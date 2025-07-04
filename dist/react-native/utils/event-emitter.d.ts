export declare class EventEmitter<T extends Record<string, any>> {
    private events;
    on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
    off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
    emit<K extends keyof T>(event: K, data?: T[K]): void;
    removeAllListeners<K extends keyof T>(event?: K): void;
}
//# sourceMappingURL=event-emitter.d.ts.map