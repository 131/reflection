"use strict";

const parsearg   = require('./parsearg');
const stripEnd   = require('nyks/string/stripEnd');
const stripStart = require('nyks/string/stripStart');

const lineSplitter = new RegExp(/^\s*\*[ \t]*([^\n]+)\s*$/, "mg");



function parse(str) {
  var blocs = {}, doc = [];

  if(!str)
    return {blocs, doc};

  //unix style LF
  str = str.replace("\r\n", "\n").trim();
  str = stripEnd(stripStart(str, "/*"), "*/");

  let line, tmp;
  while((line = lineSplitter.exec(str))) {

    if((tmp = parsearg(line[1]))) {
      if(!blocs[tmp.key])
        blocs[tmp.key] = {computed : null, values : [] };

      blocs[tmp.key]['values'].push(tmp.body);
      blocs[tmp.key]['computed'] = tmp.body;
    } else {doc.push(line[1]);}
  }

  return {blocs, doc};
}


module.exports = parse;
