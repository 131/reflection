"use strict";

var expect = require('expect.js');

var parsefunc = require('../parsefunc');


describe("Testing parsing functions", function(){

  it("Should verify nodejs function serialization", function(){

      /** ca */ function /**  cb */a/**  cd */(b, /** ce */ d)/** cf **/{ /** cg **/}
      expect(a.toString()).to.be("function a(b, /** ce */ d)/** cf **/{ /** cg **/}");
  });



  it("should reject invalid strings", function(){

    expect(function(){
        parsefunc(43)
    }).to.throwError('Invalid closure');

  });


  it("should test parsefunc args count", function(){
    function a() {};
    function b(a) {};
    function c(b, c) {};
    function d(d, e,
    f) {};
    function e(g)
    {};

    expect(Object.keys(parsefunc(a).params)).to.eql([]);
    expect(Object.keys(parsefunc(b).params)).to.eql(['a']);
    expect(Object.keys(parsefunc(c).params)).to.eql(['b', 'c']);
    expect(Object.keys(parsefunc(d).params)).to.eql(['d', 'e', 'f']);
    expect(Object.keys(parsefunc(e).params)).to.eql(['g']);

  });


  it("should test generators & ES6 classes", function(){
    function * a(a,b,c) {};

    class c {
      b(a, b) {return 42;}
    }
    var d = new c(); 

    expect(Object.keys(parsefunc(a).params)).to.eql(['a', 'b', 'c']);
    expect(Object.keys(parsefunc(d.b).params)).to.eql(['a', 'b']);

  });


  

  it("should test parsefunc name detection", function(){
    var a = function() {};
    var b = function
    () {};
    function c() {};
    function d
    () {};

    expect(parsefunc(a).name).to.be("");
    expect(parsefunc(b).name).to.be("");
    expect(parsefunc(c).name).to.be("c");
    expect(parsefunc(d).name).to.be("d");

  });


  it("should test parsefunc doc", function(){
    var a = function() /** all is fine */{};
    expect(parsefunc(a).doc.doc).to.eql([ 'all is fine ' ]);


    var a = function() /** all is
sad */{};
    expect(parsefunc(a).doc.doc).to.eql(['all is']);

  });


  it("should test parsefunc doc", function(){

    var a = function() /** this is head
* @alias foo
* @alias bar
**/{};

    var parsed = parsefunc(a).doc;

    expect(parsed.doc).to.eql(["this is head"]);
    expect(parsed.args.alias.values).to.eql([['foo'], ['bar']]);


  });



});