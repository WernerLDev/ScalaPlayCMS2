import ApiCall from './ApiBase.js';
import * as Immutable from 'immutable'

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

export interface DocumentTree {
    document : Document,
    children: DocumentTree[]
}

export interface PageType {
    typekey : string,
    typename : string
}

export interface Editable {
    id : number,
    document_id : number,
    name : string,
    value : string
}


export function getPageTypes():Promise<PageType[]> {
    return ApiCall<{pagetypes:PageType[]}>("/api/v1/pagetypes", "GET")
            .then(r => r.pagetypes as PageType[]);
}

export function getDocuments():Promise<DocumentTree[]> {
    return ApiCall("/admin/api/v1/documents", "GET").then(r => r as DocumentTree[]);
}

export function getDocument(id:number):Promise<Document> {
    return ApiCall("/admin/api/v1/documents/" + id, "GET").then(r => r as Document);
}

export function renameDocument(doc:Document) {
    var body = JSON.stringify({
        "name" : doc.name
    });
    return ApiCall("/admin/api/v1/documents/" + doc.id + "/rename", "PUT", body);
}


/**
 * Creates a new document
 * 
 * @export
 * @param {number} parent_id 
 * @param {string} name 
 * @param {string} pagetype 
 * @returns {Promise<Document>} 
 */
export function addDocument(parent_id:number, name:string, pagetype:string):Promise<Document> {
    var body = JSON.stringify({
        "document" : {
            "parent_id" : parent_id,
            "name" : name,
            "pagetype": pagetype
        }
    })
    return ApiCall("/admin/api/v1/documents", "POST", body);
}

export function deleteDocument(doc:Document) {
    return ApiCall("/admin/api/v1/documents/" + doc.id, "DELETE");
}

export function updateDocument(document:Document) {
    var body = JSON.stringify({
        "document" : document
    });
    return ApiCall("/admin/api/v1/documents", "PUT", body);
}

export function updateParentDocument(source_id:number, parent_id:number) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/admin/api/v1/documents/" + source_id + "/updateparent", "PUT", body);
}

export function collapseDocument(id:number, collapsed:boolean) {
    var body = JSON.stringify({
        "collapsed": collapsed
    });
    return ApiCall("/admin/api/v1/documents/" + id + "/collapse", "PUT", body);
}

export function saveEditables(id:number, editables:Immutable.List<Editable>) {
    var body = JSON.stringify({
        "editables": editables
    });
    return ApiCall("/admin/api/v1/documents/" + id + "/editables", "PUT", body);
}