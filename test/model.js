'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    localize = require('mongoose-localize');
//    Application = mongoose.model('Application');

var TestSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'test',
        trim: true,
        localize: false
    }
});
mongoose.model('Test', TestSchema);
var Test=mongoose.model('Test');

var TestLSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'testl',
        trim: true,
        localize: true
    }
});
mongoose.model('TestL', TestLSchema);
var TestL=mongoose.model('TestL');

//The tests
describe('<Mongoose Localize Test>', function() {

        describe('Test Schema Available', function() {
            var t=new Test();
            it('non localized should have name="test" by default', function(done) {
                t.should.have.property('name','test');
                done();
            });
        });
    describe('Localized Test Schema Available', function() {
        var tl=new TestL();
        console.log(tl);
        it('localized should have property name', function(done) {
            tl.should.have.property('name');
            done();
        });
    });
/*
        describe('Method Save', function() {
            it('should begin without the test user', function(done) {
                Application.find({ name: 'Some name' }, function(err, applications) {
                    applications.should.have.length(0);
                    done();
                });
            });

            it('should be able to save without problems', function(done) {
                application.save(done);
            });
        });
*/

});
