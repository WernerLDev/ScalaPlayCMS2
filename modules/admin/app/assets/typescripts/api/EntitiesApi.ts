import ApiCall from './ApiBase.js';

export interface Entity {
    id : number,
    parent_id : number,
    object_id : string,
    name : string,
    discriminator: string,
    created_at : number,
    published_at : number,
    updated_at : number
}

export interface EntityTree {
    entity:Entity,
    children: EntityTree[]
}

export function getEntities():Promise<EntityTree[]> {
    return ApiCall("/admin/api/v1/entities", "GET").then(r => r as EntityTree[]);
}