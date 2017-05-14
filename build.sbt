name := """playCMS"""

Common.settings

lazy val admin = (project in file("modules/admin")).enablePlugins(PlayScala, SbtWeb)
lazy val website = (project in file("modules/website")).enablePlugins(PlayScala, SbtWeb).dependsOn(admin).aggregate(admin)
lazy val root = (project in file(".")).enablePlugins(PlayScala, SbtWeb).dependsOn(admin).aggregate(admin).dependsOn(website).aggregate(website)

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "2.0.0",
  "mysql" % "mysql-connector-java" % "5.1.34",
  play.sbt.Play.autoImport.cache,
  filters,
  "org.mindrot" % "jbcrypt" % "0.3m",
  "com.typesafe.play" %% "play-mailer" % "5.0.0"
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(rjs, digest, gzip)
