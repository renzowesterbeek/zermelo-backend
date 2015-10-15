module.exports = function(grunt){

	grunt.initConfig({
		// Metadata
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author_name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		// Task configuration
    uglify: {
      options: {
        banner: '<%= banner %>',
				mangle: false
      },
      build: {
        files: {
					'build/exchangeAppcode.min.js': ['exchangeAppcode.js'],
				}
      }
    },
    jshint: {
      grunt: {
        src: ['Gruntfile.js', 'package.json']
      },
      source: {
        src: ['*.js', '!Gruntfile.js', '!package.json']
      },
      build: {
        src: ['build/**/*.js']
      }
    },
	  copy: {
		  assets: {
		    src: 'assets/**/*',
		    dest: 'build/',
		  },
		},
		clean: {
		  build: {
		    src: ["build/"]
		  }
		},
		watch: {
	    js: {
	      files: ['*.js', '!Gruntfile.js', '!package.json'],
	      tasks: ['test'],
	    },
			gruntfiles: {
				files: ['Gruntfile.js', 'package.json'],
				tasks: ['jshint:grunt']
			}
	  } // end of task config

	}); // end of grunt.initConfig

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Tasks
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['clean', 'uglify']);

};
