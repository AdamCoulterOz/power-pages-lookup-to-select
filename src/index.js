(function ($) {
    function safeAjax(ajaxOptions) {
        var deferredAjax = $.Deferred();

        shell.getTokenDeferred().done(function (token) {
            // add headers for AJAX
            if (!ajaxOptions.headers) {
                $.extend(ajaxOptions, {
                    headers: {
                        "__RequestVerificationToken": token
                    }
                });
            } else {
                ajaxOptions.headers["__RequestVerificationToken"] = token;
            }
            $.ajax(ajaxOptions)
                .done(function (data, textStatus, jqXHR) {
                    validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
                }).fail(deferredAjax.reject); //AJAX
        }).fail(function () {
            deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
        });

        return deferredAjax.promise();
    }

    // Helper function to parse base64 encoded view layouts
    function parseViewLayouts(base64Data) {
        try {
            const jsonString = atob(base64Data);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Error parsing view layouts data:", error);
            return null;
        }
    }

    // Helper function to determine text field name based on entity type and columns
    function getTextFieldName(entityName, columns) {
        // Extract the LogicalName from the first Type 0 (viewColumn) from the columns metadata
        if (columns && Array.isArray(columns)) {
            const firstViewColumn = columns.find(column => column.Type === 0);
            if (firstViewColumn && firstViewColumn.LogicalName) {
                return firstViewColumn.LogicalName;
            }
        }

        // If no column metadata is available, we cannot safely determine the text field
        // Return null to indicate that manual configuration is required
        return null;
    }

    // Helper function to extract entity configuration from DOM
    function extractEntityConfigFromDOM(fieldId) {
        const lookupModal = $(`#${fieldId}_lookupmodal`);
        if (lookupModal.length === 0) {
            return null;
        }

        const entityGrid = lookupModal.find('.entity-grid');
        if (entityGrid.length === 0) {
            return null;
        }

        const viewLayoutsData = entityGrid.attr('data-view-layouts');
        if (!viewLayoutsData) {
            return null;
        }

        const viewLayouts = parseViewLayouts(viewLayoutsData);
        if (!viewLayouts || !Array.isArray(viewLayouts)) {
            return null;
        }

        // Extract entity configurations from view layouts
        const entities = viewLayouts.map(layout => {
            const config = layout.Configuration;
            const entityName = config.EntityName;
            const primaryKeyName = config.PrimaryKeyName;
            
            // Determine the text field name from column metadata
            // This extracts the LogicalName from the first Type: 0 (viewColumn) 
            // which represents the primary display field for the entity in this view
            const textFieldName = getTextFieldName(entityName, layout.Columns);
            
            // If we cannot determine the text field name, skip this entity
            if (!textFieldName) {
                console.warn(`Unable to determine text field for entity '${entityName}' - no Type 0 columns found in view layout. Manual configuration required.`);
                return null;
            }
            
            // Generate entity set name (pluralize)
            let entitySetName = entityName;
            if (!entitySetName.endsWith('s')) {
                entitySetName += 's';
            }

            return {
                entitySetName: entitySetName,
                idFieldName: primaryKeyName,
                textFieldName: textFieldName,
                targetTableLogicalName: entityName,
                displayName: layout.ViewName || entityName,
                viewId: layout.Id
            };
        }).filter(entity => entity !== null); // Remove any null entities

        return entities.length > 0 ? entities : null;
    }

    $.fn.lookupToSelect = function (options = {}) {
        const fieldId = this.attr('id');
        
        // Try to extract configuration from DOM first
        const extractedEntities = extractEntityConfigFromDOM(fieldId);
        
        // Determine if we have explicit configuration or should use extracted data
        const hasExplicitConfig = options.entitySetName || options.entities || options.data || options.getData;
        
        if (!hasExplicitConfig && !extractedEntities) {
            throw new Error("lookupToSelect error: No configuration provided and unable to extract configuration from DOM. Please provide entitySetName/entities or ensure the lookup modal exists in DOM.");
        }

        // Use extracted entities if no explicit configuration is provided
        if (!hasExplicitConfig && extractedEntities) {
            // Always use polymorphic configuration, even for single entities
            options.entities = extractedEntities;
        }

        // Convert single entity configuration to polymorphic format for consistency
        if (options.entitySetName && !options.entities) {
            options.entities = [{
                entitySetName: options.entitySetName,
                idFieldName: options.idFieldName,
                textFieldName: options.textFieldName,
                targetTableLogicalName: options.targetTableLogicalName,
                displayName: options.displayName || options.targetTableLogicalName
            }];
            
            // Clear the single entity properties to avoid confusion
            delete options.entitySetName;
            delete options.idFieldName;
            delete options.textFieldName;
            delete options.targetTableLogicalName;
        }

        // Validate configuration - now everything uses entities array
        if (!options.entities && !options.data && !options.getData) {
            throw new Error("lookupToSelect error: entities configuration is required for external data source if no getData is provided");
        }

        // validate entities configuration
        if (options.entities) {
            if (!Array.isArray(options.entities) || options.entities.length === 0) {
                throw new Error("lookupToSelect error: entities must be a non-empty array");
            }
            
            options.entities.forEach((entity, index) => {
                if (!entity.entitySetName) {
                    throw new Error(`lookupToSelect error: entitySetName is required for entity at index ${index}`);
                }
                if (!entity.idFieldName) {
                    throw new Error(`lookupToSelect error: idFieldName is required for entity at index ${index}`);
                }
                if (!entity.textFieldName) {
                    throw new Error(`lookupToSelect error: textFieldName is required for entity at index ${index}`);
                }
                if (!entity.targetTableLogicalName) {
                    throw new Error(`lookupToSelect error: targetTableLogicalName is required for entity at index ${index}`);
                }
            });
        }

        // This is the easiest way to have default options.
        const settings = $.extend({
            // These are the defaults.
            placeholder: "Search by typing",
            delay: 250
        }, options);

        // Helper function to create OData query for an entity
        function createODataQuery(entity, searchTerm) {
            const select = `$select=${entity.idFieldName},${entity.textFieldName}&$orderby=${entity.textFieldName} asc`;
            const filter = searchTerm ? `&$filter=startswith(${entity.textFieldName},'${searchTerm}')` : "";
            return select + filter;
        }

        // Helper function to make API call for a single entity
        function fetchEntityData(entity, searchTerm) {
            return new Promise((resolve, reject) => {
                const options = createODataQuery(entity, searchTerm);

                safeAjax({
                    type: "GET",
                    url: `/_api/${entity.entitySetName}?${options}`,
                    contentType: "application/json",
                    headers: {
                        "Prefer": "odata.include-annotations=*"
                    },
                    success: function(data) {
                        resolve(data);
                    },
                    error: reject
                });
            });
        }

        // handle data retrieval if getData function is not provided
        if (!settings.getData && !settings.data) {
            // All lookups are now handled the same way (polymorphic approach)
            settings.getData = function (searchTerm, successHandler, errorHandler) {
                const promises = settings.entities.map(entity => {
                    return fetchEntityData(entity, searchTerm).then(data => {
                        // add entity metadata to each result
                        const enrichedData = data.value.map(item => ({
                            ...item,
                            _entitySetName: entity.entitySetName,
                            _targetTableLogicalName: entity.targetTableLogicalName,
                            _idFieldName: entity.idFieldName,
                            _textFieldName: entity.textFieldName,
                            _entityDisplayName: entity.displayName || entity.targetTableLogicalName
                        }));
                        return { value: enrichedData };
                    });
                });

                Promise.all(promises)
                    .then(results => {
                        // combine all results
                        const combinedData = {
                            value: results.reduce((acc, result) => acc.concat(result.value), [])
                        };
                        successHandler(combinedData);
                    })
                    .catch(errorHandler);
            };
        }

        // generate select element to which select2 will be attached
        const customSelectId = `${fieldId}_dwcSelect2`;

        const sel = $(`<select id='${customSelectId}'>`);
        this.parent().after(sel);

        const initialValue = this.val();

        if (initialValue) {
            const initialValueText = $(`#${fieldId}_name`).val();
            sel.append(`<option value='${initialValue}'>${initialValueText}</option>`)
        }

        // define select2Config object
        // TODO add support to pass the whole object as parameter
        const select2Config = {
            placeholder: settings.placeholder,
            minimumInputLength: settings.minimumInputLength,
        };

        // local data source config
        if (settings.data) {
            select2Config.data = settings.data;
        }

        // external data source config
        if (settings.getData) {
            select2Config.ajax = {
                // delay request by specified amount
                delay: settings.delay,
                // define custom request logic
                transport: function (params, success, failure) {
                    settings.getData(params.data.term, success, failure);
                },
                processResults: function (data) {
                    // Normalize data by adding metadata if missing (for external getData functions)
                    if (data && data.value && Array.isArray(data.value) && settings.entities) {
                        data.value = data.value.map(item => {
                            // If item already has metadata, keep it as-is
                            if (item._entityDisplayName) {
                                return item;
                            }
                            
                            // Add metadata for external data
                            let matchingEntity = settings.entities[0]; // Default fallback
                            
                            if (settings.entities.length > 1) {
                                // Try to match based on which entity's idFieldName exists in the item
                                const foundEntity = settings.entities.find(entity => 
                                    item.hasOwnProperty(entity.idFieldName)
                                );
                                if (foundEntity) {
                                    matchingEntity = foundEntity;
                                }
                            }
                            
                            return {
                                ...item,
                                _entitySetName: matchingEntity.entitySetName,
                                _targetTableLogicalName: matchingEntity.targetTableLogicalName,
                                _idFieldName: matchingEntity.idFieldName,
                                _textFieldName: matchingEntity.textFieldName,
                                _entityDisplayName: matchingEntity.displayName || matchingEntity.targetTableLogicalName
                            };
                        });
                    }

                    let formattedResponse;
                    const isSingleEntity = settings.entities.length === 1;

                    // grouping results if groupBy is provided
                    if (settings.groupByFieldName) {
                        formattedResponse = data.value.reduce((acc, el) => {
                            const formattedElement = $.extend(
                                {
                                    id: el[el._idFieldName],
                                    text: el[el._textFieldName]
                                },
                                el
                            );

                            const groupValue = formattedElement[settings.groupByFieldName];
                            const groupText = formattedElement[settings.groupByTextFieldName];
                            if (!acc[groupValue]) {
                                acc[groupValue] = {
                                    text: groupText,
                                    children: []
                                };
                            }
                            acc[groupValue].children.push(formattedElement);
                            return acc;
                        }, {});
                        formattedResponse = Object.values(formattedResponse);
                    } else if (!isSingleEntity && settings.groupByEntity !== false) {
                        // group by entity type for multi-entity lookups (default behavior)
                        formattedResponse = data.value.reduce((acc, el) => {
                            const entityDisplayName = el._entityDisplayName;
                            
                            const formattedElement = $.extend(
                                {
                                    id: el[el._idFieldName],
                                    text: el[el._textFieldName]
                                },
                                el
                            );

                            if (!acc[entityDisplayName]) {
                                acc[entityDisplayName] = {
                                    text: entityDisplayName,
                                    children: []
                                };
                            }
                            acc[entityDisplayName].children.push(formattedElement);
                            return acc;
                        }, {});
                        formattedResponse = Object.values(formattedResponse);
                    } else {
                        // flat list (single entity or groupByEntity disabled)
                        formattedResponse = data.value.map(el => {
                            return $.extend(
                                {
                                    id: el[el._idFieldName],
                                    text: el[el._textFieldName]
                                },
                                el
                            );
                        });
                    }

                    return {
                        results: formattedResponse
                    };
                }
            }
        }

        // custom option rendering
        if (settings.optionRenderer) {
            select2Config.templateResult = settings.optionRenderer;
        }

        // custom result rendering
        if (settings.resultRenderer) {
            select2Config.templateSelection  = settings.resultRenderer;
        }


        // initiate select2
        sel.select2(select2Config);

        // add onchange function to populate actual lookup
        sel.on("change", function () {
            const selectedValue = sel.val();
            const selectedOption = $(`#${customSelectId} option:selected`);
            const selectedValueLabel = selectedOption.text();
            const selectedData = selectedOption.data('select2-data');

            $(`#${fieldId}`).val(selectedValue);
            
            // Use the entity's target table from the selected data
            if (selectedData && selectedData._targetTableLogicalName) {
                $(`#${fieldId}_entityname`).val(selectedData._targetTableLogicalName);
            }
            
            $(`#${fieldId}_name`).val(selectedValueLabel);

            // trigger change event on original lookup
            $(`#${fieldId}`).trigger("change");
        });

        // make select2 responsive
        $(`#${customSelectId}`).parent().find(".select2").css("width", "100%");

        // hide original lookup
        this.parent().hide();
    };

}(jQuery));