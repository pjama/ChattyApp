const browserify  = require("browserify");
const spawn       = require("child_process").spawn;
const fs          = require("fs");
const gulp        = require("gulp");
const concat      = require("gulp-concat");
const react       = require("gulp-react");
const sass        = require("gulp-sass");
const watch       = require("gulp-watch");

var node;

const PATH_JSX  = "./client/src/jsx/";
const PATH_CSS  = "./client/src/scss/";
const PATH_DIST = "./client/dist/";

/*
 * Default Task
 */
gulp.task("default", () => {

  gulp.run("DEV_ENVIRONMENT")
});

/*
 * Task Definitions
 */
gulp.task("DEV_ENVIRONMENT", () => {
  gulp.watch("server/**", (event) => {
    gulp.run("START_SERVER");
  });

  gulp.watch(`${PATH_CSS}/**`, (event) => {
    gulp.run("COMPILE_SASS");
  });

  gulp.watch(`${PATH_JSX}/**`, (event) => {
    gulp.run("BUILD_JS");
  });

  gulp.run("BUILD_JS");
  gulp.run("COMPILE_SASS");
  gulp.run("START_SERVER");
});

gulp.task("START_SERVER", () => { // (re)start Node.js server
  if (node) {
    node.kill();
  }
  node = spawn("node", ["server/index.js"], { stdio: "inherit" });
  node.on("close", function (code) {
    if (code === 8) {
      gulp.log("Error detected, waiting for changes...");
    }
  });
});

gulp.task("BUILD_JS", () => {
  browserify(`./${PATH_JSX}/App.jsx`)
    .transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .on("error", function(e) {console.log("Failed to build JavaScript. \n", e.message)})
    .pipe(fs.createWriteStream(`./${PATH_DIST}/js/bundle.js`));
});

gulp.task("COMPILE_SASS", () => { // convert SCSS development code into CSS
  return gulp.src(`${PATH_CSS}/**/*.scss`)
              .pipe(sass().on("error", sass.logError))
              .pipe(concat("style.css"))
              .pipe(gulp.dest(`${PATH_DIST}/css`));
});

process.on("exit", () => { // when shutting off Gulp, then also turn off server
  if (node) {
    node.kill();
  }
});
