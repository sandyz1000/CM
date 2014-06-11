define (['underscore','jquery', 'backbone','models/ContactsModel'] , function (_,$, Backbone,contactsModel){

    var ContactView = Backbone.View.extend({

        initialize: function (options)
        {
            this.directory = options.directory;
        },

        events : {
            "click button.delete" : "deleteContact",
            "click button.edit": "editContact",
            "change select.type": "addType",
            "click button.save": "saveEdits",
            "click button.cancel": "cancelEdit"
        },

        directory: undefined,

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
            if(this.directory.getType().indexOf(removedType) === -1){
                this.directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
            }
        },

        editContact : function(){
            this.$el.html(this.editTemplate(this.model.toJSON()));
            var newOpt = $("<option/>",{
                html : "Add new..",
                value : "addType"
            });

            this.select = this.directory.createSelect().addClass("type")
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
            this.model.set(formData) ;
            var type = this.$el.find(".type").val();
            this.model.set({type: type});

            this.model.save({url:'/service/contact/'+this.model.id});
            this.model.fetch({url:'/service/contact/'+this.model.id});
            this.render();

        },

        cancelEdit: function () {
            this.render();
        }
    });
    return ContactView;
});