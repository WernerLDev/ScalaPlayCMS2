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

export function renameDocument(doc:Document) {
    var body = JSON.stringify({
        "name" : doc.label
    });
    return ApiCall("/admin/api/v1/documents/" + doc.id + "/rename", "PUT", body);
}

export function addDocument(parent_id:number, name:string, pagetype:string) {
    var body = JSON.stringify({
            "document" : {
            "parent_id" : parent_id,
            "name" : name,
            "pagetype": pagetype
        }
    })
    return ApiCall("/admin/api/v1/documents", "POST", body);
}