/**
 * TypeScript Usage Examples for Power Pages Lookup to Select
 * 
 * This file shows examples of how to use the plugin with TypeScript.
 * In a real project, you would import the plugin and its types properly.
 */

// When using this plugin in your TypeScript project, the types are automatically available
// if you import or reference the compiled index.d.ts file

// Example 1: Automatic configuration (zero-config)
// The plugin automatically detects lookup configuration from DOM
($ as any)("#contact_lookup").lookupToSelect({
    placeholder: "Search contacts..."
});

// Example 2: With initial value (programmatic initialization)
($ as any)("#contact_lookup").lookupToSelect({
    initialValue: {
        id: "12345-67890-abcdef",
        text: "John Smith",
        entityLogicalName: "contact"
    },
    placeholder: "Search contacts..."
});

// Example 3: Single entity with explicit configuration
($ as any)("#account_lookup").lookupToSelect({
    entities: [{
        entitySetName: "accounts",
        idFieldName: "accountid",
        textFieldName: "name",
        targetTableLogicalName: "account",
        displayName: "Accounts"
    }],
    placeholder: "Search accounts...",
    minimumInputLength: 2
});

// Example 4: Polymorphic lookup (multiple entities)
($ as any)("#customer_lookup").lookupToSelect({
    entities: [
        {
            entitySetName: "accounts",
            idFieldName: "accountid", 
            textFieldName: "name",
            targetTableLogicalName: "account",
            displayName: "Accounts"
        },
        {
            entitySetName: "contacts",
            idFieldName: "contactid",
            textFieldName: "fullname", 
            targetTableLogicalName: "contact",
            displayName: "Contacts"
        }
    ],
    placeholder: "Search customers...",
    groupByEntity: true // Group results by entity type
});

// Example 5: Initial value with polymorphic lookup
// Useful when you know which entity type and record to preselect
($ as any)("#polymorphic_lookup").lookupToSelect({
    entities: [
        {
            entitySetName: "accounts",
            idFieldName: "accountid",
            textFieldName: "name",
            targetTableLogicalName: "account",
            displayName: "Accounts"
        },
        {
            entitySetName: "contacts", 
            idFieldName: "contactid",
            textFieldName: "fullname",
            targetTableLogicalName: "contact",
            displayName: "Contacts"
        }
    ],
    initialValue: {
        id: "contact-12345",
        text: "Jane Doe",
        entityLogicalName: "contact" // This helps identify which entity type
    },
    placeholder: "Search customers..."
});

// Example 6: Programmatic initialization without DOM dependencies
// This is particularly useful when the standard #fieldId_name elements don't exist
// or when you're creating lookups dynamically
function createDynamicLookup(containerId: string, preselectedRecord?: any) {
    const lookupHtml = `<input type="text" id="${containerId}_lookup" />`;
    $(`#${containerId}`).html(lookupHtml);
    
    ($ as any)(`#${containerId}_lookup`).lookupToSelect({
        entities: [{
            entitySetName: "contacts",
            idFieldName: "contactid", 
            textFieldName: "fullname",
            targetTableLogicalName: "contact",
            displayName: "Contacts"
        }],
        initialValue: preselectedRecord ? {
            id: preselectedRecord.id,
            text: preselectedRecord.name,
            entityLogicalName: "contact"
        } : undefined,
        placeholder: "Select a contact..."
    });
}

// Usage: Create a lookup with preselected value
createDynamicLookup("my-container", { 
    id: "abc-123", 
    name: "John Smith" 
});

// Example 7: Custom data source with getData function
($ as any)("#custom_lookup").lookupToSelect({
    entities: [{
        entitySetName: "custom_entities",
        idFieldName: "id",
        textFieldName: "name", 
        targetTableLogicalName: "custom_entity"
    }],
    getData: function(searchTerm: string, successHandler: Function, errorHandler: Function): void {
        // Custom API call
        fetch(`/api/custom-search?term=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                // Transform your data to match ODataResponse format
                const transformedData = {
                    value: data.results.map((item: any) => ({
                        ...item,
                        _entitySetName: "custom_entities",
                        _targetTableLogicalName: "custom_entity",
                        _idFieldName: "id",
                        _textFieldName: "name",
                        _entityDisplayName: "Custom Entity"
                    }))
                };
                successHandler(transformedData);
            })
            .catch((error: any) => errorHandler(error));
    }
});

// Example 5: Custom rendering
($ as any)("#styled_lookup").lookupToSelect({
    entities: [{
        entitySetName: "contacts",
        idFieldName: "contactid",
        textFieldName: "fullname",
        targetTableLogicalName: "contact"
    }],
    optionRenderer: function(result: any): any {
        // Custom option rendering
        if (result.loading) {
            return $('<div>Loading...</div>');
        }
        
        return $(`
            <div class="custom-option">
                <div class="name">${result.text}</div>
                <div class="email">${result.emailaddress1 || ''}</div>
            </div>
        `);
    },
    resultRenderer: function(selection: any): any {
        // Custom selection display
        return selection.text || 'Select an option';
    }
});

// Example 6: Grouping by custom field
($ as any)("#grouped_lookup").lookupToSelect({
    entities: [{
        entitySetName: "contacts", 
        idFieldName: "contactid",
        textFieldName: "fullname",
        targetTableLogicalName: "contact"
    }],
    groupByFieldName: "statecode", // Group by status
    groupByTextFieldName: "statecode", // Display status as group header
    placeholder: "Search contacts grouped by status..."
});
