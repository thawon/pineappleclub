define(
    ['express'],
    function (express) {
        return function (app, passport, mongoose) {
            var home = requirejs('routes/home'),
                user = requirejs('routes/user')(mongoose),
                signup = requirejs('routes/signup')(passport),
                login = requirejs('routes/login')(passport),
                router = express.Router();

            app.use('/api', user);
            app.use('/api', login);
            app.use('/', signup);

            // home default route must be added last
            app.use('/', home);
        }
    });