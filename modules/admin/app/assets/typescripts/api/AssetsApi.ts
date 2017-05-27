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


export function getAssets():Promise<Asset[]> {
    return ApiCall("/admin/api/v1/assets", "GET").then(r => r as Asset[]);
}

export function renameAsset(asset:Asset) {
    var body = JSON.stringify({
        "name" : asset.label
    });
    return ApiCall("/admin/api/v1/assets/" + asset.id + "/rename", "PUT", body);
}