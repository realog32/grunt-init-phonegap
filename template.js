/**
 * grunt-init-phonegap
 * http://ogomand.com/grunt-init-phonegap/
 * Copyright (c) 2014 Ogom "realog32" Okafor, Ogom & Co. Inc.
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('./lib/lodash');

/*
 * Template description.
 */
exports.description = 'Set up an automated PhoneGap project build environment.';

/*
 * Template-specific notes displayed before setup prompts.
 */
exports.notes = 'The following prompts will guide you through the creation of your PhoneGap project, so buckle in, let\'s ride.';

/*
 * Template-specific notes to be displayed after setup prompts.
 */
exports.after = 'You should now install project dependencies with '+'npm '.yellow +
    'install'.yellow+'. After that, you may execute project tasks with '+'grunt'.yellow+'. For ' +
    'more information about installing and configuring Grunt, please see ' +
    'the Getting Started guide:' +
    '\n\n' +
    'http://gruntjs.com/getting-started';

/*
 * Existing files or directories matching any of these wildcards will cause a warning.
 */
exports.warnOn = ['Gruntfile.js','package.json'];

/*
 * The actual init template.
 */
exports.template = function(grunt, init, done) {

    // Set PhoneGap-specfic prompts
    _.extend(init.prompts, {
        app_package: {
            message: 'Application package name',
            default: 'com.example.hellophonegap',
            // @TODO: Fix regular expression.
            validate: /^[\a]?[\.\w]*[\.\a]*/i,
            warning: 'Must be only letters and dots.'
            // @TODO: Add sanitize method
        },
        app_os: {
            message: "Enter the number corresponding to the target mobile operating system for this application. \nEnter space-separated numbers to install multiple operating system support.\n\n".yellow+
                "[1] Amazon Fire OS\n"+
                "[2] Android OS\n"+
                "[3] Blackberry 10\n"+
                "[4] Firefox OS\n"+
                "[5] iOS\n"+
                "[6] Ubuntu\n:",
            required: true,
            pattern: /^[0-9 ]$/,
            validate: /^[0-9 ]$/,
            warning: 'Enter the number (or space-separated numbers) that corresponds to the mobile operating systems this application supports.'.yellow
        },
        app_plugins: {
            message: "Enter the number corresponding to the cordova API plugin to install. \nEnter space-separated numbers to install multiple plugins.\n\n".yellow+
                "[1] battery-status (Events)\n"+
                "[2] camera (Camera)\n"+
                "[3] contacts (Contacts)\n"+
                "[4] device (Device)\n"+
                "[5] device-orientation (Compass)\n"+
                "[6] device-motion (Accelerometer)\n"+
                "[7] dialogs (Notification)\n"+
                "[8] file (Capture, File)\n"+
                "[9] geolocation (Geolocation)\n"+
                "[10] globalization (Globalization)\n"+
                "[11] inappbrowser (InAppBrowser)\n"+
                "[12] media (Media)\n"+
                "[13] media-capture (Capture)\n"+
                "[14] network-information (Connection)\n"+
                "[15] splashscreen (Splashscreen)\n"+
                "[16] vibration (Notification)\n:",
            required: true,
            pattern: /^[0-9 ]$/,
            validate: /^[0-9 ]$/,
            warning: 'Enter the number (or space-separated numbers) that corresponds to the plugin you want to install.'.yellow
        }
    });

    init.process({type: 'PhoneGap', plugins:[4]}, [
        // Prompt for these values.
        init.prompt('title'),
        init.prompt('name', 'HelloPhonegap'),
        init.prompt('app_package'),
        init.prompt('app_plugins'),
        init.prompt('app_os'),
        init.prompt('description', 'The best PhoneGap app ever.'),
        init.prompt('version', '0.1.0'),
        init.prompt('repository'),
        init.prompt('homepage'),
        init.prompt('bugs'),
        init.prompt('licenses', init.availableLicenses()),
        init.prompt('author_name'),
        init.prompt('author_email'),
        init.prompt('author_url')//,
        // init.prompt('grunt_version'),
        // init.prompt('node_version', grunt.package.engines.node)
    ], function(err, props) {

        /*
         * Returns a list of selected operating systems.
         */
        var getOSList = function(value) {
            var osToInstall = [];
            var osList = ['amazon-fireos','android','blackberry10','firefoxos','ios','ubuntu'];
            var selections = value.split(' ');
            _.each(selections, function(selection) {
                var osId = parseInt(selection);
                if(!isNaN(osId) && osId > 0 && osId <= osList.length) {
                    var os = osList[osId-1];
                    if(_.indexOf(osToInstall, os, false)===-1) {
                        // osToInstall.push('"'+os+'"');
                        osToInstall.push(os);
                    }
                }
            });
            return osToInstall;
        };

        /*
         * Returns a string used to configure the jasmine tasks in the Gruntfile.
         */
        var getJasmineConfig = function(osArray) {
            // @todo: FUGLY! Fix!
            var tmpl = "<% _.forEach(osArray, function(os){%>"+
            "\n            <%= os %>: {\n"+
            "                src: ['platforms/<%= os %>/assets/www/js/**/*.js',\n"+
            "                    './**/*/platforms/<%= os %>/assets/www/js/**/*.js'\n"+
            "                ],\n"+
            "                options: {\n"+
            "                    specs: ['test/jasmine/specs/<%= os %>/**/*.js'],\n"+
            "                }\n"+
            "            },<%});%>\n";
            return _.template(tmpl, {'osArray': osArray});
        };

        /*
         * Returns a string representation of an array used to configure os-specific javascript files for jshint in the Gruntfile.
         */
        var getJSHintOSPathConfig = function(osArray) {
            var tmpl = "[<% _.forEach(osArray, function(os){%>"+
            "'platforms/<%= os %>/assets/www/js/**/*.js',\n"+
            "'./**/*/platforms/<%= os %>/assets/www/js/**/*.js',\n"+
            "<%});%>]";
            return _.template(tmpl, {'osArray': osArray});
        };

        var operatingSystems = getOSList(props.app_os); /* Get list of operating systems to install support for. */

        /*
         * Returns an array of selected operating systems formatted for Gruntfile output.
         */
        var buildConfigOSList = function() {
            return _.map(operatingSystems, function(os){return '"'+os+'"';});
        };

        // Set App plugin list
        var getPluginList = function(value) {
            var pluginsToInstall = ['"device"']; // Install at least the device (base) plugin.
            var plugins = ['battery-status','camera','contacts','device','device-orientation','device-motion',
              'dialogs','file','geolocation','globalization','inappbrowser','media','media-capture',
              'network-information','splashscreen','vibration'];
            var selections = value.split(' ');
            _.each(selections, function(selection) {
                var pluginId = parseInt(selection);
                if(!isNaN(pluginId) && pluginId > 0 && pluginId < 17) {
                    var plugin = plugins[pluginId-1];
                    if(_.indexOf(pluginsToInstall, plugin, false)===-1) {
                        pluginsToInstall.push('"'+plugin+'"');
                    }
                }
            });
            return pluginsToInstall;
        };

        // Set a few plugin-specific properties.
        props.dependencies = {};
        props.keywords = [];
        props.app_os = buildConfigOSList();
        props.app_plugins = getPluginList(props.app_plugins);
        props.jasmine_cfg = getJasmineConfig(operatingSystems);
        props.jshint_os_files = getJSHintOSPathConfig(operatingSystems);
        props.short_name = props.name.replace(/^grunt[\-_]?/, '').replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
        props.main = 'Gruntfile.js';
        props.npm_test = 'grunt test';
        props.keywords = ['phonegap','mobile','application'];
        props.cordovaApiVersion = '~3.4.0-0.1.0';
        props.phonegapApiVersion = '~3.3.0-0.19.6';
        props.grunt_version = '~0.4.2';
        props.node_version = '>= 0.8.0';
        props.devDependencies = {
            'lodash': '>=2.4.1',
            'shelljs': '~0.2.6',
            'cordova': props.cordovaApiVersion,
            'phonegap': props.phonegapApiVersion,
            'grunt-contrib-jshint': '~0.6.0',
            'grunt-contrib-jasmine': '~0.6.1',
            'grunt-debug-task': '~0.1.3',
            'phonegrunt': '~0.1.0'
        };
        props.peerDependencies = {
            'grunt': props.grunt_version,
        };

        // Files to copy (and process).
        var files = init.filesToCopy(props);

        // Add properly-named license files.
        init.addLicenseFiles(files, props.licenses);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {noProcess: 'libs/**'});

        // Generate package.json file, used by npm and grunt.
        init.writePackageJSON('package.json', props);

        // All done!
        done();
    });
};