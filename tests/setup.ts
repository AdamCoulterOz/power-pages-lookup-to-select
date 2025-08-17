// Global test setup
import 'jest-environment-jsdom';

// Mock jQuery globally
declare global {
  var $: any;
  var jQuery: any;
  var shell: any;
  var validateLoginSession: any;
}

// Mock jQuery
const mockJQuery = {
  fn: {},
  extend: jest.fn((target: any, ...sources: any[]) => Object.assign(target, ...sources)),
  ajax: jest.fn(),
  Deferred: jest.fn(() => ({
    done: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    resolve: jest.fn(),
    reject: jest.fn(),
    promise: jest.fn()
  }))
};

Object.assign(mockJQuery.fn, {
  select2: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  off: jest.fn().mockReturnThis(),
  val: jest.fn().mockReturnThis(),
  trigger: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  attr: jest.fn(),
  data: jest.fn(),
  length: 0,
  parent: jest.fn().mockReturnThis(),
  after: jest.fn().mockReturnThis()
});

global.$ = jest.fn(() => mockJQuery);
Object.assign(global.$, mockJQuery);
global.jQuery = global.$;

// Mock Power Pages shell
global.shell = {
  getTokenDeferred: jest.fn(() => ({
    done: jest.fn((callback) => {
      callback('mock-token');
      return { fail: jest.fn() };
    }),
    fail: jest.fn()
  }))
};

global.validateLoginSession = jest.fn((data, textStatus, jqXHR, callback) => {
  callback(data);
});

// Mock DOM methods
Object.defineProperty(window, 'atob', {
  value: jest.fn((str) => str),
  writable: true
});

// Mock select2 module
jest.mock('select2', () => ({}), { virtual: true });

// Mock pluralize
jest.mock('pluralize', () => jest.fn((word) => `${word}s`), { virtual: true });

// Setup DOM
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
