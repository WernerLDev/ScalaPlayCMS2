import ApiCall from './ApiBase.js';

export interface Document {
    id : number,
    key : string,
    path : string,
    label : string,
    doctype : string,
    collapsed : boolean,
    published : boolean,
    children : Document[]
}

export function getPageTypes() {
    return ApiCall("/api/v1/pagetypes", "GET");
}

export function getDocuments():Promise<Document[]> {
    return ApiCall("/admin/api/v1/documents", "GET").then(r => r as Document[]);
}
