/*!
 * Contentstack Sync Manager
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
export declare const init: (contentStore: any, assetStore: any) => Promise<{}>;
export declare const poke: () => void;
export declare const lock: () => void;
export declare const unlock: () => void;
