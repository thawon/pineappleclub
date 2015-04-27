define(
    ["underscore", "express", "path", "module", "config/config"],
    function (_, express, path, module, config) {
        var router = express.Router(),
            scripts = "";
        // catch all route for history
        router.get("*", function (req, res) {
            var page = { environmentScript: "scripts/optimized" };
            
            if (!process.env.NODE_ENV) {
                page.environmentScript = "scripts/main";
            }

            var dir = config.express.staticPath + "/scripts",
                excludeDirs = [
                    "vendors"
                ],
                excludeFiles = [
                    "pc.js",
                    "pc.min.js"
                ];

            getScripts(dir, excludeDirs, excludeFiles);

            res.render("index", { page: page });
        });

        return router;

        function getScripts(dir, excludeDirs, excludeFiles) {
            var fs = require("fs"),
                content = fs.readdirSync(dir);
            
            fs.readdir(dir, function (err, list) {
                var dirs = getDirs(list),
                    files = getFiles(list);

                dirs.forEach(function (name) {
                    getScripts(dir + "/" + name, excludeDirs, excludeFiles)
                });

                files.forEach(function (name) {
                    scripts = scripts + dir + "/" + name + ";"
                });
            });

        }

        function getDirs(list) {
            return _.filter(list, function (name) { return (name.indexOf(".js") === -1) });
        }

        function getFiles(list) {
            return _.filter(list, function (name) { return (name.indexOf(".js") !== -1) });
        }

    });