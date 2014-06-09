require.config({
    baseUrl : './js',
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: './assets/jquery.min',
        backbone: './assets/backbone.min',
        underscore: './assets/underscore.min',
        router: './routers/AppRouter',
        models: './models',
        views: './views',
        templates: './templates'
    }
});

requirejs([
    'main'
]);
