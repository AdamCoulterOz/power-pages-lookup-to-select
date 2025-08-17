"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../source/modules/Config");
var L2SError_1 = require("../source/modules/L2SError");
var GroupResults_1 = require("../source/modules/GroupResults");
// Simple test runner for TypeScript compilation testing
console.log("Running TypeScript compilation tests...");
// Test Config
var config = new Config_1.Config();
console.log("✓ Config class can be instantiated");
console.log("  - Default placeholder: ".concat(config.Placeholder));
console.log("  - Default allow clear: ".concat(config.AllowClear));
// Test L2SError
var error = new L2SError_1.default("Test error");
console.log("✓ L2SError class can be instantiated");
console.log("  - Error message: ".concat(error.message));
console.log("  - Error name: ".concat(error.name));
// Test GroupResults with mock data
var mockData = [
  {
    Id: "1",
    Name: "Test Record",
    CreatedBy: new Date(),
    CreatedOn: new Date(),
    ModifiedBy: new Date(),
    ModifiedOn: new Date(),
    StateCode: 0,
    StatusCode: 1,
    ImportSequenceNumber: 0,
    Values: {},
    LogicalName: "contact",
    DisplayName: "Contact",
    SetName: "contacts",
    IdField: "contactid",
    TextField: "fullname",
  },
];
var groupedResults = (0, GroupResults_1.default)(mockData, true);
var ungroupedResults = (0, GroupResults_1.default)(mockData, false);
console.log("✓ GroupResults function works");
console.log(
  "  - Grouped results count: ".concat(groupedResults.Results.length)
);
console.log(
  "  - Ungrouped results count: ".concat(ungroupedResults.Results.length)
);
console.log("\nAll TypeScript compilation tests passed!");
