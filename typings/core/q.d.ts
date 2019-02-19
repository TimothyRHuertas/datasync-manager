/*!
* Contentstack Sync Manager
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Q extends EventEmitter {
    private detectRteMarkdownAssets;
    private inProgress;
    private rteInProgress;
    private pluginInstances;
    private assetStore;
    private contentStore;
    private q;
    constructor(contentStore: any, assetStore: any, config: any);
    push(data: any): void;
    errorHandler(obj: any): void;
    private next;
    private process;
    private reStructureAssetObjects;
    private exec;
}
