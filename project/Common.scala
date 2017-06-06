import sbt._
import Keys._
import play.sbt.routes.RoutesKeys._

object Common {
  val settings: Seq[Setting[_]] = Seq(
    organization := "org.werlang",
    version := "1.2.3-SNAPSHOT",
    scalaVersion := "2.11.8"
  )

  val playSettings = settings ++ Seq(
    routesGenerator := InjectedRoutesGenerator
  )
}
