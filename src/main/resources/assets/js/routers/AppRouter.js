define([
    'views/DirectoryView',
] ,
function (directory)
{
    var app = {};
    //Provide a helper to close the prototype
    Backbone.View.prototype.close = function(){
        this.remove();
        this.unbind();
        if (this.onClose){
            this.onClose();
        }
    };
    var AppRouter = Backbone.Router.extend({
        routes: {
            "" : 'init',
            "filter/:type": "urlFilter"
        },

        urlFilter: function (type) {
            if (!app.directory)
            {
                app.directory = new directory();
            }
            app.directory.filterType = type;
            console.log("Called");
            app.directory.trigger("change:filterType");
        },
        init : function () {
            app.directory = new directory();
            app.directory.render();
        }

    });
    return AppRouter;


});

