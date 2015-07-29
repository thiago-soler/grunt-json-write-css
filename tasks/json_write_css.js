/*
 * grunt-json-write-css
 * https://github.com/thiago_soler/grunt-json-write-css
 *
 * Copyright (c) 2015 thiago-soler
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('json_write_css', 'This plugin writes CSS through the JSON files.', function() {
    
        // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          containerWidth : 960
        }),
        files = this.files;

    files.forEach( function(file) {
      
      grunt.log.writeflags(file.src, 'file.src');

      var src = file.src.filter( function(filepath) {

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }

      }).map(function(filepath) {
        
        grunt.log.writeflags(filepath, 'map-filepath');

        return grunt.file.readJSON(filepath);

      });

      grunt.log.writeflags(src, 'src');

    });
    
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

  });

};
