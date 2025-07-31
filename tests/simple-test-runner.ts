#!/usr/bin/env node
/**
 * Simple test runner for the modular architecture
 * This runs without Jest to test the basic functionality
 */

import * as fs from 'fs';
import * as path from 'path';

// Simple test framework
interface ExpectationResult {
    toBe: (expected: any) => void;
    toEqual: (expected: any) => void;
    toContain: (expected: string) => void;
    toBeNull: () => void;
    toThrow: (expectedMessage?: string) => void;
}

class SimpleTest {
    private tests: string[] = [];
    private passed: number = 0;
    private failed: number = 0;

    describe(name: string, callback: () => void): void {
        console.log(`\n📂 ${name}`);
        callback();
    }

    it(name: string, callback: () => void): void {
        try {
            callback();
            this.passed++;
            console.log(`  ✅ ${name}`);
        } catch (error) {
            this.failed++;
            console.log(`  ❌ ${name}`);
            if (error instanceof Error) {
                console.log(`     Error: ${error.message}`);
            }
        }
    }

    expect(actual: any): ExpectationResult {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toContain: (expected) => {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected "${actual}" to contain "${expected}"`);
                }
            },
            toBeNull: () => {
                if (actual !== null) {
                    throw new Error(`Expected null, but got ${actual}`);
                }
            },
            toThrow: (expectedMessage) => {
                try {
                    actual();
                    throw new Error('Expected function to throw');
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    if (expectedMessage && !errorMessage.includes(expectedMessage)) {
                        throw new Error(`Expected error message to contain "${expectedMessage}", but got "${errorMessage}"`);
                    }
                }
            }
        };
    }

    run() {
        console.log('\n🧪 Running Simple Tests\n');
        console.log('='.repeat(50));

        // Import and test modules (simplified)
        this.testModuleStructure();
        this.testTypeDefinitions();
        this.testConfigValidation();

        console.log('\n' + '='.repeat(50));
        console.log(`\n📊 Test Results:`);
        console.log(`   ✅ Passed: ${this.passed}`);
        console.log(`   ❌ Failed: ${this.failed}`);
        console.log(`   📈 Total:  ${this.passed + this.failed}`);

        if (this.failed > 0) {
            console.log('\n🔴 Some tests failed!');
            process.exit(1);
        } else {
            console.log('\n🟢 All tests passed!');
        }
    }

    testModuleStructure() {
        this.describe('Module Structure', () => {
            const srcPath = path.join(__dirname, '..', 'src');
            const modulesPath = path.join(srcPath, 'modules');

            this.it('should have src directory', () => {
                this.expect(fs.existsSync(srcPath)).toBe(true);
            });

            this.it('should have modules directory', () => {
                this.expect(fs.existsSync(modulesPath)).toBe(true);
            });

            const expectedModules = [
                'types.ts',
                'utils.ts',
                'dom-parser.ts',
                'data-service.ts',
                'data-processor.ts',
                'config-processor.ts',
                'plugin.ts'
            ];

            expectedModules.forEach(moduleName => {
                this.it(`should have ${moduleName} module`, () => {
                    const modulePath = path.join(modulesPath, moduleName);
                    this.expect(fs.existsSync(modulePath)).toBe(true);
                });
            });

            this.it('should have main index.ts file', () => {
                const indexPath = path.join(srcPath, 'index.ts');
                this.expect(fs.existsSync(indexPath)).toBe(true);
            });
        });
    }

    testTypeDefinitions() {
        this.describe('Type Definitions', () => {
            const typesPath = path.join(__dirname, '..', 'src', 'modules', 'types.ts');
            
            this.it('should have types.ts file', () => {
                this.expect(fs.existsSync(typesPath)).toBe(true);
            });

            this.it('should contain EntityConfig interface', () => {
                const content = fs.readFileSync(typesPath, 'utf8');
                this.expect(content).toContain('interface EntityConfig');
            });

            this.it('should contain LookupToSelectOptions interface', () => {
                const content = fs.readFileSync(typesPath, 'utf8');
                this.expect(content).toContain('interface LookupToSelectOptions');
            });

            this.it('should export Select2 types', () => {
                const content = fs.readFileSync(typesPath, 'utf8');
                this.expect(content).toContain('import * as Select2');
            });
        });
    }

    testConfigValidation() {
        this.describe('Configuration Validation', () => {
            const configPath = path.join(__dirname, '..', 'src', 'modules', 'config-processor.ts');
            
            this.it('should have config-processor.ts file', () => {
                this.expect(fs.existsSync(configPath)).toBe(true);
            });

            this.it('should contain validateEntityConfig function', () => {
                const content = fs.readFileSync(configPath, 'utf8');
                this.expect(content).toContain('function validateEntityConfig');
            });

            this.it('should contain processConfiguration function', () => {
                const content = fs.readFileSync(configPath, 'utf8');
                this.expect(content).toContain('function processConfiguration');
            });
        });
    }
}

// Run the tests
const test = new SimpleTest();
test.run();
