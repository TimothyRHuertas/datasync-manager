/*!
* Contentstack Sync Manager
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare const filterItems: (response: any, config: any) => Promise<{}>;
export declare const groupItems: (items: any) => {};
export declare const formatItems: (items: any, config: any) => any;
export declare const markCheckpoint: (groupedItems: any, syncResponse: any) => any;
export declare const getFile: (file: any, rotate: any) => Promise<{}>;
export declare const buildContentReferences: (schema: any[], entry: any, parent?: string[]) => any;
export declare const getOrSetRTEMarkdownAssets: (schema: any, entry: any, bucket: any[], isFindNotReplace: any, parent?: any[]) => any;
