'use strict';

/**
 * Module dependencies.
 */
var chai = require('chai'),
		mongoose = require('mongoose'),
    localize = require('../index');

var assert=chai.assert;
it('Test set/get locales',function(){
	localize.setLocales(['letter','digit']);
	assert.equal(localize.locales().length,2,'by default there are 2 locales');
	assert.equal(localize.locales()[0],'letter','check 1st locale');
	assert.equal(localize.locales()[1],'digit','check 2nd locale');
})

it('Test set/get current locale',function(){
	localize.setCurrentLocale('xxx');
	assert.equal(localize.currentLocale(),'xxx');
	localize.setCurrentLocale('digit');
	assert.equal(localize.currentLocale(),'digit');
	localize.setCurrentLocale(false);
	assert.equal(localize.currentLocale(),'letter');
	localize.setCurrentLocale('letter');
	assert.equal(localize.currentLocale(),'letter');
})

/*
it('Test simple model localizations', function() {

	var TestSchema = new mongoose.Schema({
		_id:mongoose.Schema.ObjectId,
		name: {
			type: String,
			localize: false
		}
	});
	assert.equal(TestSchema.path('name').instance,'String','with localization=false the type should stay "String"');

	var TestLSchema = new mongoose.Schema({
		_id:mongoose.Schema.ObjectId,
		name: {
			type: String,
			localize: true
		},
	});

	//console.log(TestLSchema);
	assert.isDefined(TestLSchema.path('name.letter'),'"letter" locale exist');
	assert.isDefined(TestLSchema.path('name.digit'),'"digit" locale exist');
	assert.isDefined(TestLSchema.virtuals['name._']);

	mongoose.model('TestL', TestLSchema);
	var TestLModel=mongoose.model('TestL');
	var testL=new TestLModel({name:{letter:'a',digit:'1'}});
	assert.equal(testL.name.digit,1);
	assert.equal(testL.name.letter,'a');
	localize.setCurrentLocale('letter');
	assert.equal(testL.name._,'a');
	localize.setCurrentLocale('digit');
	assert.equal(testL.name._,1);
	localize.setCurrentLocale(false);
	assert.equal(testL.name._,'a');
});
*/
it('Test sub-document localizations', function() {

	var TestLSchema = new mongoose.Schema({
		_id:mongoose.Schema.ObjectId,
		name: {
			type: String,
			localize: true
		},
		sub: {
			name: {
				type: String,
				localize: true
			}
		}
	});

	//console.log(TestLSchema);
	assert.isDefined(TestLSchema.path('name.letter'),'"letter" locale exists in document');
	assert.isDefined(TestLSchema.path('name.digit'),'"digit" locale exists in ducument');
	assert.isDefined(TestLSchema.virtuals['name._'],'name._ exists in document');

	assert.isDefined(TestLSchema.path('sub.name.letter'),'"letter" locale exist in subdocument');
	assert.isDefined(TestLSchema.path('sub.name.digit'),'"digit" locale exists in subdocument');
	assert.isDefined(TestLSchema.virtuals['sub.name._'],'name._ exists in subdocument]');

	mongoose.model('TestL', TestLSchema);
	var TestLModel=mongoose.model('TestL');
	var testL=new TestLModel({name:{letter:'a',digit:'1'},sub:{name:{letter:'b',digit:2}}});
	//console.log(testL);

	assert.equal(testL.name.digit,1,'document digit=1');
	assert.equal(testL.name.letter,'a','docuemnt letter=a');
	localize.setCurrentLocale('letter');
	assert.equal(testL.name._,'a','document name in current locale should be "a"');
	localize.setCurrentLocale('digit');
	assert.equal(testL.name._,1);
	localize.setCurrentLocale(false);
	assert.equal(testL.name._,'a');

	assert.equal(testL.sub.name.digit,2);
	assert.equal(testL.sub.name.letter,'b');
	localize.setCurrentLocale('letter');
	assert.equal(testL.sub.name._,'b');
	localize.setCurrentLocale('digit');
	assert.equal(testL.sub.name._,2);
	localize.setCurrentLocale(false);
	assert.equal(testL.sub.name._,'b');
});
