import ApiCall from './ApiBase.js';
import { EntityField } from '../components/EntitiesPanel/EntityTabPanel'
import { EntityObject } from '../components/EntitiesPanel/EntityDropdown'

export interface EntityType {
  name: string
  plural: string
}

export interface EntityRelation {
  source_id: number,
  target_id: number
}

export interface Entity {
  id: number,
  parent_id: number,
  object_id: number,
  name: string,
  discriminator: string,
  created_at: number,
  published_at: number,
  updated_at: number
}

export interface BaseEntity {
  id: number
}

export interface EntityTree {
  entity: Entity,
  children: EntityTree[]
}

export interface EntityForm {
  attributes: EntityField[],
  relations: {
    relationname: string,
    relation: string,
    unique: boolean
  }[]
}


export function getEntities(): Promise<EntityTree[]> {
  return ApiCall("/admin/api/v1/entities", "GET").then(r => r as EntityTree[]);
}

export function getEntityTypes(): Promise<EntityType[]> {
  return ApiCall("/api/v1/entities", "GET").then(r => r as EntityType[])
}

export function addEntity(parent_id: number, name: string, discriminator: EntityType): Promise<Entity> {

  const createEntity = (object_id: number) => {
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

  if (discriminator.name == "folder") {
    return createEntity(0);
  } else {
    return createEntity(0).then(entity => {
      return ApiCall<BaseEntity>(
        `/api/v1/entities/${discriminator.name.toLowerCase()}/${entity.id}/init`,
        "POST",
        "{}"
      ).then(e => {
        return updateBaseEntity({ ...entity, object_id: e.id }).then(x => {
          return entity;
        })
      })
    });
  }
}

export function deleteEntity(entity: Entity): Promise<Entity> {
  if (entity.object_id != 0) {
    return ApiCall("/api/v1/entities/" + entity.discriminator + "/" + entity.object_id, "DELETE").then(x => {
      return ApiCall("/admin/api/v1/entities/" + entity.id, "DELETE").then(r => r as Entity);
    });
  }
  return ApiCall("/admin/api/v1/entities/" + entity.id, "DELETE").then(r => r as Entity);
}

export function renameEntity(entity: Entity): Promise<Entity> {
  var body = JSON.stringify({
    "name": entity.name
  });
  return ApiCall("/admin/api/v1/entities/" + entity.id + "/rename", "PUT", body).then(r => r as Entity);
}

export function getEntityForm(entity: Entity): Promise<EntityForm> {
  return ApiCall("/api/v1/entities/" + entity.discriminator + "/" + entity.id + "/form", "GET").then(r => r as EntityForm);
}

export function getEntitiesByType(type: string): Promise<Entity[]> {
  return ApiCall("/admin/api/v1/entities/type/" + type, "GET").then(x => x as Entity[]);
}

export function getEntityObjects(type: string): Promise<EntityObject[]> {
  return ApiCall("/api/v1/entities/" + type, "GET");
}

export function getEntityById(id: number): Promise<Entity> {
  return ApiCall("/admin/api/v1/entities/" + id, "GET").then(x => x as Entity);
}

export function updateEntity(entity: Object, discriminator: string): Promise<{ success: boolean }> {
  return ApiCall("/api/v1/entities/" + discriminator, "PUT", JSON.stringify({ 'entity': entity }));
}

export function linkEntities(relation: string, source_id: number, target_id: number): Promise<{}> {
  return ApiCall("/api/v1/entities/link/" + relation + "/" + source_id + "/" + target_id, "POST", "{}")
}

export function unlinkEntities(relation: string, source_id: number, target_id: number): Promise<{}> {
  return ApiCall("/api/v1/entities/unlink/" + relation + "/" + source_id + "/" + target_id, "DELETE")
}

export function getAllRelations(relation: string): Promise<EntityRelation[]> {
  return ApiCall("/api/v1/entities/relations/" + relation, "GET").then(x => x as EntityRelation[]);
}

export function getRelations(relation: string, source_id: number): Promise<EntityRelation[]> {
  return ApiCall("/api/v1/entities/relations/" + relation + "/" + source_id, "GET")
}

export function updateParentEntity(source_id: number, target_id: number) {
  var body = JSON.stringify({
    "parent_id": target_id
  });
  return ApiCall("/admin/api/v1/entities/" + source_id + "/updateparent", "PUT", body);
}

export function updateBaseEntity(entity: Entity) {
  return ApiCall(
    "/admin/api/v1/entities",
    "PUT",
    JSON.stringify({ entity: entity })
  )
}
