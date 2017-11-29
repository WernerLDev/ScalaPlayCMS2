package models.admin

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
import models.admin._

case class Entity (
  id:Long, 
  name:String,
  object_id:Long,
  parent_id:Long,
  discriminator:String,
  created_at:Timestamp, 
  updated_at:Timestamp, 
  published_at:Timestamp 
)

case class EntityTree (
  entity: Entity,
  children: List[EntityTree]
)

class EntityTableDef(tag:Tag) extends Table[Entity](tag, "entities") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def object_id = column[Long]("object_id")
  def parent_id = column[Long]("parent_id")
  def discriminator = column[String]("discriminator")
  def created_at = column[Timestamp]("created_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))
  def updated_at = column[Timestamp]("updated_at", SqlType("timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP"))
  def published_at = column[Timestamp]("published_at", SqlType("timestamp not null default CURRENT_TIMESTAMP"))

  override def * = (id, name, object_id, parent_id, discriminator, created_at, updated_at, published_at) <>(Entity.tupled, Entity.unapply)
}


@Singleton
class Entities @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {

  val entities = TableQuery[EntityTableDef]
   
  val insertQuery = entities returning entities.map(_.id) into ((entity, id) => entity.copy(id = id))

  def insert(entity:Entity) = dbConfig.db.run(insertQuery += entity)
    
  def update(entity:Entity) = dbConfig.db.run {
    entities.filter(_.id === entity.id).update(entity)
  }

  def delete(id:Long):Future[Int] = {
    val subitems:Future[Seq[Entity]] = dbConfig.db.run(entities.filter(_.parent_id === id).result)
    subitems.map(items => {
      items.map(x => delete(x.id))
    })

    dbConfig.db.run(entities.filter(_.id === id).delete)    
  }

  def rename(id:Long, newname:String) = dbConfig.db.run {
    entities.filter(_.id === id).map(_.name).update(newname)
  }

  def getById(id:Long) = dbConfig.db.run {
    entities.filter(_.id === id).result.headOption
  }

  def getByType(entityType:String) = dbConfig.db.run {
    entities.filter(_.discriminator === entityType).result
  }

  def getAll = dbConfig.db.run {
    entities.result
  }

  def getTree = {
    def generateList(d:List[Entity], parentid:Long):List[EntityTree] = {
        d.filter(_.parent_id == parentid).map(x => {
            EntityTree(
                entity = x,
                children = generateList(d, x.id)
            )
        })
    }
    getAll.map(x => generateList(x.toList, 0))
  }

  def updateParent(id:Long, parent_id:Long):Future[Int] = {
        dbConfig.db.run {
            entities.filter(_.id === id).map(_.parent_id).update(parent_id)
        }
    }

}