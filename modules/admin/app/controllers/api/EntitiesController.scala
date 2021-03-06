package controllers.admin.api

import javax.inject._
import play.api._
import play.api.mvc._
import models.admin._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import java.sql.Timestamp
import java.util.Date
import utils.admin._
import models.admin._

case class NewEntity(parent_id:Long, object_id:Long, name:String, discriminator:String)

@Singleton
class EntitiesController @Inject()(
    entities:Entities,
    WithAuthAction:AuthAction, 
    conf:Configuration) extends Controller {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val entityWrites = Json.writes[Entity]
    implicit val entityReads = Json.reads[Entity]
    implicit val entityTreeWrites = Json.writes[EntityTree]
    implicit val newEntityReads = Json.reads[NewEntity]

    def getAll = WithAuthAction.async {
      entities.getTree map (x => {
        Ok(Json.toJson(x))
      })
    }

    def getById(id:Long) = WithAuthAction.async {
      entities.getById(id).map(x => x match {
        case Some(x) => Ok(Json.toJson(x))
        case None => NotFound(Json.toJson(Map("msg" -> JsString("No entity found with id " + id.toString))))
      })
    }
    
    def getByType(entityType:String) = WithAuthAction.async {
      entities.getByType(entityType).map(result => {
        Ok(Json.toJson(result))
      })
    }

    def addEntity = WithAuthAction.async(parse.json) { request =>
      {request.body \ "entity"}.asOpt[NewEntity].map(entity => {
        val currentTime:Timestamp = new Timestamp((new Date).getTime())
        val newEntity = Entity(
          id = 0,
          name = entity.name,
          object_id = entity.object_id,
          parent_id = entity.parent_id,
          discriminator = entity.discriminator,
          created_at = currentTime, updated_at = currentTime, published_at = currentTime
        )
        entities.insert(newEntity) map (x => {
          Ok(Json.toJson(x))
        })
      }).getOrElse(Future(BadRequest("Wrong parameter")))
    }

    def updateEntity = WithAuthAction.async(parse.json) { request =>
      (request.body \ "entity").asOpt[Entity].map(entity => {
        entities.update(entity) map (x => {
          Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
      }).getOrElse(Future(BadRequest("Wrong parameter")))
    }

    def deleteEntity(id:Long) = WithAuthAction.async { request =>
      entities.delete(id) map (x => {
        Ok(Json.toJson( Map("success" -> JsBoolean(true))))
      })
    }

    def renameEntity(id:Long) = WithAuthAction.async(parse.json) { request => 
      ((request.body \ "name").asOpt[String].map{ name =>
        entities.rename(id, name) map { x =>
          Ok(Json.toJson(Map("success" -> JsNumber(x))))
        }
      }).getOrElse( Future(BadRequest("Error: missing parameter [name]")) )
    }

    def updateParent(id:Long) = WithAuthAction.async(parse.json) { request =>
        ((request.body \ "parent_id").asOpt[Long].map{ parent_id =>
        entities.updateParent(id, parent_id) map { x =>
            Ok(Json.toJson(Map("success" -> JsNumber(x))))
        }
        }).getOrElse( Future(BadRequest("Error: missing parameter [parent_id]")) )
    }

}


