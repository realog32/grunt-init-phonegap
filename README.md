# grunt-init-phonegap

[grunt-init]: http://gruntjs.com/project-scaffolding#installation
[Jasmine]: https://github.com/gruntjs/grunt-contrib-jasmine
[jshint]: https://github.com/gruntjs/grunt-contrib-jshint
[issues]: {%=bugs%}
[PhoneGap]: http://phonegap.com
[PhoneGrunt]: http://realog32.github.io/phonegrunt

> A grunt-init template that simplifies the process of setting up a PhoneGap mobile application development environment.

It configures grunt tasks that creates and manages a [PhoneGap][] mobile application using [PhoneGrunt][], JavaScript code linting using [grunt-contrib-jshint][jshint] and Jasmine testing using [grunt-contrib-jasmine][Jasmine].


## Getting Started
If you haven't done so, please install [grunt-init][].
Also install any SDKs and build tools needed for compiling the mobile operating systems you want your PhoneGap application to support.

Once these are installed, place this template in your `~/.grunt-init/` directory `(%USERPROFILE%\.grunt-init\ on Windows)`. It is recommended that you use git to clone this template into that directory, as follows:

```shell
$ git clone https://github.com/realog32/grunt-init-phonegap.git ~/.grunt-init/phonegapdev
```

## Installation

At the command line, cd into an empty directory, run the command below and follow the prompts. Your PhoneGap application and dev environment will be created in the directory. Existing files may be overwritten.

```shell
$ grunt-init phonegapdev
```

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
or to run phonegrunt for a specific target when multiple targets are defined:

```shell
$ grunt phonegrunt:hellophonegap
```
In the above example, _hellophonegap_ is the PhoneGap build target generated for your application by the grunt-init-phonegap template. An example configuration for the PhoneGap build target can be seen in the snippet just below. The _init_ and _build_ properties define how your mobile application should be initialized and configured.
The main class for this configuration shown below would be _platforms/android/src/com/hellophonegap/app/HelloPhonegap.java_. The cordova device, battery-status, and camera plugins will be added to the build while the geolocation plugin will be removed (if it exists) from the build. Please refer to the [PhoneGrunt][] documentation for complete details.

```js
// Project configuration.
grunt.initConfig({

    phonegrunt: {

        options: {

        },
        hellophonegap: {

            init: {
                name: 'HelloPhonegap', // Your mobile application project name
                package: 'com.example.hellophonegap', // Application package namespace
                target_os: ["android"] // Target operating system(s)
            },

            build: {
                local: {
                    plugins: {
                        add: ["device","battery-status","camera"],
                        remove: ["geolocation"]
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
$ grunt phonegrunt:hellophonegap:build
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


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Acknowledgments
This effort is inspired by the awesome [grunt-init-gruntplugin][https://github.com/gruntjs/grunt-init-gruntplugin]. Many thanks to Ben Alman and his fellow contributors for making it all seem so simple.


## Release History
_(Initial Release)_