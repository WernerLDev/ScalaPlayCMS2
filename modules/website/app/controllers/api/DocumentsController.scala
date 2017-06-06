package controllers.website.api

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import models.admin.Documents
import utils.website.PageTemplates
import utils.admin._
import scala.concurrent.ExecutionContext.Implicits.global

@Singleton
class DocumentsController @Inject()(
    templates:PageTemplates, 
    documents:Documents,
    WithAuthAction:AuthAction
) extends Controller {
  
  def getPageTypes = WithAuthAction {
    val pagetypes = templates.templates.map { case (k,v) => {
      Json.toJson(Map( "typekey" -> JsString(k), "typename" -> JsString(v.name)))
     }}.toSeq
    Ok(
      Json.toJson(
        Map(
          "pagetypes" -> JsArray(pagetypes)
        )
      )
    )
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