// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Audio
class AudioMock {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.currentTime = 0;
  }
  
  play() {
    return Promise.resolve();
  }
  
  pause() {}
}

global.Audio = AudioMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.observe = jest.fn((element) => {
      this.elements.add(element);
    });
    this.unobserve = jest.fn((element) => {
      this.elements.delete(element);
    });
    this.disconnect = jest.fn(() => {
      this.elements.clear();
    });
  }
}

global.IntersectionObserver = IntersectionObserverMock; 