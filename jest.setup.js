import '@testing-library/jest-dom'

// Mock Response for tests
global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || '';
    this.headers = new Map();
  }
};
