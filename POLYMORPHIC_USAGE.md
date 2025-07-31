# Polymorphic Lookup Support

This enhanced version of the lookupToSelect plugin now supports both single entity lookups and polymorphic lookups (lookups that can reference multiple entity types).

## Single Entity Lookup (Original Usage)

For single entity lookups, use the plugin as before:

```javascript
$("#lookup_field").lookupToSelect({
    entitySetName: "contacts",
    idFieldName: "contactid",
    textFieldName: "fullname",
    targetTableLogicalName: "contact",
    placeholder: "Search contacts..."
});
```

## Polymorphic Lookup Usage

For polymorphic lookups, use the new `entities` array configuration:

```javascript
$("#customer_lookup").lookupToSelect({
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
    groupByEntity: true // Default: true - groups results by entity type
});
```

## Configuration Options

### Polymorphic Entity Configuration

Each entity in the `entities` array must have:

- `entitySetName`: The OData entity set name
- `idFieldName`: The primary key field name
- `textFieldName`: The field to display as text
- `targetTableLogicalName`: The logical name for the entity reference
- `displayName` (optional): Display name for grouping (defaults to targetTableLogicalName)

### Additional Options

- `groupByEntity`: (boolean, default: true) Whether to group results by entity type in polymorphic lookups
- `groupByFieldName`: Custom field to group by (overrides entity grouping)
- `groupByTextFieldName`: Display text for custom groups

## How It Works

### Data Retrieval
- For single entity lookups: Makes one API call to the specified entity set
- For polymorphic lookups: Makes parallel API calls to all configured entity sets and combines results

### Result Grouping
- By default, polymorphic lookup results are grouped by entity type
- You can disable grouping by setting `groupByEntity: false`
- Custom grouping is supported via `groupByFieldName`

### Selection Handling
- The plugin automatically sets the correct `entityname` value based on the selected item's entity type
- For polymorphic lookups, it uses the `_targetTableLogicalName` from the selected item
- For single entity lookups, it uses the configured `targetTableLogicalName`

## Migration from Single to Polymorphic

To convert an existing single entity lookup to polymorphic:

```javascript
// Before (single entity)
$("#lookup_field").lookupToSelect({
    entitySetName: "contacts",
    idFieldName: "contactid",
    textFieldName: "fullname",
    targetTableLogicalName: "contact"
});

// After (polymorphic)
$("#lookup_field").lookupToSelect({
    entities: [
        {
            entitySetName: "contacts",
            idFieldName: "contactid",
            textFieldName: "fullname",
            targetTableLogicalName: "contact",
            displayName: "Contacts"
        }
        // Add more entities as needed
    ]
});
```

## Error Handling

The plugin validates polymorphic configurations and will throw descriptive errors for:
- Missing or empty `entities` array
- Missing required fields in entity configurations
- Invalid entity configurations

## Browser Support

Polymorphic lookup support requires Promise support for parallel API calls. This is supported in all modern browsers and IE11+.
