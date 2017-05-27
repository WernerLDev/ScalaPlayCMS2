package controllers.website

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
import utils.admin.PageTemplates
import scala.util.{Success, Failure}
import scala.concurrent._
import scala.concurrent.duration._
import utils.admin._
import play.filters.csrf._

@Singleton
class MainController @Inject()(documents:Documents, editables:Editables, templates:PageTemplates, PageAction:PageAction) extends Controller {

  implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))


  def index = Action {
      Ok("The index page")
  }

  def page(path:String) = Action.async { implicit request =>
    documents.getByPath("/" + path) flatMap (docOpt => docOpt match {
      case Some(p) => templates.getAction(p)(request)
      case None => {
        documents.getTree map (menuitems => {
          implicit val pagerequest = new PageRequest(None, false, List(), menuitems, request)
          NotFound(views.html.notfound("The page you are looking for doesn't exist."))
        })
      }
    })
  }

}