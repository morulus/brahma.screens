module.exports = function(grunt) {
	grunt.initConfig({
		bowerjson: grunt.file.readJSON('../bower.json'),
		less: {
			styles: {
		        options: {
		          compress: false,
		          /*yuicompress: true,*/
		          optimization: 2
		        },
		        files: {
		          // target.css file: source.less file
		          "../dist/brahma.screens.css": "./less/main.less"
		        }
	      	}
		},
		snipper: {
	      js: {
	        files: {
	          '../dist/': ['./js/brahma.screens.js']
	        }
	      }
	    },
	    banner: '/*!\n* <%= bowerjson.name %> <%= bowerjson.version %> (' +
          '* <%= grunt.template.today("dd-mm-yyyy") %>)\n' +
          '* <%= bowerjson.description %>\n' +
          '* <%= bowerjson.homepage %>\n\n' +
          '* Released under the <%= bowerjson.license.toUpperCase() %> license \n'+
          '* Copyright (c) <%= grunt.template.today("yyyy") %>, <%= bowerjson.authors[0].name %> ' +
          '<<%= bowerjson.authors[0].email %>> \n*/\n',
       bannerJQuery: '/*!\n* jQuery.<%= bowerjson.name %> <%= bowerjson.version %> (' +
      '* <%= grunt.template.today("dd-mm-yyyy") %>)\n' +
      '* <%= bowerjson.description %>\n' +
      '* <%= bowerjson.homepage %>\n\n' +
      '* Released under the <%= bowerjson.license.toUpperCase() %> license \n'+
      '* Copyright (c) <%= grunt.template.today("yyyy") %>, <%= bowerjson.authors[0].name %> ' +
      '<<%= bowerjson.authors[0].email %>> \n*/\n',
	    usebanner: {
		    dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [ '../dist/brahma.screens.js', '../dist/brahma.screens.css' ]
				}
		    },
		    jquery: {
		    	options: {
			        position: 'top',
			        banner: '<%= bannerJQuery %>'
		      },
		      files: {
		        src: [ '../jquery/plugin/jquery.brahma-screens.js', '../jquery/plugin/jquery.brahma-screens.css' ]
		      }
		    }
		},
	    uglify: {
	      minone: {
	        options: {
	          mangle: false,
	          compress: true,
	          sourceMap: true,
	          preserveComments: 'some'
	        },
	        files: {
	          '../dist/brahma.screens.min.js': ['../dist/brahma.screens.js']
	        }
	      },
	      minbuild: {
	        options: {
	          mangle: false,
	          compress: true,
	          preserveComments: 'some'
	        },
	        files: {
	          '../jquery/plugin/jquery.brahma-screens.js': ['../jquery/plugin/jquery.brahma-screens.js']
	        }
	      }
	    },
	    watch: {
	      js: {
	        files: ['./js/**/*.js'], // which files to watch
	        tasks: ['snipper:js','usebanner','uglify:minone'],
	        options: {
	          nospawn: true
	        }
	      },
	      css: {
	      	files: ['./less/main.less'], // which files to watch
	        tasks: ['less:styles'],
	        options: {
	          nospawn: true
	        }
	      }
	    },
	    concat: {
		    buildjs: {
		      src: ['../req/brahma.js','../req/jquery.brahma.js','../req/brahma.touch.js','../dist/brahma.screens.js'],
		      dest: '../jquery/plugin/jquery.brahma-screens.js',
		    }
		},
		cssmin: {
			jquery: {
				options: {
				    shorthandCompacting: false,
				    roundingPrecision: -1
				  },
				  files: {
				      '../jquery/plugin/jquery.brahma-screens.css': ['../dist/brahma.screens.css']
				 }
			},
			dist: {
				options: {
				    shorthandCompacting: false,
				    roundingPrecision: -1
				  },
				  files: {
				      '../dist/brahma.screens.min.css': ['../dist/brahma.screens.css']
				  }
			}
		},
		release: {
			tick: {
				degree: 3,
				json:  '../bower.json',
				report: {'../README.MD':'## News'}
			},
			model: {
				degree: 2,
				json:  '../bower.json',
				report: {'../README.MD':'## News'}
			},
			version: {
				degree: 1,
				json:  '../bower.json',
				report: {'../README.MD':'## News'}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-snipper');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-release');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('default', ['snipper:js','usebanner:dist','less:styles','uglify:minone','watch']);
	grunt.registerTask('up-tick', ['release:tick']);
	grunt.registerTask('up-model', ['release:model']);
	grunt.registerTask('up-version', ['release:version']);
	grunt.registerTask('build', ['snipper:js', 'less:styles', 'usebanner:dist', 'cssmin:dist', 'uglify:minone', 'concat', 'cssmin:jquery', 'uglify:minbuild', 'usebanner:jquery']);
};