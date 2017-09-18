import ApiCall from './ApiBase.js';

export interface EntityType {
    name:string
    plural:string
}

export interface Entity {
    id : number,
    parent_id : number,
    object_id : number,
    name : string,
    discriminator: string,
    created_at : number,
    published_at : number,
    updated_at : number
}

export interface BaseEntity {
    id : number
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

export function addEntity(parent_id:number, name:string, discriminator:EntityType):Promise<Entity> {

    const createEntity = (object_id:number) => {
        var body = JSON.stringify({
            'entity': {
                'parent_id': parent_id,
                'object_id': object_id,
                'name': name,
                'discriminator': discriminator.name.toLowerCase()
            }
        });
        return ApiCall("/admin/api/v1/entities", "POST", body).then(r => r as Entity);
    }

    if(discriminator.name == "folder") {
        return createEntity(0);
    } else {
        return ApiCall("/api/v1/entities/" + discriminator.name.toLowerCase() + "/init", "POST", "{}").then(entity => {
            let e = entity as BaseEntity;
            return createEntity(e.id);
        });
    }
}

export function deleteEntity(entity:Entity):Promise<Entity> {
    if(entity.object_id != 0) {
        return ApiCall("/api/v1/entities/" + entity.discriminator + "/" + entity.object_id, "DELETE").then(x => {
            return ApiCall("/admin/api/v1/entities/" + entity.id, "DELETE").then(r => r as Entity);        
        });
    }
    return ApiCall("/admin/api/v1/entities/" + entity.id, "DELETE").then(r => r as Entity);
}

export function renameEntity(entity:Entity):Promise<Entity> {
    var body = JSON.stringify({
        "name" : entity.name
    });
    return ApiCall("/admin/api/v1/entities/" + entity.id + "/rename", "PUT", body).then(r => r as Entity);
}