import ApiCall from './ApiBase.js';

//Api.getAssets().then(assets => {
        //     var items = this.toTreeItems(assets);
        //     this.setState({ assets: assets, treeItems: items, working: false });
        // });


//case class Asset(id : Long , parent_id : Long, name : String, mimetype : String, collapsed : Boolean, path:String, server_path:String, filesize:Long, created_at:Timestamp )

export interface Asset {
    id : number,
    parent_id : number,
    name : string,
    mimetype : string,
    collapse : boolean,
    path : string,
    server_path: string,
    filesize: number,
    created_at : number
}

export interface AssetTree {
    id : number,
    key : string,
    path : string,
    server_path : string,
    label : string,
    mimetype : string,
    collapsed : boolean,
    children : AssetTree[]
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

export function renameAsset(asset:AssetTree) {
    var body = JSON.stringify({
        "name" : asset.label
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

export function uploadAsset(file:File):Promise<UploadResult> {
    var data  = new FormData();
    data.append("asset", file);
    return ApiCall("/admin/api/v1/assets/upload", "POST", data, "none").then(r => r as UploadResult);
}

export function deleteAsset(asset:AssetTree) {
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
