// Setup test environment
process.env.NODE_ENV = 'test';
process.env.PORT = 5002; // Use different port for tests

// Mock console.log in tests to reduce noise
if (process.env.SILENT_TESTS === 'true') {
  global.console.log = jest.fn();
}

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});