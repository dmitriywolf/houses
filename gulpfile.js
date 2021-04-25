"use strict";
let gulp = require('gulp');
let sass = require('gulp-sass');
sass.compiler = require('node-sass');
let autoPrefix = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat'); 
let uglifyES = require('gulp-uglify-es').default; 
let rename = require('gulp-rename'); 
let del = require('del');
let browserSync = require('browser-sync').create(); 



//Html
function layoutHTML() {
    return (gulp.src('./src/*.html'))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({stream: true}))
}

//Styles
function style() {
    return gulp.src('./src/sass/style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoPrefix({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({stream: true}))
}

//Scripts
function scriptLib() {
    //порядок подключения бибилиотек JS
    let jsLibFiles = [
        './node_modules/slick-carousel/slick/slick.min.js',
        './node_modules/lightbox2/dist/js/lightbox.min.js'
    ];

    return gulp.src(jsLibFiles)
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.reload({stream: true}))
}

function script() {
    return gulp.src('./src/js/main.js')
        .pipe(concat('index.min.js'))
        .pipe(uglifyES())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.reload({stream: true}))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch('./src/*.html', layoutHTML);
    gulp.watch('./src/sass/**/*.scss', style);
    gulp.watch('./src/js/*.js', script);
}

function copyImg() {
    return gulp.src("./src/img/**/*.*")
        .pipe(gulp.dest('./dist/img/'))
}

function copyFonts() {
    return gulp.src("./src/fonts/**/*.*")
        .pipe(gulp.dest('./dist/fonts/'))
}


function copyFile() {
    const file = [
      './src/*.ico',
      './src/*.php'
    ];
  
    return gulp.src(file)
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}))
  }

function clean() {
    return del(['./dist/*'])
}


gulp.task('build', gulp.series(clean, gulp.parallel(layoutHTML, style, scriptLib, script, copyImg, copyFonts, copyFile)));

gulp.task('default', gulp.series('build', watch));





