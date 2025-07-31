/**
 * Modular Usage Examples
 * 
 * This file demonstrates how to use the modular architecture
 * for advanced scenarios and custom implementations.
 */

// Example 1: Using the standard build (now modular by default)
import lookupToSelect from '../dist/index.js';

// Standard usage - exactly the same as before
$("#my_lookup").lookupToSelect({
    placeholder: "Search contacts...",
    minimumInputLength: 2
});

// Example 2: Advanced usage with individual modules
import { 
    extractEntityConfigFromDOM,
    createPolymorphicDataFunction,
    processResults,
    EntityConfig 
} from '../dist/index.js';

} from '../dist/index.js';

// Extract configuration from DOM
const entities = extractEntityConfigFromDOM('customer_lookup');

// Create custom data source
const customGetData = createPolymorphicDataFunction(entities);

// Use in custom Select2 implementation
$("#custom_select").select2({
    ajax: {
        transport: function(params, success, failure) {
            customGetData(params.data.term, success, failure);
        },
        processResults: function(data) {
            return processResults(data, { 
                entities,
                groupByEntity: true,
                placeholder: "Search...",
                delay: 250 
            });
        }
    }
});

// Example 3: Custom entity configuration with validation
import { 
    validateEntityConfig,
    createODataQuery,
    fetchEntityData 
} from '../dist/index.js';

const customEntities: EntityConfig[] = [
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
];

// Validate configuration
try {
    validateEntityConfig(customEntities);
    console.log("Configuration is valid");
} catch (error) {
    console.error("Configuration error:", error.message);
}

// Example 4: Building custom search functionality
import { safeAjax } from '../dist/index.js';

async function customSearch(entitySetName: string, searchTerm: string) {
    const query = `$select=*&$filter=startswith(name,'${searchTerm}')&$top=10`;
    
    try {
        const result = await safeAjax({
            type: "GET",
            url: `/_api/${entitySetName}?${query}`,
            contentType: "application/json"
        });
        
        return result;
    } catch (error) {
        console.error("Search failed:", error);
        throw error;
    }
}

// Example 5: Custom data processor for special formatting
import { 
    normalizeDataWithMetadata,
    processGroupByField 
} from '../dist/index.js';

function createCustomProcessor(entities: EntityConfig[]) {
    return function(data: any) {
        // Add metadata
        normalizeDataWithMetadata(data, entities);
        
        // Group by priority field
        const results = processGroupByField(
            data.value, 
            'prioritycode', // Group by priority
            'prioritytext'  // Display priority text
        );
        
        return { results };
    };
}

// Example 6: Unit testing individual modules
import { 
    parseViewLayouts,
    getTextFieldName 
} from '../dist/index.js';

// Test data parsing
function testDataParsing() {
    const testBase64 = "W3siSWQiOiJ0ZXN0IiwiVmlld05hbWUiOiJUZXN0In1d"; // Mock data
    const parsed = parseViewLayouts(testBase64);
    
    console.assert(parsed !== null, "Should parse valid base64");
    console.assert(Array.isArray(parsed), "Should return array");
}

// Test text field extraction
function testTextFieldExtraction() {
    const mockColumns = [
        { Type: 1, LogicalName: "id" },
        { Type: 0, LogicalName: "name" }, // This should be selected
        { Type: 2, LogicalName: "description" }
    ];
    
    const textField = getTextFieldName("test", mockColumns);
    console.assert(textField === "name", "Should extract correct text field");
}

// Example 7: Performance monitoring wrapper
import { fetchEntityData as originalFetchEntityData } from '../dist/index.js';

function createPerformanceWrapper<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return (async (...args: any[]) => {
        const start = performance.now();
        try {
            const result = await fn(...args);
            const end = performance.now();
            console.log(`Function ${fn.name} took ${end - start} milliseconds`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.error(`Function ${fn.name} failed after ${end - start} milliseconds`);
            throw error;
        }
    }) as T;
}

// Wrap data fetching for performance monitoring
const monitoredFetchEntityData = createPerformanceWrapper(originalFetchEntityData);

// Example 8: Custom caching layer
class LookupCache {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private ttl = 5 * 60 * 1000; // 5 minutes
    
    async get(key: string, fetchFn: () => Promise<any>): Promise<any> {
        const cached = this.cache.get(key);
        
        if (cached && (Date.now() - cached.timestamp) < this.ttl) {
            console.log(`Cache hit for ${key}`);
            return cached.data;
        }
        
        console.log(`Cache miss for ${key}, fetching...`);
        const data = await fetchFn();
        this.cache.set(key, { data, timestamp: Date.now() });
        
        return data;
    }
    
    clear(): void {
        this.cache.clear();
    }
}

// Usage with cached data fetching
const cache = new LookupCache();

async function cachedFetchEntityData(entity: EntityConfig, searchTerm: string) {
    const cacheKey = `${entity.entitySetName}-${searchTerm}`;
    
    return cache.get(cacheKey, () => 
        originalFetchEntityData(entity, searchTerm)
    );
}

export {
    customSearch,
    createCustomProcessor,
    testDataParsing,
    testTextFieldExtraction,
    createPerformanceWrapper,
    LookupCache,
    cachedFetchEntityData
};
