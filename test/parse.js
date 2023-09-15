"use strict";
/*eslint no-unused-vars: 0*/

const expect = require('expect.js');
const parsefunc = require('../parsefunc');


describe("Testing parsing functions", function() {

  let [major] = process.versions.node.split('.');
  it(`Should verify nodejs (v${major}) function serialization`, function() {

    /** ca */ function /**  cb */a/**  cd */(b, /** ce */ d)/** cf **/ { /** cg **/}

    let after8 = "function /**  cb */a/**  cd */(b, /** ce */ d)/** cf **/ { /** cg **/}";
    let to8    = "function a(b, /** ce */ d)/** cf **/ { /** cg **/}";

    expect(a.toString()).to.be(major > 8 ? after8 : to8);
  });

  it("should reject invalid strings", function() {

    expect(function() {
      parsefunc(43);
    }).to.throwError('Invalid closure');

  });


  it("should test parsefunc args count", function() {
    function a() {}
    function b(a) {}
    function c(b, c) {}
    function d(d, e,
      f) {}
    function e(g)
    {}
    function f(a, ...b) {}

    expect(Object.keys(parsefunc(a).params)).to.eql([]);
    expect(Object.keys(parsefunc(b).params)).to.eql(['a']);
    expect(Object.keys(parsefunc(c).params)).to.eql(['b', 'c']);
    expect(Object.keys(parsefunc(d).params)).to.eql(['d', 'e', 'f']);
    expect(Object.keys(parsefunc(e).params)).to.eql(['g']);
    expect(Object.keys(parsefunc(f).params)).to.eql(['a', 'b']);

  });



  it("should test generators & ES6 classes", function() {
    function        * a(a, b, c) {}

    class A { }

    class C extends A {
      constructor(a, b, c) {
        super();
      }

      b(a, b) {
        super.b();
        return 42;
      }
    }
    var d = new C();

    expect(Object.keys(parsefunc(a).params)).to.eql(['a', 'b', 'c']);
    expect(Object.keys(parsefunc(d.b).params)).to.eql(['a', 'b']);


    expect(function() {
      parsefunc(C);
    }).to.throwError(/Invalid closure, no support for class/);

    expect(function() {
      parsefunc(class{});
    }).to.throwError(/Invalid closure, no support for class/);


    expect(function() {
      parsefunc(d);
    }).to.throwError(/Invalid closure type/);


  });


  it("should test async functions", function() {
    async function a(a, b, c) {}

    class D {
      async b(a, b) {return 42;}
    }
    var e = new D();

    expect(Object.keys(parsefunc(a).params)).to.eql(['a', 'b', 'c']);
    expect(Object.keys(parsefunc(e.b).params)).to.eql(['a', 'b']);

  });

  it("should test native ", function() {

    var e = Function.prototype;

    expect(Object.keys(parsefunc(e).params)).to.eql([]);
  });


  it("should test optional args ", function() {


    class D {
      async b(a, b, c = 1, d = [1, 2, 3]) {
        return 42;
      }
    }
    var e = new D();

    expect(parsefunc(e.b).params).to.eql({
      a : {},
      b : {},
      c : { optional : true, value : 1 },
      d : { optional : true, value : undefined} // complex values cannot be serialized
    });

  });


  it("should complex args", function() {
    function b({a}, entrypoint = "hi") {}

    expect(Object.keys(parsefunc(b).params)).to.eql(['', 'entrypoint']);
  });




  it("should test parsefunc name detection", function() {
    function c() {}
    function d() {}

    expect(parsefunc(c).name).to.be("c");
    expect(parsefunc(d).name).to.be("d");

  });

  it("should test parsefunc doc", function() {

    var a = function() /** all is fine */{};
    expect(parsefunc(a).doc).to.eql(['all is fine']);


    a = function() /** all is
sad */{};

    expect(parsefunc(a).doc).to.eql(['all is']);



    a = function(name, age) /**
 * @param {string} [name=martin] - name to greet with
 * @param {number} [age=10] - age to greet with
 */ {};

    expect(parsefunc(a).doc).to.eql([]);
    expect(Object.keys(parsefunc(a).params)).to.eql(["name", "age"]);


  });



  it("should test parsefunc doc w/alias", function() {

    var a = function() /** this is head
* @alias foo
* @alias bar
* @alias ?
**/{};

    var parsed = parsefunc(a);

    expect(parsed.doc).to.eql(["this is head"]);
    expect(parsed.blocs.alias.values).to.eql([['foo'], ['bar'], ['?']]);


  });




  it("should test parsefunc args (jsdoc syntax)", function() {

    var a = function(name, big, age) /** this is head
* @param {string} name
* @param {boolean} [big=false]
* @param {number} [age=42] - captain age
**/{};

    var parsed = parsefunc(a);

    expect(parsed.params['name']).to.eql({
      type : 'string',
      descr : '',
      optional : false,
      value : undefined,
    });

    expect(parsed.params['big']).to.eql({
      type : 'boolean',
      descr : '',
      optional : true,
      value : false,
    });

    expect(typeof parsed.params['age'].value).to.be("number");

    expect(parsed.params['age']).to.eql({
      type : 'number',
      descr : 'captain age',
      optional : true,
      value : 42,
    });


  });




});
