/*
 * grunt-json-write-css
 * https://github.com/thiago_soler/grunt-json-write-css
 *
 * Copyright (c) 2015 thiago-soler
 * Licensed under the MIT license.
 */

'use strict';

var merge = require('merge');

module.exports = function(grunt) {


  grunt.registerMultiTask('json_write_css', 'This plugin writes CSS through the JSON files.', function() {
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          containerWidth : 960
        }),
        files = this.files,
        $private = {};

    // JSON temporary, he is created to generate the css file
    $private.jsonOut = {};

    // This method do the merge of multiples literal objects
    $private.mergeJSON = function(json) {
      
      $private.jsonOut = merge.recursive(true, $private.jsonOut, json);

    };

    $private.write = {

      iterator: function (json, isProp, selectorName) {
        
        selectorName = selectorName || '';

        var idxA = '',
            valueA = undefined,
            selector = '{\n#properties#}\n\n',
            separator = ':',
            endLine = ';\n',
            stringResult = '';

        for (idxA in json) {
          
          valueA = json[idxA];
          
          if (isProp === true) {
            
            // console.log(selectorName, idxA);

            stringResult += idxA + separator + valueA + endLine;

          } else {
            
            $private.write.tempSelectors += idxA + selector.replace('properties', idxA);
            selectorName = idxA;
            
            // console.log(' ');
            // console.log('---------- seletores ------------');
            // console.log(idxA);
            // console.log('---------- seletores ------------');
            // console.log(' ');

          }
          

          if (typeof json[idxA] === 'object') {
            $private.write.iterator(json[idxA], true, selectorName);
          }
        }

        $private.write.tempSelectors = $private.write.tempSelectors.replace('#' + selectorName + '#', stringResult);

      },

      css: function (file) {
        grunt.file.write($private.write.dest, file);
      },

      tempSelectors: '',
      tempProps: '',

      dest : ''

    };

    // Starts the process of creating the css file
    $private.init = function (json) {

      $private.write.iterator(json);

      $private.write.css($private.write.tempSelectors);

    };

    files.forEach( function(file) {

      $private.write.dest = file.dest;
      
      var currentFile = file.src.filter( function(filepath) {

        if ( !grunt.file.exists(filepath)) {
          
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;

        } else {
          
          return true;

        }

      }).map( function(filepath) {

        var json = grunt.file.readJSON(filepath);

        $private.mergeJSON(json);

        return file;

      });

    });

    $private.init( $private.jsonOut );

  });

};


/*
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));
      // Handle options.
      src += options.punctuation;
      // Write the destination file.
      grunt.file.write(f.dest, src);
      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  */