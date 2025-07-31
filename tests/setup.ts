/**
 * Test setup and global mocks
 */

// Mock jQuery globally
(global as any).jQuery = {
    extend: jest.fn((target, ...sources) => Object.assign(target, ...sources)),
    Deferred: jest.fn(() => ({
        done: jest.fn(),
        fail: jest.fn(),
        resolve: jest.fn(),
        reject: jest.fn(),
        rejectWith: jest.fn(),
        promise: jest.fn()
    })),
    ajax: jest.fn()
};

(global as any).$ = (global as any).jQuery;

// Mock Power Pages globals
(global as any).shell = {
    getTokenDeferred: jest.fn(() => ({
        done: jest.fn((callback) => {
            callback('mock-token');
            return { fail: jest.fn() };
        })
    }))
};

(global as any).validateLoginSession = jest.fn((data, textStatus, jqXHR, callback) => {
    callback(data);
});

// Mock atob for base64 decoding
(global as any).atob = jest.fn((base64) => {
    return Buffer.from(base64, 'base64').toString('utf-8');
});

// Mock console methods to avoid noise in tests
global.console.warn = jest.fn();
global.console.error = jest.fn();
