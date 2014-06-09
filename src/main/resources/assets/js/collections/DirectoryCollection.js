define (['underscore','models/ContactsModel' ],

     function (_, Contacts)
    {
        var Collection = Backbone.Collection.extend({
            // The model preporty defined the specific collection class of model
            model : Contacts,
            url : "/service/contacts"
        });
        return Collection;
    }

);