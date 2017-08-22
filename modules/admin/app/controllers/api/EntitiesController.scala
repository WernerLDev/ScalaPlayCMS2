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
import scala.util.{Success, Failure}
import java.io.File
import models.admin._

case class NewEntity(parent_id:Long, name:String, discriminator:String)

@Singleton
class EntitiesController @Inject()(
    entities:Entities,
    WithAuthAction:AuthAction, 
    conf:Configuration) extends Controller {

    implicit val entityWrites = Json.writes[Entity]
    implicit val entityTreeWrites = Json.writes[EntityTree]
    implicit val entityReads = Json.reads[NewEntity]

    def getAll = WithAuthAction.async {
      entities.getTree map (x => {
        Ok(Json.toJson(x))
      })
    }
    

    def addEntity = WithAuthAction.async(parse.json) { request =>
      {request.body \ "entity"}.asOpt[NewEntity].map(entity => {
        val currentTime:Timestamp = new Timestamp((new Date).getTime());
        val newEntity = Entity(
          id = 0,
          name = entity.name,
          object_id = 0,
          parent_id = entity.parent_id,
          discriminator = entity.discriminator,
          created_at = currentTime, updated_at = currentTime, published_at = currentTime
        )
        entities.insert(newEntity) map (x => {
          Ok(Json.toJson(x))
        })
      }).getOrElse(Future(BadRequest("Wrong parameter")))
    }

}


