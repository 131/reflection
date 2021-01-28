"use strict";

const parsearg   = require('./parsearg');
const stripEnd   = require('nyks/string/stripEnd');
const stripStart = require('nyks/string/stripStart');

const lineSplitter = new RegExp("^\\s*\\* ?(.+)\\s*", "mg");



function parse(str) {
  if(!str)
    return false;

  //unix style LF
  str = str.replace("\r\n", "\n").trim();
  str = stripEnd(stripStart(str, "/*"), "*/");

  var args = {}, doc = [], line, tmp;
  while((line = lineSplitter.exec(str))) {

    if((tmp = parsearg(line[1]))) {
      if(!args[tmp.key])
        args[tmp.key] = {computed : null, values : [] };

      args[tmp.key]['values'].push(tmp.body);
      args[tmp.key]['computed'] = tmp.body;
    } else {doc.push(line[1]);}
  }

  return {
    args : args,
    doc  : doc,
  };
}


module.exports = parse;
