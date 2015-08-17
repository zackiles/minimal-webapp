#Gulp Minimal Webapp
Gulp, Angular, Font Awesome, Bootstrap, SCSS (no js).

##Why?
Needed something for myself that was less bulky, uses the latest gulp libraries and npm packages, and that bypassed a lot of the tiny annoying bugs with current generators. I also wanted a development build that used a template cache to help speed up browser reloads in projects with many templates.

###Gulp Commands
gulp build
gulp clean
gulp serve
gulp serve-dist

##Plugins Used

####CSS
- Inject
- Wiredep
- Sass/SCSS
- Minify
- Sourcemaps
- Autoprefix
- Place scss files anywhere in src/app, src/components, or src/assets/styles

####HTML
- Inject
- Wiredep
- Minify
- Angular Template Cache
- Useref
- Place files anywhere in src/app or src/components

####JS
- Inject
- Wiredep
- Jshint
- Uglify (with save license)
- Ng-Annotae
- Sourcemaps
- Place files anywhere in src/app or src/components
