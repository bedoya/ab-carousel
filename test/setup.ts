( globalThis as any ).IntersectionObserver = class {
    observe() {
    }

    unobserve() {
    }

    disconnect() {
    }
};

if ( typeof window.CustomEvent === 'undefined' ) {
    window.CustomEvent = class CustomEvent extends Event {
        detail;

        constructor( type, eventInitDict = {} ) {
            super( type, eventInitDict );
            this.detail = eventInitDict.detail ?? null;
        }
    };
}

export {};
