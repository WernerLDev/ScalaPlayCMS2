import ApiCall from './ApiBase.js';

export interface Asset {
    id : number,
    parent_id : number,
    name : string,
    mimetype : string,
    collapsed : boolean,
    path : string,
    server_path: string,
    filesize: number,
    created_at : number
}

export interface AssetTree {
    asset:Asset,
    children: AssetTree[]
}

export interface UploadResult {
    success : boolean,
    name : string,
    contenttype: string,
    server_path : string
}

export function getAssets():Promise<AssetTree[]> {
    return ApiCall("/admin/api/v1/assets", "GET").then(r => r as AssetTree[]);
}

export function getAssetChilds(id:number):Promise<Asset[]> {
    return ApiCall("/admin/api/v1/assets/" + id + "/childs", "GET").then(r => r as Asset[])
}

export function renameAsset(asset:Asset) {
    var body = JSON.stringify({
        "name" : asset.name
    });
    return ApiCall("/admin/api/v1/assets/" + asset.id + "/rename", "PUT", body);
}

export function addAsset(parent_id:number, name:string, path:string, mimetype:string):Promise<Asset> {
    var body = JSON.stringify({
        'parent_id': parent_id,
        'name': name,
        'server_path': path,
        'mimetype': mimetype
    });
    return ApiCall("/admin/api/v1/assets", "POST", body).then(r => r as Asset);
}

// export function uploadAsset(file:File):Promise<UploadResult> {
//     var data  = new FormData();
//     data.append("asset", file);
//     return ApiCall("/admin/api/v1/assets/upload", "POST", data, "none").then(r => r as UploadResult);
// }

export function deleteAsset(asset:Asset) {
    return ApiCall("/admin/api/v1/assets/" + asset.id, "DELETE");
}

export function updateAsset(asset:Asset) {
    var body = JSON.stringify({
        "asset" : asset
    });
    return ApiCall("/admin/api/v1/assets", "PUT", body);
}

export function getAsset(id:number) {
    return ApiCall("/admin/api/v1/assets/" + id, "GET");
}

export function getAssetContentAsText(asset:Asset) {
    return ApiCall("/admin/uploads"+asset.path, "GET", null, "text/plain");
}

export function updateParentAsset(id:number, parent_id:number) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/admin/api/v1/assets/" + id + "/updateparent", "PUT", body);
}

export function collapseAsset(id:number, collapsed:boolean) {
    var body = JSON.stringify({
        "collapsed": collapsed
    });
    return ApiCall("/admin/api/v1/assets/" + id + "/collapse", "PUT", body);
}