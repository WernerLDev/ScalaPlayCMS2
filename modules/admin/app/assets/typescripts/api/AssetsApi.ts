import ApiCall from './ApiBase.js';

export interface Asset {
    id : number,
    key : string,
    path : string,
    server_path : string,
    label : string,
    mimetype : string,
    collapsed : boolean,
    children : Asset[]
}

export interface UploadResult {
    success : boolean,
    name : string,
    contenttype: string,
    server_path : string
}


export function getAssets():Promise<Asset[]> {
    return ApiCall("/admin/api/v1/assets", "GET").then(r => r as Asset[]);
}

export function renameAsset(asset:Asset) {
    var body = JSON.stringify({
        "name" : asset.label
    });
    return ApiCall("/admin/api/v1/assets/" + asset.id + "/rename", "PUT", body);
}

export function addAsset(parent_id:number, name:string, path:string, mimetype:string) {
    var body = JSON.stringify({
        'parent_id': parent_id,
        'name': name,
        'server_path': path,
        'mimetype': mimetype
    });
    return ApiCall("/admin/api/v1/assets", "POST", body);
}

export function uploadAsset(file:File):Promise<UploadResult> {
    var data  = new FormData();
    data.append("asset", file);
    return ApiCall("/admin/api/v1/assets/upload", "POST", data, "none").then(r => r as UploadResult);
}

export function deleteAsset(asset:Asset) {
    return ApiCall("/admin/api/v1/assets/" + asset.id, "DELETE");
}

export function getAsset(id:number) {
    return ApiCall("/admin/api/v1/assets/" + id, "GET");
}

export function updateParentAsset(id:number, parent_id:number) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/admin/api/v1/assets/" + id + "/updateparent", "PUT", body);
}
