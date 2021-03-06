"use strict";

const splitArgs = require('nyks/process/splitArgs');

const argMatch  = new RegExp("^@([a-z_][0-9a-z_-]+)(.*)");

function arg(str) {
  var out = argMatch.exec(str);

  if(!out)
    return false;

  return {
    key  : out[1],
    body : splitArgs(out[2])
  };
}



module.exports = arg;
