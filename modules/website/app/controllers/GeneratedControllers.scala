package controllers.website

import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import scala.concurrent.Future
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Singleton
import javax.inject._
import play.api.Play.current
import java.sql.Timestamp
import slick.profile.SqlProfile.ColumnOption.SqlType
import play.api.mvc._
import utils.admin._
import play.api.libs.json._
import play.api.libs.json.Reads._

import models.website._


trait TGenController {
    def getAll(request:AuthRequest[AnyContent]):Future[Result]
    def insert(request:AuthRequest[JsValue]):Future[Result]
    def delete(id:Long, request:AuthRequest[AnyContent]):Future[Result]
    def createNew(request:AuthRequest[AnyContent]):Future[Result]
}

@Singleton
class GeneratedPostsController @Inject() (
    WithAuthAction:AuthAction,
    posts:Posts
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val PostWrites = Json.writes[Post]
    implicit val PostReads = Json.reads[Post]
    implicit val categoryWrites = Json.writes[Category]

    def getAll(request:AuthRequest[AnyContent]) = {
        posts.getAll.map(entities => Ok(Json.toJson(entities.map(x => Map( "id" -> JsNumber(x._1.id), "name"-> JsString(x._1.name), "title"-> JsString(x._1.title), "content"-> JsString(x._1.content), "category_id" -> JsNumber(x._1.category_id), "category" -> Json.toJson(x._2)) ))))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Post].map( entity => {
            posts.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      posts.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        posts.insert(Post(
           0, "", "", "", 0 
        )) map (x => Ok(Json.toJson(x)))
    }

}


@Singleton
class GeneratedCategoriesController @Inject() (
    WithAuthAction:AuthAction,
    categories:Categories
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val CategoryWrites = Json.writes[Category]
    implicit val CategoryReads = Json.reads[Category]


    def getAll(request:AuthRequest[AnyContent]) = {
        categories.getAll.map(x => Ok(Json.toJson(x)))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Category].map( entity => {
            categories.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      categories.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        categories.insert(Category(
           0, "", "" 
        )) map (x => Ok(Json.toJson(x)))
    }

}


@Singleton
class GeneratedProjectsController @Inject() (
    WithAuthAction:AuthAction,
    projects:Projects
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val ProjectWrites = Json.writes[Project]
    implicit val ProjectReads = Json.reads[Project]


    def getAll(request:AuthRequest[AnyContent]) = {
        projects.getAll.map(x => Ok(Json.toJson(x)))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Project].map( entity => {
            projects.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      projects.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        projects.insert(Project(
           0, "", "", "", new Timestamp(new java.util.Date().getTime()) 
        )) map (x => Ok(Json.toJson(x)))
    }

}

@Singleton
class GeneratedController @Inject() (
    WithAuthAction:AuthAction,
    posts:GeneratedPostsController,
    categories:GeneratedCategoriesController,
    projects:GeneratedProjectsController
) extends Controller {


    val controllers = Map(
        "post" -> posts,
        "category" -> categories,
        "project" -> projects
    )
 
    val entityTypes = Map(
        "post" -> "posts",
        "category" -> "categories",
        "project" -> "projects"
    )


    def getAll(name:String) = WithAuthAction.async { request =>
        controllers.get(name) match {
            case Some(x) => x.getAll(request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def insert(name:String) = WithAuthAction.async(parse.json) { request =>
        controllers.get(name) match {
            case Some(x) => x.insert(request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def delete(name:String, id:Long) = WithAuthAction.async { request =>
        controllers.get(name) match {
            case Some(x) => x.delete(id, request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def createNew(name:String) = WithAuthAction.async { request =>
        controllers.get(name) match {
            case Some(x) => x.createNew(request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def getEntities = WithAuthAction { request =>
        val entities = entityTypes.map { case (k,v) => {
            Json.toJson(Map("name" -> JsString(k.capitalize), "plural" -> JsString(v)))
        }}.toSeq
        Ok( Json.toJson(JsArray(entities)) )
    }
}
