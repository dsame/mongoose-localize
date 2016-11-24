'use strict';

//var mongoose = require('mongoose');

var locales=['en','ru'];
var locale=locales[0];

function	setLocales(sLocales){
	locales=sLocales;
}

function currentLocale(){
	return locale?locale:((locales.length>0)?locales[0]:undefined);
}

function	setCurrentLocale(sLocale){
	if (locales.indexOf(sLocale)>=0)
		locale=sLocale;
	else{
		let i=sLocale.indexOf('-');
		if (i>0){
			return setCurrentLocale(sLocale.substring(0,i));
		}else{
			i=sLocale.indexOf('_');
			if (i>0){
				return setCurrentLocale(sLocale.substring(0,i));
			}else{
				if (locales.length>0){
					setCurrentLocale(locales[0]);
				}
			}
		}
	}
}

function isLocalized(){
	return true;
}

var prototype_mongoose=function(mongoose_instance,_currentLocale,_locales){

	function localizedAdd(obj, prefix) {
		//console.log({in:obj});
		var oobj=addI18n(this,obj,prefix);
		//console.log({out:oobj});
		ma.call(this,oobj,prefix);
	};


	if (_currentLocale) setCurrentLocale(_currentLocale);
	if (_locales) setLocales(_locales);
	if (!mongoose_instance)
		mongoose_instance=require('mongoose');

	//if (mongoose_instance.Schema.prototype.add === localizedAdd){
	if (mongoose_instance.Schema.prototype.localized === isLocalized){
		//console.log('WARN: mongoose already has been localized');
		return;
	}else{
		//console.log('INFO: mongoose will be localized');
	};

	var ma = mongoose_instance.Schema.prototype.add;
	if (mongoose_instance.Schema.prototype.localized) return;

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
							var l=currentLocale();
							if (l)
								this.set(vpath+'.'+l,value);
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

	mongoose_instance.Schema.prototype.add = localizedAdd;
	mongoose_instance.Schema.prototype.localized=isLocalized;
};

prototype_mongoose()


module.exports = {
	currentLocale:currentLocale,
	setCurrentLocale:setCurrentLocale,
	locales:function(){
		return locales;
	},
	setLocales:setLocales,
	localize:prototype_mongoose,
	localized:function(){mongoose.Schema.prototype.localized==isLocalized}
}



