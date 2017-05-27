import ApiCall from './ApiBase.js';

export interface Document {
    id : number,
    parent_id : number,
    name : string,
    doctype : string,
    collapsed: boolean,
    view : string,
    path : string,
    title : string,
    locale : string,
    description : string,
    created_at : number,
    updated_at : number,
    published_at : number
}

// export interface DocumentTree {
//     id : number,
//     key : string,
//     path : string,
//     label : string,
//     doctype : string,
//     collapsed : boolean,
//     published : boolean,
//     children : DocumentTree[]
// }

export interface DocumentTree {
    doc : Document,
    children: DocumentTree[]
}

export interface PageType {
    typekey : string,
    typename : string
}

export function getPageTypes():Promise<PageType[]> {
    return ApiCall("/admin/api/v1/pagetypes", "GET").then(r => r.pagetypes as PageType[]);
}

export function getDocuments():Promise<DocumentTree[]> {
    return ApiCall("/admin/api/v1/documents", "GET").then(r => r as DocumentTree[]);
}

export function renameDocument(doc:Document) {
    var body = JSON.stringify({
        "name" : doc.name
    });
    return ApiCall("/admin/api/v1/documents/" + doc.id + "/rename", "PUT", body);
}

export function addDocument(parent_id:number, name:string, pagetype:string):Promise<Document> {
    var body = JSON.stringify({
            "document" : {
            "parent_id" : parent_id,
            "name" : name,
            "pagetype": pagetype
        }
    })
    return ApiCall("/admina/api/v1/documents", "POST", body);
}

export function deleteDocument(doc:Document) {
    return ApiCall("/admin/api/v1/documents/" + doc.id, "DELETE");
}

export function updateParentDocument(source_id:number, parent_id:number) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/admin/api/v1/documents/" + source_id + "/updateparent", "PUT", body);
}