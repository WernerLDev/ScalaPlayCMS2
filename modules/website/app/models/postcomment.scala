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

@Singleton
class Postcomments @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends TPostcomments {

}