"use strict";

const parsefunc = require('reflection-js/parsefunc');
var heavyComputation = function (a, b = 1) /**
* This function computer bar
* @param {string} a Initial rotation speed
* @param {string} [b=1] this is foo
*/ {
  return a + b;
};

console.log(JSON.stringify(parsefunc(heavyComputation), null, 2));
