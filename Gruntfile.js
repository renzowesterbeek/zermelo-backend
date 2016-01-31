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
					'build/exchangeAppcode.js': ['exchangeAppcode.js'],
					'build/firsttimeserv.js': ['firsttimeserv.js'],
					'build/pushserv.js': ['pushserv.js'],
					'build/registerserv.js': ['registerserv.js'],
					'build/sendPush.js': ['sendPush.js'],
					'build/startbackend.js': ['startbackend.js'],
					'build/strtotime.js': ['strtotime.js'],
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
		clean: {
		  build: {
		    src: ["build/"]
		  }
		},
		// replace: {
		// 	build: {
		// 		src: 'startbackend.js',
		// 		dest: 'build/',
		// 		replacements: [{
		// 			from: 'pushServ(10)',
		// 			to: 'pushServ(15*60)'
		// 		}]
		// 	}
		// },
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
	grunt.loadNpmTasks('grunt-text-replace');

	// Tasks
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['clean', 'uglify']);
	grunt.registerTask('build', ['clean', 'uglify']);

};
