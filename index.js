'use strict';

var mongoose = require('mongoose');

var locales=['en','ru'];

(function(){
    var ma = mongoose.Schema.prototype.add;
    var addI18n=function(obj){
        var keys = Object.keys(obj);
        var ret={};

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var val = obj[key];

            if (typeof val != "object") {
                ret[key]=val;
                continue;
            };

            var kkeys=Object.keys(val);
            var localize=false;
            for (var ii=0; ii<kkeys.length;++ii){
                var kkey=kkeys[ii];
                var vval=val[kkey];
                if (typeof vval=="object"){
                    val[kkey]=addI18n(vval)
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
                    nval[locales[j]]=val;// TODO: let's try to live without copy JSON.parse(JSON.stringify(va));
                }
                ret[key]=nval;
            }else{
                ret[key]=val;
            }
        };
        return ret;
    }
    mongoose.Schema.prototype.add = function add (obj, prefix) {
        ma.call(this,addI18n(obj),prefix);
    };
})();

var localize=module.exports = function(opt){
    return {

    }
}
localize.locales=function(){
    return locales;
}