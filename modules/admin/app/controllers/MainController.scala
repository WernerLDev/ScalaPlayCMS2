package controllers.admin

import javax.inject._
import play.api._
import play.api.mvc._
import models.admin._
import play.api.libs.json._
import play.api.libs.json.Reads._
import java.sql.Timestamp
import utils.admin._
import play.filters.csrf._

@Singleton
class MainController @Inject()(documents:Documents, editables:Editables, WithAuthAction:AuthAction, PageAction:PageAction) extends Controller {

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