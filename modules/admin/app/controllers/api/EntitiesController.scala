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

@Singleton
class EntitiesController @Inject()(
    entities:Entities,
    WithAuthAction:AuthAction, 
    conf:Configuration) extends Controller {


    implicit val entityWrites = Json.writes[Entity]

    def getAll = WithAuthAction.async {
      entities.getAll map (x => {
          println(x)
        Ok(Json.toJson(x))
    })
  }

}