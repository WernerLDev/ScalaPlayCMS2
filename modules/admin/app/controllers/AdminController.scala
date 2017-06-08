
package controllers.admin

import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject._
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.validation._
import play.api.data.Forms._
import scala.concurrent._
import scala.concurrent.duration._
import utils.admin.PasswordHasher
import play.api.i18n._
import play.api.i18n.I18nSupport
import models.admin._
import java.sql.Timestamp
import java.util.Date
import play.api.libs.mailer._

case class UserData(username:String, password:String)
case class LostPassData(email:String)

@Singleton
class AdminController @Inject()(
    val messagesApi: MessagesApi,
    users:Users, 
    sessions:UserSessions, 
    resettokens:ResetTokens, 
    mailerClient: MailerClient) extends Controller with I18nSupport {

    val loginForm = Form(
        mapping(
            "username" -> nonEmptyText,
            "password" -> nonEmptyText
        )(UserData.apply)(UserData.unapply)    
    )

    def login = Action { implicit request =>
        //users.insert( User(0, "werner", "testing123", "blaat@bla.nl") )
        //users.insert( User(0, "admin", "test1234", "nogiemand@bla.nl") )
        //val test = PasswordHasher.hashPassword("testing123")
        //println(test)
        Ok(views.html.admin.login(loginForm))
    }

    def doLogin = Action.async { implicit request =>
        loginForm.bindFromRequest.fold(
            formWithErrors => Future(BadRequest(views.html.admin.login(formWithErrors))),
            userData => {
                users.authenticate(userData.username, userData.password) flatMap (userOpt => {
                    userOpt match {
                        case Some(user:User) => {
                            val useragent = request.headers.get("User-Agent").getOrElse("Unknown")
                            val ip = request.remoteAddress
                            sessions.newSession(user, useragent, ip) map ( session => {
                                    Redirect(controllers.admin.routes.MainController.index)
                                    .withSession(
                                        request.session + ("username" -> user.username) + ("skey" -> session.session_key)
                                    )
                            })
                        }
                        case None => {
                            Future(
                                Redirect(controllers.admin.routes.AdminController.login)
                                .withNewSession.flashing("loginfailed" -> "Login attempt failed.")
                            )
                        }
                    }
                })
            }
        )
    }

    val lostpassForm = Form(
        mapping(
            "email" -> email
        )(LostPassData.apply)(LostPassData.unapply)    
    )

    def retrievePasswordForm = Action { implicit request => {
        Ok(views.html.admin.lostpass(lostpassForm))
    }}

    def redirectLostPass(email:String) = {
        Redirect(controllers.admin.routes.AdminController.retrievePasswordForm)
                .withNewSession.flashing("mailsent" -> email)
    }

    def retrievePassword = Action.async { implicit request =>
        lostpassForm.bindFromRequest.fold(
            formWithErrors => Future(BadRequest(views.html.admin.lostpass(formWithErrors))),
            lostpassData => {
                users.findByEmail(lostpassData.email) flatMap (userOpt => userOpt match {
                    case Some(user:User) => {
                        val currDate:Date = new Date()
                        val expirationDate:Date = new Date(currDate.getTime() + 1 * 24 * 3600 * 1000)
                        val resetToken = PasswordHasher.generateKey
                        resettokens.create(ResetToken(
                            id = 0,
                            user_id = user.id,
                            resettoken = resetToken,
                            expires_at = new Timestamp(expirationDate.getTime())
                        )) map (x => {
                            val emailTxt = s"""Hello ${user.username},\n
                                              |You or someone else requested a new password. Click on the following link to reset your password.
                                              |http://localhost:9000/admin/login/resetpassword/$resetToken 
                                              |""".stripMargin
                            mailerClient.send(Email(
                                "Password reset for your admin panel",
                                "NoReply <noreply@werlang.nl>",
                                Seq(user.username + " <" + user.email + ">"),
                                bodyText = Some(emailTxt)
                            ))
                            redirectLostPass(user.email)
                        })

                    }
                    case None => Future(redirectLostPass(lostpassData.email))
                })

            }
        )
    }

    def resetPassword(tokenstring:String) = Action.async { implicit request =>
        resettokens.getByToken(tokenstring) flatMap (tokenOpt => tokenOpt match {
            case Some((token:ResetToken, user:User)) => {
                val newPassword = PasswordHasher.generatePassword
                val newUser = User(
                    id = user.id,
                    username = user.username,
                    email = user.email,
                    passwordhash = PasswordHasher.hashPassword(newPassword)
                )
                users.update(newUser) flatMap (x => {
                    val emailTxt = s"""Hello ${user.username},\n\n
                                      |Your password has been reset.\n\n
                                      |Your new password is: $newPassword
                                    """.stripMargin
                    mailerClient.send(Email(
                        "New password for your admin panel",
                        "NoReply <noreply@werlang.nl>",
                        Seq(user.username + " <" + user.email + ">"),
                        bodyText = Some(emailTxt)
                    ))
                    val msg = "Your password has been reset. Check your email."
                    resettokens.deleteByToken(tokenstring) map ( y => {
                        Ok(views.html.admin.guestmessage("Password reset", msg) )
                    })
                })
            }
            case None => Future(BadRequest(views.html.admin.guestmessage("Error", "Invalid resettoken") ))
        })
    }

    def logout = Action { implicit request =>
        request.session.get("skey") map (key => sessions.deleteByKey(key))
        Redirect(controllers.admin.routes.AdminController.login).withSession( request.session - "username" - "skey" )
    }
}
