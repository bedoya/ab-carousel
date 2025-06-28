( globalThis as any ).IntersectionObserver = class {
    observe() {
    }

    unobserve() {
    }

    disconnect() {
    }
};

// Needed so TypeScript treats this file as a module
export {};
