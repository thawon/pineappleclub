define(
    ["express"],
    function (express) {
        var router = express.Router();

        // catch all route for history
        router.get("*", function (req, res) {
            var page = { environmentScript: "scripts/optimized" };
            
            if (!process.env.NODE_ENV) {
                page.environmentScript = "scripts/main";
            }

            res.render("index", { page: page });
        });

        return router;
    });