/**
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'test/jasmine/**/*.js',
                {%= jshint_os_files %},
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // PhoneGrunt task with global options and one target defined.
        phonegrunt: {

            options: {
                cordovaBin: './node_modules/.bin/cordova',
                phonegapBin: './node_modules/.bin/phonegap'
            },

            {%= short_name %}: {

                options: {
                    cordovaBin: './node_modules/.bin/cordova',
                    installDir: './',
                    phonegapBin: './node_modules/.bin/phonegap'
                },

                init: {
                    name: '{%= name %}',
                    pkg: '{%= app_package %}',
                    install_os: [{%= app_os %}],
                    uninstall_os: []
                },

                build: {
                    local: {
                        plugins: {
                            add: [{%= app_plugins %}],
                            remove: []
                        }
                    }
                },
            }
        },

        debug: {
            options: {
                open: true
            }
        },

        // Jasmine spec tests.
        jasmine: {
            options: {
                helpers: 'test/jasmine/helper.js'
            },{%= jasmine_cfg %}        },

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('phonegrunt');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['jasmine']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'phonegrunt', 'jasmine']);

    // Debug task.
    grunt.registerTask('debug', ['debug:phonegrunt']);

};
