define (['underscore', 'jquery', 'backbone'],
function (_, $,  Backbone){
    var ContactsModel = Backbone.Model.extend({
        defaults: {
            //This is a default attribute for any model which have no photo prop defined
            'name': "",
            'address': "C-701. Regency Cosmos Baner Pune",
            'tel': "0123456789",
            'email': "xyz@me.com",
            'type': "",
            'photo': 'img/placeholder.jpg',
        },
        url: function () {
            var base = '/service/contact';
            if (this.isNew()) return base;
            return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
        },
    });
    return ContactsModel;
});