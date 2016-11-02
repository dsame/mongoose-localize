'use strict';

var mongoose = require('mongoose');

var locales=['en','ru'];
var locale=locales[0];

function currentLocale(){
	return locale?locale:((locales.length>0)?locales[0]:undefined);
}

var prototype_mongoose=function(){
	var ma = mongoose.Schema.prototype.add;
	if (mongoose.Schema.protection.localized) return;
	mongoose.Schema.protection.localized=()=>true;

	//traverse over all fields and modify the objects having "localize" attribute
	var addI18n=function(schema,obj,prefix){
		var keys = Object.keys(obj);

		if (keys.length==1 && keys=='_id') return obj;

		var ret={};

		for (var i = 0; i < keys.length; i++) {
			//keys of fields
			var key = keys[i];
			var field = obj[key];

			if (key==='type'){
				ret[key]=field;
				continue;
			}

			if (typeof field != "object") {
				ret[key]=field;
				continue;
			};

			if (field instanceof Array) {
				//TODO: Should traverse? Than a problem with virtual name path
				ret[key]=field.slice();
				continue;
			};

			//now we are sure "field" is an object
			//field=addI18n(schema,field,path+(path==''?'':'.')+key);

			if (field.localize){
				if ((locales instanceof Array) && locales.length>0){
					var nfield={};
					for (var li=0;li<locales.length;li++){
					//TODO: remove ES6
						nfield[locales[li]]=Object.assign({},field);
						delete(nfield[locales[li]].localize);
					}
					ret[key]=nfield;
					var vpath=(prefix?prefix:'')+key;
					schema.virtual(vpath+'._')
					.get(function(){
						var l=currentLocale();
						if (l) return this.get(vpath+'.'+l);
						return undefined;
					}).set(function(value,virtual){
						if (currentLocale(value))
							this.set((prefix?prefix:'')+key+'.'+l,value);
					});
				}else{
					ret[key]=Object.assign({},field);
					delete(ret[key].localize);
				}
			}else{
				ret[key]=field;
			}
		};
		return ret;
	}

	mongoose.Schema.prototype.add = function add (obj, prefix) {
		console.log({in:obj});
		var oobj=addI18n(this,obj,prefix);
		console.log({out:oobj});
		ma.call(this,oobj,prefix);
	};
};

prototype_mongoose();


module.exports = {
	currentLocale:currentLocale,
	setCurrentLocale:function(sLocale){
		locale=sLocale;
	},
	locales:function(){
		return locales;
	},
	setLocales:function(sLocales){
		locales=sLocales;
	},
	activate:prototype_mongoose;
	active:()=>!!mongoose.Schema.protection.localized
}


