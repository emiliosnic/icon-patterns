"use strict";

const gulp = require("gulp-help")(require("gulp"));
const del = require("del");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require('gulp-babel');

gulp.task("clean-js", "Clean js assets", () => {
  return del("icon-patterns.min.js");
});

gulp.task("clean-css", "Clean css assets", () => {
  return del("icon-patterns.min.css");
});

gulp.task("build-css", "Build css assets", ["clean-css"], () => {
  return gulp.src("./src/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
    }))
    .pipe(gulp.dest("./dist"))
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("build-js", "Build js assets", ["clean-js"], () => {
  return gulp.src("src/**icon-patterns.js")
    .pipe(babel({
			presets: ['env']
		}))
    .pipe(gulp.dest("./dist"))
    .pipe(uglify())
    .on("error", (err) => {
      console.error(err);
      this.emit("end");
    })
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", "Watch for changes", () => {
  gulp.watch("src/**.js", ["build-js"]);
  gulp.watch("src/**.scss", ["build-css"]);
});

gulp.task("default", "The default task", ["watch"]);
gulp.task("build", "The build task.", ["build-js", "build-css"]);
