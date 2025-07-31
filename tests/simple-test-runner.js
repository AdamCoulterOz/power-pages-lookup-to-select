#!/usr/bin/env node
"use strict";
/**
 * Simple test runner for the modular architecture
 * This runs without Jest to test the basic functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var SimpleTest = /** @class */ (function () {
    function SimpleTest() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    SimpleTest.prototype.describe = function (name, callback) {
        console.log("\n\uD83D\uDCC2 ".concat(name));
        callback();
    };
    SimpleTest.prototype.it = function (name, callback) {
        try {
            callback();
            this.passed++;
            console.log("  \u2705 ".concat(name));
        }
        catch (error) {
            this.failed++;
            console.log("  \u274C ".concat(name));
            if (error instanceof Error) {
                console.log("     Error: ".concat(error.message));
            }
        }
    };
    SimpleTest.prototype.expect = function (actual) {
        return {
            toBe: function (expected) {
                if (actual !== expected) {
                    throw new Error("Expected ".concat(expected, ", but got ").concat(actual));
                }
            },
            toEqual: function (expected) {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error("Expected ".concat(JSON.stringify(expected), ", but got ").concat(JSON.stringify(actual)));
                }
            },
            toContain: function (expected) {
                if (!actual.includes(expected)) {
                    throw new Error("Expected \"".concat(actual, "\" to contain \"").concat(expected, "\""));
                }
            },
            toBeNull: function () {
                if (actual !== null) {
                    throw new Error("Expected null, but got ".concat(actual));
                }
            },
            toThrow: function (expectedMessage) {
                try {
                    actual();
                    throw new Error('Expected function to throw');
                }
                catch (error) {
                    if (expectedMessage && !error.message.includes(expectedMessage)) {
                        throw new Error("Expected error message to contain \"".concat(expectedMessage, "\", but got \"").concat(error.message, "\""));
                    }
                }
            }
        };
    };
    SimpleTest.prototype.run = function () {
        console.log('\n🧪 Running Simple Tests\n');
        console.log('='.repeat(50));
        // Import and test modules (simplified)
        this.testModuleStructure();
        this.testTypeDefinitions();
        this.testConfigValidation();
        console.log('\n' + '='.repeat(50));
        console.log("\n\uD83D\uDCCA Test Results:");
        console.log("   \u2705 Passed: ".concat(this.passed));
        console.log("   \u274C Failed: ".concat(this.failed));
        console.log("   \uD83D\uDCC8 Total:  ".concat(this.passed + this.failed));
        if (this.failed > 0) {
            console.log('\n🔴 Some tests failed!');
            process.exit(1);
        }
        else {
            console.log('\n🟢 All tests passed!');
        }
    };
    SimpleTest.prototype.testModuleStructure = function () {
        var _this = this;
        this.describe('Module Structure', function () {
            var srcPath = path.join(__dirname, '..', 'src');
            var modulesPath = path.join(srcPath, 'modules');
            _this.it('should have src directory', function () {
                _this.expect(fs.existsSync(srcPath)).toBe(true);
            });
            _this.it('should have modules directory', function () {
                _this.expect(fs.existsSync(modulesPath)).toBe(true);
            });
            var expectedModules = [
                'types.ts',
                'utils.ts',
                'dom-parser.ts',
                'data-service.ts',
                'data-processor.ts',
                'config-processor.ts',
                'plugin.ts'
            ];
            expectedModules.forEach(function (moduleName) {
                _this.it("should have ".concat(moduleName, " module"), function () {
                    var modulePath = path.join(modulesPath, moduleName);
                    _this.expect(fs.existsSync(modulePath)).toBe(true);
                });
            });
            _this.it('should have main index.ts file', function () {
                var indexPath = path.join(srcPath, 'index.ts');
                _this.expect(fs.existsSync(indexPath)).toBe(true);
            });
        });
    };
    SimpleTest.prototype.testTypeDefinitions = function () {
        var _this = this;
        this.describe('Type Definitions', function () {
            var typesPath = path.join(__dirname, '..', 'src', 'modules', 'types.ts');
            _this.it('should have types.ts file', function () {
                _this.expect(fs.existsSync(typesPath)).toBe(true);
            });
            _this.it('should contain EntityConfig interface', function () {
                var content = fs.readFileSync(typesPath, 'utf8');
                _this.expect(content).toContain('interface EntityConfig');
            });
            _this.it('should contain LookupToSelectOptions interface', function () {
                var content = fs.readFileSync(typesPath, 'utf8');
                _this.expect(content).toContain('interface LookupToSelectOptions');
            });
            _this.it('should export Select2 types', function () {
                var content = fs.readFileSync(typesPath, 'utf8');
                _this.expect(content).toContain('import * as Select2');
            });
        });
    };
    SimpleTest.prototype.testConfigValidation = function () {
        var _this = this;
        this.describe('Configuration Validation', function () {
            var configPath = path.join(__dirname, '..', 'src', 'modules', 'config-processor.ts');
            _this.it('should have config-processor.ts file', function () {
                _this.expect(fs.existsSync(configPath)).toBe(true);
            });
            _this.it('should contain validateEntityConfig function', function () {
                var content = fs.readFileSync(configPath, 'utf8');
                _this.expect(content).toContain('function validateEntityConfig');
            });
            _this.it('should contain processConfiguration function', function () {
                var content = fs.readFileSync(configPath, 'utf8');
                _this.expect(content).toContain('function processConfiguration');
            });
        });
    };
    return SimpleTest;
}());
// Run the tests
var test = new SimpleTest();
test.run();
