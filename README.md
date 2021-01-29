# Reflection / parsefunc is a reflection API for nodejs

[![Build Status](https://travis-ci.com/131/reflection.svg?branch=master)](https://travis-ci.com/131/reflection)
[![Coverage Status](https://coveralls.io/repos/github/131/reflection/badge.svg?branch=master)](https://coveralls.io/github/131/reflection?branch=master)
[![NPM version](https://img.shields.io/npm/v/reflection-js.svg)](https://www.npmjs.com/package/reflection-js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

# Motivation
This is a very simple reflection API for javascript functions build on [acorn](https://www.npmjs.com/package/acorn).  [reflection-js](https://github.com/131/reflection) is mostly designed to fit [cnyks](https://github.com/131/reflection)'s needs.


# Usage
```
const parsefunc = require('reflection-js/parsefunc');
var heavyComputation = function (a, b = 1) /**
* This function computer bar
* @param {string} a Initial rotation speed
* @param {string} [b=1] this is foo
*/ {
  return a + b;
};


console.log(parsefunc(heavyComputation));

{
  "name": "heavyComputation",
  "params": {
    "a": {
      "type": "string",
      "descr": "Initial rotation speed",
      "optional": false
    },
    "b": {
      "type": "string",
      "descr": "this is foo",
      "value": "1",
      "optional": true
    }
  },
  "blocs": // all parsed @sections
  "doc": [
    "This function computer bar"
  ],
  "jsdoc": // raw comment string
}
```

# PHPdoc/JSdoc
PHPdoc is part of PHP reflection API, that is, function described with this syntax can access their own comment.
There is no standard way to attach a comment to a function in javascript.
Esprima provide a way to parse the AST (and to retrieve comment) but we need a little more.

... enter the JSdoc syntax !


# Attach a JSdoc to a javascript function
## JSdoc pattern

```
foo.prototype.bar = function() /**
* This comment is valid and can describe the function behavior
* This syntax allow reflection API to work, as the comment will be serialized in the function body
*/ {
  return 43;
}


class Bar {
  async static bar() /**
  * This comment is valid and can describe the function behavior
  * This syntax allow reflection API to work, as the comment will be serialized in the function body
  */ {
    return 43;
  }

}
```


# Credits 
* [131](https://github.com/131)




