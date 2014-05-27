'use strict';

//var mongoose = require('mongoose');

var locales=['en','ru'];
var locale='en';

var prototype_mongoose=function(mongoose){
    var ma = mongoose.Schema.prototype.add;
    var addI18n=function(schema,obj){
        var keys = Object.keys(obj);

        if (keys.length==1 && keys=='_id') return obj;

        var ret={};

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var val = obj[key];

            if (key==='type'){
                ret[key]=val;
                continue;
            }

            if (typeof val != "object") {
                ret[key]=val;
                continue;
            };

            if (val instanceof Array) {
                ret[key]=val;
                continue;
            };

            var kkeys=Object.keys(val);
            var localize=false;
            for (var ii=0; ii<kkeys.length;++ii){
                var kkey=kkeys[ii];
                var vval=val[kkey];
                if (typeof vval==="object"){
                    val[kkey]=addI18n(schema,vval)
                }else{
                    if (vval && kkey=="localize"){
                        localize=true;
                    }
                }
            }
            if (localize){
                delete(val.localize);
                var nval={};
                for (var j=0;j<locales.length;j++){
                    nval[locales[j]]=val;// Note: must live without copy JSON.parse(JSON.stringify(va)) because of [Function];
                    //nval[locales[j]]=JSON.parse(JSON.stringify(val));
                }
                //ret['_localized_'+key]=nval;
                ret[key]=nval;
                schema.virtual('localized.'+key)
                    .get(function(value,virtual){
                        var n=virtual.path.substring(10);
                        return this[n][locale];
                    })/*
                    .set(function(value,virtual){
                        var n=virtual.path.substring(10);
                        this[n]=value;
                    });*/
            }else{
                ret[key]=val;
            }
        };
        return ret;
    }

    mongoose.Schema.prototype.add = function add (obj, prefix) {
        var oobj=addI18n(this,obj);
        ma.call(this,oobj,prefix);
    };
};

var localize=module.exports = function(mongoose,opt){
    if (opt){
        if (opt.locales) locales=opt.locales;
        if (opt.locale) locale=opt.locale;
    }
    prototype_mongoose(mongoose);
    return {}
}
localize.locale=function(){
    return locale;
}
localize.setLocale=function(sLocale){
    locale=sLocale;
}
localize.locales=function(){
    return locales;
}
localize.setLocales=function(sLocales){
    locales=sLocales;
}

