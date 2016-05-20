import { HTTP } from 'meteor/http';

Websites = new Mongo.Collection("websites");

Websites.allow({
	insert:function(userId, doc){		
	if(Meteor.user()){
		console.log(doc);
			if(userId != doc.createdBy){
				return false;
			}else{
				return true;
			}
		} else{
			return false;
		}
	},
	update:function(userId, doc){
		if(Meteor.user()){
			return true;
		} else{
			return false;
		}
	}
})
