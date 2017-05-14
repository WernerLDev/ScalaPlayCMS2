package utils.admin

import controllers.admin.HomeController
import javax.inject.Singleton
import javax.inject._
import play.api._
import play.api.mvc._
import play.api.mvc.Results._
import models.admin.Document
import utils.admin._

case class PageType(name:String, action:(Document => Action[AnyContent]))

@Singleton
class PageTemplates @Inject()(controller:HomeController, PageAction:PageAction) {

    val templates = Map(
        "default" -> PageType("Default page", controller.default ),
        "test" -> PageType("Test page", controller.test )
    )

    def getAction(page:Document):Action[AnyContent] = {
        templates.get(page.view.getOrElse("")) match {
            case Some(pagetype) => pagetype.action(page)
            case None => {
                PageAction { implicit request =>
                    NotFound(views.html.notfound("The page you're requesting has an invalid page type.'"))
                }
            }
        }
    }
}
