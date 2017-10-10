"use strict";

const gulp = require("gulp-help")(require("gulp"));
const del = require("del");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");

gulp.task("clean-js", "Clean js assets", () => {
  return del("icon-patterns.min.js");
});

gulp.task("clean-css", "Clean css assets", () => {
  return del("icon-patterns.min.css");
});

gulp.task("build-css", "Minify css assets", ["clean-css"], () => {
  return gulp.src("src/icon-patterns.css")
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(__dirname + "/src"));
});

gulp.task("build-js", "Minify js assets", ["clean-js"], () => {
  return gulp.src("src/**icon-patterns.js")
    .pipe(uglify())
    .on("error", (err) => {
      console.error(err);
      this.emit("end");
    })
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(__dirname + "/src"));
});

gulp.task("watch", "Watch for changes!", () => {
  gulp.watch("src/**.js", ["build-js"]);
  gulp.watch("src/**.css", ["build-css"]);
});

gulp.task("default", "The default task.", ["watch"]);
gulp.task("build", "The build task.", ["build-js", "build-css"]);
