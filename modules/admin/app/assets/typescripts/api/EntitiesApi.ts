import ApiCall from './ApiBase.js';

export interface EntityType {
    name:string
    plural:string
}

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

export function getEntityTypes():Promise<EntityType[]> {
    return ApiCall("/api/v1/entities", "GET").then(r => r as EntityType[])
}

export function addEntity(parent_id:number, name:string, discriminator:string):Promise<Entity> {
    var body = JSON.stringify({
        'entity': {
            'parent_id': parent_id,
            'name': name,
            'discriminator': discriminator
        }
    });
    return ApiCall("/admin/api/v1/entities", "POST", body).then(r => r as Entity);
}