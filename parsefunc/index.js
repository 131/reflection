"use strict";

const acorn  = require('acorn');

const trim     = require('mout/string/trim');
const ltrim    = require('mout/string/ltrim');
const get      = require('mout/object/get');
const parsedoc = require('../lib/parsedoc');


/*
* Parse input function with heredoc parameter syntax (if any)
*/


module.exports = function(fn) {
  var body = fn.toString(),
    name = fn.name;

  let params = {}, comments = [], tokens = [], parsed;

  body = body.replace(/^.*?\(/, 'async function * abb(');
  body = body.replace(/\{\s+\[native code\]\s+\}$/, '{}');
  body = body.replace(/super\.?/, '');

  try {
    parsed = acorn.parse(body, {onComment : comments, ecmaVersion : '2020', onToken : tokens});
    parsed = parsed.body[0];
  } catch(err) { }

  if(!parsed || parsed.type != "FunctionDeclaration")
    throw `Invalid closure expression '${body}'`;

  // main func comment is between the end token of parameters and start bloc of the
  // fn () /** here **/ {
  let bloc = tokens.indexOf(tokens.find(token => token.start == parsed.body.start));
  let start = tokens[bloc - 1].end, end = parsed.body.start;
  let jsdoc = (comments.find(bloc => bloc.start >= start && bloc.end <= end) || {}).value || "";

  var {blocs, doc} = parsedoc(jsdoc);
  var paramsDoc = {};


  (get(blocs, 'param.values') || []).forEach(function(line) {
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
      value = !!(value && value != "false"); // && value != "f"
    if(value !== undefined && type == "number")
      value = Number(value);

    paramsDoc[name] = {type, descr, value, optional};
  });

  for(var arg of parsed.params) {
    if(arg.type == "Identifier")
      params[arg.name] = paramsDoc[arg.name] || {};
    if(arg.type == "AssignmentPattern") {
      let value =  (arg.right.type == "Literal") ? arg.right.value : undefined;
      params[arg.left.name] = paramsDoc[arg.left.name] || {optional : true, value};
    }
  }

  return {name, params, blocs, doc, jsdoc};
};
