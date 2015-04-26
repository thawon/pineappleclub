module.exports = function (grunt) {
    grunt.initConfig({
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: "server.js",
                    node_env: undefined,
                    debug: true
                }
            },
            test: {
                options: {
                    script: "server.js",
                    node_env: undefined
                }
            }
        },
        watch: {
            frontend: {
                options: {
                    livereload: true
                },
                files:
                [                    
                    "./app/scripts/components/**/*.less"
                ],
                tasks: ["less"]
            }
            ,
            server: {
                files: ["./server/**/*"],
                tasks: ["express:dev"],
                options: {
                    //Without this option specified express won't be reloaded
                    nospawn: true,
                    atBegin: true
                }
            }
        },
        "node-inspector": {
            dev: {
                options: {
                    "web-port": 8082,
                    "no-preload": true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["./less"],
                    yuicompress: true
                },
                files: {
                    "./app/styles/custom-bootstrap.css": "./app/lesses/styles.less"
                }
            }
        },
        karma: {
            unit: {
                configFile: "test/karma.conf.js",
                browsers: ["PhantomJS"],
                singleRun: true
            }
        },
        protractor_webdriver: {
            options: {
                // Task-specific options go here.
            },
            your_target: {
                options: {
                    command: "webdriver-manager start",
                    keepAlive: true
                }
            }
        },
        protractor: {
            options: {
                configFile: "test/protractor.conf.js",
                keepAlive: true
            },
            run: {}
        },
        ngAnnotate: {
            options: {
                singleQuotes: false
            },
            app: {
                files: {
                    "./app/scripts/pc.js": [
                        "./app/scripts/app.js",
                        "./app/scripts/components/**/*.js",
                        "./app/scripts/constants/**/*.js",
                        "./app/scripts/directives/**/*.js",
                        "./app/scripts/services/**/*.js"
                    ]
                }
            }
        },
        uglify: {
            min: {
                files: {
                    "./app/scripts/pc.min.js": [
                        "./app/scripts/pc.js"
                    ]
                }
            }
        },
        parallel: {
            dev: {
                options: {
                    stream: true
                },
                tasks: [{
                        grunt: true,
                        args: ["watch:frontend"]
                    }, {
                        grunt: true,
                        args: ["watch:server"]
                    }, {
                        grunt: true,
                        args: ["node-inspector:dev"]
                    }]
            },
            test: {
                option: {
                    stream: true
                },
                tasks: [{
                    grunt: true,
                    args: ["karma:unit"]
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-express-server");
    grunt.loadNpmTasks("grunt-env");
    grunt.loadNpmTasks("grunt-node-inspector");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-protractor-webdriver");
    grunt.loadNpmTasks("grunt-protractor-runner");
    grunt.loadNpmTasks("grunt-parallel");
    grunt.loadNpmTasks("grunt-ng-annotate");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    // test
    grunt.registerTask("test", "run specs",
    ["parallel:test"]);

    // development
    grunt.registerTask("dev", "launch webserver and watch task",
    ["parallel:dev"]);

    // production
    grunt.registerTask("prod", "minifies js files",
    ["requirejs:prod"]);

    grunt.registerTask("a", "run",
    ["ngAnnotate", "uglify"]);
};