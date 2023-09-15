"use strict";
const gulp = require("gulp");
const webpack = require("webpack-stream");
const browserSync = require("browser-sync");
const sass        = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
// const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');
// const pngquant = require('imagemin-pngquant');
// const uglify = require('gulp-uglify');

const dist = "./dist/";
gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        },
        notofy: false 
    });

    gulp.watch("src/**/*.html").on('change', browserSync.reload);
});


gulp.task('styles', function() {
    return gulp.src("src/scss/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
          overrideBrowserslist: ['last 10 versions'],
          grid: true
        }))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/assets/css"))
        .pipe(browserSync.stream());
});

gulp.task('htmlInclude', function() {
    return gulp.src(['./src/**/**/**/*.html'])
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream());
})

gulp.task('html', function () {
    return gulp.src("src/*.html")
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/assets/js"))
        
        .pipe(browserSync.stream());
});

// gulp.task('fonts', function () {
//     return gulp.src("src/fonts/**/*")
//         .pipe(gulp.dest("dist/fonts"))
//         .pipe(browserSync.stream());
// });

// gulp.task('icons', function () {
//     return gulp.src("src/assets/icons/**/*")
//         .pipe(imagemin([imagemin.gifsicle({interlaced: true}),
//                         imagemin.svgo({
//                             plugins: [
//                                 {removeViewBox: true},
//                                 {cleanupIDs: false}
//                             ]
//                         }) 
//                     ]))
//         .pipe(gulp.dest("dist/assets/icons"))
//         .pipe(browserSync.stream());
// });

// gulp.task('images', function () {
//     return gulp.src("src/assets/img/**/*")
//         .pipe(imagemin(
//             {
//                 // interlaced: true,
//                 // progressive: true,
//                 // svgoPlugins: [{removeViewBox: false}],
//                 // use: [pngquant(
//                 //     {
//                 //         quality: '100'
//                 //     }
//                 // )]
//             }
//         ))
//         .pipe(gulp.dest("dist/assets/img"))
//         .pipe(browserSync.stream());
// });
////////////////////

// gulp.task("copy-html", () => {
//     return gulp.src("./src/index.html")
//                 .pipe(gulp.dest(dist))
//                 .pipe(browserSync.stream());
// });

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browserSync.reload);
});

gulp.task("copy-assets", () => {
    return gulp.src("./src/assets/**/*.*")
                .pipe(gulp.dest(dist + "/assets"))
                .on("end", browserSync.reload);
});

gulp.task("copy-mailer", () => {
  return gulp.src("./src/mailer/*.*")
              .pipe(gulp.dest(dist + "/mailer"))
              .on("end", browserSync.reload);
});

gulp.task("watch", () => {
    browserSync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    // gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/mailer/*.*", gulp.parallel("copy-mailer"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
    gulp.watch("src/scss/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/**/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
    gulp.watch("src/**/**/**/*.html").on('change', gulp.parallel('htmlInclude'));
    // gulp.watch("src/fonts/**/*").on('all', gulp.parallel('fonts'));
    // gulp.watch("src/assets/icons/**/*").on('all', gulp.parallel('icons'));
    // gulp.watch("src/assets/img/**/*").on('all', gulp.parallel('images'));
});

// gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js"));
gulp.task("build", gulp.parallel("copy-assets", "copy-mailer", "build-js"));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel('watch', 'build', 'styles', 'html', 'scripts', 'htmlInclude'));