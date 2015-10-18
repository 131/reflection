# Reflection / parsefunc is a reflection API for nodejs


# Motivation
This is a very simple reflection API for javascript functions build on esprima.


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
```

## Non working patterns
```
/**
* Invalid comment declaration
* No way for esprima to link the comment and the function
*/
foo.prototype.bar = function(){


}

//nodejs prime' style 
prime({

/**
* This comment cannot be link to the following function
*/
  bar : function(){

  }
});
```


# Esprima and comment parsing
  TODO : use esprima for 

