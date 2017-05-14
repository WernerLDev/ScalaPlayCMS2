name := """playCMSAdmin"""

Common.settings

Common.playSettings

libraryDependencies ++= Seq(
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "mysql" % "mysql-connector-java" % "5.1.34",
  play.sbt.Play.autoImport.cache,
  filters,
  "org.mindrot" % "jbcrypt" % "0.3m",
  "com.typesafe.play" %% "play-mailer" % "5.0.0"
)

PlayKeys.playRunHooks += Webpack(baseDirectory.value)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(rjs, digest, gzip)  