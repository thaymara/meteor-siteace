import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
	this.render("navbar", {
		to: "navbar"
	});	
	this.render("websites", {
		to: "main"
	});
});

Router.route('/website/:_id', function(){
	this.render("navbar", {
		to: "navbar"
	});

	this.render("website_detail", {
		to: "main",
		data: function(){
			return Websites.findOne({_id: this.params._id});		
		}
	});
});

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

Comments.ui.config({
   template: 'bootstrap' // or ionic, semantic-ui
});

/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({		
		websites:function(){
			return Websites.find({}, {sort:{upRating: -1}});
		}
	})

	Template.website_form.helpers({
		username:function(){
			if(Meteor.user()){
				return Meteor.user().username;
			}
			else{
				return "anonymous";
			}
		}
	})

	Template.registerHelper('formatDate', function(date) {
	  return moment(date).format('MM-DD-YYYY');
	});

	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			// put the code in here to add a vote to a website!
			var rate = this.upRating + 1;
			
			Websites.update({_id: website_id}, {$set: {upRating:rate}}); 
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;

			// put the code in here to remove a vote from a website!
			var rate = this.downRating + 1;
			
			Websites.update({_id: website_id}, {$set: {downRating:rate}}); 

			return false;// prevent the button from reloading the page
		},
		"click .js-detail": function(event){
			var button_id = this._id;
		}
		
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var vUrl = event.target.url.value;
			var vTitle = event.target.title.value;
			var vDescription = event.target.description.value;
			
			//  put your website saving code in here!	

			if(vUrl == ""){
				$("#form_url").addClass("has-error");
				//$(".error-label").show();
			}
			if(vTitle == ""){
				$("#form_title").addClass("has-error");
				//$(".error-label").show();
			} 
			if(vDescription == ""){
				$("#form_desc").addClass("has-error");
				//$(".error-label").show();				
			}
			if(vUrl != "" && vTitle != "" && vDescription != ""){
				Websites.insert({
					title: vTitle, 
			    		url: vUrl, 
			    		description: vDescription, 
					upRating: 0,
					downRating: 0,
					createdBy: Meteor.user()._id,
			    		createdOn: new Date()
				});
				$("#form_url").removeClass("has-error");
				$("#form_title").removeClass("has-error");
				$("#form_desc").removeClass("has-error");
				$(".error-label").hide();
				
				$('#url').val("");
				$('#title').val("");
				$('#description').val("");
			}
			return false;// stop the form submit from reloading the page

		},
		"blur #url":function(event){
			var vUrl = event.target.value;
			Meteor.call('remoteGet', vUrl, function(err,res){
				var matches = res.content.match(/<title>(.*?)<\/title>/);
				$("#title").val(matches[1]);
			} );
			
			
		}
	});
