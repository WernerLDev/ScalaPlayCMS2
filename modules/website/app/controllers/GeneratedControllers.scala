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
    def update(request:AuthRequest[JsValue]):Future[Result]
    def delete(id:Long, request:AuthRequest[AnyContent]):Future[Result]
    def createNew(request:AuthRequest[AnyContent]):Future[Result]
    def getFormById(id:Long, request:AuthRequest[AnyContent]):Future[Result]
}

@Singleton
class GeneratedAuthorsController @Inject() (
    WithAuthAction:AuthAction,
    authors:Authors
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val AuthorWrites = Json.writes[Author]
    implicit val AuthorReads = Json.reads[Author]
    implicit val projectWrites = Json.writes[Project]

    def getAll(request:AuthRequest[AnyContent]) = {
        authors.getAll.map(x => Ok(Json.toJson(x)))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Author].map( entity => {
            authors.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def update(request:AuthRequest[JsValue]) = {
        (request.body \ "entity").asOpt[Author].map( entity => {
             authors.update(entity).map(x => {
                 Ok(Json.toJson(Map("success" -> JsBoolean(true))))
             })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      authors.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        authors.insert(Author(
           0, "", "", new Timestamp(new java.util.Date().getTime()) 
        )) map (x => Ok(Json.toJson(x)))
    }

     def getFormById(id:Long, request:AuthRequest[AnyContent]) = {
        authors.getById(id).map(x => x match {
            case Some(p) => {
                Ok(Json.toJson(
                    Map(
                       "attributes" -> List(
                           Map("name" -> JsString("id"),  "type" -> JsString("readonly"), "value" -> JsNumber(p.id)),
                           Map("name" -> JsString("name"),  "type" -> JsString("text"), "value" -> JsString(p.name)),
                           Map("name" -> JsString("email"),  "type" -> JsString("text"), "value" -> JsString(p.email)),
                           Map("name" -> JsString("dateofbirth"),  "type" -> JsString("date"), "value" -> JsNumber(p.dateofbirth.getTime()))
                       ),
                       "relations" -> List(
                           Map("relationname" -> JsString("authorproject"), "relation" -> JsString("project"), "unique" -> JsBoolean(false))
                       )
                    )
                ))
            }
            case None => BadRequest("Invalid authors id provided.")
        })
    }

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
    implicit val authorWrites = Json.writes[Author]
    implicit val commentWrites = Json.writes[Comment]
    implicit val projectWrites = Json.writes[Project]

    def getAll(request:AuthRequest[AnyContent]) = {
        posts.getAll.map(x => Ok(Json.toJson(x)))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Post].map( entity => {
            posts.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def update(request:AuthRequest[JsValue]) = {
        (request.body \ "entity").asOpt[Post].map( entity => {
             posts.update(entity).map(x => {
                 Ok(Json.toJson(Map("success" -> JsBoolean(true))))
             })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      posts.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        posts.insert(Post(
           0, "", "", 0, 0 
        )) map (x => Ok(Json.toJson(x)))
    }

     def getFormById(id:Long, request:AuthRequest[AnyContent]) = {
        posts.getById(id).map(x => x match {
            case Some(p) => {
                Ok(Json.toJson(
                    Map(
                       "attributes" -> List(
                           Map("name" -> JsString("id"),  "type" -> JsString("readonly"), "value" -> JsNumber(p.id)),
                           Map("name" -> JsString("title"),  "type" -> JsString("text"), "value" -> JsString(p.title)),
                           Map("name" -> JsString("content"),  "type" -> JsString("textarea"), "value" -> JsString(p.content)),
                           Map("name" -> JsString("category_id"), "relation" -> JsString("category"),"unique" -> JsBoolean(false), "type" -> JsString("relation"), "value" -> JsNumber(p.category_id)),
                           Map("name" -> JsString("author_id"), "relation" -> JsString("author"),"unique" -> JsBoolean(false), "type" -> JsString("relation"), "value" -> JsNumber(p.author_id))
                       ),
                       "relations" -> List(
                           Map("relationname" -> JsString("postcomment"), "relation" -> JsString("comment"), "unique" -> JsBoolean(false)),
                           Map("relationname" -> JsString("postproject"), "relation" -> JsString("project"), "unique" -> JsBoolean(false))
                       )
                    )
                ))
            }
            case None => BadRequest("Invalid posts id provided.")
        })
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

    def update(request:AuthRequest[JsValue]) = {
        (request.body \ "entity").asOpt[Category].map( entity => {
             categories.update(entity).map(x => {
                 Ok(Json.toJson(Map("success" -> JsBoolean(true))))
             })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      categories.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        categories.insert(Category(
           0, "" 
        )) map (x => Ok(Json.toJson(x)))
    }

     def getFormById(id:Long, request:AuthRequest[AnyContent]) = {
        categories.getById(id).map(x => x match {
            case Some(p) => {
                Ok(Json.toJson(
                    Map(
                       "attributes" -> List(
                           Map("name" -> JsString("id"),  "type" -> JsString("readonly"), "value" -> JsNumber(p.id)),
                           Map("name" -> JsString("categoryname"),  "type" -> JsString("text"), "value" -> JsString(p.categoryname))
                       ),
                       "relations" -> List(

                       )
                    )
                ))
            }
            case None => BadRequest("Invalid categories id provided.")
        })
    }

}


@Singleton
class GeneratedCommentsController @Inject() (
    WithAuthAction:AuthAction,
    comments:Comments
    ) extends Controller with TGenController {

    implicit val tsreads: Reads[Timestamp] = Reads.of[Long] map (new Timestamp(_))
    implicit val CommentWrites = Json.writes[Comment]
    implicit val CommentReads = Json.reads[Comment]
    implicit val authorWrites = Json.writes[Author]

    def getAll(request:AuthRequest[AnyContent]) = {
        comments.getAll.map(x => Ok(Json.toJson(x)))
    }

    def insert(request:AuthRequest[JsValue]) = {
        {request.body \ "entity"}.asOpt[Comment].map( entity => {
            comments.insert(entity).map(x => {
                Ok(Json.toJson( Map("id" -> JsNumber(x.id)) ))
            })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def update(request:AuthRequest[JsValue]) = {
        (request.body \ "entity").asOpt[Comment].map( entity => {
             comments.update(entity).map(x => {
                 Ok(Json.toJson(Map("success" -> JsBoolean(true))))
             })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      comments.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        comments.insert(Comment(
           0, "", 0 
        )) map (x => Ok(Json.toJson(x)))
    }

     def getFormById(id:Long, request:AuthRequest[AnyContent]) = {
        comments.getById(id).map(x => x match {
            case Some(p) => {
                Ok(Json.toJson(
                    Map(
                       "attributes" -> List(
                           Map("name" -> JsString("id"),  "type" -> JsString("readonly"), "value" -> JsNumber(p.id)),
                           Map("name" -> JsString("message"),  "type" -> JsString("textarea"), "value" -> JsString(p.message)),
                           Map("name" -> JsString("author_id"), "relation" -> JsString("author"),"unique" -> JsBoolean(true), "type" -> JsString("relation"), "value" -> JsNumber(p.author_id))
                       ),
                       "relations" -> List(

                       )
                    )
                ))
            }
            case None => BadRequest("Invalid comments id provided.")
        })
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
    implicit val categoryWrites = Json.writes[Category]

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

    def update(request:AuthRequest[JsValue]) = {
        (request.body \ "entity").asOpt[Project].map( entity => {
             projects.update(entity).map(x => {
                 Ok(Json.toJson(Map("success" -> JsBoolean(true))))
             })
        }).getOrElse(Future(BadRequest("Parameter missing")))
    }

    def delete(id:Long, request:AuthRequest[AnyContent]) = {
      projects.delete(id).map(x => Ok(Json.toJson(Map("success" -> JsBoolean(true)))))
    }

    def createNew(request:AuthRequest[AnyContent]) = {
        projects.insert(Project(
           0, "", "", new Timestamp(new java.util.Date().getTime()) 
        )) map (x => Ok(Json.toJson(x)))
    }

     def getFormById(id:Long, request:AuthRequest[AnyContent]) = {
        projects.getById(id).map(x => x match {
            case Some(p) => {
                Ok(Json.toJson(
                    Map(
                       "attributes" -> List(
                           Map("name" -> JsString("id"),  "type" -> JsString("readonly"), "value" -> JsNumber(p.id)),
                           Map("name" -> JsString("Projectname"),  "type" -> JsString("text"), "value" -> JsString(p.Projectname)),
                           Map("name" -> JsString("Description"),  "type" -> JsString("textarea"), "value" -> JsString(p.Description)),
                           Map("name" -> JsString("ProjectDate"),  "type" -> JsString("datetime"), "value" -> JsNumber(p.ProjectDate.getTime()))
                       ),
                       "relations" -> List(
                           Map("relationname" -> JsString("projectcategory"), "relation" -> JsString("category"), "unique" -> JsBoolean(true))
                       )
                    )
                ))
            }
            case None => BadRequest("Invalid projects id provided.")
        })
    }

}

trait TGenRelationController {
    def link(source_id:Long, target_id:Long):Future[Result]
    def unlink(source_id:Long, target_id:Long):Future[Result]
    def getBySourceId(id:Long):Future[Result]
    def getAll:Future[Result]
}

@Singleton
class GeneratedAuthorprojectsController @Inject() (
    WithAuthAction:AuthAction,
    authorprojects:Authorprojects
    ) extends Controller with TGenRelationController {
    
    implicit val AuthorprojectWrites = Json.writes[Authorproject]

    def link(source_id:Long, target_id:Long) = {
        authorprojects.link(Authorproject(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def unlink(source_id:Long, target_id:Long) = {
        authorprojects.unlink(Authorproject(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def getBySourceId(source_id:Long) = {
        authorprojects.getBySourceId(source_id).map(x => {
            Ok(Json.toJson(x))
        })
    }

    def getAll = {
      authorprojects.getAll.map(x => {
        Ok(Json.toJson(x))
      })
    }

}



@Singleton
class GeneratedPostcommentsController @Inject() (
    WithAuthAction:AuthAction,
    postcomments:Postcomments
    ) extends Controller with TGenRelationController {
    
    implicit val PostcommentWrites = Json.writes[Postcomment]

    def link(source_id:Long, target_id:Long) = {
        postcomments.link(Postcomment(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def unlink(source_id:Long, target_id:Long) = {
        postcomments.unlink(Postcomment(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def getBySourceId(source_id:Long) = {
        postcomments.getBySourceId(source_id).map(x => {
            Ok(Json.toJson(x))
        })
    }

    def getAll = {
      postcomments.getAll.map(x => {
        Ok(Json.toJson(x))
      })
    }

}



@Singleton
class GeneratedPostprojectsController @Inject() (
    WithAuthAction:AuthAction,
    postprojects:Postprojects
    ) extends Controller with TGenRelationController {
    
    implicit val PostprojectWrites = Json.writes[Postproject]

    def link(source_id:Long, target_id:Long) = {
        postprojects.link(Postproject(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def unlink(source_id:Long, target_id:Long) = {
        postprojects.unlink(Postproject(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def getBySourceId(source_id:Long) = {
        postprojects.getBySourceId(source_id).map(x => {
            Ok(Json.toJson(x))
        })
    }

    def getAll = {
      postprojects.getAll.map(x => {
        Ok(Json.toJson(x))
      })
    }

}



@Singleton
class GeneratedProjectcategoriesController @Inject() (
    WithAuthAction:AuthAction,
    projectcategories:Projectcategories
    ) extends Controller with TGenRelationController {
    
    implicit val ProjectcategoryWrites = Json.writes[Projectcategory]

    def link(source_id:Long, target_id:Long) = {
        projectcategories.link(Projectcategory(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def unlink(source_id:Long, target_id:Long) = {
        projectcategories.unlink(Projectcategory(source_id, target_id)).map(x => {
            Ok(Json.toJson(Map("success" -> JsBoolean(true))))
        })
    }

    def getBySourceId(source_id:Long) = {
        projectcategories.getBySourceId(source_id).map(x => {
            Ok(Json.toJson(x))
        })
    }

    def getAll = {
      projectcategories.getAll.map(x => {
        Ok(Json.toJson(x))
      })
    }

}


@Singleton
class GeneratedController @Inject() (
    WithAuthAction:AuthAction,
    authors:GeneratedAuthorsController,
    posts:GeneratedPostsController,
    categories:GeneratedCategoriesController,
    comments:GeneratedCommentsController,
    projects:GeneratedProjectsController,
    authorprojects:GeneratedAuthorprojectsController,
    postcomments:GeneratedPostcommentsController,
    postprojects:GeneratedPostprojectsController,
    projectcategories:GeneratedProjectcategoriesController
) extends Controller {


    val controllers = Map(
        "author" -> authors,
        "post" -> posts,
        "category" -> categories,
        "comment" -> comments,
        "project" -> projects
    )
 
    val entityTypes = Map(
        "author" -> "authors",
        "post" -> "posts",
        "category" -> "categories",
        "comment" -> "comments",
        "project" -> "projects"
    )

    val relations = Map(
        "authorproject" -> authorprojects,
        "postcomment" -> postcomments,
        "postproject" -> postprojects,
        "projectcategory" -> projectcategories
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

    def update(name:String) = WithAuthAction.async(parse.json) { request =>
        controllers.get(name) match {
            case Some(x) => x.update(request)
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
    
    def getFormById(name:String, id:Long) = WithAuthAction.async { request =>
        controllers.get(name) match {
            case Some(x) => x.getFormById(id, request)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def link(name:String, source_id:Long, target_id:Long) = WithAuthAction.async { request =>
        relations.get(name) match {
            case Some(x) => x.link(source_id, target_id)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }    
    }

    def unlink(name:String, source_id:Long, target_id:Long) = WithAuthAction.async { request =>
        relations.get(name) match {
            case Some(x) => x.unlink(source_id, target_id)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }
    }

    def getRelationsBySourceId(name:String, source_id:Long) = WithAuthAction.async { request =>
        relations.get(name) match {
            case Some(x) => x.getBySourceId(source_id)
            case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
        }    
    }

    def getAllRelations(name:String) = WithAuthAction.async { request => 
      relations.get(name) match {
        case Some(x) => x.getAll
        case None => Future(BadRequest("Error: Entity with name " + name + " doesn't exist."))
      }
    }


}
