package controllers.admin

import javax.inject._
import play.api._
import play.api.mvc._
import views.html._
import utils.admin._
import models.admin._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(PageAction:PageAction) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = Action { implicit request =>
    Ok(views.html.admin.index("Your new application is ready.", ""))
  }

  def test(p:Document) = PageAction { implicit request =>
    Ok("Test template")
  }

  def default(p:Document) = PageAction { implicit request =>
    println(request.user)
    Ok("default template")
  }

}
