define(
    ['express', 'models/user'],
    function (express, User) {

        return function (mongoose) {
            var router = express.Router(),
                bmongo = require('breeze-mongodb');

            router.get('/User', getUser);

            router.post('/SaveChanges', saveChanges);

            return router;

            function getUser(req, res, next) {                
                var id = req.query.$filter.split(" ")[2].replace("'", '').replace("'", '');

                User.findById(id, function (err, user) {
                    // if there are any errors, return the error before anything else
                    if (err)
                        res.send(err);

                    res.send(user);
                });

                //query.execute(mongoose.connection, 'User',
                //    function (error) {
                //        var x;
                //        x = 1;
                //    });
            }

            function saveChanges(req, res, next) {
                data.saveChanges(req.body, function (res, next) {
                    var x;
                    x = 1;
                });
            }
        }

    });