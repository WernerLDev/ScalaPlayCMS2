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

case class Author (id:Long, name:String, email:String) 

class AuthorTableDef(tag:Tag) extends Table[Author](tag, "authors") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def name = column[String]("name")
  def email = column[String]("email")

  override def * = (id, name, email) <>(Author.tupled, Author.unapply)
}


trait TAuthors extends HasDatabaseConfigProvider[JdbcProfile] {

  val authors = TableQuery[AuthorTableDef]
   
  val insertQuery = authors returning authors.map(_.id) into ((author, id) => author.copy(id = id))

  def insert(author:Author) = dbConfig.db.run(insertQuery += author)
    
  def update(author:Author) = dbConfig.db.run {
    authors.filter(_.id === author.id).update(author)
  }

  def delete(id:Long) = dbConfig.db.run {
    authors.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    authors.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    authors.result
  }

}
case class Postcomment (source_id:Long, target_id:Long) 

class PostcommentTableDef(tag:Tag) extends Table[Postcomment](tag, "postcomments") {
  
  def source_id = column[Long]("source_id")
  def target_id = column[Long]("target_id")

  override def * = (source_id, target_id) <>(Postcomment.tupled, Postcomment.unapply)
}


trait TPostcomments extends HasDatabaseConfigProvider[JdbcProfile] {

  val postcomments = TableQuery[PostcommentTableDef]

  def link(postcomment:Postcomment) = dbConfig.db.run(postcomments += postcomment)
  
  def unlink(postcomment:Postcomment) = dbConfig.db.run {
    postcomments.filter(x => x.source_id === postcomment.source_id && x.target_id === postcomment.target_id).delete
  }

  def getBySourceId(id:Long) = dbConfig.db.run {
    postcomments.filter(_.source_id === id).result
  }

}
case class Postproject (source_id:Long, target_id:Long) 

class PostprojectTableDef(tag:Tag) extends Table[Postproject](tag, "postprojects") {
  
  def source_id = column[Long]("source_id")
  def target_id = column[Long]("target_id")

  override def * = (source_id, target_id) <>(Postproject.tupled, Postproject.unapply)
}


trait TPostprojects extends HasDatabaseConfigProvider[JdbcProfile] {

  val postprojects = TableQuery[PostprojectTableDef]

  def link(postproject:Postproject) = dbConfig.db.run(postprojects += postproject)
  
  def unlink(postproject:Postproject) = dbConfig.db.run {
    postprojects.filter(x => x.source_id === postproject.source_id && x.target_id === postproject.target_id).delete
  }

  def getBySourceId(id:Long) = dbConfig.db.run {
    postprojects.filter(_.source_id === id).result
  }

}
case class Post (id:Long, title:String, content:String, category_id:Long, author_id:Long) 

class PostTableDef(tag:Tag) extends Table[Post](tag, "posts") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def title = column[String]("title")
  def content = column[String]("content")
  def category_id = column[Long]("category_id")
  def author_id = column[Long]("author_id")

  override def * = (id, title, content, category_id, author_id) <>(Post.tupled, Post.unapply)
}


trait TPosts extends HasDatabaseConfigProvider[JdbcProfile] {

  val posts = TableQuery[PostTableDef]
  val categories = TableQuery[CategoryTableDef]
val authors = TableQuery[AuthorTableDef]
val comments = TableQuery[CommentTableDef]
val projects = TableQuery[ProjectTableDef] 
  val insertQuery = posts returning posts.map(_.id) into ((post, id) => post.copy(id = id))

  def insert(post:Post) = dbConfig.db.run(insertQuery += post)
    
  def update(post:Post) = dbConfig.db.run {
    posts.filter(_.id === post.id).update(post)
  }

  def delete(id:Long) = dbConfig.db.run {
    posts.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    posts.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    posts.result
  }

}
case class Category (id:Long, categoryname:String) 

class CategoryTableDef(tag:Tag) extends Table[Category](tag, "categories") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def categoryname = column[String]("categoryname")

  override def * = (id, categoryname) <>(Category.tupled, Category.unapply)
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
case class Comment (id:Long, message:String, author_id:Long) 

class CommentTableDef(tag:Tag) extends Table[Comment](tag, "comments") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def message = column[String]("message")
  def author_id = column[Long]("author_id")

  override def * = (id, message, author_id) <>(Comment.tupled, Comment.unapply)
}


trait TComments extends HasDatabaseConfigProvider[JdbcProfile] {

  val comments = TableQuery[CommentTableDef]
  val authors = TableQuery[AuthorTableDef] 
  val insertQuery = comments returning comments.map(_.id) into ((comment, id) => comment.copy(id = id))

  def insert(comment:Comment) = dbConfig.db.run(insertQuery += comment)
    
  def update(comment:Comment) = dbConfig.db.run {
    comments.filter(_.id === comment.id).update(comment)
  }

  def delete(id:Long) = dbConfig.db.run {
    comments.filter(_.id === id).delete
  }

  def getById(id:Long) = dbConfig.db.run {
    comments.filter(_.id === id).result.headOption
  }

  def getAll = dbConfig.db.run {
    comments.result
  }

}
case class Projectcategory (source_id:Long, target_id:Long) 

class ProjectcategoryTableDef(tag:Tag) extends Table[Projectcategory](tag, "projectcategories") {
  
  def source_id = column[Long]("source_id")
  def target_id = column[Long]("target_id")

  override def * = (source_id, target_id) <>(Projectcategory.tupled, Projectcategory.unapply)
}


trait TProjectcategories extends HasDatabaseConfigProvider[JdbcProfile] {

  val projectcategories = TableQuery[ProjectcategoryTableDef]

  def link(projectcategory:Projectcategory) = dbConfig.db.run(projectcategories += projectcategory)
  
  def unlink(projectcategory:Projectcategory) = dbConfig.db.run {
    projectcategories.filter(x => x.source_id === projectcategory.source_id && x.target_id === projectcategory.target_id).delete
  }

  def getBySourceId(id:Long) = dbConfig.db.run {
    projectcategories.filter(_.source_id === id).result
  }

}
case class Project (id:Long, Projectname:String, Description:String, ProjectDate:Timestamp) 

class ProjectTableDef(tag:Tag) extends Table[Project](tag, "projects") {
  
  def id = column[Long]("id", O.PrimaryKey,O.AutoInc)
  def Projectname = column[String]("Projectname")
  def Description = column[String]("Description")
  def ProjectDate = column[Timestamp]("ProjectDate")

  override def * = (id, Projectname, Description, ProjectDate) <>(Project.tupled, Project.unapply)
}


trait TProjects extends HasDatabaseConfigProvider[JdbcProfile] {

  val projects = TableQuery[ProjectTableDef]
  val categories = TableQuery[CategoryTableDef] 
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
