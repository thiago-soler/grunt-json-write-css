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

      iterator: function (json, isProp, buffer) {


        buffer = buffer || '';

        var idx = '',
            idxName = '',
            idxValue = undefined,
            nameToReplace = '#properties#',
            markupA = '{\n' + nameToReplace + '}\n\n',
            // markupA = '{\n',
            // markupB = '}\n\n',
            separator = ':',
            endLine = ';\n',
            properties = '';

        for (idx in json) {
          
          idxName = idx;
          idxValue = json[idx];
          isProp = isProp || false;

          // Set the selector element
          if (isProp === false && typeof idxValue === 'object') {
            
            buffer += idxName + markupA;

            buffer = $private.write.iterator(idxValue, true, buffer);

          }

          if (isProp === true && typeof idxValue === 'string') {

            properties += idxName + separator + idxValue + endLine;

          }

          if (isProp === true && typeof idxValue === 'object') {
            
            buffer = buffer.replace(nameToReplace, idxName + markupA + nameToReplace);
            
            buffer = $private.write.iterator(idxValue, true, buffer);
          }

        }

        if (isProp === true) {

          buffer = buffer.replace(nameToReplace, properties);

        }

        return buffer;
        
      },

      css: function (buffer) {

        grunt.file.write($private.write.dest, buffer);

      },

      dest : ''

    };

    // Starts the process of creating the css file
    $private.init = function (json) {

      var buffer = $private.write.iterator(json);

      $private.write.css(buffer);

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



  //   // Iterate over all specified file groups.
  //   this.files.forEach(function(f) {
  //     // Concat specified files.
  //     var src = f.src.filter(function(filepath) {
  //       // Warn on and remove invalid source files (if nonull was set).
  //       if (!grunt.file.exists(filepath)) {
  //         grunt.log.warn('Source file "' + filepath + '" not found.');
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }).map(function(filepath) {
  //       // Read file source.
  //       return grunt.file.read(filepath);
  //     }).join(grunt.util.normalizelf(options.separator));
  //     // Handle options.
  //     src += options.punctuation;
  //     // Write the destination file.
  //     grunt.file.write(f.dest, src);
  //     // Print a success message.
  //     grunt.log.writeln('File "' + f.dest + '" created.');
  //   });
  // 