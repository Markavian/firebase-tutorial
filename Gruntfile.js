module.exports = function(grunt) {
  
  // ftp host
  var FTP_HOST = 'ftp.mkv25.net';
  var FTP_PATH = '/';

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
	  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	"shell": {
      "build typescript tests": {
		command: "tsc.cmd @build_tests.tsc"
	  },
	  "build typescript tutorial": {
		command: "tsc.cmd @build.tsc"
	  }
    },
	"uglify": {
	  options: {
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	  },
	  "build tests": {
		files: {
		  'bin/scripts/firebase-tutorial.js': ['firebase-tutorial.min.js']
		}
	  },
	  "build tutorial": {
		files: {
		  'bin/tests/firebase-tutorial.js': ['firebase-tutorial.min.js']
		}
	  }
    },
	"ftp-deploy": {
	  build: {
	    auth: {
	      host: FTP_HOST,
		  port: 21,
		  authKey: 'grunt'
	    },
	    src: 'bin/',
	    dest: FTP_PATH,
	    exclusions: []
	  }
	},
  });

  // Default task(s).
  grunt.registerTask('default', ['shell', 'uglify', 'ftp-deploy']);

};
