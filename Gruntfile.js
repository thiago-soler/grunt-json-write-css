/*
 * grunt-json-write-css
 * https://github.com/thiago_soler/grunt-json-write-css
 *
 * Copyright (c) 2015 thiago-soler
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({


    // Configuration to be run (and then tested).
    json_write_css: {

      scene1 : {

        options: {},

        files : {
          'example/out/scene1.css' : [ 'example/src/**/*.json' ]
        }

      }


    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    // Hint tests.
    jshint: {
      options: {
        globalstrict: true,
        globals: {
          module: true,
          require: true
        },
        reporter: require('jshint-stylish')
      },
      target: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['json_write_css']);

  // By default, lint and run all tests.
  grunt.registerTask('test', ['jshint', 'karma']);

};
