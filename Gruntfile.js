var babel = require('rollup-plugin-babel');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    rollup: {
      options: {
        format: 'cjs',
        plugins: [
          babel({
            presets: ['es2015-rollup'],
            plugins: ['syntax-async-functions', 'transform-regenerator']
          })
        ]
      },
      files: {
        src: 'src/index.js',
        dest: 'dist/tempmail-node.js'
      }
    },
    browserify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        browserifyOptions: {
          standalone: 'tempmail'
        },
        transform: [['babelify', {
          presets: ['es2015'],
          plugins: ['syntax-async-functions', 'transform-regenerator']
        }]]
      },
      build: {
        src:  'src/index.js',
        dest: 'dist/tempmail.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! tempmail.min.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src:  'dist/tempmail.js',
        dest: 'dist/tempmail.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-rollup');

  // Default task(s).
  grunt.registerTask('default', ['rollup', 'browserify', 'uglify']);

};
