Power Pages Lookup to Select
======

[![](https://data.jsdelivr.com/v1/package/npm/power-pages-lookup-to-select/badge)](https://www.jsdelivr.com/package/npm/power-pages-lookup-to-select)

jQuery library to easily replace Power Pages lookup control with [Select2](https://select2.org/) control.

## ✨ New: Dynamic Configuration
The plugin now automatically extracts configuration from existing Power Pages lookup controls - **no manual setup required**!

```javascript
// Automatic configuration for any lookup (single or polymorphic)
$("#your_lookup_field").lookupToSelect({
    placeholder: "Search..."
});
```

## Features
- 🚀 **Zero-config setup** - Automatically detects single and polymorphic lookups
- 🔄 **Polymorphic lookup support** - Handle multiple entity types in one lookup
- 🎨 **Customizable rendering** - Custom option and result templates
- 📱 **Responsive design** - Works on all screen sizes
- ⚡ **Performance optimized** - Efficient data loading and caching
- 📝 **TypeScript support** - Full type definitions included

To get started, check out examples and documentation at https://www.dancingwithcrm.com/power-pages-lookup-to-select

## Development

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run dev
```

### TypeScript
This project is written in TypeScript and provides full type definitions. The compiled JavaScript and type definitions are output to the `dist/` folder.

```typescript
// TypeScript usage with full type safety
$("#my_lookup").lookupToSelect({
    entities: [{
        entitySetName: "contacts",
        idFieldName: "contactid", 
        textFieldName: "fullname",
        targetTableLogicalName: "contact"
    }],
    placeholder: "Search contacts..."
});
```

Usage
------
You can source LtS directly from a CDN like jsDelivr or download it from [GitHub repository](https://github.com/OOlashyn/power-pages-lookup-to-select) and serve as a Web File on your Power Pages site. 


Contributing
------
This is an open source project - which means you can contribute in multiple ways:
* open an issue to let us know about bugs or problems
* look into existing issues to help to resolve existing problems
* create a PR for new functionality or enhance existing one

License
------

MIT
