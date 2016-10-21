"use strict";

var filter   = require('mout/array/filter');
var combine  = require('nyks/object/combine');
var trim     = require('mout/string/trim');
var ltrim    = require('mout/string/ltrim');
var get      = require('mout/object/get');
var parsedoc = require('../lib/parsedoc');

var argsSplitter = new RegExp("^(?:function)?\\*?\\s*(\\S*)\\(([\\s\\S]*?)\\)\\s*(/\\*[\\s\\S]*?\\*/)?\\s*{");



module.exports = function(fn){

    var body = fn.toString(), params = {}, comment;

    if(!argsSplitter.test(body))
      throw Error("Invalid closure");

    var q = argsSplitter.exec(body);
    var paramsName = filter(q[2].split(/[,\s]+/));
    var doc = q[3], parseddoc = parsedoc(doc);
    var paramsDoc = {};

    (get(parseddoc, 'args.param.values') || []).forEach(function(line) {
      var type = trim(line.shift(), ['{', '}']);
      var name = line.shift();
      var descr = trim(ltrim(line.join(" "), "-"));
      var optional = name[0] == "[";
      var value;
      if(optional) {
        name = trim(name, ["[", "]"]);
        let tmp = name.split("=", 2);
        name = tmp[0]; value = tmp[1];
      }

      if(value !== undefined && type == "boolean")
        value = !! (value && value != "false"); // && value != "f"
      if(value !== undefined && type == "number")
        value = Number(value);

      paramsDoc[name] = {type : type, descr : descr, value : value, optional : optional};
    });

    paramsName.forEach( function (name) {
      params[name] = paramsDoc[name] || {};
    });

    var res = {
      name   : q[1],
      params : params,
      doc    : parseddoc,
      rawdoc : doc,
    };

    return res;
}
