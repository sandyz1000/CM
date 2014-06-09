require([
        "app",
        "routers/AppRouter",

    ],
    function(app, WebRouter) {
        app.router = new WebRouter();
        Backbone.history.start();
    });
