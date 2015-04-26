define(
    ["module", "path", "consolidate"],
    function (module, path, consolidate) {
        var config = {},
            dirname = path.normalize(path.dirname(module.uri));

        config.basePath = path.normalize(dirname + "/../..");

        console.log("env: " + process.env.NODE_ENV);

        config.express = {
            port: process.env.port || 3000,
            ip: "127.0.0.1",
            key: "connect.sid",
            secret: "website.pineappleclub_secret",
            view: {
                path: config.basePath + "/server/views",
                engine: {
                    type: "jade",
                    driver: consolidate.jade
                }
            },

            // base directory 
            staticPath: config.basePath + "/app",

            // shared libraries
            sharedLibPath: config.basePath + "/shared-lib"
        };

        var mongoUrl = (!process.env.NODE_ENV)
                        // development connection string
                        ? "mongodb://localhost:27017/pineappleclub"
                        // production connection string
                        : "mongodb://pineappleclub:CB_FhmudQikwCHn6eK.e3NShH6dvjC_gCpbIMllNJBw-@ds060977.mongolab.com:60977/pineappleclub";

        console.log("mongo url: " + mongoUrl);

        config.db = {
            database: "pineappleclub",
            url: mongoUrl
        };

        return config;
    });