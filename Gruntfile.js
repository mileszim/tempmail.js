module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		browserify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				browserifyOptions: {
					standalone: 'tempmail'
				}
      },
      build: {
        src:  'index.js',
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

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'uglify']);

};