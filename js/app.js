(function(){
    var contacts = [
        { name: "Contact 1", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "family", list : { a, b, c } },
        { name: "Contact 2", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "family" },
        { name: "Contact 3", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "friend" },
        { name: "Contact 4", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "colleague" },
        { name: "Contact 5", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "family" },
        { name: "Contact 6", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "colleague" },
        { name: "Contact 7", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "friend" },
        { name: "Contact 8", address: "C-701. Regency Cosmos Baner Pune", tel: "0123456789", email: "xyz@me.com", type: "family" }
    ];
    window.APP = {Routers :{}, Collection :{}, Models : {}, Views :{}};

    window.APP.Routers.ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type": "urlFilter"
        },
     
        urlFilter: function (type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
        }
    });

    

    window.APP.Models.Contact = Backbone.Model.extend({
        defaults : {
            //This is a default attribute for any model which have no photo prop defined
            'name': "",
            'address': "C-701. Regency Cosmos Baner Pune",
            'tel': "0123456789",
            'email': "xyz@me.com",
            'type' : "",
            'photo' : 'img/placeholder.jpg'
        }
    });

    window.APP.Collection.Directory = Backbone.Collection.extend({
        // The model preporty defined the specific collection class of model
        model : window.APP.Models.Contact
    });

    window.APP.Views.ContactView = Backbone.View.extend({
        events : {
            "click button.delete" : "deleteContact",
            "click button.edit": "editContact",
            "change select.type": "addType",
            "click button.save": "saveEdits",
            "click button.cancel": "cancelEdit"        
        },

        tagName : 'div',
        
        className : "contact-container clearfix",
        
        template : _.template($("#contactTemplate").html()),

        editTemplate : _.template($("#contactEditTemplate").html()),
        
        render : function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        deleteContact : function(){
            var removedType = this.model.get("type").toLowerCase();
            // When the model is destroy it call the remove event in the collection
            this.model.destroy();
            this.remove();
            if(directory.getType().indexOf(removedType) === -1){
                directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
            }
        }, 

        editContact : function(){
            this.$el.html(this.editTemplate(this.model.toJSON()));
            var newOpt = $("<option/>",{
                html : "Add new..",
                value : "addType"
            });

            this.select = directory.createSelect().addClass("type")
            .val(this.$el.find("#type").val()).append(newOpt)
            .insertAfter(this.$el.find(".name"));
     
            this.$el.find("input[type='hidden']").remove();
        },

        addType : function(){
            if (this.select.val() === "addType") {
                this.select.remove();
             
                $("<input />", {
                    "class": "type"
                }).insertAfter(this.$el.find(".name")).focus();
            }
        },

        saveEdits : function(e){
            //Replacing the model with new inserted data
            var targetForm = $(e.target).parent('form');
            var formData = {}, prev = {};
            $.extend(prev, this.model.attributes);
            targetForm.find('input').each(function(index, el){
                formData[$(el).attr('class')] = $(el).val();
            });
            if (formData.photo === "") {
                delete formData.photo;
            }
            this.model.set(formData);
            
            //Update the contacts objects
            if(prev.photo === 'img/placeholder.jpg'){
                delete prev.photo;
            }                

            $.each(contacts, function(i, contact){
                if(JSON.stringify(prev) === JSON.stringify(contact)){
                    contacts.splice(contacts.indexOf(contact), 1, formData);
                }
            });

            this.render();

        },

        cancelEdit: function () {
            this.render();
        }
    });


    //Master View
    window.APP.Views.DirectoryView = Backbone.View.extend({
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
            this.collection = new window.APP.Collection.Directory(contacts);
            this.$el.find("#filter").append(this.createSelect());
            this.render();
            
            //Binding Events to the object and adding a listener to it 
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("add", this.renderContact, this);
            this.collection.on("remove", this.removeContact, this);
            this.collection.on("reset", this.render, this);
        },

        render : function(){
            var self = this;
            self.$el.find('.contact-container').remove();
            $.each(this.collection.models, function(index, value){
                self.renderContact(value);
            });
        },

        renderContact : function(item){
            var contactView  = new window.APP.Views.ContactView({model : item});
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
            contacts.push(formData);
            //Add a new model into collection
            if(this.getType().indexOf(formData.type) === -1){
                self.collection.add(new APP.Models.Contact(formData));
                $("#filter").find("select").remove().end().append(this.createSelect())
            } 
            else {
                self.collection.add(new APP.Models.Contact(formData));
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
                contactsRouter.navigate("filter/all");
            } 
            else {
                var filterType = this.filterType;
                this.collection.reset(contacts, {silent : true});
                //Using Jquery Filtered method
                var filtered = this.collection.models.filter(function(item){
                    return (item.get("type").toLowerCase() === filterType.toLowerCase());
                });
                this.collection.reset(filtered);
                contactsRouter.navigate("filter/" + filterType);
            }
        },

        getType : function(){
            // _uniq(arary, isSortedFlag, the result of the collection)
            return _.uniq(this.collection.pluck("type"), false, function(type){
                return type.toLowerCase();
            });
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
    
    var directory = new window.APP.Views.DirectoryView();
    var contactsRouter = new window.APP.Routers.ContactsRouter();
    Backbone.history.start(); //For monitoring URL from hash change

}())

