package controllers.admin.api

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
import utils.admin._
import scala.util.{Success, Failure}
import java.io.File

case class NewAsset(parent_id : Long, name : String, server_path : String, mimetype : String)

@Singleton
class AssetsController @Inject()(assets:Assets, WithAuthAction:AuthAction, PageAction:PageAction, conf:Configuration) extends Controller {

    implicit val AssetTreeWrites = Json.writes[AssetTree]
    implicit val AssetWrites = Json.writes[Asset]
    implicit val NewAssetReads = Json.reads[NewAsset]

    def all = WithAuthAction.async { request => {
        //println(conf.getString("elestic.uploaddir"))
        assets.listJson().map(x => {
            Ok(Json.toJson(x))
        })
    }}

    def getById(id:Long) = WithAuthAction.async { request => 
        assets.getById(id).map(assetOpt => {
            assetOpt.map(asset => Ok(Json.toJson(asset)))
            .getOrElse(NotFound("Couldn't find asset"))
        })
    }

    def create = WithAuthAction.async(parse.json) { request =>
      val uploadroot = conf.getString("elestic.uploadroot").getOrElse("")
      val parent_id = (request.body \ "parent_id").asOpt[Int].getOrElse(0)
      val name = (request.body \ "name").asOpt[String].getOrElse("")
      val server_path = (request.body \ "server_path").asOpt[String].getOrElse("")
      val mimetype = (request.body \ "mimetype").asOpt[String].getOrElse("")
      val currentTime:Timestamp = new Timestamp((new Date).getTime());
      val parentAssetFuture = assets.getById(parent_id)
      parentAssetFuture flatMap (parentOpt => parentOpt match {
          case Some(parentAsset:Asset) => {
              val newpath = if(parentAsset.mimetype == "home") "/" + name else parentAsset.path + "/" + name
              val assetfile = new File(uploadroot + server_path)
              val asset = Asset(
                  id = 0, parent_id = parent_id, name = name, path = newpath,
                  server_path = server_path, collapsed = true,
                  mimetype = mimetype, filesize = assetfile.length(), created_at = currentTime
              )
              assets.create(asset) map ( x => {
                  Ok(Json.toJson(x))
              })
          }
          case None => Future(BadRequest("Error: Missing (or invalid) parameter. [parent_id]"))
      })
    }

    def upload = WithAuthAction(parse.multipartFormData) { implicit request =>
        val uploadroot = conf.getString("elestic.uploadroot").getOrElse("")
        val uploaddir = conf.getString("elestic.uploaddir").getOrElse("")
        val assetsdir = uploadroot + uploaddir;
        request.body.file("asset").map { asset =>
            //val filename = asset.filename 
            val extension = asset.filename.split("\\.").toList.last
            val filename = new java.util.Date().getTime() + "." + extension
            val contentType = asset.contentType
            val outputfile = new File(assetsdir + filename)
            asset.ref.moveTo(outputfile)
            
            val filepath = uploaddir + filename
            Ok(Json.obj("success" -> true, "name" -> asset.filename, "contenttype" -> contentType, "server_path" -> filepath))
        }.getOrElse {
            Ok(Json.obj("success" -> false, "name" -> "", "path" -> ""))
        }
    }

    def delete(id:Long) = WithAuthAction.async { request =>
        assets.delete(id).map(r => {
            Ok(Json.obj("success" -> true))
        })
    }

    def rename(id:Long) = WithAuthAction.async(parse.json) { request =>
        (request.body \ "name").asOpt[String].map(name => {
            assets.setName(id, name).map(x => 
                Ok(Json.obj("success" -> true))
            )
        }).getOrElse(Future(BadRequest("Missing parameter [name]")) )
    }

    def updateParent(id:Long) = WithAuthAction.async(parse.json) { request =>
        ((request.body \ "parent_id").asOpt[Long].map{ parent_id =>
        assets.updateParent(id, parent_id) map { x =>
            Ok(Json.toJson(Map("success" -> JsNumber(x))))
        }
        }).getOrElse( Future(BadRequest("Error: missing parameter [parent_id]")) )
    }

    def collapse(id:Long) = WithAuthAction.async(parse.json) { request =>
        val collapseState = (request.body \ "collapsed").asOpt[Boolean]
        (collapseState map { collapse:Boolean =>
        assets.setCollapsed(id, collapse) map { x =>
            Ok(Json.toJson(Map("success" -> JsNumber(x))))
        }
        }).getOrElse( Future(BadRequest("Error: Missing parameter [collapsed]")) )
    } 

    def getUpload(filename:String) = PageAction.async { implicit request =>
        val assetdir = conf.getString("elestic.uploadroot").getOrElse("")
        assets.getByPath("/" + filename).map(assetOpt => {
            assetOpt.map(asset => {
                val assetFile = new File(assetdir + asset.server_path)
                if(assetFile.exists) {
                    Ok.sendFile(
                        content = assetFile,
                        inline = true
                    )
                } else {
                    NotFound.sendFile(
                        content = new File(assetdir + "/public/images/imagenotfound.png"),
                        inline = true
                    )
                }
            }).getOrElse(NotFound(views.html.notfound("The uploaded file you are looking for doesn't exist.")))
        })
   }
}
