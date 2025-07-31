/**
 * Tests for DOM Parser module
 */
import { parseViewLayouts, getTextFieldName, extractEntityConfigFromDOM } from '../src/modules/dom-parser';
import { ViewLayoutColumn } from '../src/modules/types';

describe('DOM Parser', () => {
    describe('parseViewLayouts', () => {
        it('should parse valid base64 JSON data', () => {
            const testData = [{ test: 'data' }];
            const base64Data = Buffer.from(JSON.stringify(testData)).toString('base64');
            
            const result = parseViewLayouts(base64Data);
            
            expect(result).toEqual(testData);
        });

        it('should return null for invalid base64 data', () => {
            const result = parseViewLayouts('invalid-base64');
            
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });

        it('should return null for valid base64 but invalid JSON', () => {
            const base64Data = Buffer.from('invalid-json').toString('base64');
            
            const result = parseViewLayouts(base64Data);
            
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('getTextFieldName', () => {
        it('should return the LogicalName of the first Type 0 column', () => {
            const columns: ViewLayoutColumn[] = [
                { Type: 1, LogicalName: 'col-select' },
                { Type: 0, LogicalName: 'sch_name' },
                { Type: 0, LogicalName: 'sch_description' }
            ];

            const result = getTextFieldName('sch_entity', columns);

            expect(result).toBe('sch_name');
        });

        it('should return null if no Type 0 columns exist', () => {
            const columns: ViewLayoutColumn[] = [
                { Type: 1, LogicalName: 'col-select' },
                { Type: 2, LogicalName: 'col-action' }
            ];

            const result = getTextFieldName('sch_entity', columns);

            expect(result).toBeNull();
        });

        it('should return null for empty columns array', () => {
            const result = getTextFieldName('sch_entity', []);

            expect(result).toBeNull();
        });

        it('should return null for undefined columns', () => {
            const result = getTextFieldName('sch_entity', undefined as any);

            expect(result).toBeNull();
        });
    });

    describe('extractEntityConfigFromDOM', () => {
        beforeEach(() => {
            // Mock jQuery DOM methods
            (global as any).jQuery = jest.fn((selector: string) => {
                if (selector.includes('_lookupmodal')) {
                    // Mock the lookup modal
                    return {
                        length: 1,
                        find: jest.fn((findSelector: string) => {
                            if (findSelector === '.entity-grid') {
                                // Mock the entity grid with data-view-layouts attribute
                                return {
                                    length: 1,
                                    attr: jest.fn((attrName: string) => {
                                        if (attrName === 'data-view-layouts') {
                                            const testData = [{
                                                Id: 'test-id',
                                                ViewName: 'Test View',
                                                Configuration: {
                                                    EntityName: 'sch_address',
                                                    PrimaryKeyName: 'sch_addressid'
                                                },
                                                Columns: [
                                                    { Type: 0, LogicalName: 'sch_name' }
                                                ]
                                            }];
                                            return Buffer.from(JSON.stringify(testData)).toString('base64');
                                        }
                                        return null;
                                    })
                                };
                            }
                            return { length: 0 };
                        })
                    };
                }
                return { length: 0 };
            });
        });

        it('should extract entity configuration from DOM when modal exists', () => {
            const result = extractEntityConfigFromDOM('test_field');

            expect(result).toHaveLength(1);
            expect(result![0]).toEqual({
                entitySetName: 'sch_addresses',
                idFieldName: 'sch_addressid',
                textFieldName: 'sch_name',
                targetTableLogicalName: 'sch_address',
                displayName: 'Test View',
                viewId: 'test-id'
            });
        });

        it('should return null when lookup modal does not exist', () => {
            (global as any).jQuery = jest.fn(() => ({ length: 0 }));

            const result = extractEntityConfigFromDOM('test_field');

            expect(result).toBeNull();
        });

        it('should warn and skip entities without text field', () => {
            (global as any).jQuery = jest.fn(() => ({
                length: 1,
                find: jest.fn(() => ({
                    length: 1,
                    attr: jest.fn(() => {
                        const testData = [{
                            Configuration: {
                                EntityName: 'sch_address',
                                PrimaryKeyName: 'sch_addressid'
                            },
                            Columns: [] // No Type 0 columns
                        }];
                        return Buffer.from(JSON.stringify(testData)).toString('base64');
                    })
                }))
            }));

            const result = extractEntityConfigFromDOM('test_field');

            expect(result).toBeNull();
            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining("Unable to determine text field for entity 'sch_address'")
            );
        });
    });
});
