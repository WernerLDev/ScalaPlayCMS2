package controllers.admin

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
class MainController @Inject()(documents:Documents, editables:Editables, templates:PageTemplates, WithAuthAction:AuthAction, PageAction:PageAction) extends Controller {

  implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = WithAuthAction { implicit request =>
    val token = CSRF.getToken.get
    Ok(views.html.admin.index("Logged in as " + request.user.username, token.value))
  }

}