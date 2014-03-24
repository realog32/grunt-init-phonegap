# {%= name %}

> {%= description %}

## Getting Started
This plugin requires Grunt `{%= grunt_version %}` and supports PhoneGap API `{%= phonegapApiVersion %}`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

After the application files are generated, install dependencies via _npm_ (It may take a while to download all packages):

```shell
$ npm install
```

## Usage

After all dependencies are downloaded, you are now ready to build your application using _grunt_. The default task lints task files using [jshint][], generates and configures the PhoneGap application based on your specifications using [PhoneGrunt][], and tests the mobile application using [Jasmine][].

The following command runs all tasks:

```shell
$ grunt
```

Alternatively, the following development tasks may be run individually:

### PhoneGrunt build tasks

```shell
$ grunt phonegrunt
```
or to run phonegrunt for the {%= short_name %} target when multiple targets are defined:

```shell
$ grunt phonegrunt:{%= short_name %}
```
In the above example, _{%= short_name %}_ is the PhoneGap build target generated for your application by the grunt-init-phonegap template. An example configuration for the PhoneGap build target can be seen in the snippet just below. The _init_ and _build_ properties define how your mobile application should be initialized and configured. The cordova device, battery-status, and camera plugins will be added to the build while the geolocation plugin will be removed (if it exists) from the build. Please refer to the [PhoneGrunt][] documentation for complete details.

```js
// Project configuration.
grunt.initConfig({

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
        },
        anotherTarget: {
        . // multiple targets
        . // can be 
        . // defined here
    }
    .
    .
    .
```

Plugins for the configuration above can be added or removed to an existing build by simply running:

```shell
$ grunt phonegrunt:{%= short_name %}:build
```

### Lint task (JSHint)

```shell
$ grunt jshint
```

This will lint files configured in the jshint task in the generated Gruntfile.js. Please refer to the [grunt-contrib-jshint][jshint] plugin for configuration details for this task.
Below is an example of the default configuration for an android application:

```js
// Project configuration.
grunt.initConfig({

    jshint: {
        all: [
            'Gruntfile.js', // This gruntfile.
            'tasks/*.js', // Generated PhoneGap build tasks and any user-defined tasks.
            'test/jasmine/**/*.js', // Jasmine test scripts.
            ['platforms/android/assets/www/js/**/*.js',], // PhoneGap application JS files.
        ],
        options: {
            jshintrc: '.jshintrc', // configuartion options for jshint
        },
    },
    .
    .
    .
```

### Jamine test task

```shell
$ grunt jasmine
```

This will run the Jasmine tests in the test/jasmine/specs directory. Please refer to [grunt-contrib-jasmine][Jasmine] plugin for configuration options.


## Support
Please report any issues [here][issues] and feel absolutely welcome to fork and submit pull requests.


[grunt-init]: http://gruntjs.com/project-scaffolding#installation
[Jasmine]: https://github.com/gruntjs/grunt-contrib-jasmine
[jshint]: https://github.com/gruntjs/grunt-contrib-jshint
[issues]: {%=bugs%}
[PhoneGap]: http://phonegap.com
[PhoneGrunt]: http://realog32.github.io/phonegrunt