package controllers.website

import javax.inject._
import play.api._
import play.api.mvc._
import views.html._
import utils.admin._
import models.admin._
import models.website._
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(
  PageAction:PageAction,
  documents:Documents,
  posts:Posts
) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = PageAction { implicit request =>
    Ok(views.html.home("Your new application is ready."))
  }

  def test(p:Document) = PageAction { implicit request =>
    Ok(views.html.test(p))
  }

  def default(p:Document) = PageAction { implicit request =>
    Ok(views.html.default(p))
  }

  def product(p:Document) = PageAction.async { implicit request =>
    documents.getByParentId(p.id) map (childPages => {
      Ok(views.html.product(p, childPages.toList))
    })
  }

  def bloglist(p:Document) = PageAction.async { implicit request =>
    posts.getAll map (result => {
      Ok(views.html.bloglist(p, result.toList))
    })
  }

}
