name := """playCMSWebsite"""

Common.settings

Common.playSettings

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "mysql" % "mysql-connector-java" % "5.1.34",
  filters
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node
