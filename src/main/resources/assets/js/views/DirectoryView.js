define ([
'collections/DirectoryCollection',
'data/ContactsData',
'views/ContactView',
'models/ContactsModel',
 'app'
], function (collection, contacts, contactsView, contactsModel,app) {
    var DirectoryView = Backbone.View.extend({
        el : "#contacts",

        events : {
            //key : value // Binding an UI event to the backbone View
            "change #filter select" : "setFilter",
            "click #add" : "addContacts",
            "click #showForm" : "showForm"
        },

        showForm: function(){
            this.$el.find("#addContact").slideToggle();
        },


        initialize : function(){
            this.collection = new collection();
            var that = this;
            this.collection.fetch({
                success:function () {
                $("#filter").append(that.createSelect());
            }});


            //Binding Events to the object and adding a listener to it
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("add", this.renderContact, this);
            this.collection.on("remove", this.removeContact, this);
            this.collection.on("reset", this.render, this);
            this.render();
        },

        render : function(){
            var self = this;
            self.$el.find('.contact-container').remove();
            $.each(this.collection.models, function(index, value){
                self.renderContact(value);
            });
        },

        renderContact : function(item){
            var contactView  = new contactsView({model : item, directory:this});
            this.$el.append(contactView.render().el);
        },

        setFilter : function(e){
            this.filterType = e.currentTarget.value;
            //Creating a custom event just for the sake of this tutorial
            this.trigger("change:filterType");
        },

        addContacts : function(e){

            //Add a validate method for validating the user Input
            e.preventDefault();
            var formData = {};
            var self = this;
            $("#addContact").find("input").each(function(index, el){
                if($(el).val() !== ""){
                    var value = $(el).val();
                    if(el.id === "photo"){
                        value = value.replace(/C:\\fakepath\\/i, '');
                        value = 'img/'+value;
                    }
                    formData[el.id] = value;
                }
            });
            var newModel = new contactsModel();
            newModel.set(formData);
            newModel.save({url:'/service/contact'});
            //dd a new model into collection
            if(this.getType().indexOf(formData.type) === -1){
                self.collection.add(newModel);
                $("#filter").find("select").remove().end().append(this.createSelect())
            }
            else {
                self.collection.add(newModel);
            }
        },

        removeContact: function (removedModel) {
            var removed = removedModel.attributes;

            if (removed.photo === "img/placeholder.jpg") {
                delete removed.photo;
            }

            $.each(contacts, function (index, contact) {
                if (JSON.stringify(contact) === JSON.stringify(removed)) {
                    contacts.splice(contacts.indexOf(contact), 1);
                }
            });
        },

        filterByType : function(){
            if(this.filterType.toLowerCase() === "all"){
                this.collection.reset(contacts);
                app.router.navigate("filter/all");
            }
            else {
                var filterType = this.filterType;
                this.collection.reset(contacts, {silent : true});
                //Using Jquery Filtered method
                var filtered = this.collection.models.filter(function(item){
                    return (item.get("type").toLowerCase() === filterType.toLowerCase());
                });
                this.collection.reset(filtered);
                app.router.navigate("filter/" + filterType);
            }
        },

        getType : function(){
            // _uniq(arary, isSortedFlag, the result of the collection)
            console.log(this.collection);
            var abc =  _.uniq(this.collection.pluck("type"));
            console.log(abc);
            return abc;
            //Write your own method for returning unique
            // (function(){
            //     var isUnique = function(){

            //     }

            //     return;
            // }());
        },

        createSelect : function(){
            //Create an select box based on the type of array
            var filter = this.$el.find("#filter");
            var search = $("<select/>", {
                html : "<option>All</option>"
            });

            $.each(this.getType(), function(index, value){
                var options = $("<option/>",{
                    value : value.toLowerCase(),
                    text : value.toLowerCase()
                }).appendTo(search);
            });

            return search;
        }
    });
    return DirectoryView;
});