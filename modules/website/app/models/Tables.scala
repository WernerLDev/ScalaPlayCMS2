package models.website

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
import models.website._

case class Post (id:Long, name:String, title:String, content:String, category_id:Long) 

class PostTableDef(tag:Tag) extends Table[Post](tag, "posts") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def title = column[String]("title")
  def content = column[String]("content")
  def category_id = column[Long]("category_id")

  override def * = (id, name, title, content, category_id) <>(Post.tupled, Post.unapply)
}


trait TPosts extends HasDatabaseConfigProvider[JdbcProfile] {

  val posts = TableQuery[PostTableDef]
  val categories = TableQuery[CategoryTableDef] 
  val insertQuery = posts returning posts.map(_.id) into ((post, id) => post.copy(id = id))

  def insert(post:Post) = dbConfig.db.run(insertQuery += post)
    
  def update(post:Post) = dbConfig.db.run {
    posts.filter(_.id === post.id).update(post)
  }

  def delete(id:Long) = dbConfig.db.run {
    posts.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    posts.join(categories).on(_.category_id === _.id).filter(_._1.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    posts.join(categories).on(_.category_id === _.id).result
  }

}
case class Category (id:Long, name:String, categoryname:String) 

class CategoryTableDef(tag:Tag) extends Table[Category](tag, "categories") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def categoryname = column[String]("categoryname")

  override def * = (id, name, categoryname) <>(Category.tupled, Category.unapply)
}


trait TCategories extends HasDatabaseConfigProvider[JdbcProfile] {

  val categories = TableQuery[CategoryTableDef]
   
  val insertQuery = categories returning categories.map(_.id) into ((category, id) => category.copy(id = id))

  def insert(category:Category) = dbConfig.db.run(insertQuery += category)
    
  def update(category:Category) = dbConfig.db.run {
    categories.filter(_.id === category.id).update(category)
  }

  def delete(id:Long) = dbConfig.db.run {
    categories.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    categories.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    categories.result
  }

}
case class Project (id:Long, name:String, Projectname:String, Description:String, ProjectDate:Timestamp) 

class ProjectTableDef(tag:Tag) extends Table[Project](tag, "projects") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def Projectname = column[String]("Projectname")
  def Description = column[String]("Description")
  def ProjectDate = column[Timestamp]("ProjectDate")

  override def * = (id, name, Projectname, Description, ProjectDate) <>(Project.tupled, Project.unapply)
}


trait TProjects extends HasDatabaseConfigProvider[JdbcProfile] {

  val projects = TableQuery[ProjectTableDef]
   
  val insertQuery = projects returning projects.map(_.id) into ((project, id) => project.copy(id = id))

  def insert(project:Project) = dbConfig.db.run(insertQuery += project)
    
  def update(project:Project) = dbConfig.db.run {
    projects.filter(_.id === project.id).update(project)
  }

  def delete(id:Long) = dbConfig.db.run {
    projects.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    projects.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    projects.result
  }

}
