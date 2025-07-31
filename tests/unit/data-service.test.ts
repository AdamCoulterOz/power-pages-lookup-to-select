/**
 * Tests for Data Service module
 */
import { createODataQuery, fetchEntityData, createPolymorphicDataFunction } from '../src/modules/data-service';
import { EntityConfig } from '../src/modules/types';
import * as utils from '../src/modules/utils';

// Mock the utils module
jest.mock('../src/modules/utils');
const mockSafeAjax = utils.safeAjax as jest.MockedFunction<typeof utils.safeAjax>;

describe('Data Service', () => {
    const mockEntity: EntityConfig = {
        entitySetName: 'sch_addresses',
        idFieldName: 'sch_addressid',
        textFieldName: 'sch_name',
        targetTableLogicalName: 'sch_address',
        displayName: 'Address'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createODataQuery', () => {
        it('should create query with select and order clauses', () => {
            const result = createODataQuery(mockEntity, '');
            
            expect(result).toBe('$select=sch_addressid,sch_name&$orderby=sch_name asc');
        });

        it('should include filter when search term is provided', () => {
            const result = createODataQuery(mockEntity, 'test');
            
            expect(result).toBe('$select=sch_addressid,sch_name&$orderby=sch_name asc&$filter=startswith(sch_name,\'test\')');
        });

        it('should handle empty search term', () => {
            const result = createODataQuery(mockEntity, '');
            
            expect(result).not.toContain('$filter');
        });
    });

    describe('fetchEntityData', () => {
        it('should make correct API call and resolve with data', async () => {
            const mockResponse = { value: [{ sch_addressid: '1', sch_name: 'Test' }] };
            mockSafeAjax.mockResolvedValue(mockResponse);

            const result = await fetchEntityData(mockEntity, 'test');

            expect(mockSafeAjax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/_api/sch_addresses?$select=sch_addressid,sch_name&$orderby=sch_name asc&$filter=startswith(sch_name,\'test\')',
                contentType: 'application/json',
                headers: {
                    'Prefer': 'odata.include-annotations=*'
                },
                success: expect.any(Function),
                error: expect.any(Function)
            });
            
            expect(result).toEqual(mockResponse);
        });

        it('should reject on API error', async () => {
            const mockError = new Error('API Error');
            mockSafeAjax.mockRejectedValue(mockError);

            await expect(fetchEntityData(mockEntity, 'test')).rejects.toThrow('API Error');
        });
    });

    describe('createPolymorphicDataFunction', () => {
        const mockEntities: EntityConfig[] = [
            mockEntity,
            {
                entitySetName: 'sch_offices',
                idFieldName: 'sch_officeid',
                textFieldName: 'sch_name',
                targetTableLogicalName: 'sch_office',
                displayName: 'Office'
            }
        ];

        it('should create function that fetches data from multiple entities', async () => {
            const mockResponse1 = { value: [{ sch_addressid: '1', sch_name: 'Address 1' }] };
            const mockResponse2 = { value: [{ sch_officeid: '2', sch_name: 'Office 1' }] };
            
            mockSafeAjax
                .mockResolvedValueOnce(mockResponse1)
                .mockResolvedValueOnce(mockResponse2);

            const dataFunction = createPolymorphicDataFunction(mockEntities);
            
            return new Promise<void>((resolve) => {
                dataFunction('test', (data) => {
                    expect(data.value).toHaveLength(2);
                    expect(data.value[0]).toEqual(expect.objectContaining({
                        sch_addressid: '1',
                        sch_name: 'Address 1',
                        _entitySetName: 'sch_addresses',
                        _targetTableLogicalName: 'sch_address',
                        _entityDisplayName: 'Address'
                    }));
                    expect(data.value[1]).toEqual(expect.objectContaining({
                        sch_officeid: '2',
                        sch_name: 'Office 1',
                        _entitySetName: 'sch_offices',
                        _targetTableLogicalName: 'sch_office',
                        _entityDisplayName: 'Office'
                    }));
                    resolve();
                }, () => {});
            });
        });

        it('should handle errors from any entity fetch', async () => {
            const mockError = new Error('Fetch error');
            mockSafeAjax.mockRejectedValue(mockError);

            const dataFunction = createPolymorphicDataFunction(mockEntities);
            
            return new Promise<void>((resolve) => {
                dataFunction('test', () => {}, (error) => {
                    expect(error).toEqual(mockError);
                    resolve();
                });
            });
        });
    });
});
