mongoose-localize
=================

A nodejs module to convert mongoose model property to set of localized properties.

As soon as mongoose_localize has been required...

```javascript
import mongoose_localize from 'mongoose-localize';
mongoose_localize.setLocales(['locale1','locale2',...,'localeN']);
```

...every attribute of mongoose Scheme containing  "localize" attribute set to true...

```javascript
approverSchema = new mongoose.Schema({
	name: {
		type:String,
		localize: true
	}
});
```

...will be treated as if it would be 
```javascript
approverSchema = new mongoose.Schema({
	name: {
		locale1: {type:String},
		locale2: {type:String},
    ...
    localeN: {type:String},
	}
});
approverSchema.virtual('name._').get(function () {
// return name in the current locale
  ...
}).set(function (v) {
// set name of the current locale to v
  ...
})
;
```

While the module must be required and setLocales must be called before the first Schema added the current locale may be set and changed in any moment. 

```javascript
mongoose_localize.setCurrenLocale('locale2');
```

Locales and current locales may be retrieved with 

```javascript
mongoose_localize.locales();
mongoose_localize.currentLocale();
```

