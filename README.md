#Gulp Minimal Webapp
Gulp, Angular, Font Awesome, Bootstrap, SCSS (no js).

##Why?
Needed something for myself that was less bulky, uses the latest gulp libraries and npm packages, and that bypassed a lot of the tiny annoying bugs with current generators. I also wanted a development build that used a template cache to help speed up browser reloads in projects with many templates.

Much thanks to [run-sequence](https://www.npmjs.com/package/run-sequence) which helped a lot cutting back on the bugs from traditional gulp build tasks found in other webapp templates/generators.

###Gulp Commands
build, clean, serve, serve-dist

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
- Ng-Annotate
- NgConstant (add angular configs for different build environments)
- Sourcemaps
- Place files anywhere in src/app or src/components

####OTHER
- Imagemin
- Proxy Middleware (for development testing with external API route)
