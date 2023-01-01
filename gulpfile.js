import gulp from 'gulp';
import browserSync from 'browser-sync';

import gulpsass from 'gulp-sass';
import sasscomp from 'sass';
const sass = gulpsass(sasscomp);

import concat from "gulp-concat";
import cleancss from 'gulp-clean-css';

const bsInstance = browserSync.create();
const outputPath = './dist';
const outputPathImg = './dist/image/';

function browsersync() {
    bsInstance.init({
        server: { baseDir: outputPath, outputPathImg },
        notify: false,
        online: false
    });
}

function pages() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function styles() {
    return gulp.src('app/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(outputPath))
        .pipe(concat('styles.min.css'))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}
function img() {
    return gulp.src('image/*.*')
        .pipe(gulp.dest(outputPathImg))
        .pipe(bsInstance.stream());
}
function startwatch() {
    gulp.watch('app/*.html').on('change', () => {
        pages();
        bsInstance.reload;
    });
    gulp.watch('app/*.scss').on('change', () => {
        styles();
        bsInstance.reload;
    });
    gulp.watch('image/*.*').on('change', () => {
        img();
        bsInstance.reload;
    });
}

const build = gulp.series(gulp.parallel(pages, styles, img));
const serve = gulp.series(build, gulp.parallel(browsersync, startwatch));

export {
    build,
    serve
}

export default build;