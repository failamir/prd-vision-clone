import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Mock ResizeObserver for Radix UI components
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
(globalThis as any).ResizeObserver = ResizeObserver;

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
