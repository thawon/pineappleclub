define(
    [],
    function () {
        return function (app, passport) {
            var home = requirejs("routes/home"),
                signup = requirejs("routes/signup")(passport),
                login = requirejs("routes/login")(passport);

            app.use("/", home);
            app.use("/", login);
            app.use("/", signup);
        }
    });