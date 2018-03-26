/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 2.6.4
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Wed Feb 07 2018 22:59:25 GMT+0100 (Mitteleuropäische Zeit)
*/;
(function(root, factory) {
  /* istanbul ignore next */
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){
      return factory(root, root.document)
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === 'object') {
    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
  } else {
    root.SVG = factory(root, root.document)
  }
}(typeof window !== "undefined" ? window : this, function(window, document) {

// The main wrapping element
var SVG = this.SVG = function(element) {
  if (SVG.supported) {
    element = new SVG.Doc(element)

    if(!SVG.parser.draw)
      SVG.prepare()

    return element
  }
}

// Default namespaces
SVG.ns    = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'
SVG.svgjs = 'http://svgjs.com/svgjs'

// Svg support test
SVG.supported = (function() {
  return !! document.createElementNS &&
         !! document.createElementNS(SVG.ns,'svg').createSVGRect
})()

// Don't bother to continue if SVG is not supported
if (!SVG.supported) return false

// Element id sequence
SVG.did  = 1000

// Get next named element id
SVG.eid = function(name) {
  return 'Svgjs' + capitalize(name) + (SVG.did++)
}

// Method for element creation
SVG.create = function(name) {
  // create element
  var element = document.createElementNS(this.ns, name)

  // apply unique id
  element.setAttribute('id', this.eid(name))

  return element
}

// Method for extending objects
SVG.extend = function() {
  var modules, methods, key, i

  // Get list of modules
  modules = [].slice.call(arguments)

  // Get object with extensions
  methods = modules.pop()

  for (i = modules.length - 1; i >= 0; i--)
    if (modules[i])
      for (key in methods)
        modules[i].prototype[key] = methods[key]

  // Make sure SVG.Set inherits any newly added methods
  if (SVG.Set && SVG.Set.inherit)
    SVG.Set.inherit()
}

// Invent new element
SVG.invent = function(config) {
  // Create element initializer
  var initializer = typeof config.create == 'function' ?
    config.create :
    function() {
      this.constructor.call(this, SVG.create(config.create))
    }

  // Inherit prototype
  if (config.inherit)
    initializer.prototype = new config.inherit

  // Extend with methods
  if (config.extend)
    SVG.extend(initializer, config.extend)

  // Attach construct method to parent
  if (config.construct)
    SVG.extend(config.parent || SVG.Container, config.construct)

  return initializer
}

// Adopt existing svg elements
SVG.adopt = function(node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance) return node.instance

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName == 'svg')
    element = node.parentNode instanceof window.SVGElement ? new SVG.Nested : new SVG.Doc
  else if (node.nodeName == 'linearGradient')
    element = new SVG.Gradient('linear')
  else if (node.nodeName == 'radialGradient')
    element = new SVG.Gradient('radial')
  else if (SVG[capitalize(node.nodeName)])
    element = new SVG[capitalize(node.nodeName)]
  else
    element = new SVG.Element(node)

  // ensure references
  element.type  = node.nodeName
  element.node  = node
  node.instance = element

  // SVG.Class specific preparations
  if (element instanceof SVG.Doc)
    element.namespace().defs()

  // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
  element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})

  return element
}

// Initialize parsing element
SVG.prepare = function() {
  // Select document body and create invisible svg element
  var body = document.getElementsByTagName('body')[0]
    , draw = (body ? new SVG.Doc(body) : SVG.adopt(document.documentElement).nested()).size(2, 0)

  // Create parser object
  SVG.parser = {
    body: body || document.documentElement
  , draw: draw.style('opacity:0;position:absolute;left:-100%;top:-100%;overflow:hidden').node
  , poly: draw.polyline().node
  , path: draw.path().node
  , native: SVG.create('svg')
  }
}

SVG.parser = {
  native: SVG.create('svg')
}

document.addEventListener('DOMContentLoaded', function() {
  if(!SVG.parser.draw)
    SVG.prepare()
}, false)

// Storage for regular expressions
SVG.regex = {
  // Parse unit value
  numberAndUnit:    /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

  // Parse hex value
, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

  // Parse rgb value
, rgb:              /rgb\((\d+),(\d+),(\d+)\)/

  // Parse reference id
, reference:        /#([a-z0-9\-_]+)/i

  // splits a transformation chain
, transforms:       /\)\s*,?\s*/

  // Whitespace
, whitespace:       /\s/g

  // Test hex value
, isHex:            /^#[a-f0-9]{3,6}$/i

  // Test rgb value
, isRgb:            /^rgb\(/

  // Test css declaration
, isCss:            /[^:]+:[^;]+;?/

  // Test for blank string
, isBlank:          /^(\s+)?$/

  // Test for numeric string
, isNumber:         /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

  // Test for percent value
, isPercent:        /^-?[\d\.]+%$/

  // Test for image url
, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

  // split at whitespace and comma
, delimiter:        /[\s,]+/

  // The following regex are used to parse the d attribute of a path

  // Matches all hyphens which are not after an exponent
, hyphen:           /([^e])\-/gi

  // Replaces and tests for all path letters
, pathLetters:      /[MLHVCSQTAZ]/gi

  // yes we need this one, too
, isPathLetter:     /[MLHVCSQTAZ]/i

  // matches 0.154.23.45
, numbersWithDots:  /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi

  // matches .
, dots:             /\./g
}

SVG.utils = {
  // Map function
  map: function(array, block) {
    var i
      , il = array.length
      , result = []

    for (i = 0; i < il; i++)
      result.push(block(array[i]))

    return result
  }

  // Filter function
, filter: function(array, block) {
    var i
      , il = array.length
      , result = []

    for (i = 0; i < il; i++)
      if (block(array[i]))
        result.push(array[i])

    return result
  }

  // Degrees to radians
, radians: function(d) {
    return d % 360 * Math.PI / 180
  }

  // Radians to degrees
, degrees: function(r) {
    return r * 180 / Math.PI % 360
  }

, filterSVGElements: function(nodes) {
    return this.filter( nodes, function(el) { return el instanceof window.SVGElement })
  }

}

SVG.defaults = {
  // Default attribute values
  attrs: {
    // fill and stroke
    'fill-opacity':     1
  , 'stroke-opacity':   1
  , 'stroke-width':     0
  , 'stroke-linejoin':  'miter'
  , 'stroke-linecap':   'butt'
  , fill:               '#000000'
  , stroke:             '#000000'
  , opacity:            1
    // position
  , x:                  0
  , y:                  0
  , cx:                 0
  , cy:                 0
    // size
  , width:              0
  , height:             0
    // radius
  , r:                  0
  , rx:                 0
  , ry:                 0
    // gradient
  , offset:             0
  , 'stop-opacity':     1
  , 'stop-color':       '#000000'
    // text
  , 'font-size':        16
  , 'font-family':      'Helvetica, Arial, sans-serif'
  , 'text-anchor':      'start'
  }

}
// Module for color convertions
SVG.Color = function(color) {
  var match

  // initialize defaults
  this.r = 0
  this.g = 0
  this.b = 0

  if(!color) return

  // parse color
  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test(color)) {
      // get rgb values
      match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace,''))

      // parse numeric values
      this.r = parseInt(match[1])
      this.g = parseInt(match[2])
      this.b = parseInt(match[3])

    } else if (SVG.regex.isHex.test(color)) {
      // get hex values
      match = SVG.regex.hex.exec(fullHex(color))

      // parse numeric values
      this.r = parseInt(match[1], 16)
      this.g = parseInt(match[2], 16)
      this.b = parseInt(match[3], 16)

    }

  } else if (typeof color === 'object') {
    this.r = color.r
    this.g = color.g
    this.b = color.b

  }

}

SVG.extend(SVG.Color, {
  // Default to hex conversion
  toString: function() {
    return this.toHex()
  }
  // Build hex value
, toHex: function() {
    return '#'
      + compToHex(this.r)
      + compToHex(this.g)
      + compToHex(this.b)
  }
  // Build rgb value
, toRgb: function() {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
  }
  // Calculate true brightness
, brightness: function() {
    return (this.r / 255 * 0.30)
         + (this.g / 255 * 0.59)
         + (this.b / 255 * 0.11)
  }
  // Make color morphable
, morph: function(color) {
    this.destination = new SVG.Color(color)

    return this
  }
  // Get morphed color at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // normalise pos
    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

    // generate morphed color
    return new SVG.Color({
      r: ~~(this.r + (this.destination.r - this.r) * pos)
    , g: ~~(this.g + (this.destination.g - this.g) * pos)
    , b: ~~(this.b + (this.destination.b - this.b) * pos)
    })
  }

})

// Testers

// Test if given value is a color string
SVG.Color.test = function(color) {
  color += ''
  return SVG.regex.isHex.test(color)
      || SVG.regex.isRgb.test(color)
}

// Test if given value is a rgb object
SVG.Color.isRgb = function(color) {
  return color && typeof color.r == 'number'
               && typeof color.g == 'number'
               && typeof color.b == 'number'
}

// Test if given value is a color
SVG.Color.isColor = function(color) {
  return SVG.Color.isRgb(color) || SVG.Color.test(color)
}
// Module for array conversion
SVG.Array = function(array, fallback) {
  array = (array || []).valueOf()

  // if array is empty and fallback is provided, use fallback
  if (array.length == 0 && fallback)
    array = fallback.valueOf()

  // parse array
  this.value = this.parse(array)
}

SVG.extend(SVG.Array, {
  // Make array morphable
  morph: function(array) {
    this.destination = this.parse(array)

    // normalize length of arrays
    if (this.value.length != this.destination.length) {
      var lastValue       = this.value[this.value.length - 1]
        , lastDestination = this.destination[this.destination.length - 1]

      while(this.value.length > this.destination.length)
        this.destination.push(lastDestination)
      while(this.value.length < this.destination.length)
        this.value.push(lastValue)
    }

    return this
  }
  // Clean up any duplicate points
, settle: function() {
    // find all unique values
    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
      if (seen.indexOf(this.value[i]) == -1)
        seen.push(this.value[i])

    // set new value
    return this.value = seen
  }
  // Get morphed array at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed array
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

    return new SVG.Array(array)
  }
  // Convert array to string
, toString: function() {
    return this.value.join(' ')
  }
  // Real value
, valueOf: function() {
    return this.value
  }
  // Parse whitespace separated string
, parse: function(array) {
    array = array.valueOf()

    // if already is an array, no need to parse it
    if (Array.isArray(array)) return array

    return this.split(array)
  }
  // Strip unnecessary whitespace
, split: function(string) {
    return string.trim().split(SVG.regex.delimiter).map(parseFloat)
  }
  // Reverse array
, reverse: function() {
    this.value.reverse()

    return this
  }
, clone: function() {
    var clone = new this.constructor()
    clone.value = array_clone(this.value)
    return clone
  }
})
// Poly points array
SVG.PointArray = function(array, fallback) {
  SVG.Array.call(this, array, fallback || [[0,0]])
}

// Inherit from SVG.Array
SVG.PointArray.prototype = new SVG.Array
SVG.PointArray.prototype.constructor = SVG.PointArray

SVG.extend(SVG.PointArray, {
  // Convert array to string
  toString: function() {
    // convert to a poly point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i].join(','))

    return array.join(' ')
  }
  // Convert array to line object
, toLine: function() {
    return {
      x1: this.value[0][0]
    , y1: this.value[0][1]
    , x2: this.value[1][0]
    , y2: this.value[1][1]
    }
  }
  // Get morphed array at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push([
        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
      ])

    return new SVG.PointArray(array)
  }
  // Parse point string and flat array
, parse: function(array) {
    var points = []

    array = array.valueOf()

    // if it is an array
    if (Array.isArray(array)) {
      // and it is not flat, there is no need to parse it
      if(Array.isArray(array[0])) {
        return array
      }
    } else { // Else, it is considered as a string
      // parse points
      array = array.trim().split(SVG.regex.delimiter).map(parseFloat)
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop()

    // wrap points in two-tuples and parse points as floats
    for(var i = 0, len = array.length; i < len; i = i + 2)
      points.push([ array[i], array[i+1] ])

    return points
  }
  // Move point string
, move: function(x, y) {
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    // move every point
    if (!isNaN(x) && !isNaN(y))
      for (var i = this.value.length - 1; i >= 0; i--)
        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

    return this
  }
  // Resize poly string
, size: function(width, height) {
    var i, box = this.bbox()

    // recalculate position of all points according to new size
    for (i = this.value.length - 1; i >= 0; i--) {
      if(box.width) this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
      if(box.height) this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
    }

    return this
  }
  // Get bounding box of points
, bbox: function() {
    SVG.parser.poly.setAttribute('points', this.toString())

    return SVG.parser.poly.getBBox()
  }
})

var pathHandlers = {
  M: function(c, p, p0) {
    p.x = p0.x = c[0]
    p.y = p0.y = c[1]

    return ['M', p.x, p.y]
  },
  L: function(c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['L', c[0], c[1]]
  },
  H: function(c, p) {
    p.x = c[0]
    return ['H', c[0]]
  },
  V: function(c, p) {
    p.y = c[0]
    return ['V', c[0]]
  },
  C: function(c, p) {
    p.x = c[4]
    p.y = c[5]
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
  },
  S: function(c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['S', c[0], c[1], c[2], c[3]]
  },
  Q: function(c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['Q', c[0], c[1], c[2], c[3]]
  },
  T: function(c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['T', c[0], c[1]]
  },
  Z: function(c, p, p0) {
    p.x = p0.x
    p.y = p0.y
    return ['Z']
  },
  A: function(c, p) {
    p.x = c[5]
    p.y = c[6]
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
  }
}

var mlhvqtcsa = 'mlhvqtcsaz'.split('')

for(var i = 0, il = mlhvqtcsa.length; i < il; ++i){
  pathHandlers[mlhvqtcsa[i]] = (function(i){
    return function(c, p, p0) {
      if(i == 'H') c[0] = c[0] + p.x
      else if(i == 'V') c[0] = c[0] + p.y
      else if(i == 'A'){
        c[5] = c[5] + p.x,
        c[6] = c[6] + p.y
      }
      else
        for(var j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j%2 ? p.y : p.x)
        }

      return pathHandlers[i](c, p, p0)
    }
  })(mlhvqtcsa[i].toUpperCase())
}

// Path points array
SVG.PathArray = function(array, fallback) {
  SVG.Array.call(this, array, fallback || [['M', 0, 0]])
}

// Inherit from SVG.Array
SVG.PathArray.prototype = new SVG.Array
SVG.PathArray.prototype.constructor = SVG.PathArray

SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function() {
    return arrayToString(this.value)
  }
  // Move path string
, move: function(x, y) {
    // get bounding box of current situation
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (var l, i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]

        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] += x
          this.value[i][2] += y

        } else if (l == 'H')  {
          this.value[i][1] += x

        } else if (l == 'V')  {
          this.value[i][1] += y

        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] += x
          this.value[i][2] += y
          this.value[i][3] += x
          this.value[i][4] += y

          if (l == 'C')  {
            this.value[i][5] += x
            this.value[i][6] += y
          }

        } else if (l == 'A')  {
          this.value[i][6] += x
          this.value[i][7] += y
        }

      }
    }

    return this
  }
  // Resize path string
, size: function(width, height) {
    // get bounding box of current situation
    var i, l, box = this.bbox()

    // recalculate position of all points according to new size
    for (i = this.value.length - 1; i >= 0; i--) {
      l = this.value[i][0]

      if (l == 'M' || l == 'L' || l == 'T')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y

      } else if (l == 'H')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x

      } else if (l == 'V')  {
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y

      } else if (l == 'C' || l == 'S' || l == 'Q')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

        if (l == 'C')  {
          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
        }

      } else if (l == 'A')  {
        // resize radii
        this.value[i][1] = (this.value[i][1] * width)  / box.width
        this.value[i][2] = (this.value[i][2] * height) / box.height

        // move position values
        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
      }

    }

    return this
  }
  // Test if the passed path array use the same path data commands as this path array
, equalCommands: function(pathArray) {
    var i, il, equalCommands

    pathArray = new SVG.PathArray(pathArray)

    equalCommands = this.value.length === pathArray.value.length
    for(i = 0, il = this.value.length; equalCommands && i < il; i++) {
      equalCommands = this.value[i][0] === pathArray.value[i][0]
    }

    return equalCommands
  }
  // Make path array morphable
, morph: function(pathArray) {
    pathArray = new SVG.PathArray(pathArray)

    if(this.equalCommands(pathArray)) {
      this.destination = pathArray
    } else {
      this.destination = null
    }

    return this
  }
  // Get morphed path array at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    var sourceArray = this.value
      , destinationArray = this.destination.value
      , array = [], pathArray = new SVG.PathArray()
      , i, il, j, jl

    // Animate has specified in the SVG spec
    // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
    for (i = 0, il = sourceArray.length; i < il; i++) {
      array[i] = [sourceArray[i][0]]
      for(j = 1, jl = sourceArray[i].length; j < jl; j++) {
        array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos
      }
      // For the two flags of the elliptical arc command, the SVG spec say:
      // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
      // Elliptical arc command as an array followed by corresponding indexes:
      // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
      //   0    1   2        3                 4             5      6  7
      if(array[i][0] === 'A') {
        array[i][4] = +(array[i][4] != 0)
        array[i][5] = +(array[i][5] != 0)
      }
    }

    // Directly modify the value of a path array, this is done this way for performance
    pathArray.value = array
    return pathArray
  }
  // Absolutize and parse path to array
, parse: function(array) {
    // if it's already a patharray, no need to parse it
    if (array instanceof SVG.PathArray) return array.valueOf()

    // prepare for parsing
    var i, x0, y0, s, seg, arr
      , x = 0
      , y = 0
      , paramCnt = { 'M':2, 'L':2, 'H':1, 'V':1, 'C':6, 'S':4, 'Q':4, 'T':2, 'A':7, 'Z':0 }

    if(typeof array == 'string'){

      array = array
        .replace(SVG.regex.numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
        .replace(SVG.regex.hyphen, '$1 -')      // add space before hyphen
        .trim()                                 // trim
        .split(SVG.regex.delimiter)   // split into array

    }else{
      array = array.reduce(function(prev, curr){
        return [].concat.call(prev, curr)
      }, [])
    }

    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
    var arr = []
      , p = new SVG.Point()
      , p0 = new SVG.Point()
      , index = 0
      , len = array.length

    do{
      // Test if we have a path letter
      if(SVG.regex.isPathLetter.test(array[index])){
        s = array[index]
        ++index
      // If last letter was a move command and we got no new, it defaults to [L]ine
      }else if(s == 'M'){
        s = 'L'
      }else if(s == 'm'){
        s = 'l'
      }

      arr.push(pathHandlers[s].call(null,
          array.slice(index, (index = index + paramCnt[s.toUpperCase()])).map(parseFloat),
          p, p0
        )
      )

    }while(len > index)

    return arr

  }
  // Get bounding box of path
, bbox: function() {
    SVG.parser.path.setAttribute('d', this.toString())

    return SVG.parser.path.getBBox()
  }

})

// Module for unit convertions
SVG.Number = SVG.invent({
  // Initialize
  create: function(value, unit) {
    // initialize defaults
    this.value = 0
    this.unit  = unit || ''

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value

    } else if (typeof value === 'string') {
      unit = value.match(SVG.regex.numberAndUnit)

      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1])

        // normalize
        if (unit[5] == '%')
          this.value /= 100
        else if (unit[5] == 's')
          this.value *= 1000

        // store unit
        this.unit = unit[5]
      }

    } else {
      if (value instanceof SVG.Number) {
        this.value = value.valueOf()
        this.unit  = value.unit
      }
    }

  }
  // Add methods
, extend: {
    // Stringalize
    toString: function() {
      return (
        this.unit == '%' ?
          ~~(this.value * 1e8) / 1e6:
        this.unit == 's' ?
          this.value / 1e3 :
          this.value
      ) + this.unit
    }
  , toJSON: function() {
      return this.toString()
    }
  , // Convert to primitive
    valueOf: function() {
      return this.value
    }
    // Add number
  , plus: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this + number, this.unit || number.unit)
    }
    // Subtract number
  , minus: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this - number, this.unit || number.unit)
    }
    // Multiply number
  , times: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this * number, this.unit || number.unit)
    }
    // Divide number
  , divide: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this / number, this.unit || number.unit)
    }
    // Convert to different unit
  , to: function(unit) {
      var number = new SVG.Number(this)

      if (typeof unit === 'string')
        number.unit = unit

      return number
    }
    // Make number morphable
  , morph: function(number) {
      this.destination = new SVG.Number(number)

      if(number.relative) {
        this.destination.value += this.value
      }

      return this
    }
    // Get morphed number at given position
  , at: function(pos) {
      // Make sure a destination is defined
      if (!this.destination) return this

      // Generate new morphed number
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }

  }
})


SVG.Element = SVG.invent({
  // Initialize node
  create: function(node) {
    // make stroke value accessible dynamically
    this._stroke = SVG.defaults.attrs.stroke
    this._event = null

    // initialize data object
    this.dom = {}

    // create circular reference
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this

      // store current attribute value
      this._stroke = node.getAttribute('stroke') || this._stroke
    }
  }

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
    }
    // Move element to given x and y values
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Move element by its center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Set width of element
  , width: function(width) {
      return this.attr('width', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('height', height)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this
        .width(new SVG.Number(p.width))
        .height(new SVG.Number(p.height))
    }
    // Clone element
  , clone: function(parent, withData) {
      // write dom data to the dom so the clone can pickup the data
      this.writeDataToDom()

      // clone element and assign new id
      var clone = assignNewId(this.node.cloneNode(true))

      // insert the clone in the given parent or after myself
      if(parent) parent.add(clone)
      else this.after(clone)

      return clone
    }
    // Remove element
  , remove: function() {
      if (this.parent())
        this.parent().removeElement(this)

      return this
    }
    // Replace element
  , replace: function(element) {
      this.after(element).remove()

      return element
    }
    // Add element to given container and return self
  , addTo: function(parent) {
      return parent.put(this)
    }
    // Add element to given container and return container
  , putIn: function(parent) {
      return parent.add(this)
    }
    // Get / set id
  , id: function(id) {
      return this.attr('id', id)
    }
    // Checks whether the given point inside the bounding box of the element
  , inside: function(x, y) {
      var box = this.bbox()

      return x > box.x
          && y > box.y
          && x < box.x + box.width
          && y < box.y + box.height
    }
    // Show element
  , show: function() {
      return this.style('display', '')
    }
    // Hide element
  , hide: function() {
      return this.style('display', 'none')
    }
    // Is element visible?
  , visible: function() {
      return this.style('display') != 'none'
    }
    // Return id on string conversion
  , toString: function() {
      return this.attr('id')
    }
    // Return array of classes on the node
  , classes: function() {
      var attr = this.attr('class')

      return attr == null ? [] : attr.trim().split(SVG.regex.delimiter)
    }
    // Return true if class exists on the node, false otherwise
  , hasClass: function(name) {
      return this.classes().indexOf(name) != -1
    }
    // Add class to the node
  , addClass: function(name) {
      if (!this.hasClass(name)) {
        var array = this.classes()
        array.push(name)
        this.attr('class', array.join(' '))
      }

      return this
    }
    // Remove class from the node
  , removeClass: function(name) {
      if (this.hasClass(name)) {
        this.attr('class', this.classes().filter(function(c) {
          return c != name
        }).join(' '))
      }

      return this
    }
    // Toggle the presence of a class on the node
  , toggleClass: function(name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
    }
    // Get referenced element form attribute value
  , reference: function(attr) {
      return SVG.get(this.attr(attr))
    }
    // Returns the parent element instance
  , parent: function(type) {
      var parent = this

      // check for parent
      if(!parent.node.parentNode) return null

      // get parent element
      parent = SVG.adopt(parent.node.parentNode)

      if(!type) return parent

      // loop trough ancestors if type is given
      while(parent && parent.node instanceof window.SVGElement){
        if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
        if(parent.node.parentNode.nodeName == '#document') return null // #720
        parent = SVG.adopt(parent.node.parentNode)
      }
    }
    // Get parent document
  , doc: function() {
      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
    }
    // return array of all ancestors of given type up to the root svg
  , parents: function(type) {
      var parents = [], parent = this

      do{
        parent = parent.parent(type)
        if(!parent || !parent.node) break

        parents.push(parent)
      } while(parent.parent)

      return parents
    }
    // matches the element vs a css selector
  , matches: function(selector){
      return matches(this.node, selector)
    }
    // Returns the svg node to call native svg methods on it
  , native: function() {
      return this.node
    }
    // Import raw svg
  , svg: function(svg) {
      // create temporary holder
      var well = document.createElement('svg')

      // act as a setter if svg is given
      if (svg && this instanceof SVG.Parent) {
        // dump raw svg
        well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'

        // transplant nodes
        for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
          this.node.appendChild(well.firstChild.firstChild)

      // otherwise act as a getter
      } else {
        // create a wrapping svg element in case of partial content
        well.appendChild(svg = document.createElement('svg'))

        // write svgjs data to the dom
        this.writeDataToDom()

        // insert a copy of this node
        svg.appendChild(this.node.cloneNode(true))

        // return target element
        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
      }

      return this
    }
  // write svgjs data to the dom
  , writeDataToDom: function() {

      // dump variables recursively
      if(this.each || this.lines){
        var fn = this.each ? this : this.lines();
        fn.each(function(){
          this.writeDataToDom()
        })
      }

      // remove previously set data
      this.node.removeAttribute('svgjs:data')

      if(Object.keys(this.dom).length)
        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428

      return this
    }
  // set given data to the elements data property
  , setData: function(o){
      this.dom = o
      return this
    }
  , is: function(obj){
      return is(this, obj)
    }
  }
})

SVG.easing = {
  '-': function(pos){return pos}
, '<>':function(pos){return -Math.cos(pos * Math.PI) / 2 + 0.5}
, '>': function(pos){return  Math.sin(pos * Math.PI / 2)}
, '<': function(pos){return -Math.cos(pos * Math.PI / 2) + 1}
}

SVG.morph = function(pos){
  return function(from, to) {
    return new SVG.MorphObj(from, to).at(pos)
  }
}

SVG.Situation = SVG.invent({

  create: function(o){
    this.init = false
    this.reversed = false
    this.reversing = false

    this.duration = new SVG.Number(o.duration).valueOf()
    this.delay = new SVG.Number(o.delay).valueOf()

    this.start = +new Date() + this.delay
    this.finish = this.start + this.duration
    this.ease = o.ease

    // this.loop is incremented from 0 to this.loops
    // it is also incremented when in an infinite loop (when this.loops is true)
    this.loop = 0
    this.loops = false

    this.animations = {
      // functionToCall: [list of morphable objects]
      // e.g. move: [SVG.Number, SVG.Number]
    }

    this.attrs = {
      // holds all attributes which are not represented from a function svg.js provides
      // e.g. someAttr: SVG.Number
    }

    this.styles = {
      // holds all styles which should be animated
      // e.g. fill-color: SVG.Color
    }

    this.transforms = [
      // holds all transformations as transformation objects
      // e.g. [SVG.Rotate, SVG.Translate, SVG.Matrix]
    ]

    this.once = {
      // functions to fire at a specific position
      // e.g. "0.5": function foo(){}
    }

  }

})


SVG.FX = SVG.invent({

  create: function(element) {
    this._target = element
    this.situations = []
    this.active = false
    this.situation = null
    this.paused = false
    this.lastPos = 0
    this.pos = 0
    // The absolute position of an animation is its position in the context of its complete duration (including delay and loops)
    // When performing a delay, absPos is below 0 and when performing a loop, its value is above 1
    this.absPos = 0
    this._speed = 1
  }

, extend: {

    /**
     * sets or returns the target of this animation
     * @param o object || number In case of Object it holds all parameters. In case of number its the duration of the animation
     * @param ease function || string Function which should be used for easing or easing keyword
     * @param delay Number indicating the delay before the animation starts
     * @return target || this
     */
    animate: function(o, ease, delay){

      if(typeof o == 'object'){
        ease = o.ease
        delay = o.delay
        o = o.duration
      }

      var situation = new SVG.Situation({
        duration: o || 1000,
        delay: delay || 0,
        ease: SVG.easing[ease || '-'] || ease
      })

      this.queue(situation)

      return this
    }

    /**
     * sets a delay before the next element of the queue is called
     * @param delay Duration of delay in milliseconds
     * @return this.target()
     */
  , delay: function(delay){
      // The delay is performed by an empty situation with its duration
      // attribute set to the duration of the delay
      var situation = new SVG.Situation({
        duration: delay,
        delay: 0,
        ease: SVG.easing['-']
      })

      return this.queue(situation)
    }

    /**
     * sets or returns the target of this animation
     * @param null || target SVG.Element which should be set as new target
     * @return target || this
     */
  , target: function(target){
      if(target && target instanceof SVG.Element){
        this._target = target
        return this
      }

      return this._target
    }

    // returns the absolute position at a given time
  , timeToAbsPos: function(timestamp){
      return (timestamp - this.situation.start) / (this.situation.duration/this._speed)
    }

    // returns the timestamp from a given absolute positon
  , absPosToTime: function(absPos){
      return this.situation.duration/this._speed * absPos + this.situation.start
    }

    // starts the animationloop
  , startAnimFrame: function(){
      this.stopAnimFrame()
      this.animationFrame = window.requestAnimationFrame(function(){ this.step() }.bind(this))
    }

    // cancels the animationframe
  , stopAnimFrame: function(){
      window.cancelAnimationFrame(this.animationFrame)
    }

    // kicks off the animation - only does something when the queue is currently not active and at least one situation is set
  , start: function(){
      // dont start if already started
      if(!this.active && this.situation){
        this.active = true
        this.startCurrent()
      }

      return this
    }

    // start the current situation
  , startCurrent: function(){
      this.situation.start = +new Date + this.situation.delay/this._speed
      this.situation.finish = this.situation.start + this.situation.duration/this._speed
      return this.initAnimations().step()
    }

    /**
     * adds a function / Situation to the animation queue
     * @param fn function / situation to add
     * @return this
     */
  , queue: function(fn){
      if(typeof fn == 'function' || fn instanceof SVG.Situation)
        this.situations.push(fn)

      if(!this.situation) this.situation = this.situations.shift()

      return this
    }

    /**
     * pulls next element from the queue and execute it
     * @return this
     */
  , dequeue: function(){
      // stop current animation
      this.stop()

      // get next animation from queue
      this.situation = this.situations.shift()

      if(this.situation){
        if(this.situation instanceof SVG.Situation) {
          this.start()
        } else {
          // If it is not a SVG.Situation, then it is a function, we execute it
          this.situation.call(this)
        }
      }

      return this
    }

    // updates all animations to the current state of the element
    // this is important when one property could be changed from another property
  , initAnimations: function() {
      var i, j, source
      var s = this.situation

      if(s.init) return this

      for(i in s.animations){
        source = this.target()[i]()

        if(!Array.isArray(source)) {
          source = [source]
        }

        if(!Array.isArray(s.animations[i])) {
          s.animations[i] = [s.animations[i]]
        }

        //if(s.animations[i].length > source.length) {
        //  source.concat = source.concat(s.animations[i].slice(source.length, s.animations[i].length))
        //}

        for(j = source.length; j--;) {
          // The condition is because some methods return a normal number instead
          // of a SVG.Number
          if(s.animations[i][j] instanceof SVG.Number)
            source[j] = new SVG.Number(source[j])

          s.animations[i][j] = source[j].morph(s.animations[i][j])
        }
      }

      for(i in s.attrs){
        s.attrs[i] = new SVG.MorphObj(this.target().attr(i), s.attrs[i])
      }

      for(i in s.styles){
        s.styles[i] = new SVG.MorphObj(this.target().style(i), s.styles[i])
      }

      s.initialTransformation = this.target().matrixify()

      s.init = true
      return this
    }
  , clearQueue: function(){
      this.situations = []
      return this
    }
  , clearCurrent: function(){
      this.situation = null
      return this
    }
    /** stops the animation immediately
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately.
     * @param clearQueue A Boolean indicating whether to remove queued animation as well.
     * @return this
     */
  , stop: function(jumpToEnd, clearQueue){
      var active = this.active
      this.active = false

      if(clearQueue){
        this.clearQueue()
      }

      if(jumpToEnd && this.situation){
        // initialize the situation if it was not
        !active && this.startCurrent()
        this.atEnd()
      }

      this.stopAnimFrame()

      return this.clearCurrent()
    }

    /** resets the element to the state where the current element has started
     * @return this
     */
  , reset: function(){
      if(this.situation){
        var temp = this.situation
        this.stop()
        this.situation = temp
        this.atStart()
      }
      return this
    }

    // Stop the currently-running animation, remove all queued animations, and complete all animations for the element.
  , finish: function(){

      this.stop(true, false)

      while(this.dequeue().situation && this.stop(true, false));

      this.clearQueue().clearCurrent()

      return this
    }

    // set the internal animation pointer at the start position, before any loops, and updates the visualisation
  , atStart: function() {
      return this.at(0, true)
    }

    // set the internal animation pointer at the end position, after all the loops, and updates the visualisation
  , atEnd: function() {
      if (this.situation.loops === true) {
        // If in a infinite loop, we end the current iteration
        this.situation.loops = this.situation.loop + 1
      }

      if(typeof this.situation.loops == 'number') {
        // If performing a finite number of loops, we go after all the loops
        return this.at(this.situation.loops, true)
      } else {
        // If no loops, we just go at the end
        return this.at(1, true)
      }
    }

    // set the internal animation pointer to the specified position and updates the visualisation
    // if isAbsPos is true, pos is treated as an absolute position
  , at: function(pos, isAbsPos){
      var durDivSpd = this.situation.duration/this._speed

      this.absPos = pos
      // If pos is not an absolute position, we convert it into one
      if (!isAbsPos) {
        if (this.situation.reversed) this.absPos = 1 - this.absPos
        this.absPos += this.situation.loop
      }

      this.situation.start = +new Date - this.absPos * durDivSpd
      this.situation.finish = this.situation.start + durDivSpd

      return this.step(true)
    }

    /**
     * sets or returns the speed of the animations
     * @param speed null || Number The new speed of the animations
     * @return Number || this
     */
  , speed: function(speed){
      if (speed === 0) return this.pause()

      if (speed) {
        this._speed = speed
        // We use an absolute position here so that speed can affect the delay before the animation
        return this.at(this.absPos, true)
      } else return this._speed
    }

    // Make loopable
  , loop: function(times, reverse) {
      var c = this.last()

      // store total loops
      c.loops = (times != null) ? times : true
      c.loop = 0

      if(reverse) c.reversing = true
      return this
    }

    // pauses the animation
  , pause: function(){
      this.paused = true
      this.stopAnimFrame()

      return this
    }

    // unpause the animation
  , play: function(){
      if(!this.paused) return this
      this.paused = false
      // We use an absolute position here so that the delay before the animation can be paused
      return this.at(this.absPos, true)
    }

    /**
     * toggle or set the direction of the animation
     * true sets direction to backwards while false sets it to forwards
     * @param reversed Boolean indicating whether to reverse the animation or not (default: toggle the reverse status)
     * @return this
     */
  , reverse: function(reversed){
      var c = this.last()

      if(typeof reversed == 'undefined') c.reversed = !c.reversed
      else c.reversed = reversed

      return this
    }


    /**
     * returns a float from 0-1 indicating the progress of the current animation
     * @param eased Boolean indicating whether the returned position should be eased or not
     * @return number
     */
  , progress: function(easeIt){
      return easeIt ? this.situation.ease(this.pos) : this.pos
    }

    /**
     * adds a callback function which is called when the current animation is finished
     * @param fn Function which should be executed as callback
     * @return number
     */
  , after: function(fn){
      var c = this.last()
        , wrapper = function wrapper(e){
            if(e.detail.situation == c){
              fn.call(this, c)
              this.off('finished.fx', wrapper) // prevent memory leak
            }
          }

      this.target().on('finished.fx', wrapper)

      return this._callStart()
    }

    // adds a callback which is called whenever one animation step is performed
  , during: function(fn){
      var c = this.last()
        , wrapper = function(e){
            if(e.detail.situation == c){
              fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, c)
            }
          }

      // see above
      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

      this.after(function(){
        this.off('during.fx', wrapper)
      })

      return this._callStart()
    }

    // calls after ALL animations in the queue are finished
  , afterAll: function(fn){
      var wrapper = function wrapper(e){
            fn.call(this)
            this.off('allfinished.fx', wrapper)
          }

      // see above
      this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper)

      return this._callStart()
    }

    // calls on every animation step for all animations
  , duringAll: function(fn){
      var wrapper = function(e){
            fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, e.detail.situation)
          }

      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

      this.afterAll(function(){
        this.off('during.fx', wrapper)
      })

      return this._callStart()
    }

  , last: function(){
      return this.situations.length ? this.situations[this.situations.length-1] : this.situation
    }

    // adds one property to the animations
  , add: function(method, args, type){
      this.last()[type || 'animations'][method] = args
      return this._callStart()
    }

    /** perform one step of the animation
     *  @param ignoreTime Boolean indicating whether to ignore time and use position directly or recalculate position based on time
     *  @return this
     */
  , step: function(ignoreTime){

      // convert current time to an absolute position
      if(!ignoreTime) this.absPos = this.timeToAbsPos(+new Date)

      // This part convert an absolute position to a position
      if(this.situation.loops !== false) {
        var absPos, absPosInt, lastLoop

        // If the absolute position is below 0, we just treat it as if it was 0
        absPos = Math.max(this.absPos, 0)
        absPosInt = Math.floor(absPos)

        if(this.situation.loops === true || absPosInt < this.situation.loops) {
          this.pos = absPos - absPosInt
          lastLoop = this.situation.loop
          this.situation.loop = absPosInt
        } else {
          this.absPos = this.situation.loops
          this.pos = 1
          // The -1 here is because we don't want to toggle reversed when all the loops have been completed
          lastLoop = this.situation.loop - 1
          this.situation.loop = this.situation.loops
        }

        if(this.situation.reversing) {
          // Toggle reversed if an odd number of loops as occured since the last call of step
          this.situation.reversed = this.situation.reversed != Boolean((this.situation.loop - lastLoop) % 2)
        }

      } else {
        // If there are no loop, the absolute position must not be above 1
        this.absPos = Math.min(this.absPos, 1)
        this.pos = this.absPos
      }

      // while the absolute position can be below 0, the position must not be below 0
      if(this.pos < 0) this.pos = 0

      if(this.situation.reversed) this.pos = 1 - this.pos


      // apply easing
      var eased = this.situation.ease(this.pos)

      // call once-callbacks
      for(var i in this.situation.once){
        if(i > this.lastPos && i <= eased){
          this.situation.once[i].call(this.target(), this.pos, eased)
          delete this.situation.once[i]
        }
      }

      // fire during callback with position, eased position and current situation as parameter
      if(this.active) this.target().fire('during', {pos: this.pos, eased: eased, fx: this, situation: this.situation})

      // the user may call stop or finish in the during callback
      // so make sure that we still have a valid situation
      if(!this.situation){
        return this
      }

      // apply the actual animation to every property
      this.eachAt()

      // do final code when situation is finished
      if((this.pos == 1 && !this.situation.reversed) || (this.situation.reversed && this.pos == 0)){

        // stop animation callback
        this.stopAnimFrame()

        // fire finished callback with current situation as parameter
        this.target().fire('finished', {fx:this, situation: this.situation})

        if(!this.situations.length){
          this.target().fire('allfinished')

          // Recheck the length since the user may call animate in the afterAll callback
          if(!this.situations.length){
            this.target().off('.fx') // there shouldnt be any binding left, but to make sure...
            this.active = false
          }
        }

        // start next animation
        if(this.active) this.dequeue()
        else this.clearCurrent()

      }else if(!this.paused && this.active){
        // we continue animating when we are not at the end
        this.startAnimFrame()
      }

      // save last eased position for once callback triggering
      this.lastPos = eased
      return this

    }

    // calculates the step for every property and calls block with it
  , eachAt: function(){
      var i, len, at, self = this, target = this.target(), s = this.situation

      // apply animations which can be called trough a method
      for(i in s.animations){

        at = [].concat(s.animations[i]).map(function(el){
          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
        })

        target[i].apply(target, at)

      }

      // apply animation which has to be applied with attr()
      for(i in s.attrs){

        at = [i].concat(s.attrs[i]).map(function(el){
          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
        })

        target.attr.apply(target, at)

      }

      // apply animation which has to be applied with style()
      for(i in s.styles){

        at = [i].concat(s.styles[i]).map(function(el){
          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
        })

        target.style.apply(target, at)

      }

      // animate initialTransformation which has to be chained
      if(s.transforms.length){

        // get initial initialTransformation
        at = s.initialTransformation
        for(i = 0, len = s.transforms.length; i < len; i++){

          // get next transformation in chain
          var a = s.transforms[i]

          // multiply matrix directly
          if(a instanceof SVG.Matrix){

            if(a.relative){
              at = at.multiply(new SVG.Matrix().morph(a).at(s.ease(this.pos)))
            }else{
              at = at.morph(a).at(s.ease(this.pos))
            }
            continue
          }

          // when transformation is absolute we have to reset the needed transformation first
          if(!a.relative)
            a.undo(at.extract())

          // and reapply it after
          at = at.multiply(a.at(s.ease(this.pos)))

        }

        // set new matrix on element
        target.matrix(at)
      }

      return this

    }


    // adds an once-callback which is called at a specific position and never again
  , once: function(pos, fn, isEased){
      var c = this.last()
      if(!isEased) pos = c.ease(pos)

      c.once[pos] = fn

      return this
    }

  , _callStart: function() {
      setTimeout(function(){this.start()}.bind(this), 0)
      return this
    }

  }

, parent: SVG.Element

  // Add method to parent elements
, construct: {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(o, ease, delay) {
      return (this.fx || (this.fx = new SVG.FX(this))).animate(o, ease, delay)
    }
  , delay: function(delay){
      return (this.fx || (this.fx = new SVG.FX(this))).delay(delay)
    }
  , stop: function(jumpToEnd, clearQueue) {
      if (this.fx)
        this.fx.stop(jumpToEnd, clearQueue)

      return this
    }
  , finish: function() {
      if (this.fx)
        this.fx.finish()

      return this
    }
    // Pause current animation
  , pause: function() {
      if (this.fx)
        this.fx.pause()

      return this
    }
    // Play paused current animation
  , play: function() {
      if (this.fx)
        this.fx.play()

      return this
    }
    // Set/Get the speed of the animations
  , speed: function(speed) {
      if (this.fx)
        if (speed == null)
          return this.fx.speed()
        else
          this.fx.speed(speed)

      return this
    }
  }

})

// MorphObj is used whenever no morphable object is given
SVG.MorphObj = SVG.invent({

  create: function(from, to){
    // prepare color for morphing
    if(SVG.Color.isColor(to)) return new SVG.Color(from).morph(to)
    // prepare value list for morphing
    if(SVG.regex.delimiter.test(from)) return new SVG.Array(from).morph(to)
    // prepare number for morphing
    if(SVG.regex.numberAndUnit.test(to)) return new SVG.Number(from).morph(to)

    // prepare for plain morphing
    this.value = from
    this.destination = to
  }

, extend: {
    at: function(pos, real){
      return real < 1 ? this.value : this.destination
    },

    valueOf: function(){
      return this.value
    }
  }

})

SVG.extend(SVG.FX, {
  // Add animatable attributes
  attr: function(a, v, relative) {
    // apply attributes individually
    if (typeof a == 'object') {
      for (var key in a)
        this.attr(key, a[key])

    } else {
      this.add(a, v, 'attrs')
    }

    return this
  }
  // Add animatable styles
, style: function(s, v) {
    if (typeof s == 'object')
      for (var key in s)
        this.style(key, s[key])

    else
      this.add(s, v, 'styles')

    return this
  }
  // Animatable x-axis
, x: function(x, relative) {
    if(this.target() instanceof SVG.G){
      this.transform({x:x}, relative)
      return this
    }

    var num = new SVG.Number(x)
    num.relative = relative
    return this.add('x', num)
  }
  // Animatable y-axis
, y: function(y, relative) {
    if(this.target() instanceof SVG.G){
      this.transform({y:y}, relative)
      return this
    }

    var num = new SVG.Number(y)
    num.relative = relative
    return this.add('y', num)
  }
  // Animatable center x-axis
, cx: function(x) {
    return this.add('cx', new SVG.Number(x))
  }
  // Animatable center y-axis
, cy: function(y) {
    return this.add('cy', new SVG.Number(y))
  }
  // Add animatable move
, move: function(x, y) {
    return this.x(x).y(y)
  }
  // Add animatable center
, center: function(x, y) {
    return this.cx(x).cy(y)
  }
  // Add animatable size
, size: function(width, height) {
    if (this.target() instanceof SVG.Text) {
      // animate font size for Text elements
      this.attr('font-size', width)

    } else {
      // animate bbox based size for all other elements
      var box

      if(!width || !height){
        box = this.target().bbox()
      }

      if(!width){
        width = box.width / box.height  * height
      }

      if(!height){
        height = box.height / box.width  * width
      }

      this.add('width' , new SVG.Number(width))
          .add('height', new SVG.Number(height))

    }

    return this
  }
  // Add animatable width
, width: function(width) {
    return this.add('width', new SVG.Number(width))
  }
  // Add animatable height
, height: function(height) {
    return this.add('height', new SVG.Number(height))
  }
  // Add animatable plot
, plot: function(a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if(arguments.length == 4) {
      return this.plot([a, b, c, d])
    }

    return this.add('plot', new (this.target().morphArray)(a))
  }
  // Add leading method
, leading: function(value) {
    return this.target().leading ?
      this.add('leading', new SVG.Number(value)) :
      this
  }
  // Add animatable viewbox
, viewbox: function(x, y, width, height) {
    if (this.target() instanceof SVG.Container) {
      this.add('viewbox', new SVG.ViewBox(x, y, width, height))
    }

    return this
  }
, update: function(o) {
    if (this.target() instanceof SVG.Stop) {
      if (typeof o == 'number' || o instanceof SVG.Number) {
        return this.update({
          offset:  arguments[0]
        , color:   arguments[1]
        , opacity: arguments[2]
        })
      }

      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', o.offset)
    }

    return this
  }
})

SVG.Box = SVG.invent({
  create: function(x, y, width, height) {
    if (typeof x == 'object' && !(x instanceof SVG.Element)) {
      // chromes getBoundingClientRect has no x and y property
      return SVG.Box.call(this, x.left != null ? x.left : x.x , x.top != null ? x.top : x.y, x.width, x.height)
    } else if (arguments.length == 4) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    }

    // add center, right, bottom...
    fullBox(this)
  }
, extend: {
    // Merge rect box with another, return a new instance
    merge: function(box) {
      var b = new this.constructor()

      // merge boxes
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

      return fullBox(b)
    }

  , transform: function(m) {
      var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, p, bbox

      var pts = [
        new SVG.Point(this.x, this.y),
        new SVG.Point(this.x2, this.y),
        new SVG.Point(this.x, this.y2),
        new SVG.Point(this.x2, this.y2)
      ]

      pts.forEach(function(p) {
        p = p.transform(m)
        xMin = Math.min(xMin,p.x)
        xMax = Math.max(xMax,p.x)
        yMin = Math.min(yMin,p.y)
        yMax = Math.max(yMax,p.y)
      })

      bbox = new this.constructor()
      bbox.x = xMin
      bbox.width = xMax-xMin
      bbox.y = yMin
      bbox.height = yMax-yMin

      fullBox(bbox)

      return bbox
    }
  }
})

SVG.BBox = SVG.invent({
  // Initialize
  create: function(element) {
    SVG.Box.apply(this, [].slice.call(arguments))

    // get values if element is given
    if (element instanceof SVG.Element) {
      var box

      // yes this is ugly, but Firefox can be a pain when it comes to elements that are not yet rendered
      try {

        if (!document.documentElement.contains){
          // This is IE - it does not support contains() for top-level SVGs
          var topParent = element.node
          while (topParent.parentNode){
            topParent = topParent.parentNode
          }
          if (topParent != document) throw new Exception('Element not in the dom')
        } else {
          // the element is NOT in the dom, throw error
          if(!document.documentElement.contains(element.node)) throw new Exception('Element not in the dom')
        }

        // find native bbox
        box = element.node.getBBox()
      } catch(e) {
        if(element instanceof SVG.Shape){
          var clone = element.clone(SVG.parser.draw.instance).show()
          box = clone.node.getBBox()
          clone.remove()
        }else{
          box = {
            x:      element.node.clientLeft
          , y:      element.node.clientTop
          , width:  element.node.clientWidth
          , height: element.node.clientHeight
          }
        }
      }

      SVG.Box.call(this, box)
    }

  }

  // Define ancestor
, inherit: SVG.Box

  // Define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get bounding box
    bbox: function() {
      return new SVG.BBox(this)
    }
  }

})

SVG.BBox.prototype.constructor = SVG.BBox


SVG.extend(SVG.Element, {
  tbox: function(){
    console.warn('Use of TBox is deprecated and mapped to RBox. Use .rbox() instead.')
    return this.rbox(this.doc())
  }
})

SVG.RBox = SVG.invent({
  // Initialize
  create: function(element) {
    SVG.Box.apply(this, [].slice.call(arguments))

    if (element instanceof SVG.Element) {
      SVG.Box.call(this, element.node.getBoundingClientRect())
    }
  }

, inherit: SVG.Box

  // define Parent
, parent: SVG.Element

, extend: {
    addOffset: function() {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += window.pageXOffset
      this.y += window.pageYOffset
      return this
    }
  }

  // Constructor
, construct: {
    // Get rect box
    rbox: function(el) {
      if (el) return new SVG.RBox(this).transform(el.screenCTM().inverse())
      return new SVG.RBox(this).addOffset()
    }
  }

})

SVG.RBox.prototype.constructor = SVG.RBox

SVG.Matrix = SVG.invent({
  // Initialize
  create: function(source) {
    var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

    // ensure source as object
    source = source instanceof SVG.Element ?
      source.matrixify() :
    typeof source === 'string' ?
      arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat)) :
    arguments.length == 6 ?
      arrayToMatrix([].slice.call(arguments)) :
    Array.isArray(source) ?
      arrayToMatrix(source) :
    typeof source === 'object' ?
      source : base

    // merge source
    for (i = abcdef.length - 1; i >= 0; --i)
      this[abcdef[i]] = source[abcdef[i]] != null ?
        source[abcdef[i]] : base[abcdef[i]]
  }

  // Add methods
, extend: {
    // Extract individual transformations
    extract: function() {
      // find delta transform points
      var px    = deltaTransformPoint(this, 0, 1)
        , py    = deltaTransformPoint(this, 1, 0)
        , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

      return {
        // translation
        x:        this.e
      , y:        this.f
      , transformedX:(this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b)
      , transformedY:(this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d)
        // skew
      , skewX:    -skewX
      , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
        // scale
      , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
      , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
        // rotation
      , rotation: skewX
      , a: this.a
      , b: this.b
      , c: this.c
      , d: this.d
      , e: this.e
      , f: this.f
      , matrix: new SVG.Matrix(this)
      }
    }
    // Clone matrix
  , clone: function() {
      return new SVG.Matrix(this)
    }
    // Morph one matrix into another
  , morph: function(matrix) {
      // store new destination
      this.destination = new SVG.Matrix(matrix)

      return this
    }
    // Get morphed matrix at a given position
  , at: function(pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var matrix = new SVG.Matrix({
        a: this.a + (this.destination.a - this.a) * pos
      , b: this.b + (this.destination.b - this.b) * pos
      , c: this.c + (this.destination.c - this.c) * pos
      , d: this.d + (this.destination.d - this.d) * pos
      , e: this.e + (this.destination.e - this.e) * pos
      , f: this.f + (this.destination.f - this.f) * pos
      })

      return matrix
    }
    // Multiplies by given matrix
  , multiply: function(matrix) {
      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
    }
    // Inverses matrix
  , inverse: function() {
      return new SVG.Matrix(this.native().inverse())
    }
    // Translate matrix
  , translate: function(x, y) {
      return new SVG.Matrix(this.native().translate(x || 0, y || 0))
    }
    // Scale matrix
  , scale: function(x, y, cx, cy) {
      // support uniformal scale
      if (arguments.length == 1) {
        y = x
      } else if (arguments.length == 3) {
        cy = cx
        cx = y
        y = x
      }

      return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
    }
    // Rotate matrix
  , rotate: function(r, cx, cy) {
      // convert degrees to radians
      r = SVG.utils.radians(r)

      return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
    }
    // Flip matrix on x or y, at a given offset
  , flip: function(a, o) {
      return a == 'x' ?
          this.scale(-1, 1, o, 0) :
        a == 'y' ?
          this.scale(1, -1, 0, o) :
          this.scale(-1, -1, a, o != null ? o : a)
    }
    // Skew
  , skew: function(x, y, cx, cy) {
      // support uniformal skew
      if (arguments.length == 1) {
        y = x
      } else if (arguments.length == 3) {
        cy = cx
        cx = y
        y = x
      }

      // convert degrees to radians
      x = SVG.utils.radians(x)
      y = SVG.utils.radians(y)

      return this.around(cx, cy, new SVG.Matrix(1, Math.tan(y), Math.tan(x), 1, 0, 0))
    }
    // SkewX
  , skewX: function(x, cx, cy) {
      return this.skew(x, 0, cx, cy)
    }
    // SkewY
  , skewY: function(y, cx, cy) {
      return this.skew(0, y, cx, cy)
    }
    // Transform around a center point
  , around: function(cx, cy, matrix) {
      return this
        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
        .multiply(matrix)
        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
    }
    // Convert to native SVGMatrix
  , native: function() {
      // create new matrix
      var matrix = SVG.parser.native.createSVGMatrix()

      // update with current values
      for (var i = abcdef.length - 1; i >= 0; i--)
        matrix[abcdef[i]] = this[abcdef[i]]

      return matrix
    }
    // Convert matrix to string
  , toString: function() {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
    }
  }

  // Define parent
, parent: SVG.Element

  // Add parent method
, construct: {
    // Get current matrix
    ctm: function() {
      return new SVG.Matrix(this.node.getCTM())
    },
    // Get current screen matrix
    screenCTM: function() {
      /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
         This is needed because FF does not return the transformation matrix
         for the inner coordinate system when getScreenCTM() is called on nested svgs.
         However all other Browsers do that */
      if(this instanceof SVG.Nested) {
        var rect = this.rect(1,1)
        var m = rect.node.getScreenCTM()
        rect.remove()
        return new SVG.Matrix(m)
      }
      return new SVG.Matrix(this.node.getScreenCTM())
    }

  }

})

SVG.Point = SVG.invent({
  // Initialize
  create: function(x,y) {
    var i, source, base = {x:0, y:0}

    // ensure source as object
    source = Array.isArray(x) ?
      {x:x[0], y:x[1]} :
    typeof x === 'object' ?
      {x:x.x, y:x.y} :
    x != null ?
      {x:x, y:(y != null ? y : x)} : base // If y has no value, then x is used has its value

    // merge source
    this.x = source.x
    this.y = source.y
  }

  // Add methods
, extend: {
    // Clone point
    clone: function() {
      return new SVG.Point(this)
    }
    // Morph one point into another
  , morph: function(x, y) {
      // store new destination
      this.destination = new SVG.Point(x, y)

      return this
    }
    // Get morphed point at a given position
  , at: function(pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var point = new SVG.Point({
        x: this.x + (this.destination.x - this.x) * pos
      , y: this.y + (this.destination.y - this.y) * pos
      })

      return point
    }
    // Convert to native SVGPoint
  , native: function() {
      // create new point
      var point = SVG.parser.native.createSVGPoint()

      // update with current values
      point.x = this.x
      point.y = this.y

      return point
    }
    // transform point with matrix
  , transform: function(matrix) {
      return new SVG.Point(this.native().matrixTransform(matrix.native()))
    }

  }

})

SVG.extend(SVG.Element, {

  // Get point
  point: function(x, y) {
    return new SVG.Point(x,y).transform(this.screenCTM().inverse());
  }

})

SVG.extend(SVG.Element, {
  // Set svg element attribute
  attr: function(a, v, n) {
    // act as full getter
    if (a == null) {
      // get an object of attributes
      a = {}
      v = this.node.attributes
      for (n = v.length - 1; n >= 0; n--)
        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue

      return a

    } else if (typeof a == 'object') {
      // apply every attribute individually if an object is passed
      for (v in a) this.attr(v, a[v])

    } else if (v === null) {
        // remove value
        this.node.removeAttribute(a)

    } else if (v == null) {
      // act as a getter if the first and only argument is not an object
      v = this.node.getAttribute(a)
      return v == null ?
        SVG.defaults.attrs[a] :
      SVG.regex.isNumber.test(v) ?
        parseFloat(v) : v

    } else {
      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
      if (a == 'stroke-width')
        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
      else if (a == 'stroke')
        this._stroke = v

      // convert image fill and stroke to patterns
      if (a == 'fill' || a == 'stroke') {
        if (SVG.regex.isImage.test(v))
          v = this.doc().defs().image(v, 0, 0)

        if (v instanceof SVG.Image)
          v = this.doc().defs().pattern(0, 0, function() {
            this.add(v)
          })
      }

      // ensure correct numeric values (also accepts NaN and Infinity)
      if (typeof v === 'number')
        v = new SVG.Number(v)

      // ensure full hex color
      else if (SVG.Color.isColor(v))
        v = new SVG.Color(v)

      // parse array values
      else if (Array.isArray(v))
        v = new SVG.Array(v)

      // if the passed attribute is leading...
      if (a == 'leading') {
        // ... call the leading method instead
        if (this.leading)
          this.leading(v)
      } else {
        // set given attribute on node
        typeof n === 'string' ?
          this.node.setAttributeNS(n, a, v.toString()) :
          this.node.setAttribute(a, v.toString())
      }

      // rebuild if required
      if (this.rebuild && (a == 'font-size' || a == 'x'))
        this.rebuild(a, v)
    }

    return this
  }
})
SVG.extend(SVG.Element, {
  // Add transformations
  transform: function(o, relative) {
    // get target in case of the fx module, otherwise reference this
    var target = this
      , matrix, bbox

    // act as a getter
    if (typeof o !== 'object') {
      // get current matrix
      matrix = new SVG.Matrix(target).extract()

      return typeof o === 'string' ? matrix[o] : matrix
    }

    // get current matrix
    matrix = new SVG.Matrix(target)

    // ensure relative flag
    relative = !!relative || !!o.relative

    // act on matrix
    if (o.a != null) {
      matrix = relative ?
        // relative
        matrix.multiply(new SVG.Matrix(o)) :
        // absolute
        new SVG.Matrix(o)

    // act on rotation
    } else if (o.rotation != null) {
      // ensure centre point
      ensureCentre(o, target)

      // apply transformation
      matrix = relative ?
        // relative
        matrix.rotate(o.rotation, o.cx, o.cy) :
        // absolute
        matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)

    // act on scale
    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure scale values on both axes
      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

      if (!relative) {
        // absolute; multiply inversed values
        var e = matrix.extract()
        o.scaleX = o.scaleX * 1 / e.scaleX
        o.scaleY = o.scaleY * 1 / e.scaleY
      }

      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

    // act on skew
    } else if (o.skew != null || o.skewX != null || o.skewY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure skew values on both axes
      o.skewX = o.skew != null ? o.skew : o.skewX != null ? o.skewX : 0
      o.skewY = o.skew != null ? o.skew : o.skewY != null ? o.skewY : 0

      if (!relative) {
        // absolute; reset skew values
        var e = matrix.extract()
        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
      }

      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

    // act on flip
    } else if (o.flip) {
      if(o.flip == 'x' || o.flip == 'y') {
        o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
      } else {
        if(o.offset == null) {
          bbox = target.bbox()
          o.flip = bbox.cx
          o.offset = bbox.cy
        } else {
          o.flip = o.offset
        }
      }

      matrix = new SVG.Matrix().flip(o.flip, o.offset)

    // act on translate
    } else if (o.x != null || o.y != null) {
      if (relative) {
        // relative
        matrix = matrix.translate(o.x, o.y)
      } else {
        // absolute
        if (o.x != null) matrix.e = o.x
        if (o.y != null) matrix.f = o.y
      }
    }

    return this.attr('transform', matrix)
  }
})

SVG.extend(SVG.FX, {
  transform: function(o, relative) {
    // get target in case of the fx module, otherwise reference this
    var target = this.target()
      , matrix, bbox

    // act as a getter
    if (typeof o !== 'object') {
      // get current matrix
      matrix = new SVG.Matrix(target).extract()

      return typeof o === 'string' ? matrix[o] : matrix
    }

    // ensure relative flag
    relative = !!relative || !!o.relative

    // act on matrix
    if (o.a != null) {
      matrix = new SVG.Matrix(o)

    // act on rotation
    } else if (o.rotation != null) {
      // ensure centre point
      ensureCentre(o, target)

      // apply transformation
      matrix = new SVG.Rotate(o.rotation, o.cx, o.cy)

    // act on scale
    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure scale values on both axes
      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

      matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)

    // act on skew
    } else if (o.skewX != null || o.skewY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure skew values on both axes
      o.skewX = o.skewX != null ? o.skewX : 0
      o.skewY = o.skewY != null ? o.skewY : 0

      matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)

    // act on flip
    } else if (o.flip) {
      if(o.flip == 'x' || o.flip == 'y') {
        o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
      } else {
        if(o.offset == null) {
          bbox = target.bbox()
          o.flip = bbox.cx
          o.offset = bbox.cy
        } else {
          o.flip = o.offset
        }
      }

      matrix = new SVG.Matrix().flip(o.flip, o.offset)

    // act on translate
    } else if (o.x != null || o.y != null) {
      matrix = new SVG.Translate(o.x, o.y)
    }

    if(!matrix) return this

    matrix.relative = relative

    this.last().transforms.push(matrix)

    return this._callStart()
  }
})

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function() {
    return this.attr('transform', null)
  },
  // merge the whole transformation chain into one matrix and returns it
  matrixify: function() {

    var matrix = (this.attr('transform') || '')
      // split transformations
      .split(SVG.regex.transforms).slice(0,-1).map(function(str){
        // generate key => value pairs
        var kv = str.trim().split('(')
        return [kv[0], kv[1].split(SVG.regex.delimiter).map(function(str){ return parseFloat(str) })]
      })
      // merge every transformation into one matrix
      .reduce(function(matrix, transform){

        if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
        return matrix[transform[0]].apply(matrix, transform[1])

      }, new SVG.Matrix())

    return matrix
  },
  // add an element to another parent without changing the visual representation on the screen
  toParent: function(parent) {
    if(this == parent) return this
    var ctm = this.screenCTM()
    var pCtm = parent.screenCTM().inverse()

    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

    return this
  },
  // same as above with parent equals root-svg
  toDoc: function() {
    return this.toParent(this.doc())
  }

})

SVG.Transformation = SVG.invent({

  create: function(source, inversed){

    if(arguments.length > 1 && typeof inversed != 'boolean'){
      return this.constructor.call(this, [].slice.call(arguments))
    }

    if(Array.isArray(source)){
      for(var i = 0, len = this.arguments.length; i < len; ++i){
        this[this.arguments[i]] = source[i]
      }
    } else if(typeof source == 'object'){
      for(var i = 0, len = this.arguments.length; i < len; ++i){
        this[this.arguments[i]] = source[this.arguments[i]]
      }
    }

    this.inversed = false

    if(inversed === true){
      this.inversed = true
    }

  }

, extend: {

    arguments: []
  , method: ''

  , at: function(pos){

      var params = []

      for(var i = 0, len = this.arguments.length; i < len; ++i){
        params.push(this[this.arguments[i]])
      }

      var m = this._undo || new SVG.Matrix()

      m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos)

      return this.inversed ? m.inverse() : m

    }

  , undo: function(o){
      for(var i = 0, len = this.arguments.length; i < len; ++i){
        o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]]
      }

      // The method SVG.Matrix.extract which was used before calling this
      // method to obtain a value for the parameter o doesn't return a cx and
      // a cy so we use the ones that were provided to this object at its creation
      o.cx = this.cx
      o.cy = this.cy

      this._undo = new SVG[capitalize(this.method)](o, true).at(1)

      return this
    }

  }

})

SVG.Translate = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['transformedX', 'transformedY']
  , method: 'translate'
  }

})

SVG.Rotate = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['rotation', 'cx', 'cy']
  , method: 'rotate'
  , at: function(pos){
      var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy)
      return this.inversed ? m.inverse() : m
    }
  , undo: function(o){
      this._undo = o
      return this
    }
  }

})

SVG.Scale = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['scaleX', 'scaleY', 'cx', 'cy']
  , method: 'scale'
  }

})

SVG.Skew = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['skewX', 'skewY', 'cx', 'cy']
  , method: 'skew'
  }

})

SVG.extend(SVG.Element, {
  // Dynamic style generator
  style: function(s, v) {
    if (arguments.length == 0) {
      // get full style
      return this.node.style.cssText || ''

    } else if (arguments.length < 2) {
      // apply every style individually if an object is passed
      if (typeof s == 'object') {
        for (v in s) this.style(v, s[v])

      } else if (SVG.regex.isCss.test(s)) {
        // parse css string
        s = s.split(/\s*;\s*/)
          // filter out suffix ; and stuff like ;;
          .filter(function(e) { return !!e })
          .map(function(e){ return e.split(/\s*:\s*/) })

        // apply every definition individually
        while (v = s.pop()) {
          this.style(v[0], v[1])
        }
      } else {
        // act as a getter if the first and only argument is not an object
        return this.node.style[camelCase(s)]
      }

    } else {
      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
    }

    return this
  }
})
SVG.Parent = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Element

  // Add class methods
, extend: {
    // Returns all child elements
    children: function() {
      return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
        return SVG.adopt(node)
      })
    }
    // Add given element at a position
  , add: function(element, i) {
      if (i == null)
        this.node.appendChild(element.node)
      else if (element.node != this.node.childNodes[i])
        this.node.insertBefore(element.node, this.node.childNodes[i])

      return this
    }
    // Basically does the same as `add()` but returns the added element instead
  , put: function(element, i) {
      this.add(element, i)
      return element
    }
    // Checks if the given element is a child
  , has: function(element) {
      return this.index(element) >= 0
    }
    // Gets index of given element
  , index: function(element) {
      return [].slice.call(this.node.childNodes).indexOf(element.node)
    }
    // Get a element at the given index
  , get: function(i) {
      return SVG.adopt(this.node.childNodes[i])
    }
    // Get first child
  , first: function() {
      return this.get(0)
    }
    // Get the last child
  , last: function() {
      return this.get(this.node.childNodes.length - 1)
    }
    // Iterates over all children and invokes a given block
  , each: function(block, deep) {
      var i, il
        , children = this.children()

      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element)
          block.apply(children[i], [i, children])

        if (deep && (children[i] instanceof SVG.Container))
          children[i].each(block, deep)
      }

      return this
    }
    // Remove a given child
  , removeElement: function(element) {
      this.node.removeChild(element.node)

      return this
    }
    // Remove all elements in this container
  , clear: function() {
      // remove children
      while(this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)

      // remove defs reference
      delete this._defs

      return this
    }
  , // Get defs
    defs: function() {
      return this.doc().defs()
    }
  }

})

SVG.extend(SVG.Parent, {

  ungroup: function(parent, depth) {
    if(depth === 0 || this instanceof SVG.Defs || this.node == SVG.parser.draw) return this

    parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent))
    depth = depth || Infinity

    this.each(function(){
      if(this instanceof SVG.Defs) return this
      if(this instanceof SVG.Parent) return this.ungroup(parent, depth-1)
      return this.toParent(parent)
    })

    this.node.firstChild || this.remove()

    return this
  },

  flatten: function(parent, depth) {
    return this.ungroup(parent, depth)
  }

})
SVG.Container = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Parent

})

SVG.ViewBox = SVG.invent({

  create: function(source) {
    var i, base = [0, 0, 0, 0]

    var x, y, width, height, box, view, we, he
      , wm   = 1 // width multiplier
      , hm   = 1 // height multiplier
      , reg  = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi

    if(source instanceof SVG.Element){

      we = source
      he = source
      view = (source.attr('viewBox') || '').match(reg)
      box = source.bbox

      // get dimensions of current node
      width  = new SVG.Number(source.width())
      height = new SVG.Number(source.height())

      // find nearest non-percentual dimensions
      while (width.unit == '%') {
        wm *= width.value
        width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width())
        we = we.parent()
      }
      while (height.unit == '%') {
        hm *= height.value
        height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height())
        he = he.parent()
      }

      // ensure defaults
      this.x      = 0
      this.y      = 0
      this.width  = width  * wm
      this.height = height * hm
      this.zoom   = 1

      if (view) {
        // get width and height from viewbox
        x      = parseFloat(view[0])
        y      = parseFloat(view[1])
        width  = parseFloat(view[2])
        height = parseFloat(view[3])

        // calculate zoom accoring to viewbox
        this.zoom = ((this.width / this.height) > (width / height)) ?
          this.height / height :
          this.width  / width

        // calculate real pixel dimensions on parent SVG.Doc element
        this.x      = x
        this.y      = y
        this.width  = width
        this.height = height

      }

    }else{

      // ensure source as object
      source = typeof source === 'string' ?
        source.match(reg).map(function(el){ return parseFloat(el) }) :
      Array.isArray(source) ?
        source :
      typeof source == 'object' ?
        [source.x, source.y, source.width, source.height] :
      arguments.length == 4 ?
        [].slice.call(arguments) :
        base

      this.x = source[0]
      this.y = source[1]
      this.width = source[2]
      this.height = source[3]
    }


  }

, extend: {

    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
  , morph: function(x, y, width, height){
      this.destination = new SVG.ViewBox(x, y, width, height)
      return this
    }

  , at: function(pos) {

      if(!this.destination) return this

      return new SVG.ViewBox([
          this.x + (this.destination.x - this.x) * pos
        , this.y + (this.destination.y - this.y) * pos
        , this.width + (this.destination.width - this.width) * pos
        , this.height + (this.destination.height - this.height) * pos
      ])

    }

  }

  // Define parent
, parent: SVG.Container

  // Add parent method
, construct: {

    // get/set viewbox
    viewbox: function(x, y, width, height) {
      if (arguments.length == 0)
        // act as a getter if there are no arguments
        return new SVG.ViewBox(this)

      // otherwise act as a setter
      return this.attr('viewBox', new SVG.ViewBox(x, y, width, height))
    }

  }

})
// Add events to elements
;[  'click'
  , 'dblclick'
  , 'mousedown'
  , 'mouseup'
  , 'mouseover'
  , 'mouseout'
  , 'mousemove'
  // , 'mouseenter' -> not supported by IE
  // , 'mouseleave' -> not supported by IE
  , 'touchstart'
  , 'touchmove'
  , 'touchleave'
  , 'touchend'
  , 'touchcancel' ].forEach(function(event) {

  // add event to SVG.Element
  SVG.Element.prototype[event] = function(f) {
    // bind event to element rather than element node
    SVG.on(this.node, event, f)
    return this
  }
})

// Initialize listeners stack
SVG.listeners = []
SVG.handlerMap = []
SVG.listenerId = 0

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener, binding, options) {
  // create listener, get object-index
  var l     = listener.bind(binding || node.instance || node)
    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
    , ev    = event.split('.')[0]
    , ns    = event.split('.')[1] || '*'


  // ensure valid object
  SVG.listeners[index]         = SVG.listeners[index]         || {}
  SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
  SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}

  if(!listener._svgjsListenerId)
    listener._svgjsListenerId = ++SVG.listenerId

  // reference listener
  SVG.listeners[index][ev][ns][listener._svgjsListenerId] = l

  // add listener
  node.addEventListener(ev, l, options || false)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  var index = SVG.handlerMap.indexOf(node)
    , ev    = event && event.split('.')[0]
    , ns    = event && event.split('.')[1]
    , namespace = ''

  if(index == -1) return

  if (listener) {
    if(typeof listener == 'function') listener = listener._svgjsListenerId
    if(!listener) return

    // remove listener reference
    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
      // remove listener
      node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)

      delete SVG.listeners[index][ev][ns || '*'][listener]
    }

  } else if (ns && ev) {
    // remove all listeners for a namespaced event
    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
      for (listener in SVG.listeners[index][ev][ns])
        SVG.off(node, [ev, ns].join('.'), listener)

      delete SVG.listeners[index][ev][ns]
    }

  } else if (ns){
    // remove all listeners for a specific namespace
    for(event in SVG.listeners[index]){
        for(namespace in SVG.listeners[index][event]){
            if(ns === namespace){
                SVG.off(node, [event, ns].join('.'))
            }
        }
    }

  } else if (ev) {
    // remove all listeners for the event
    if (SVG.listeners[index][ev]) {
      for (namespace in SVG.listeners[index][ev])
        SVG.off(node, [ev, namespace].join('.'))

      delete SVG.listeners[index][ev]
    }

  } else {
    // remove all listeners on a given node
    for (event in SVG.listeners[index])
      SVG.off(node, event)

    delete SVG.listeners[index]
    delete SVG.handlerMap[index]

  }
}

//
SVG.extend(SVG.Element, {
  // Bind given event to listener
  on: function(event, listener, binding, options) {
    SVG.on(this.node, event, listener, binding, options)

    return this
  }
  // Unbind event from listener
, off: function(event, listener) {
    SVG.off(this.node, event, listener)

    return this
  }
  // Fire given event
, fire: function(event, data) {

    // Dispatch event
    if(event instanceof window.Event){
        this.node.dispatchEvent(event)
    }else{
        this.node.dispatchEvent(event = new window.CustomEvent(event, {detail:data, cancelable: true}))
    }

    this._event = event
    return this
  }
, event: function() {
    return this._event
  }
})


SVG.Defs = SVG.invent({
  // Initialize node
  create: 'defs'

  // Inherit from
, inherit: SVG.Container

})
SVG.G = SVG.invent({
  // Initialize node
  create: 'g'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2)
    }
  , gbox: function() {

      var bbox  = this.bbox()
        , trans = this.transform()

      bbox.x  += trans.x
      bbox.x2 += trans.x
      bbox.cx += trans.x

      bbox.y  += trans.y
      bbox.y2 += trans.y
      bbox.cy += trans.y

      return bbox
    }
  }

  // Add parent method
, construct: {
    // Create a group element
    group: function() {
      return this.put(new SVG.G)
    }
  }
})

// ### This module adds backward / forward functionality to elements.

//
SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function() {
    return this.parent().children()
  }
  // Get the curent position siblings
, position: function() {
    return this.parent().index(this)
  }
  // Get the next element (will return null if there is none)
, next: function() {
    return this.siblings()[this.position() + 1]
  }
  // Get the next element (will return null if there is none)
, previous: function() {
    return this.siblings()[this.position() - 1]
  }
  // Send given element one step forward
, forward: function() {
    var i = this.position() + 1
      , p = this.parent()

    // move node one step forward
    p.removeElement(this).add(this, i)

    // make sure defs node is always at the top
    if (p instanceof SVG.Doc)
      p.node.appendChild(p.defs().node)

    return this
  }
  // Send given element one step backward
, backward: function() {
    var i = this.position()

    if (i > 0)
      this.parent().removeElement(this).add(this, i - 1)

    return this
  }
  // Send given element all the way to the front
, front: function() {
    var p = this.parent()

    // Move node forward
    p.node.appendChild(this.node)

    // Make sure defs node is always at the top
    if (p instanceof SVG.Doc)
      p.node.appendChild(p.defs().node)

    return this
  }
  // Send given element all the way to the back
, back: function() {
    if (this.position() > 0)
      this.parent().removeElement(this).add(this, 0)

    return this
  }
  // Inserts a given element before the targeted element
, before: function(element) {
    element.remove()

    var i = this.position()

    this.parent().add(element, i)

    return this
  }
  // Insters a given element after the targeted element
, after: function(element) {
    element.remove()

    var i = this.position()

    this.parent().add(element, i + 1)

    return this
  }

})
SVG.Mask = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('mask'))

    // keep references to masked elements
    this.targets = []
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Unmask all masked elements and remove itself
    remove: function() {
      // unmask all targets
      for (var i = this.targets.length - 1; i >= 0; i--)
        if (this.targets[i])
          this.targets[i].unmask()
      this.targets = []

      // remove mask from parent
      this.parent().removeElement(this)

      return this
    }
  }

  // Add parent method
, construct: {
    // Create masking element
    mask: function() {
      return this.defs().put(new SVG.Mask)
    }
  }
})


SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function(element) {
    // use given mask or create a new one
    this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

    // store reverence on self in mask
    this.masker.targets.push(this)

    // apply mask
    return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
  }
  // Unmask element
, unmask: function() {
    delete this.masker
    return this.attr('mask', null)
  }

})

SVG.ClipPath = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('clipPath'))

    // keep references to clipped elements
    this.targets = []
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Unclip all clipped elements and remove itself
    remove: function() {
      // unclip all targets
      for (var i = this.targets.length - 1; i >= 0; i--)
        if (this.targets[i])
          this.targets[i].unclip()
      this.targets = []

      // remove clipPath from parent
      this.parent().removeElement(this)

      return this
    }
  }

  // Add parent method
, construct: {
    // Create clipping element
    clip: function() {
      return this.defs().put(new SVG.ClipPath)
    }
  }
})

//
SVG.extend(SVG.Element, {
  // Distribute clipPath to svg element
  clipWith: function(element) {
    // use given clip or create a new one
    this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

    // store reverence on self in mask
    this.clipper.targets.push(this)

    // apply mask
    return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
  }
  // Unclip element
, unclip: function() {
    delete this.clipper
    return this.attr('clip-path', null)
  }

})
SVG.Gradient = SVG.invent({
  // Initialize node
  create: function(type) {
    this.constructor.call(this, SVG.create(type + 'Gradient'))

    // store type
    this.type = type
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Add a color stop
    at: function(offset, color, opacity) {
      return this.put(new SVG.Stop).update(offset, color, opacity)
    }
    // Update gradient
  , update: function(block) {
      // remove all stops
      this.clear()

      // invoke passed block
      if (typeof block == 'function')
        block.call(this, this)

      return this
    }
    // Return the fill id
  , fill: function() {
      return 'url(#' + this.id() + ')'
    }
    // Alias string convertion to fill
  , toString: function() {
      return this.fill()
    }
    // custom attr to handle transform
  , attr: function(a, b, c) {
      if(a == 'transform') a = 'gradientTransform'
      return SVG.Container.prototype.attr.call(this, a, b, c)
    }
  }

  // Add parent method
, construct: {
    // Create gradient element in defs
    gradient: function(type, block) {
      return this.defs().gradient(type, block)
    }
  }
})

// Add animatable methods to both gradient and fx module
SVG.extend(SVG.Gradient, SVG.FX, {
  // From position
  from: function(x, y) {
    return (this._target || this).type == 'radial' ?
      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
  }
  // To position
, to: function(x, y) {
    return (this._target || this).type == 'radial' ?
      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
  }
})

// Base gradient generation
SVG.extend(SVG.Defs, {
  // define gradient
  gradient: function(type, block) {
    return this.put(new SVG.Gradient(type)).update(block)
  }

})

SVG.Stop = SVG.invent({
  // Initialize node
  create: 'stop'

  // Inherit from
, inherit: SVG.Element

  // Add class methods
, extend: {
    // add color stops
    update: function(o) {
      if (typeof o == 'number' || o instanceof SVG.Number) {
        o = {
          offset:  arguments[0]
        , color:   arguments[1]
        , opacity: arguments[2]
        }
      }

      // set attributes
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

      return this
    }
  }

})

SVG.Pattern = SVG.invent({
  // Initialize node
  create: 'pattern'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Return the fill id
    fill: function() {
      return 'url(#' + this.id() + ')'
    }
    // Update pattern by rebuilding
  , update: function(block) {
      // remove content
      this.clear()

      // invoke passed block
      if (typeof block == 'function')
        block.call(this, this)

      return this
    }
    // Alias string convertion to fill
  , toString: function() {
      return this.fill()
    }
    // custom attr to handle transform
  , attr: function(a, b, c) {
      if(a == 'transform') a = 'patternTransform'
      return SVG.Container.prototype.attr.call(this, a, b, c)
    }

  }

  // Add parent method
, construct: {
    // Create pattern element in defs
    pattern: function(width, height, block) {
      return this.defs().pattern(width, height, block)
    }
  }
})

SVG.extend(SVG.Defs, {
  // Define gradient
  pattern: function(width, height, block) {
    return this.put(new SVG.Pattern).update(block).attr({
      x:            0
    , y:            0
    , width:        width
    , height:       height
    , patternUnits: 'userSpaceOnUse'
    })
  }

})
SVG.Doc = SVG.invent({
  // Initialize node
  create: function(element) {
    if (element) {
      // ensure the presence of a dom element
      element = typeof element == 'string' ?
        document.getElementById(element) :
        element

      // If the target is an svg element, use that element as the main wrapper.
      // This allows svg.js to work with svg documents as well.
      if (element.nodeName == 'svg') {
        this.constructor.call(this, element)
      } else {
        this.constructor.call(this, SVG.create('svg'))
        element.appendChild(this.node)
        this.size('100%', '100%')
      }

      // set svg element attributes and ensure defs node
      this.namespace().defs()
    }
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Add namespaces
    namespace: function() {
      return this
        .attr({ xmlns: SVG.ns, version: '1.1' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
    }
    // Creates and returns defs element
  , defs: function() {
      if (!this._defs) {
        var defs

        // Find or create a defs element in this instance
        if (defs = this.node.getElementsByTagName('defs')[0])
          this._defs = SVG.adopt(defs)
        else
          this._defs = new SVG.Defs

        // Make sure the defs node is at the end of the stack
        this.node.appendChild(this._defs.node)
      }

      return this._defs
    }
    // custom parent method
  , parent: function() {
      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
    }
    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , spof: function() {
      var pos = this.node.getScreenCTM()

      if (pos)
        this
          .style('left', (-pos.e % 1) + 'px')
          .style('top',  (-pos.f % 1) + 'px')

      return this
    }

      // Removes the doc from the DOM
  , remove: function() {
      if(this.parent()) {
        this.parent().removeChild(this.node)
      }

      return this
    }
  , clear: function() {
      // remove children
      while(this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)

      // remove defs reference
      delete this._defs

      // add back parser
      if(!SVG.parser.draw.parentNode)
        this.node.appendChild(SVG.parser.draw)

      return this
    }
  }

})

SVG.Shape = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Element

})

SVG.Bare = SVG.invent({
  // Initialize
  create: function(element, inherit) {
    // construct element
    this.constructor.call(this, SVG.create(element))

    // inherit custom methods
    if (inherit)
      for (var method in inherit.prototype)
        if (typeof inherit.prototype[method] === 'function')
          this[method] = inherit.prototype[method]
  }

  // Inherit from
, inherit: SVG.Element

  // Add methods
, extend: {
    // Insert some plain text
    words: function(text) {
      // remove contents
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)

      // create text node
      this.node.appendChild(document.createTextNode(text))

      return this
    }
  }
})


SVG.extend(SVG.Parent, {
  // Create an element that is not described by SVG.js
  element: function(element, inherit) {
    return this.put(new SVG.Bare(element, inherit))
  }
})

SVG.Symbol = SVG.invent({
  // Initialize node
  create: 'symbol'

  // Inherit from
, inherit: SVG.Container

, construct: {
    // create symbol
    symbol: function() {
      return this.put(new SVG.Symbol)
    }
  }
})

SVG.Use = SVG.invent({
  // Initialize node
  create: 'use'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Use element as a reference
    element: function(element, file) {
      // Set lined element
      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
    }
  }

  // Add parent method
, construct: {
    // Create a use element
    use: function(element, file) {
      return this.put(new SVG.Use).element(element, file)
    }
  }
})
SVG.Rect = SVG.invent({
  // Initialize node
  create: 'rect'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create a rect element
    rect: function(width, height) {
      return this.put(new SVG.Rect()).size(width, height)
    }
  }
})
SVG.Circle = SVG.invent({
  // Initialize node
  create: 'circle'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create circle element, based on ellipse
    circle: function(size) {
      return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
    }
  }
})

SVG.extend(SVG.Circle, SVG.FX, {
  // Radius x value
  rx: function(rx) {
    return this.attr('r', rx)
  }
  // Alias radius x value
, ry: function(ry) {
    return this.rx(ry)
  }
})

SVG.Ellipse = SVG.invent({
  // Initialize node
  create: 'ellipse'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create an ellipse
    ellipse: function(width, height) {
      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
    }
  }
})

SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
  // Radius x value
  rx: function(rx) {
    return this.attr('rx', rx)
  }
  // Radius y value
, ry: function(ry) {
    return this.attr('ry', ry)
  }
})

// Add common method
SVG.extend(SVG.Circle, SVG.Ellipse, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.attr('cx') : this.attr('cx', x)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.attr('cy') : this.attr('cy', y)
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
    }
    // Custom size function
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this
        .rx(new SVG.Number(p.width).divide(2))
        .ry(new SVG.Number(p.height).divide(2))
    }
})
SVG.Line = SVG.invent({
  // Initialize node
  create: 'line'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Get array
    array: function() {
      return new SVG.PointArray([
        [ this.attr('x1'), this.attr('y1') ]
      , [ this.attr('x2'), this.attr('y2') ]
      ])
    }
    // Overwrite native plot() method
  , plot: function(x1, y1, x2, y2) {
      if (x1 == null)
        return this.array()
      else if (typeof y1 !== 'undefined')
        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
      else
        x1 = new SVG.PointArray(x1).toLine()

      return this.attr(x1)
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr(this.array().move(x, y).toLine())
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this.attr(this.array().size(p.width, p.height).toLine())
    }
  }

  // Add parent method
, construct: {
    // Create a line element
    line: function(x1, y1, x2, y2) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a SVG.PointArray
      return SVG.Line.prototype.plot.apply(
        this.put(new SVG.Line)
      , x1 != null ? [x1, y1, x2, y2] : [0, 0, 0, 0]
      )
    }
  }
})

SVG.Polyline = SVG.invent({
  // Initialize node
  create: 'polyline'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create a wrapped polyline element
    polyline: function(p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polyline).plot(p || new SVG.PointArray)
    }
  }
})

SVG.Polygon = SVG.invent({
  // Initialize node
  create: 'polygon'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create a wrapped polygon element
    polygon: function(p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polygon).plot(p || new SVG.PointArray)
    }
  }
})

// Add polygon-specific functions
SVG.extend(SVG.Polyline, SVG.Polygon, {
  // Get array
  array: function() {
    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
  }
  // Plot new path
, plot: function(p) {
    return (p == null) ?
      this.array() :
      this.clear().attr('points', typeof p == 'string' ? p : (this._array = new SVG.PointArray(p)))
  }
  // Clear array cache
, clear: function() {
    delete this._array
    return this
  }
  // Move by left top corner
, move: function(x, y) {
    return this.attr('points', this.array().move(x, y))
  }
  // Set element size to given width and height
, size: function(width, height) {
    var p = proportionalSize(this, width, height)

    return this.attr('points', this.array().size(p.width, p.height))
  }

})

// unify all point to point elements
SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
  // Define morphable array
  morphArray:  SVG.PointArray
  // Move by left top corner over x-axis
, x: function(x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }
  // Move by left top corner over y-axis
, y: function(y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }
  // Set width of element
, width: function(width) {
    var b = this.bbox()

    return width == null ? b.width : this.size(width, b.height)
  }
  // Set height of element
, height: function(height) {
    var b = this.bbox()

    return height == null ? b.height : this.size(b.width, height)
  }
})
SVG.Path = SVG.invent({
  // Initialize node
  create: 'path'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Define morphable array
    morphArray:  SVG.PathArray
    // Get array
  , array: function() {
      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
    }
    // Plot new path
  , plot: function(d) {
      return (d == null) ?
        this.array() :
        this.clear().attr('d', typeof d == 'string' ? d : (this._array = new SVG.PathArray(d)))
    }
    // Clear array cache
  , clear: function() {
      delete this._array
      return this
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('d', this.array().move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this.attr('d', this.array().size(p.width, p.height))
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
    }

  }

  // Add parent method
, construct: {
    // Create a wrapped path element
    path: function(d) {
      // make sure plot is called as a setter
      return this.put(new SVG.Path).plot(d || new SVG.PathArray)
    }
  }
})

SVG.Image = SVG.invent({
  // Initialize node
  create: 'image'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // (re)load image
    load: function(url) {
      if (!url) return this

      var self = this
        , img  = new window.Image()

      // preload image
      SVG.on(img, 'load', function() {
        SVG.off(img)

        var p = self.parent(SVG.Pattern)

        if(p === null) return

        // ensure image size
        if (self.width() == 0 && self.height() == 0)
          self.size(img.width, img.height)

        // ensure pattern size if not set
        if (p && p.width() == 0 && p.height() == 0)
          p.size(self.width(), self.height())

        // callback
        if (typeof self._loaded === 'function')
          self._loaded.call(self, {
            width:  img.width
          , height: img.height
          , ratio:  img.width / img.height
          , url:    url
          })
      })

      SVG.on(img, 'error', function(e){
        SVG.off(img)

        if (typeof self._error === 'function'){
            self._error.call(self, e)
        }
      })

      return this.attr('href', (img.src = this.src = url), SVG.xlink)
    }
    // Add loaded callback
  , loaded: function(loaded) {
      this._loaded = loaded
      return this
    }

  , error: function(error) {
      this._error = error
      return this
    }
  }

  // Add parent method
, construct: {
    // create image element, load image and set its size
    image: function(source, width, height) {
      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
    }
  }

})
SVG.Text = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('text'))

    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
    this._rebuild = true                      // enable automatic updating of dy values
    this._build   = false                     // disable build mode for adding multiple lines

    // set default font
    this.attr('font-family', SVG.defaults.attrs['font-family'])
  }

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      // act as getter
      if (x == null)
        return this.attr('x')

      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      var oy = this.attr('y')
        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

      // act as getter
      if (y == null)
        return typeof oy === 'number' ? oy - o : oy

      return this.attr('y', typeof y === 'number' ? y + o : y)
    }
    // Move center over x-axis
  , cx: function(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move center over y-axis
  , cy: function(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }
    // Set the text content
  , text: function(text) {
      // act as getter
      if (typeof text === 'undefined'){
        var text = ''
        var children = this.node.childNodes
        for(var i = 0, len = children.length; i < len; ++i){

          // add newline if its not the first child and newLined is set to true
          if(i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true){
            text += '\n'
          }

          // add content of this node
          text += children[i].textContent
        }

        return text
      }

      // remove existing content
      this.clear().build(true)

      if (typeof text === 'function') {
        // call block
        text.call(this, this)

      } else {
        // store text and make sure text is not blank
        text = text.split('\n')

        // build new lines
        for (var i = 0, il = text.length; i < il; i++)
          this.tspan(text[i]).newLine()
      }

      // disable build mode and rebuild lines
      return this.build(false).rebuild()
    }
    // Set font size
  , size: function(size) {
      return this.attr('font-size', size).rebuild()
    }
    // Set / get leading
  , leading: function(value) {
      // act as getter
      if (value == null)
        return this.dom.leading

      // act as setter
      this.dom.leading = new SVG.Number(value)

      return this.rebuild()
    }
    // Get all the first level lines
  , lines: function() {
      var node = (this.textPath && this.textPath() || this).node

      // filter tspans and map them to SVG.js instances
      var lines = SVG.utils.map(SVG.utils.filterSVGElements(node.childNodes), function(el){
        return SVG.adopt(el)
      })

      // return an instance of SVG.set
      return new SVG.Set(lines)
    }
    // Rebuild appearance type
  , rebuild: function(rebuild) {
      // store new rebuild flag if given
      if (typeof rebuild == 'boolean')
        this._rebuild = rebuild

      // define position of all lines
      if (this._rebuild) {
        var self = this
          , blankLineOffset = 0
          , dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

        this.lines().each(function() {
          if (this.dom.newLined) {
            if (!self.textPath())
              this.attr('x', self.attr('x'))
            if(this.text() == '\n') {
              blankLineOffset += dy
            }else{
              this.attr('dy', dy + blankLineOffset)
              blankLineOffset = 0
            }
          }
        })

        this.fire('rebuild')
      }

      return this
    }
    // Enable / disable build mode
  , build: function(build) {
      this._build = !!build
      return this
    }
    // overwrite method from parent to set data properly
  , setData: function(o){
      this.dom = o
      this.dom.leading = new SVG.Number(o.leading || 1.3)
      return this
    }
  }

  // Add parent method
, construct: {
    // Create text element
    text: function(text) {
      return this.put(new SVG.Text).text(text)
    }
    // Create plain text element
  , plain: function(text) {
      return this.put(new SVG.Text).plain(text)
    }
  }

})

SVG.Tspan = SVG.invent({
  // Initialize node
  create: 'tspan'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Set text content
    text: function(text) {
      if(text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

      typeof text === 'function' ? text.call(this, this) : this.plain(text)

      return this
    }
    // Shortcut dx
  , dx: function(dx) {
      return this.attr('dx', dx)
    }
    // Shortcut dy
  , dy: function(dy) {
      return this.attr('dy', dy)
    }
    // Create new line
  , newLine: function() {
      // fetch text parent
      var t = this.parent(SVG.Text)

      // mark new line
      this.dom.newLined = true

      // apply new hy¡n
      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
    }
  }

})

SVG.extend(SVG.Text, SVG.Tspan, {
  // Create plain text node
  plain: function(text) {
    // clear if build mode is disabled
    if (this._build === false)
      this.clear()

    // create text node
    this.node.appendChild(document.createTextNode(text))

    return this
  }
  // Create a tspan
, tspan: function(text) {
    var node  = (this.textPath && this.textPath() || this).node
      , tspan = new SVG.Tspan

    // clear if build mode is disabled
    if (this._build === false)
      this.clear()

    // add new tspan
    node.appendChild(tspan.node)

    return tspan.text(text)
  }
  // Clear all lines
, clear: function() {
    var node = (this.textPath && this.textPath() || this).node

    // remove existing child nodes
    while (node.hasChildNodes())
      node.removeChild(node.lastChild)

    return this
  }
  // Get length of text element
, length: function() {
    return this.node.getComputedTextLength()
  }
})

SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath'

  // Inherit from
, inherit: SVG.Parent

  // Define parent class
, parent: SVG.Text

  // Add parent method
, construct: {
    morphArray: SVG.PathArray
    // Create path for text to run on
  , path: function(d) {
      // create textPath element
      var path  = new SVG.TextPath
        , track = this.doc().defs().path(d)

      // move lines to textpath
      while (this.node.hasChildNodes())
        path.node.appendChild(this.node.firstChild)

      // add textPath element as child node
      this.node.appendChild(path.node)

      // link textPath to path and add content
      path.attr('href', '#' + track, SVG.xlink)

      return this
    }
    // return the array of the path track element
  , array: function() {
      var track = this.track()

      return track ? track.array() : null
    }
    // Plot path if any
  , plot: function(d) {
      var track = this.track()
        , pathArray = null

      if (track) {
        pathArray = track.plot(d)
      }

      return (d == null) ? pathArray : this
    }
    // Get the path track element
  , track: function() {
      var path = this.textPath()

      if (path)
        return path.reference('href')
    }
    // Get the textPath child
  , textPath: function() {
      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
        return SVG.adopt(this.node.firstChild)
    }
  }
})

SVG.Nested = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('svg'))

    this.style('overflow', 'visible')
  }

  // Inherit from
, inherit: SVG.Container

  // Add parent method
, construct: {
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Nested)
    }
  }
})
SVG.A = SVG.invent({
  // Initialize node
  create: 'a'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Link url
    to: function(url) {
      return this.attr('href', url, SVG.xlink)
    }
    // Link show attribute
  , show: function(target) {
      return this.attr('show', target, SVG.xlink)
    }
    // Link target attribute
  , target: function(target) {
      return this.attr('target', target)
    }
  }

  // Add parent method
, construct: {
    // Create a hyperlink element
    link: function(url) {
      return this.put(new SVG.A).to(url)
    }
  }
})

SVG.extend(SVG.Element, {
  // Create a hyperlink element
  linkTo: function(url) {
    var link = new SVG.A

    if (typeof url == 'function')
      url.call(link, link)
    else
      link.to(url)

    return this.parent().put(link).put(this)
  }

})
SVG.Marker = SVG.invent({
  // Initialize node
  create: 'marker'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Set width of element
    width: function(width) {
      return this.attr('markerWidth', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('markerHeight', height)
    }
    // Set marker refX and refY
  , ref: function(x, y) {
      return this.attr('refX', x).attr('refY', y)
    }
    // Update marker
  , update: function(block) {
      // remove all content
      this.clear()

      // invoke passed block
      if (typeof block == 'function')
        block.call(this, this)

      return this
    }
    // Return the fill id
  , toString: function() {
      return 'url(#' + this.id() + ')'
    }
  }

  // Add parent method
, construct: {
    marker: function(width, height, block) {
      // Create marker element in defs
      return this.defs().marker(width, height, block)
    }
  }

})

SVG.extend(SVG.Defs, {
  // Create marker
  marker: function(width, height, block) {
    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
    return this.put(new SVG.Marker)
      .size(width, height)
      .ref(width / 2, height / 2)
      .viewbox(0, 0, width, height)
      .attr('orient', 'auto')
      .update(block)
  }

})

SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
  // Create and attach markers
  marker: function(marker, width, height, block) {
    var attr = ['marker']

    // Build attribute name
    if (marker != 'all') attr.push(marker)
    attr = attr.join('-')

    // Set marker attribute
    marker = arguments[1] instanceof SVG.Marker ?
      arguments[1] :
      this.doc().marker(width, height, block)

    return this.attr(attr, marker)
  }

})
// Define list of available attributes for stroke and fill
var sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
, fill:   ['color', 'opacity', 'rule']
, prefix: function(t, a) {
    return a == 'color' ? t : t + '-' + a
  }
}

// Add sugar for fill and stroke
;['fill', 'stroke'].forEach(function(m) {
  var i, extension = {}

  extension[m] = function(o) {
    if (typeof o == 'undefined')
      return this
    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
      this.attr(m, o)

    else
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--)
        if (o[sugar[m][i]] != null)
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])

    return this
  }

  SVG.extend(SVG.Element, SVG.FX, extension)

})

SVG.extend(SVG.Element, SVG.FX, {
  // Map rotation to transform
  rotate: function(d, cx, cy) {
    return this.transform({ rotation: d, cx: cx, cy: cy })
  }
  // Map skew to transform
, skew: function(x, y, cx, cy) {
    return arguments.length == 1  || arguments.length == 3 ?
      this.transform({ skew: x, cx: y, cy: cx }) :
      this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
  }
  // Map scale to transform
, scale: function(x, y, cx, cy) {
    return arguments.length == 1  || arguments.length == 3 ?
      this.transform({ scale: x, cx: y, cy: cx }) :
      this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
  }
  // Map translate to transform
, translate: function(x, y) {
    return this.transform({ x: x, y: y })
  }
  // Map flip to transform
, flip: function(a, o) {
    o = typeof a == 'number' ? a : o
    return this.transform({ flip: a || 'both', offset: o })
  }
  // Map matrix to transform
, matrix: function(m) {
    return this.attr('transform', new SVG.Matrix(arguments.length == 6 ? [].slice.call(arguments) : m))
  }
  // Opacity
, opacity: function(value) {
    return this.attr('opacity', value)
  }
  // Relative move over x axis
, dx: function(x) {
    return this.x(new SVG.Number(x).plus(this instanceof SVG.FX ? 0 : this.x()), true)
  }
  // Relative move over y axis
, dy: function(y) {
    return this.y(new SVG.Number(y).plus(this instanceof SVG.FX ? 0 : this.y()), true)
  }
  // Relative move over x and y axes
, dmove: function(x, y) {
    return this.dx(x).dy(y)
  }
})

SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
  // Add x and y radius
  radius: function(x, y) {
    var type = (this._target || this).type;
    return type == 'radial' || type == 'circle' ?
      this.attr('r', new SVG.Number(x)) :
      this.rx(x).ry(y == null ? x : y)
  }
})

SVG.extend(SVG.Path, {
  // Get path length
  length: function() {
    return this.node.getTotalLength()
  }
  // Get point at length
, pointAt: function(length) {
    return this.node.getPointAtLength(length)
  }
})

SVG.extend(SVG.Parent, SVG.Text, SVG.Tspan, SVG.FX, {
  // Set font
  font: function(a, v) {
    if (typeof a == 'object') {
      for (v in a) this.font(v, a[v])
    }

    return a == 'leading' ?
        this.leading(v) :
      a == 'anchor' ?
        this.attr('text-anchor', v) :
      a == 'size' || a == 'family' || a == 'weight' || a == 'stretch' || a == 'variant' || a == 'style' ?
        this.attr('font-'+ a, v) :
        this.attr(a, v)
  }
})

SVG.Set = SVG.invent({
  // Initialize
  create: function(members) {
    // Set initial state
    Array.isArray(members) ? this.members = members : this.clear()
  }

  // Add class methods
, extend: {
    // Add element to set
    add: function() {
      var i, il, elements = [].slice.call(arguments)

      for (i = 0, il = elements.length; i < il; i++)
        this.members.push(elements[i])

      return this
    }
    // Remove element from set
  , remove: function(element) {
      var i = this.index(element)

      // remove given child
      if (i > -1)
        this.members.splice(i, 1)

      return this
    }
    // Iterate over all members
  , each: function(block) {
      for (var i = 0, il = this.members.length; i < il; i++)
        block.apply(this.members[i], [i, this.members])

      return this
    }
    // Restore to defaults
  , clear: function() {
      // initialize store
      this.members = []

      return this
    }
    // Get the length of a set
  , length: function() {
      return this.members.length
    }
    // Checks if a given element is present in set
  , has: function(element) {
      return this.index(element) >= 0
    }
    // retuns index of given element in set
  , index: function(element) {
      return this.members.indexOf(element)
    }
    // Get member at given index
  , get: function(i) {
      return this.members[i]
    }
    // Get first member
  , first: function() {
      return this.get(0)
    }
    // Get last member
  , last: function() {
      return this.get(this.members.length - 1)
    }
    // Default value
  , valueOf: function() {
      return this.members
    }
    // Get the bounding box of all members included or empty box if set has no items
  , bbox: function(){
      // return an empty box of there are no members
      if (this.members.length == 0)
        return new SVG.RBox()

      // get the first rbox and update the target bbox
      var rbox = this.members[0].rbox(this.members[0].doc())

      this.each(function() {
        // user rbox for correct position and visual representation
        rbox = rbox.merge(this.rbox(this.doc()))
      })

      return rbox
    }
  }

  // Add parent method
, construct: {
    // Create a new set
    set: function(members) {
      return new SVG.Set(members)
    }
  }
})

SVG.FX.Set = SVG.invent({
  // Initialize node
  create: function(set) {
    // store reference to set
    this.set = set
  }

})

// Alias methods
SVG.Set.inherit = function() {
  var m
    , methods = []

  // gather shape methods
  for(var m in SVG.Shape.prototype)
    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
      methods.push(m)

  // apply shape aliasses
  methods.forEach(function(method) {
    SVG.Set.prototype[method] = function() {
      for (var i = 0, il = this.members.length; i < il; i++)
        if (this.members[i] && typeof this.members[i][method] == 'function')
          this.members[i][method].apply(this.members[i], arguments)

      return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
    }
  })

  // clear methods for the next round
  methods = []

  // gather fx methods
  for(var m in SVG.FX.prototype)
    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
      methods.push(m)

  // apply fx aliasses
  methods.forEach(function(method) {
    SVG.FX.Set.prototype[method] = function() {
      for (var i = 0, il = this.set.members.length; i < il; i++)
        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

      return this
    }
  })
}




SVG.extend(SVG.Element, {
  // Store data values on svg nodes
  data: function(a, v, r) {
    if (typeof a == 'object') {
      for (v in a)
        this.data(v, a[v])

    } else if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr('data-' + a))
      } catch(e) {
        return this.attr('data-' + a)
      }

    } else {
      this.attr(
        'data-' + a
      , v === null ?
          null :
        r === true || typeof v === 'string' || typeof v === 'number' ?
          v :
          JSON.stringify(v)
      )
    }

    return this
  }
})
SVG.extend(SVG.Element, {
  // Remember arbitrary data
  remember: function(k, v) {
    // remember every item in an object individually
    if (typeof arguments[0] == 'object')
      for (var v in k)
        this.remember(v, k[v])

    // retrieve memory
    else if (arguments.length == 1)
      return this.memory()[k]

    // store memory
    else
      this.memory()[k] = v

    return this
  }

  // Erase a given memory
, forget: function() {
    if (arguments.length == 0)
      this._memory = {}
    else
      for (var i = arguments.length - 1; i >= 0; i--)
        delete this.memory()[arguments[i]]

    return this
  }

  // Initialize or return local memory object
, memory: function() {
    return this._memory || (this._memory = {})
  }

})
// Method for getting an element by id
SVG.get = function(id) {
  var node = document.getElementById(idFromReference(id) || id)
  return SVG.adopt(node)
}

// Select elements by query string
SVG.select = function(query, parent) {
  return new SVG.Set(
    SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
      return SVG.adopt(node)
    })
  )
}

SVG.extend(SVG.Parent, {
  // Scoped select method
  select: function(query) {
    return SVG.select(query, this.node)
  }

})
function pathRegReplace(a, b, c, d) {
  return c + d.replace(SVG.regex.dots, ' .')
}

// creates deep clone of array
function array_clone(arr){
  var clone = arr.slice(0)
  for(var i = clone.length; i--;){
    if(Array.isArray(clone[i])){
      clone[i] = array_clone(clone[i])
    }
  }
  return clone
}

// tests if a given element is instance of an object
function is(el, obj){
  return el instanceof obj
}

// tests if a given selector matches an element
function matches(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}

// Convert dash-separated-string to camelCase
function camelCase(s) {
  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
    return g.toUpperCase()
  })
}

// Capitalize first letter of a string
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Ensure to six-based hex
function fullHex(hex) {
  return hex.length == 4 ?
    [ '#',
      hex.substring(1, 2), hex.substring(1, 2)
    , hex.substring(2, 3), hex.substring(2, 3)
    , hex.substring(3, 4), hex.substring(3, 4)
    ].join('') : hex
}

// Component to hex value
function compToHex(comp) {
  var hex = comp.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
function proportionalSize(element, width, height) {
  if (width == null || height == null) {
    var box = element.bbox()

    if (width == null)
      width = box.width / box.height * height
    else if (height == null)
      height = box.height / box.width * width
  }

  return {
    width:  width
  , height: height
  }
}

// Delta transform point
function deltaTransformPoint(matrix, x, y) {
  return {
    x: x * matrix.a + y * matrix.c + 0
  , y: x * matrix.b + y * matrix.d + 0
  }
}

// Map matrix array to object
function arrayToMatrix(a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// Parse matrix if required
function parseMatrix(matrix) {
  if (!(matrix instanceof SVG.Matrix))
    matrix = new SVG.Matrix(matrix)

  return matrix
}

// Add centre point to transform object
function ensureCentre(o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx
  o.cy = o.cy == null ? target.bbox().cy : o.cy
}

// PathArray Helpers
function arrayToString(a) {
  for (var i = 0, il = a.length, s = ''; i < il; i++) {
    s += a[i][0]

    if (a[i][1] != null) {
      s += a[i][1]

      if (a[i][2] != null) {
        s += ' '
        s += a[i][2]

        if (a[i][3] != null) {
          s += ' '
          s += a[i][3]
          s += ' '
          s += a[i][4]

          if (a[i][5] != null) {
            s += ' '
            s += a[i][5]
            s += ' '
            s += a[i][6]

            if (a[i][7] != null) {
              s += ' '
              s += a[i][7]
            }
          }
        }
      }
    }
  }

  return s + ' '
}

// Deep new id assignment
function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (var i = node.childNodes.length - 1; i >= 0; i--)
    if (node.childNodes[i] instanceof window.SVGElement)
      assignNewId(node.childNodes[i])

  return SVG.adopt(node).id(SVG.eid(node.nodeName))
}

// Add more bounding box properties
function fullBox(b) {
  if (b.x == null) {
    b.x      = 0
    b.y      = 0
    b.width  = 0
    b.height = 0
  }

  b.w  = b.width
  b.h  = b.height
  b.x2 = b.x + b.width
  b.y2 = b.y + b.height
  b.cx = b.x + b.width / 2
  b.cy = b.y + b.height / 2

  return b
}

// Get id from reference string
function idFromReference(url) {
  var m = url.toString().match(SVG.regex.reference)

  if (m) return m[1]
}

// Create matrix array for looping
var abcdef = 'abcdef'.split('')
// Add CustomEvent to IE9 and IE10
if (typeof window.CustomEvent !== 'function') {
  // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
  var CustomEvent = function(event, options) {
    options = options || { bubbles: false, cancelable: false, detail: undefined }
    var e = document.createEvent('CustomEvent')
    e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
    return e
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
}

// requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
(function(w) {
  var lastTime = 0
  var vendors = ['moz', 'webkit']

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
    w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
                              w[vendors[x] + 'CancelRequestAnimationFrame']
  }

  w.requestAnimationFrame = w.requestAnimationFrame ||
    function(callback) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))

      var id = w.setTimeout(function() {
        callback(currTime + timeToCall)
      }, timeToCall)

      lastTime = currTime + timeToCall
      return id
    }

  w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;

}(window))

return SVG

}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVG = __webpack_require__(0);
var missingM = 'missing M in the begining';
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.rotate = function (input, rotate) {
        var path = new SVG.Path();
        path.plot(input);
        var matrix = path.rotate(rotate).transform().matrix;
        input.value.forEach(function (element) {
            if (element.length === 3) {
                var point = new SVG.Point([element[1], element[2]]);
                point = point.transform(matrix);
                element[1] = point.x;
                element[2] = point.y;
            }
        });
        return input;
    };
    Helper.validateInput = function (input) {
        if (input[0] !== 'M' && input[0] !== 'm') {
            return this.reportError(missingM);
        }
        var regex = /(M|m|L|l|Z|z|H|h|V|v)/;
        var result = [];
        var splitedString = input.split(regex);
        if (splitedString[0] === '') {
            splitedString.shift();
        }
        if (splitedString[splitedString.length - 1] === '') {
            splitedString.pop();
        }
        try {
            splitedString.forEach(function (element) {
                if (element.length !== 1) {
                    var points = element.trim().split(' ');
                    if (points.length % 2 === 1) {
                        throw new Error('Invalid params length');
                    }
                    var pointsInt = points.map(function (point) { return parseInt(point); });
                    pointsInt.forEach(function (point) {
                        if (typeof point !== 'number' || isNaN(point)) {
                            throw new Error('Not a number');
                        }
                    });
                }
            });
        }
        catch (error) {
            return this.reportError(error.message);
        }
        return this.reportSuccess();
    };
    Helper.parsePath = function (input) {
        var regex = /(M|m|L|l|Z|z)/;
        var result = [];
        var splitedString = input.split(regex);
        if (splitedString[0] === '') {
            splitedString.shift();
        }
        if (splitedString[splitedString.length - 1] === '') {
            splitedString.pop();
        }
        splitedString.forEach(function (element) {
            if (element.length === 1) {
                result.push(element.trim());
            }
            else {
                var points = element.split(' ').map(function (point) { return parseInt(point.trim()); });
                if (points.length % 2 === 1) {
                    throw new Error('Invalid params length');
                }
                points.forEach(function (point) {
                    if (typeof point !== 'number' || isNaN(point)) {
                        throw new Error('Not a number');
                    }
                });
                var pointsArray = [];
                for (var i = 0; i < points.length; i = i + 2) {
                    pointsArray.push([points[i], points[i + 1]]);
                }
                result.push(pointsArray);
            }
        });
        return result;
    };
    Helper.buildPath = function (input) {
        var result = input.reduce(function (acc, curr) {
            return acc + curr.toString();
        }, '');
        return result.replace(/,/g, ' ');
    };
    Helper.scale = function (input, scaleFactor) {
        input[1][0] = input[1][0].map(function (cord) { return cord * scaleFactor; });
        input[3] = input[3].map(function (cord) { return cord.map(function (point) { return point * scaleFactor; }); });
        return input;
    };
    Helper.scalePath = function (input, scaleFactor) {
        input.value.forEach(function (element) {
            if (typeof element[1] !== 'undefined') {
                element[1] = element[1] * scaleFactor;
            }
            if (typeof element[2] !== 'undefined') {
                element[2] = element[2] * scaleFactor;
            }
        });
        return input;
    };
    Helper.translateX = function (input, translateXFactor) {
        input[1][0][0] = input[1][0][0] + translateXFactor;
        input[3] = input[3].map(function (cord) { return [
            (cord[0] = cord[0] + translateXFactor),
            cord[1],
        ]; });
        return input;
    };
    Helper.translateXPath = function (input, translateXFactor) {
        input.value.forEach(function (element) {
            if (typeof element[1] !== 'undefined') {
                element[1] = element[1] + translateXFactor;
            }
        });
        return input;
    };
    Helper.translateY = function (input, translateYFactor) {
        input[1][0][1] = input[1][0][1] + translateYFactor;
        input[3] = input[3].map(function (cord) { return [
            cord[0],
            (cord[1] = cord[1] + translateYFactor),
        ]; });
        return input;
    };
    Helper.translateYPath = function (input, translateYFactor) {
        input.value.forEach(function (element) {
            if (typeof element[2] !== 'undefined') {
                element[2] = element[2] + translateYFactor;
            }
        });
        return input;
    };
    Helper.reportError = function (message) {
        return {
            valid: false,
            error: message,
        };
    };
    Helper.reportSuccess = function () {
        return {
            valid: true,
        };
    };
    return Helper;
}());
exports.Helper = Helper;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(3);
var editor_1 = __webpack_require__(4);
__webpack_require__(7);
window.onload = function () {
    var editor = new editor_1.Editor({
        pathInput: document.getElementById('pathInput'),
        scale: document.getElementById('scale'),
        transX: document.getElementById('transX'),
        transY: document.getElementById('transY'),
        rotate: document.getElementById('rotate'),
        output: document.getElementById('output'),
    });
};
document.getElementById('copyButton').addEventListener('click', function () {
    var output = document.querySelector('#output');
    var range = document.createRange();
    range.selectNode(output);
    window.getSelection().addRange(range);
    var successful = document.execCommand('copy');
    alert("Path copied: " + output.textContent);
    window.getSelection().removeAllRanges();
});


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(1);
var editorFacade_1 = __webpack_require__(5);
var SVG = __webpack_require__(0);
var Editor = /** @class */ (function () {
    function Editor(html) {
        var _this = this;
        this.html = html;
        this.pathInput = html.pathInput;
        this.output = html.output;
        this.svgPath = this.svgPath || new SVG.Path();
        for (var element in html) {
            if ((html.hasOwnProperty(element) &&
                html[element] instanceof HTMLTextAreaElement) ||
                html[element] instanceof HTMLInputElement) {
                html[element].addEventListener('input', function (_) {
                    _this.calculatePath();
                });
            }
        }
        this.svgDoc = SVG('svgOutput').viewbox(0, 0, 300, 300);
        this.calculatePath();
    }
    Editor.prototype.addPoint = function () {
        var path = this.svgPath.array();
        var last = path.value.pop();
        if (last[0] == 'Z' || last[0] == 'z') {
            path.value.push(['L', 10, 10]);
            path.value.push(last);
        }
        else {
            path.value.push(last);
            path.value.push(['L', 10, 10]);
        }
        this.redraw(path);
    };
    Editor.prototype.calculatePath = function (data) {
        if (data === void 0) { data = this.getRawValue(); }
        var path;
        this.output.textContent = '';
        var result = helpers_1.Helper.validateInput(data.pathInput);
        if (result.valid === false) {
            this.output.textContent = result.error;
            return;
        }
        path = editorFacade_1.EditorFacade.getTransformatedPath(data);
        this.redraw(path);
    };
    Editor.prototype.redraw = function (path) {
        this.svgDoc.clear();
        this.svgDoc.add(this.svgPath);
        this.drawPath(path);
        this.attachAncors(path);
    };
    Editor.prototype.drawPath = function (path) {
        ;
        this.svgPath.clear();
        this.svgPath.plot(path);
        this.output.textContent = path.toString();
        this.svgPath.fill('none');
        this.svgPath.stroke({
            color: '#9b4dca',
            width: 1,
            linecap: 'round',
            linejoin: 'round',
        });
    };
    Editor.prototype.attachAncors = function (path) {
        var _this = this;
        path.value.map(function (point) { return _this.drawPoint(point, path); });
    };
    Editor.prototype.drawPoint = function (point, path) {
        var _this = this;
        if (point.length === 3) {
            var circle = this.svgDoc.circle(6).move(point[1] - 3, point[2] - 3);
            circle.draggable();
            circle.on('dragmove', function (event) {
                point[1] = event.target.cx.baseVal.valueInSpecifiedUnits;
                point[2] = event.target.cy.baseVal.valueInSpecifiedUnits;
                _this.drawPath(path);
            });
        }
    };
    Editor.prototype.getRawValue = function () {
        return {
            pathInput: this.html.pathInput.value,
            scale: parseInt(this.html.scale.value),
            transX: parseInt(this.html.transX.value),
            transY: parseInt(this.html.transY.value),
            rotate: parseInt(this.html.rotate.value),
        };
    };
    return Editor;
}());
exports.Editor = Editor;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __webpack_require__(6);
var EditorFacade = /** @class */ (function () {
    function EditorFacade() {
    }
    EditorFacade.getTransformatedPath = function (input) {
        //1. parse
        //2. scale
        //3. moveX
        //4. moveY
        //5. rotate
        //6. print
        var path = new path_1.Path(input.pathInput)
            .scalePath(input.scale)
            .translateX(input.transX)
            .translateY(input.transY)
            .rotate(input.rotate);
        return path.getPathArray();
    };
    return EditorFacade;
}());
exports.EditorFacade = EditorFacade;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(1);
var SVG = __webpack_require__(0);
var Path = /** @class */ (function () {
    function Path(input) {
        var path = new SVG.Path();
        path.plot(input);
        this.path = path.array();
    }
    Path.prototype.scalePath = function (scaleFactory) {
        this.path = helpers_1.Helper.scalePath(this.path, scaleFactory);
        return this;
    };
    Path.prototype.translateX = function (transX) {
        this.path = helpers_1.Helper.translateXPath(this.path, transX);
        return this;
    };
    Path.prototype.translateY = function (transY) {
        this.path = helpers_1.Helper.translateYPath(this.path, transY);
        return this;
    };
    Path.prototype.getPathArray = function () {
        return this.path;
    };
    Path.prototype.rotate = function (rotate) {
        this.path = helpers_1.Helper.rotate(this.path, rotate);
        return this;
    };
    return Path;
}());
exports.Path = Path;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*! svg.draggable.js - v2.2.1 - 2016-08-25
* https://github.com/wout/svg.draggable.js
* Copyright (c) 2016 Wout Fierens; Licensed MIT */
;(function() {

  // creates handler, saves it
  function DragHandler(el){
    el.remember('_draggable', this)
    this.el = el
  }


  // Sets new parameter, starts dragging
  DragHandler.prototype.init = function(constraint, val){
    var _this = this
    this.constraint = constraint
    this.value = val
    this.el.on('mousedown.drag', function(e){ _this.start(e) })
    this.el.on('touchstart.drag', function(e){ _this.start(e) })
  }

  // transforms one point from screen to user coords
  DragHandler.prototype.transformPoint = function(event, offset){
      event = event || window.event
      var touches = event.changedTouches && event.changedTouches[0] || event
      this.p.x = touches.pageX - (offset || 0)
      this.p.y = touches.pageY
      return this.p.matrixTransform(this.m)
  }
  
  // gets elements bounding box with special handling of groups, nested and use
  DragHandler.prototype.getBBox = function(){

    var box = this.el.bbox()

    if(this.el instanceof SVG.Nested) box = this.el.rbox()
    
    if (this.el instanceof SVG.G || this.el instanceof SVG.Use || this.el instanceof SVG.Nested) {
      box.x = this.el.x()
      box.y = this.el.y()
    }

    return box
  }

  // start dragging
  DragHandler.prototype.start = function(e){

    // check for left button
    if(e.type == 'click'|| e.type == 'mousedown' || e.type == 'mousemove'){
      if((e.which || e.buttons) != 1){
          return
      }
    }
  
    var _this = this

    // fire beforedrag event
    this.el.fire('beforedrag', { event: e, handler: this })

    // search for parent on the fly to make sure we can call
    // draggable() even when element is not in the dom currently
    this.parent = this.parent || this.el.parent(SVG.Nested) || this.el.parent(SVG.Doc)
    this.p = this.parent.node.createSVGPoint()

    // save current transformation matrix
    this.m = this.el.node.getScreenCTM().inverse()

    var box = this.getBBox()
    
    var anchorOffset;
    
    // fix text-anchor in text-element (#37)
    if(this.el instanceof SVG.Text){
      anchorOffset = this.el.node.getComputedTextLength();
        
      switch(this.el.attr('text-anchor')){
        case 'middle':
          anchorOffset /= 2;
          break
        case 'start':
          anchorOffset = 0;
          break;
      }
    }
    
    this.startPoints = {
      // We take absolute coordinates since we are just using a delta here
      point: this.transformPoint(e, anchorOffset),
      box:   box,
      transform: this.el.transform()
    }
    
    // add drag and end events to window
    SVG.on(window, 'mousemove.drag', function(e){ _this.drag(e) })
    SVG.on(window, 'touchmove.drag', function(e){ _this.drag(e) })
    SVG.on(window, 'mouseup.drag', function(e){ _this.end(e) })
    SVG.on(window, 'touchend.drag', function(e){ _this.end(e) })

    // fire dragstart event
    this.el.fire('dragstart', {event: e, p: this.startPoints.point, m: this.m, handler: this})

    // prevent browser drag behavior
    e.preventDefault()

    // prevent propagation to a parent that might also have dragging enabled
    e.stopPropagation();
  }

  // while dragging
  DragHandler.prototype.drag = function(e){

    var box = this.getBBox()
      , p   = this.transformPoint(e)
      , x   = this.startPoints.box.x + p.x - this.startPoints.point.x
      , y   = this.startPoints.box.y + p.y - this.startPoints.point.y
      , c   = this.constraint
      , gx  = p.x - this.startPoints.point.x
      , gy  = p.y - this.startPoints.point.y
      
    var event = new CustomEvent('dragmove', {
        detail: {
            event: e
          , p: p
          , m: this.m
          , handler: this
        }
      , cancelable: true
    })
      
    this.el.fire(event)
    
    if(event.defaultPrevented) return p

    // move the element to its new position, if possible by constraint
    if (typeof c == 'function') {

      var coord = c.call(this.el, x, y, this.m)

      // bool, just show us if movement is allowed or not
      if (typeof coord == 'boolean') {
        coord = {
          x: coord,
          y: coord
        }
      }

      // if true, we just move. If !false its a number and we move it there
      if (coord.x === true) {
        this.el.x(x)
      } else if (coord.x !== false) {
        this.el.x(coord.x)
      }

      if (coord.y === true) {
        this.el.y(y)
      } else if (coord.y !== false) {
        this.el.y(coord.y)
      }

    } else if (typeof c == 'object') {

      // keep element within constrained box
      if (c.minX != null && x < c.minX)
        x = c.minX
      else if (c.maxX != null && x > c.maxX - box.width){
        x = c.maxX - box.width
      }if (c.minY != null && y < c.minY)
        y = c.minY
      else if (c.maxY != null && y > c.maxY - box.height)
        y = c.maxY - box.height
        
      if(this.el instanceof SVG.G)
        this.el.matrix(this.startPoints.transform).transform({x:gx, y: gy}, true)
      else
        this.el.move(x, y)
    }
    
    // so we can use it in the end-method, too
    return p
  }

  DragHandler.prototype.end = function(e){

    // final drag
    var p = this.drag(e);

    // fire dragend event
    this.el.fire('dragend', { event: e, p: p, m: this.m, handler: this })

    // unbind events
    SVG.off(window, 'mousemove.drag')
    SVG.off(window, 'touchmove.drag')
    SVG.off(window, 'mouseup.drag')
    SVG.off(window, 'touchend.drag')

  }

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be an object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or an object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(value, constraint) {

      // Check the parameters and reassign if needed
      if (typeof value == 'function' || typeof value == 'object') {
        constraint = value
        value = true
      }

      var dragHandler = this.remember('_draggable') || new DragHandler(this)

      // When no parameter is given, value is true
      value = typeof value === 'undefined' ? true : value

      if(value) dragHandler.init(constraint || {}, value)
      else {
        this.off('mousedown.drag')
        this.off('touchstart.drag')
      }

      return this
    }

  })

}).call(this);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTZkODMzNGFmODAwMjU5MzVhYTMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy5qcy9kaXN0L3N2Zy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yL2hlbHBlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvc3R5bGUuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yL2VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yL2VkaXRvckZhY2FkZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N2Zy5kcmFnZ2FibGUuanMvZGlzdC9zdmcuZHJhZ2dhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQUE7QUFDTCxHQUFHO0FBQ0gsZ0ZBQWdGO0FBQ2hGLEdBQUc7QUFDSDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOEJBQThCLFFBQVE7QUFDdEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtRUFBbUU7O0FBRW5FO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msa0JBQWtCLFdBQVcsVUFBVTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTs7QUFFM0Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyxJQUFJOztBQUVwQztBQUNBOztBQUVBO0FBQ0EsOEJBQThCLEdBQUc7O0FBRWpDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLHlDQUF5QztBQUN0Rjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELFFBQVE7QUFDOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RCxRQUFRO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxRQUFRO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RCxRQUFRO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxPQUFPO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQyxTQUFTO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUNBQW1DLFFBQVE7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUNBQXFDLFFBQVE7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFFBQVE7QUFDN0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsUUFBUTtBQUNwRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUOztBQUVBLFNBQVM7QUFDVDs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7O0FBRUEsT0FBTztBQUNQOztBQUVBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxzQ0FBc0MseUJBQXlCO0FBQy9EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDtBQUNBLDRDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COztBQUVwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtEQUErRCxRQUFRO0FBQ3ZFOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBLHFCQUFxQjtBQUNyQixxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLHFCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUM7OztBQUdEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0UsY0FBYztBQUNsRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCLEtBQUs7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0RBQW9ELGlFQUFpRTs7QUFFckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxtQ0FBbUM7O0FBRTNFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLFNBQVM7O0FBRXREO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QixhQUFhO0FBQ3pDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLElBQUk7QUFDMUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixJQUFJO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBLE9BQU8sZUFBZTtBQUN0QjtBQUNBLE9BQU8sYUFBYTtBQUNwQjtBQUNBLE9BQU8sMkJBQTJCOztBQUVsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFFBQVE7QUFDcEM7O0FBRUE7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFLHlCQUF5QjtBQUNuRyxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE9BQU87O0FBRVA7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFpRCxTQUFTO0FBQzFEO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaURBQWlELFNBQVM7QUFDMUQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLGlEQUFpRCxTQUFTO0FBQzFEO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxpREFBaUQsU0FBUztBQUMxRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBLHlCQUF5QjtBQUN6QixnQ0FBZ0M7QUFDaEMsK0JBQStCLGFBQWE7QUFDNUMsMkJBQTJCLDRCQUE0Qjs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Q0FBdUMsUUFBUTtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLDJDQUEyQyx3QkFBd0I7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCx1RUFBdUUsOEJBQThCO0FBQ3JHOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7OztBQUdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxrQkFBa0I7QUFDakY7QUFDQTtBQUNBO0FBQ0EsK0RBQStELGtCQUFrQjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsUUFBUTtBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsUUFBUTtBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwrQ0FBK0M7QUFDaEUsaUJBQWlCLCtDQUErQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwrQ0FBK0M7QUFDaEUsaUJBQWlCLCtDQUErQztBQUNoRTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0NBQWdDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7OztBQUdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxTQUFTOztBQUV0RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLFFBQVE7QUFDM0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDhCQUE4QjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix5QkFBeUI7QUFDL0Msc0JBQXNCLHFDQUFxQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiwwQkFBMEI7QUFDaEQsc0JBQXNCLHVDQUF1QztBQUM3RDtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwrQkFBK0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Q0FBdUMsUUFBUTtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsUUFBUTtBQUMzRDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxRQUFRO0FBQ2hEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QztBQUM3Qzs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxRQUFRO0FBQ2hEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IscURBQXFEO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBLENBQUMsSTs7Ozs7Ozs7O0FDbjdLRCxpQ0FBNkI7QUFNN0IsSUFBTSxRQUFRLEdBQUcsMkJBQTJCO0FBRTVDO0lBQUE7SUF1SkEsQ0FBQztJQXRKUSxhQUFNLEdBQWIsVUFBYyxLQUFvQixFQUFFLE1BQWM7UUFDaEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTTtRQUNyRCxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQVk7WUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBUSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxLQUFLO0lBQ2QsQ0FBQztJQUNNLG9CQUFhLEdBQXBCLFVBQXFCLEtBQWE7UUFDaEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7UUFDbkMsQ0FBQztRQUNELElBQU0sS0FBSyxHQUFHLHVCQUF1QjtRQUNyQyxJQUFJLE1BQU0sR0FBRyxFQUFFO1FBQ2YsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUIsYUFBYSxDQUFDLEtBQUssRUFBRTtRQUN2QixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRCxhQUFhLENBQUMsR0FBRyxFQUFFO1FBQ3JCLENBQUM7UUFDRCxJQUFJLENBQUM7WUFDSCxhQUFhLENBQUMsT0FBTyxDQUFDLGlCQUFPO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUN4QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDO29CQUMxQyxDQUFDO29CQUNELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBSyxJQUFJLGVBQVEsQ0FBQyxLQUFLLENBQUMsRUFBZixDQUFlLENBQUM7b0JBQ3RELFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBSzt3QkFDckIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDO3dCQUNqQyxDQUFDO29CQUNILENBQUMsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUM3QixDQUFDO0lBQ00sZ0JBQVMsR0FBaEIsVUFBaUIsS0FBYTtRQUM1QixJQUFNLEtBQUssR0FBRyxlQUFlO1FBQzdCLElBQUksTUFBTSxHQUFHLEVBQUU7UUFDZixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QixhQUFhLENBQUMsS0FBSyxFQUFFO1FBQ3ZCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25ELGFBQWEsQ0FBQyxHQUFHLEVBQUU7UUFDckIsQ0FBQztRQUNELGFBQWEsQ0FBQyxPQUFPLENBQUMsaUJBQU87WUFDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM3QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBSyxJQUFJLGVBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQztnQkFDdEUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQztnQkFDMUMsQ0FBQztnQkFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQUs7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQztvQkFDakMsQ0FBQztnQkFDSCxDQUFDLENBQUM7Z0JBQ0YsSUFBTSxXQUFXLEdBQUcsRUFBRTtnQkFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7b0JBQzdDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFCLENBQUM7UUFDSCxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTTtJQUNmLENBQUM7SUFDTSxnQkFBUyxHQUFoQixVQUFpQixLQUFZO1FBQzNCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsSUFBSTtZQUNwQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDOUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNOLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7SUFDbEMsQ0FBQztJQUNNLFlBQUssR0FBWixVQUFhLEtBQW9CLEVBQUUsV0FBbUI7UUFDcEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBSSxJQUFJLFdBQUksR0FBRyxXQUFXLEVBQWxCLENBQWtCLENBQUM7UUFDekQsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBSSxJQUFJLFdBQUksQ0FBQyxHQUFHLENBQUMsZUFBSyxJQUFJLFlBQUssR0FBRyxXQUFXLEVBQW5CLENBQW1CLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQztRQUN2RSxNQUFNLENBQUMsS0FBSztJQUNkLENBQUM7SUFDTSxnQkFBUyxHQUFoQixVQUFpQixLQUFvQixFQUFFLFdBQW1CO1FBQ3hELEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFPO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVztZQUN2QyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXO1lBQ3ZDLENBQUM7UUFDSCxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsS0FBSztJQUNkLENBQUM7SUFDTSxpQkFBVSxHQUFqQixVQUFrQixLQUFZLEVBQUUsZ0JBQXdCO1FBQ3RELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCO1FBQ2xELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQUksSUFBSTtZQUM5QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7WUFDdEMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNSLEVBSCtCLENBRy9CLENBQUM7UUFDRixNQUFNLENBQUMsS0FBSztJQUNkLENBQUM7SUFDTSxxQkFBYyxHQUFyQixVQUNFLEtBQW9CLEVBQ3BCLGdCQUF3QjtRQUV4QixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBTztZQUN6QixFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQjtZQUM1QyxDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLEtBQUs7SUFDZCxDQUFDO0lBQ00saUJBQVUsR0FBakIsVUFBa0IsS0FBWSxFQUFFLGdCQUF3QjtRQUN0RCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQjtRQUNsRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFJLElBQUk7WUFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztTQUN2QyxFQUgrQixDQUcvQixDQUFDO1FBQ0YsTUFBTSxDQUFDLEtBQUs7SUFDZCxDQUFDO0lBQ00scUJBQWMsR0FBckIsVUFDRSxLQUFvQixFQUNwQixnQkFBd0I7UUFFeEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQU87WUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0I7WUFDNUMsQ0FBQztRQUNILENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxLQUFLO0lBQ2QsQ0FBQztJQUNjLGtCQUFXLEdBQTFCLFVBQTJCLE9BQWU7UUFDeEMsTUFBTSxDQUFDO1lBQ0wsS0FBSyxFQUFFLEtBQUs7WUFDWixLQUFLLEVBQUUsT0FBTztTQUNmO0lBQ0gsQ0FBQztJQUNjLG9CQUFhLEdBQTVCO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsS0FBSyxFQUFFLElBQUk7U0FDWjtJQUNILENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQztBQXZKWSx3QkFBTTs7Ozs7Ozs7OztBQ1JuQix1QkFBc0I7QUFDdEIsc0NBQXdDO0FBRXhDLHVCQUF5QjtBQUV6QixNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ2QsSUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQWM7UUFDckMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO1FBQy9DLEtBQUssRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUN2QyxNQUFNLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7UUFDekMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUN6QyxNQUFNLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7S0FDMUMsQ0FBQztBQUNKLENBQUM7QUFFRCxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtJQUM5RCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUNoRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3JDLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxrQkFBZ0IsTUFBTSxDQUFDLFdBQWEsQ0FBQztJQUMzQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFO0FBQ3pDLENBQUMsQ0FBQzs7Ozs7OztBQ3hCRix5Qzs7Ozs7Ozs7O0FDQ0EsdUNBQWtDO0FBQ2xDLDRDQUE2QztBQUM3QyxpQ0FBNkI7QUFFN0I7SUFLRSxnQkFBb0IsSUFBaUI7UUFBckMsaUJBbUJDO1FBbkJtQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1FBRTdDLEdBQUcsQ0FBQyxDQUFDLElBQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQ0QsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLG1CQUFtQixDQUFDO2dCQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksZ0JBQzNCLENBQUMsQ0FBQyxDQUFDO2dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsV0FBQztvQkFDdkMsS0FBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsQ0FBQyxDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3RELElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDdEIsQ0FBQztJQUVNLHlCQUFRLEdBQWY7UUFDRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBUztRQUN4QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVPLDhCQUFhLEdBQXJCLFVBQXNCLElBQXlCO1FBQXpCLDhCQUFPLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDN0MsSUFBSSxJQUFtQjtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFO1FBQzVCLElBQU0sTUFBTSxHQUFHLGdCQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLO1lBQ3RDLE1BQU07UUFDUixDQUFDO1FBQ0QsSUFBSSxHQUFHLDJCQUFZLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFDTyx1QkFBTSxHQUFkLFVBQWUsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFDTyx5QkFBUSxHQUFoQixVQUFpQixJQUFtQjtRQUNsQyxDQUFDO1FBQU0sSUFBSSxDQUFDLE9BQVEsQ0FBQyxLQUFLLEVBQUU7UUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1lBQ2hCLEtBQUssRUFBRSxDQUFDO1lBQ1IsT0FBTyxFQUFFLE9BQU87WUFDaEIsUUFBUSxFQUFFLE9BQU87U0FDbEIsQ0FBQztJQUNKLENBQUM7SUFDTyw2QkFBWSxHQUFwQixVQUFxQixJQUFtQjtRQUF4QyxpQkFFQztRQURDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQUssSUFBSSxZQUFJLENBQUMsU0FBUyxDQUFDLEtBQVksRUFBRSxJQUFJLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQztJQUM3RCxDQUFDO0lBQ08sMEJBQVMsR0FBakIsVUFBa0IsS0FBWSxFQUFFLElBQW1CO1FBQW5ELGlCQVVDO1FBVEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDcEU7WUFBTSxNQUFPLENBQUMsU0FBUyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGVBQUs7Z0JBQ3pCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMscUJBQXFCO2dCQUN4RCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLHFCQUFxQjtnQkFDeEQsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDckIsQ0FBQyxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFFTyw0QkFBVyxHQUFuQjtRQUNFLE1BQU0sQ0FBQztZQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLO1lBQ3BDLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDO0FBNUZZLHdCQUFNOzs7Ozs7Ozs7O0FDSm5CLG9DQUE2QjtBQUU3QjtJQUFBO0lBZUEsQ0FBQztJQWRRLGlDQUFvQixHQUEzQixVQUE0QixLQUFjO1FBQ3hDLFVBQVU7UUFDVixVQUFVO1FBQ1YsVUFBVTtRQUNWLFVBQVU7UUFDVixXQUFXO1FBQ1gsVUFBVTtRQUNWLElBQU0sSUFBSSxHQUFHLElBQUksV0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDbkMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7YUFDdEIsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFDeEIsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7SUFDNUIsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQztBQWZZLG9DQUFZOzs7Ozs7Ozs7O0FDSHpCLHVDQUFrQztBQUNsQyxpQ0FBNkI7QUFJN0I7SUFFRSxjQUFZLEtBQWE7UUFDdkIsSUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRTtJQUMxQixDQUFDO0lBQ00sd0JBQVMsR0FBaEIsVUFBaUIsWUFBb0I7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztRQUNyRCxNQUFNLENBQUMsSUFBSTtJQUNiLENBQUM7SUFDTSx5QkFBVSxHQUFqQixVQUFrQixNQUFjO1FBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7UUFDcEQsTUFBTSxDQUFDLElBQUk7SUFDYixDQUFDO0lBQ00seUJBQVUsR0FBakIsVUFBa0IsTUFBYztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxJQUFJO0lBQ2IsQ0FBQztJQUNNLDJCQUFZLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJO0lBQ2xCLENBQUM7SUFDTSxxQkFBTSxHQUFiLFVBQWMsTUFBYztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJO0lBQ2IsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDO0FBMUJZLG9CQUFJOzs7Ozs7O0FDTGpCO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLGlCQUFpQjtBQUM5RCw4Q0FBOEMsaUJBQWlCO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZ0NBQWdDLDBCQUEwQjs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFpRCxnQkFBZ0I7QUFDakUsaURBQWlELGdCQUFnQjtBQUNqRSwrQ0FBK0MsZUFBZTtBQUM5RCxnREFBZ0QsZUFBZTs7QUFFL0Q7QUFDQSwrQkFBK0IsOERBQThEOztBQUU3RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBOEQsWUFBWTtBQUMxRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsMkNBQTJDOztBQUV4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxLQUFLO0FBQ3hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxHQUFHOztBQUVILENBQUMsYSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTZkODMzNGFmODAwMjU5MzVhYTMiLCIvKiFcbiogc3ZnLmpzIC0gQSBsaWdodHdlaWdodCBsaWJyYXJ5IGZvciBtYW5pcHVsYXRpbmcgYW5kIGFuaW1hdGluZyBTVkcuXG4qIEB2ZXJzaW9uIDIuNi40XG4qIGh0dHBzOi8vc3ZnZG90anMuZ2l0aHViLmlvL1xuKlxuKiBAY29weXJpZ2h0IFdvdXQgRmllcmVucyA8d291dEBtaWNrLXdvdXQuY29tPlxuKiBAbGljZW5zZSBNSVRcbipcbiogQlVJTFQ6IFdlZCBGZWIgMDcgMjAxOCAyMjo1OToyNSBHTVQrMDEwMCAoTWl0dGVsZXVyb3DDpGlzY2hlIFplaXQpXG4qLztcbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdCwgcm9vdC5kb2N1bWVudClcclxuICAgIH0pXHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gcm9vdC5kb2N1bWVudCA/IGZhY3Rvcnkocm9vdCwgcm9vdC5kb2N1bWVudCkgOiBmdW5jdGlvbih3KXsgcmV0dXJuIGZhY3Rvcnkodywgdy5kb2N1bWVudCkgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICByb290LlNWRyA9IGZhY3Rvcnkocm9vdCwgcm9vdC5kb2N1bWVudClcclxuICB9XHJcbn0odHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcclxuXHJcbi8vIFRoZSBtYWluIHdyYXBwaW5nIGVsZW1lbnRcclxudmFyIFNWRyA9IHRoaXMuU1ZHID0gZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gIGlmIChTVkcuc3VwcG9ydGVkKSB7XHJcbiAgICBlbGVtZW50ID0gbmV3IFNWRy5Eb2MoZWxlbWVudClcclxuXHJcbiAgICBpZighU1ZHLnBhcnNlci5kcmF3KVxyXG4gICAgICBTVkcucHJlcGFyZSgpXHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnRcclxuICB9XHJcbn1cclxuXHJcbi8vIERlZmF1bHQgbmFtZXNwYWNlc1xyXG5TVkcubnMgICAgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXHJcblNWRy54bWxucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLydcclxuU1ZHLnhsaW5rID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnXHJcblNWRy5zdmdqcyA9ICdodHRwOi8vc3ZnanMuY29tL3N2Z2pzJ1xyXG5cclxuLy8gU3ZnIHN1cHBvcnQgdGVzdFxyXG5TVkcuc3VwcG9ydGVkID0gKGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiAhISBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiZcclxuICAgICAgICAgISEgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWRy5ucywnc3ZnJykuY3JlYXRlU1ZHUmVjdFxyXG59KSgpXHJcblxyXG4vLyBEb24ndCBib3RoZXIgdG8gY29udGludWUgaWYgU1ZHIGlzIG5vdCBzdXBwb3J0ZWRcclxuaWYgKCFTVkcuc3VwcG9ydGVkKSByZXR1cm4gZmFsc2VcclxuXHJcbi8vIEVsZW1lbnQgaWQgc2VxdWVuY2VcclxuU1ZHLmRpZCAgPSAxMDAwXHJcblxyXG4vLyBHZXQgbmV4dCBuYW1lZCBlbGVtZW50IGlkXHJcblNWRy5laWQgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgcmV0dXJuICdTdmdqcycgKyBjYXBpdGFsaXplKG5hbWUpICsgKFNWRy5kaWQrKylcclxufVxyXG5cclxuLy8gTWV0aG9kIGZvciBlbGVtZW50IGNyZWF0aW9uXHJcblNWRy5jcmVhdGUgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgLy8gY3JlYXRlIGVsZW1lbnRcclxuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCBuYW1lKVxyXG5cclxuICAvLyBhcHBseSB1bmlxdWUgaWRcclxuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmVpZChuYW1lKSlcclxuXHJcbiAgcmV0dXJuIGVsZW1lbnRcclxufVxyXG5cclxuLy8gTWV0aG9kIGZvciBleHRlbmRpbmcgb2JqZWN0c1xyXG5TVkcuZXh0ZW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG1vZHVsZXMsIG1ldGhvZHMsIGtleSwgaVxyXG5cclxuICAvLyBHZXQgbGlzdCBvZiBtb2R1bGVzXHJcbiAgbW9kdWxlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG5cclxuICAvLyBHZXQgb2JqZWN0IHdpdGggZXh0ZW5zaW9uc1xyXG4gIG1ldGhvZHMgPSBtb2R1bGVzLnBvcCgpXHJcblxyXG4gIGZvciAoaSA9IG1vZHVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICBpZiAobW9kdWxlc1tpXSlcclxuICAgICAgZm9yIChrZXkgaW4gbWV0aG9kcylcclxuICAgICAgICBtb2R1bGVzW2ldLnByb3RvdHlwZVtrZXldID0gbWV0aG9kc1trZXldXHJcblxyXG4gIC8vIE1ha2Ugc3VyZSBTVkcuU2V0IGluaGVyaXRzIGFueSBuZXdseSBhZGRlZCBtZXRob2RzXHJcbiAgaWYgKFNWRy5TZXQgJiYgU1ZHLlNldC5pbmhlcml0KVxyXG4gICAgU1ZHLlNldC5pbmhlcml0KClcclxufVxyXG5cclxuLy8gSW52ZW50IG5ldyBlbGVtZW50XHJcblNWRy5pbnZlbnQgPSBmdW5jdGlvbihjb25maWcpIHtcclxuICAvLyBDcmVhdGUgZWxlbWVudCBpbml0aWFsaXplclxyXG4gIHZhciBpbml0aWFsaXplciA9IHR5cGVvZiBjb25maWcuY3JlYXRlID09ICdmdW5jdGlvbicgP1xyXG4gICAgY29uZmlnLmNyZWF0ZSA6XHJcbiAgICBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoY29uZmlnLmNyZWF0ZSkpXHJcbiAgICB9XHJcblxyXG4gIC8vIEluaGVyaXQgcHJvdG90eXBlXHJcbiAgaWYgKGNvbmZpZy5pbmhlcml0KVxyXG4gICAgaW5pdGlhbGl6ZXIucHJvdG90eXBlID0gbmV3IGNvbmZpZy5pbmhlcml0XHJcblxyXG4gIC8vIEV4dGVuZCB3aXRoIG1ldGhvZHNcclxuICBpZiAoY29uZmlnLmV4dGVuZClcclxuICAgIFNWRy5leHRlbmQoaW5pdGlhbGl6ZXIsIGNvbmZpZy5leHRlbmQpXHJcblxyXG4gIC8vIEF0dGFjaCBjb25zdHJ1Y3QgbWV0aG9kIHRvIHBhcmVudFxyXG4gIGlmIChjb25maWcuY29uc3RydWN0KVxyXG4gICAgU1ZHLmV4dGVuZChjb25maWcucGFyZW50IHx8IFNWRy5Db250YWluZXIsIGNvbmZpZy5jb25zdHJ1Y3QpXHJcblxyXG4gIHJldHVybiBpbml0aWFsaXplclxyXG59XHJcblxyXG4vLyBBZG9wdCBleGlzdGluZyBzdmcgZWxlbWVudHNcclxuU1ZHLmFkb3B0ID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIC8vIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBub2RlXHJcbiAgaWYgKCFub2RlKSByZXR1cm4gbnVsbFxyXG5cclxuICAvLyBtYWtlIHN1cmUgYSBub2RlIGlzbid0IGFscmVhZHkgYWRvcHRlZFxyXG4gIGlmIChub2RlLmluc3RhbmNlKSByZXR1cm4gbm9kZS5pbnN0YW5jZVxyXG5cclxuICAvLyBpbml0aWFsaXplIHZhcmlhYmxlc1xyXG4gIHZhciBlbGVtZW50XHJcblxyXG4gIC8vIGFkb3B0IHdpdGggZWxlbWVudC1zcGVjaWZpYyBzZXR0aW5nc1xyXG4gIGlmIChub2RlLm5vZGVOYW1lID09ICdzdmcnKVxyXG4gICAgZWxlbWVudCA9IG5vZGUucGFyZW50Tm9kZSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50ID8gbmV3IFNWRy5OZXN0ZWQgOiBuZXcgU1ZHLkRvY1xyXG4gIGVsc2UgaWYgKG5vZGUubm9kZU5hbWUgPT0gJ2xpbmVhckdyYWRpZW50JylcclxuICAgIGVsZW1lbnQgPSBuZXcgU1ZHLkdyYWRpZW50KCdsaW5lYXInKVxyXG4gIGVsc2UgaWYgKG5vZGUubm9kZU5hbWUgPT0gJ3JhZGlhbEdyYWRpZW50JylcclxuICAgIGVsZW1lbnQgPSBuZXcgU1ZHLkdyYWRpZW50KCdyYWRpYWwnKVxyXG4gIGVsc2UgaWYgKFNWR1tjYXBpdGFsaXplKG5vZGUubm9kZU5hbWUpXSlcclxuICAgIGVsZW1lbnQgPSBuZXcgU1ZHW2NhcGl0YWxpemUobm9kZS5ub2RlTmFtZSldXHJcbiAgZWxzZVxyXG4gICAgZWxlbWVudCA9IG5ldyBTVkcuRWxlbWVudChub2RlKVxyXG5cclxuICAvLyBlbnN1cmUgcmVmZXJlbmNlc1xyXG4gIGVsZW1lbnQudHlwZSAgPSBub2RlLm5vZGVOYW1lXHJcbiAgZWxlbWVudC5ub2RlICA9IG5vZGVcclxuICBub2RlLmluc3RhbmNlID0gZWxlbWVudFxyXG5cclxuICAvLyBTVkcuQ2xhc3Mgc3BlY2lmaWMgcHJlcGFyYXRpb25zXHJcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTVkcuRG9jKVxyXG4gICAgZWxlbWVudC5uYW1lc3BhY2UoKS5kZWZzKClcclxuXHJcbiAgLy8gcHVsbCBzdmdqcyBkYXRhIGZyb20gdGhlIGRvbSAoZ2V0QXR0cmlidXRlTlMgZG9lc24ndCB3b3JrIGluIGh0bWw1KVxyXG4gIGVsZW1lbnQuc2V0RGF0YShKU09OLnBhcnNlKG5vZGUuZ2V0QXR0cmlidXRlKCdzdmdqczpkYXRhJykpIHx8IHt9KVxyXG5cclxuICByZXR1cm4gZWxlbWVudFxyXG59XHJcblxyXG4vLyBJbml0aWFsaXplIHBhcnNpbmcgZWxlbWVudFxyXG5TVkcucHJlcGFyZSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIFNlbGVjdCBkb2N1bWVudCBib2R5IGFuZCBjcmVhdGUgaW52aXNpYmxlIHN2ZyBlbGVtZW50XHJcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXHJcbiAgICAsIGRyYXcgPSAoYm9keSA/IG5ldyBTVkcuRG9jKGJvZHkpIDogU1ZHLmFkb3B0KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkubmVzdGVkKCkpLnNpemUoMiwgMClcclxuXHJcbiAgLy8gQ3JlYXRlIHBhcnNlciBvYmplY3RcclxuICBTVkcucGFyc2VyID0ge1xyXG4gICAgYm9keTogYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcclxuICAsIGRyYXc6IGRyYXcuc3R5bGUoJ29wYWNpdHk6MDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0xMDAlO3RvcDotMTAwJTtvdmVyZmxvdzpoaWRkZW4nKS5ub2RlXHJcbiAgLCBwb2x5OiBkcmF3LnBvbHlsaW5lKCkubm9kZVxyXG4gICwgcGF0aDogZHJhdy5wYXRoKCkubm9kZVxyXG4gICwgbmF0aXZlOiBTVkcuY3JlYXRlKCdzdmcnKVxyXG4gIH1cclxufVxyXG5cclxuU1ZHLnBhcnNlciA9IHtcclxuICBuYXRpdmU6IFNWRy5jcmVhdGUoJ3N2ZycpXHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICBpZighU1ZHLnBhcnNlci5kcmF3KVxyXG4gICAgU1ZHLnByZXBhcmUoKVxyXG59LCBmYWxzZSlcclxuXG4vLyBTdG9yYWdlIGZvciByZWd1bGFyIGV4cHJlc3Npb25zXHJcblNWRy5yZWdleCA9IHtcclxuICAvLyBQYXJzZSB1bml0IHZhbHVlXHJcbiAgbnVtYmVyQW5kVW5pdDogICAgL14oWystXT8oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/KShbYS16JV0qKSQvaVxyXG5cclxuICAvLyBQYXJzZSBoZXggdmFsdWVcclxuLCBoZXg6ICAgICAgICAgICAgICAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pXHJcblxyXG4gIC8vIFBhcnNlIHJnYiB2YWx1ZVxyXG4sIHJnYjogICAgICAgICAgICAgIC9yZ2JcXCgoXFxkKyksKFxcZCspLChcXGQrKVxcKS9cclxuXHJcbiAgLy8gUGFyc2UgcmVmZXJlbmNlIGlkXHJcbiwgcmVmZXJlbmNlOiAgICAgICAgLyMoW2EtejAtOVxcLV9dKykvaVxyXG5cclxuICAvLyBzcGxpdHMgYSB0cmFuc2Zvcm1hdGlvbiBjaGFpblxyXG4sIHRyYW5zZm9ybXM6ICAgICAgIC9cXClcXHMqLD9cXHMqL1xyXG5cclxuICAvLyBXaGl0ZXNwYWNlXHJcbiwgd2hpdGVzcGFjZTogICAgICAgL1xccy9nXHJcblxyXG4gIC8vIFRlc3QgaGV4IHZhbHVlXHJcbiwgaXNIZXg6ICAgICAgICAgICAgL14jW2EtZjAtOV17Myw2fSQvaVxyXG5cclxuICAvLyBUZXN0IHJnYiB2YWx1ZVxyXG4sIGlzUmdiOiAgICAgICAgICAgIC9ecmdiXFwoL1xyXG5cclxuICAvLyBUZXN0IGNzcyBkZWNsYXJhdGlvblxyXG4sIGlzQ3NzOiAgICAgICAgICAgIC9bXjpdKzpbXjtdKzs/L1xyXG5cclxuICAvLyBUZXN0IGZvciBibGFuayBzdHJpbmdcclxuLCBpc0JsYW5rOiAgICAgICAgICAvXihcXHMrKT8kL1xyXG5cclxuICAvLyBUZXN0IGZvciBudW1lcmljIHN0cmluZ1xyXG4sIGlzTnVtYmVyOiAgICAgICAgIC9eWystXT8oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/JC9pXHJcblxyXG4gIC8vIFRlc3QgZm9yIHBlcmNlbnQgdmFsdWVcclxuLCBpc1BlcmNlbnQ6ICAgICAgICAvXi0/W1xcZFxcLl0rJSQvXHJcblxyXG4gIC8vIFRlc3QgZm9yIGltYWdlIHVybFxyXG4sIGlzSW1hZ2U6ICAgICAgICAgIC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpKFxcP1tePV0rLiopPy9pXHJcblxyXG4gIC8vIHNwbGl0IGF0IHdoaXRlc3BhY2UgYW5kIGNvbW1hXHJcbiwgZGVsaW1pdGVyOiAgICAgICAgL1tcXHMsXSsvXHJcblxyXG4gIC8vIFRoZSBmb2xsb3dpbmcgcmVnZXggYXJlIHVzZWQgdG8gcGFyc2UgdGhlIGQgYXR0cmlidXRlIG9mIGEgcGF0aFxyXG5cclxuICAvLyBNYXRjaGVzIGFsbCBoeXBoZW5zIHdoaWNoIGFyZSBub3QgYWZ0ZXIgYW4gZXhwb25lbnRcclxuLCBoeXBoZW46ICAgICAgICAgICAvKFteZV0pXFwtL2dpXHJcblxyXG4gIC8vIFJlcGxhY2VzIGFuZCB0ZXN0cyBmb3IgYWxsIHBhdGggbGV0dGVyc1xyXG4sIHBhdGhMZXR0ZXJzOiAgICAgIC9bTUxIVkNTUVRBWl0vZ2lcclxuXHJcbiAgLy8geWVzIHdlIG5lZWQgdGhpcyBvbmUsIHRvb1xyXG4sIGlzUGF0aExldHRlcjogICAgIC9bTUxIVkNTUVRBWl0vaVxyXG5cclxuICAvLyBtYXRjaGVzIDAuMTU0LjIzLjQ1XHJcbiwgbnVtYmVyc1dpdGhEb3RzOiAgLygoXFxkP1xcLlxcZCsoPzplWystXT9cXGQrKT8pKCg/OlxcLlxcZCsoPzplWystXT9cXGQrKT8pKykpKy9naVxyXG5cclxuICAvLyBtYXRjaGVzIC5cclxuLCBkb3RzOiAgICAgICAgICAgICAvXFwuL2dcclxufVxyXG5cblNWRy51dGlscyA9IHtcclxuICAvLyBNYXAgZnVuY3Rpb25cclxuICBtYXA6IGZ1bmN0aW9uKGFycmF5LCBibG9jaykge1xyXG4gICAgdmFyIGlcclxuICAgICAgLCBpbCA9IGFycmF5Lmxlbmd0aFxyXG4gICAgICAsIHJlc3VsdCA9IFtdXHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgIHJlc3VsdC5wdXNoKGJsb2NrKGFycmF5W2ldKSlcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbiAgfVxyXG5cclxuICAvLyBGaWx0ZXIgZnVuY3Rpb25cclxuLCBmaWx0ZXI6IGZ1bmN0aW9uKGFycmF5LCBibG9jaykge1xyXG4gICAgdmFyIGlcclxuICAgICAgLCBpbCA9IGFycmF5Lmxlbmd0aFxyXG4gICAgICAsIHJlc3VsdCA9IFtdXHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgIGlmIChibG9jayhhcnJheVtpXSkpXHJcbiAgICAgICAgcmVzdWx0LnB1c2goYXJyYXlbaV0pXHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLy8gRGVncmVlcyB0byByYWRpYW5zXHJcbiwgcmFkaWFuczogZnVuY3Rpb24oZCkge1xyXG4gICAgcmV0dXJuIGQgJSAzNjAgKiBNYXRoLlBJIC8gMTgwXHJcbiAgfVxyXG5cclxuICAvLyBSYWRpYW5zIHRvIGRlZ3JlZXNcclxuLCBkZWdyZWVzOiBmdW5jdGlvbihyKSB7XHJcbiAgICByZXR1cm4gciAqIDE4MCAvIE1hdGguUEkgJSAzNjBcclxuICB9XHJcblxyXG4sIGZpbHRlclNWR0VsZW1lbnRzOiBmdW5jdGlvbihub2Rlcykge1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKCBub2RlcywgZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnQgfSlcclxuICB9XHJcblxyXG59XG5cclxuU1ZHLmRlZmF1bHRzID0ge1xyXG4gIC8vIERlZmF1bHQgYXR0cmlidXRlIHZhbHVlc1xyXG4gIGF0dHJzOiB7XHJcbiAgICAvLyBmaWxsIGFuZCBzdHJva2VcclxuICAgICdmaWxsLW9wYWNpdHknOiAgICAgMVxyXG4gICwgJ3N0cm9rZS1vcGFjaXR5JzogICAxXHJcbiAgLCAnc3Ryb2tlLXdpZHRoJzogICAgIDBcclxuICAsICdzdHJva2UtbGluZWpvaW4nOiAgJ21pdGVyJ1xyXG4gICwgJ3N0cm9rZS1saW5lY2FwJzogICAnYnV0dCdcclxuICAsIGZpbGw6ICAgICAgICAgICAgICAgJyMwMDAwMDAnXHJcbiAgLCBzdHJva2U6ICAgICAgICAgICAgICcjMDAwMDAwJ1xyXG4gICwgb3BhY2l0eTogICAgICAgICAgICAxXHJcbiAgICAvLyBwb3NpdGlvblxyXG4gICwgeDogICAgICAgICAgICAgICAgICAwXHJcbiAgLCB5OiAgICAgICAgICAgICAgICAgIDBcclxuICAsIGN4OiAgICAgICAgICAgICAgICAgMFxyXG4gICwgY3k6ICAgICAgICAgICAgICAgICAwXHJcbiAgICAvLyBzaXplXHJcbiAgLCB3aWR0aDogICAgICAgICAgICAgIDBcclxuICAsIGhlaWdodDogICAgICAgICAgICAgMFxyXG4gICAgLy8gcmFkaXVzXHJcbiAgLCByOiAgICAgICAgICAgICAgICAgIDBcclxuICAsIHJ4OiAgICAgICAgICAgICAgICAgMFxyXG4gICwgcnk6ICAgICAgICAgICAgICAgICAwXHJcbiAgICAvLyBncmFkaWVudFxyXG4gICwgb2Zmc2V0OiAgICAgICAgICAgICAwXHJcbiAgLCAnc3RvcC1vcGFjaXR5JzogICAgIDFcclxuICAsICdzdG9wLWNvbG9yJzogICAgICAgJyMwMDAwMDAnXHJcbiAgICAvLyB0ZXh0XHJcbiAgLCAnZm9udC1zaXplJzogICAgICAgIDE2XHJcbiAgLCAnZm9udC1mYW1pbHknOiAgICAgICdIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmJ1xyXG4gICwgJ3RleHQtYW5jaG9yJzogICAgICAnc3RhcnQnXHJcbiAgfVxyXG5cclxufVxuLy8gTW9kdWxlIGZvciBjb2xvciBjb252ZXJ0aW9uc1xyXG5TVkcuQ29sb3IgPSBmdW5jdGlvbihjb2xvcikge1xyXG4gIHZhciBtYXRjaFxyXG5cclxuICAvLyBpbml0aWFsaXplIGRlZmF1bHRzXHJcbiAgdGhpcy5yID0gMFxyXG4gIHRoaXMuZyA9IDBcclxuICB0aGlzLmIgPSAwXHJcblxyXG4gIGlmKCFjb2xvcikgcmV0dXJuXHJcblxyXG4gIC8vIHBhcnNlIGNvbG9yXHJcbiAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcclxuICAgIGlmIChTVkcucmVnZXguaXNSZ2IudGVzdChjb2xvcikpIHtcclxuICAgICAgLy8gZ2V0IHJnYiB2YWx1ZXNcclxuICAgICAgbWF0Y2ggPSBTVkcucmVnZXgucmdiLmV4ZWMoY29sb3IucmVwbGFjZShTVkcucmVnZXgud2hpdGVzcGFjZSwnJykpXHJcblxyXG4gICAgICAvLyBwYXJzZSBudW1lcmljIHZhbHVlc1xyXG4gICAgICB0aGlzLnIgPSBwYXJzZUludChtYXRjaFsxXSlcclxuICAgICAgdGhpcy5nID0gcGFyc2VJbnQobWF0Y2hbMl0pXHJcbiAgICAgIHRoaXMuYiA9IHBhcnNlSW50KG1hdGNoWzNdKVxyXG5cclxuICAgIH0gZWxzZSBpZiAoU1ZHLnJlZ2V4LmlzSGV4LnRlc3QoY29sb3IpKSB7XHJcbiAgICAgIC8vIGdldCBoZXggdmFsdWVzXHJcbiAgICAgIG1hdGNoID0gU1ZHLnJlZ2V4LmhleC5leGVjKGZ1bGxIZXgoY29sb3IpKVxyXG5cclxuICAgICAgLy8gcGFyc2UgbnVtZXJpYyB2YWx1ZXNcclxuICAgICAgdGhpcy5yID0gcGFyc2VJbnQobWF0Y2hbMV0sIDE2KVxyXG4gICAgICB0aGlzLmcgPSBwYXJzZUludChtYXRjaFsyXSwgMTYpXHJcbiAgICAgIHRoaXMuYiA9IHBhcnNlSW50KG1hdGNoWzNdLCAxNilcclxuXHJcbiAgICB9XHJcblxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGNvbG9yID09PSAnb2JqZWN0Jykge1xyXG4gICAgdGhpcy5yID0gY29sb3IuclxyXG4gICAgdGhpcy5nID0gY29sb3IuZ1xyXG4gICAgdGhpcy5iID0gY29sb3IuYlxyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5Db2xvciwge1xyXG4gIC8vIERlZmF1bHQgdG8gaGV4IGNvbnZlcnNpb25cclxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy50b0hleCgpXHJcbiAgfVxyXG4gIC8vIEJ1aWxkIGhleCB2YWx1ZVxyXG4sIHRvSGV4OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAnIydcclxuICAgICAgKyBjb21wVG9IZXgodGhpcy5yKVxyXG4gICAgICArIGNvbXBUb0hleCh0aGlzLmcpXHJcbiAgICAgICsgY29tcFRvSGV4KHRoaXMuYilcclxuICB9XHJcbiAgLy8gQnVpbGQgcmdiIHZhbHVlXHJcbiwgdG9SZ2I6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuICdyZ2IoJyArIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iXS5qb2luKCkgKyAnKSdcclxuICB9XHJcbiAgLy8gQ2FsY3VsYXRlIHRydWUgYnJpZ2h0bmVzc1xyXG4sIGJyaWdodG5lc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnIgLyAyNTUgKiAwLjMwKVxyXG4gICAgICAgICArICh0aGlzLmcgLyAyNTUgKiAwLjU5KVxyXG4gICAgICAgICArICh0aGlzLmIgLyAyNTUgKiAwLjExKVxyXG4gIH1cclxuICAvLyBNYWtlIGNvbG9yIG1vcnBoYWJsZVxyXG4sIG1vcnBoOiBmdW5jdGlvbihjb2xvcikge1xyXG4gICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTVkcuQ29sb3IoY29sb3IpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gR2V0IG1vcnBoZWQgY29sb3IgYXQgZ2l2ZW4gcG9zaXRpb25cclxuLCBhdDogZnVuY3Rpb24ocG9zKSB7XHJcbiAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXHJcbiAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzXHJcblxyXG4gICAgLy8gbm9ybWFsaXNlIHBvc1xyXG4gICAgcG9zID0gcG9zIDwgMCA/IDAgOiBwb3MgPiAxID8gMSA6IHBvc1xyXG5cclxuICAgIC8vIGdlbmVyYXRlIG1vcnBoZWQgY29sb3JcclxuICAgIHJldHVybiBuZXcgU1ZHLkNvbG9yKHtcclxuICAgICAgcjogfn4odGhpcy5yICsgKHRoaXMuZGVzdGluYXRpb24uciAtIHRoaXMucikgKiBwb3MpXHJcbiAgICAsIGc6IH5+KHRoaXMuZyArICh0aGlzLmRlc3RpbmF0aW9uLmcgLSB0aGlzLmcpICogcG9zKVxyXG4gICAgLCBiOiB+fih0aGlzLmIgKyAodGhpcy5kZXN0aW5hdGlvbi5iIC0gdGhpcy5iKSAqIHBvcylcclxuICAgIH0pXHJcbiAgfVxyXG5cclxufSlcclxuXHJcbi8vIFRlc3RlcnNcclxuXHJcbi8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYSBjb2xvciBzdHJpbmdcclxuU1ZHLkNvbG9yLnRlc3QgPSBmdW5jdGlvbihjb2xvcikge1xyXG4gIGNvbG9yICs9ICcnXHJcbiAgcmV0dXJuIFNWRy5yZWdleC5pc0hleC50ZXN0KGNvbG9yKVxyXG4gICAgICB8fCBTVkcucmVnZXguaXNSZ2IudGVzdChjb2xvcilcclxufVxyXG5cclxuLy8gVGVzdCBpZiBnaXZlbiB2YWx1ZSBpcyBhIHJnYiBvYmplY3RcclxuU1ZHLkNvbG9yLmlzUmdiID0gZnVuY3Rpb24oY29sb3IpIHtcclxuICByZXR1cm4gY29sb3IgJiYgdHlwZW9mIGNvbG9yLnIgPT0gJ251bWJlcidcclxuICAgICAgICAgICAgICAgJiYgdHlwZW9mIGNvbG9yLmcgPT0gJ251bWJlcidcclxuICAgICAgICAgICAgICAgJiYgdHlwZW9mIGNvbG9yLmIgPT0gJ251bWJlcidcclxufVxyXG5cclxuLy8gVGVzdCBpZiBnaXZlbiB2YWx1ZSBpcyBhIGNvbG9yXHJcblNWRy5Db2xvci5pc0NvbG9yID0gZnVuY3Rpb24oY29sb3IpIHtcclxuICByZXR1cm4gU1ZHLkNvbG9yLmlzUmdiKGNvbG9yKSB8fCBTVkcuQ29sb3IudGVzdChjb2xvcilcclxufVxuLy8gTW9kdWxlIGZvciBhcnJheSBjb252ZXJzaW9uXHJcblNWRy5BcnJheSA9IGZ1bmN0aW9uKGFycmF5LCBmYWxsYmFjaykge1xyXG4gIGFycmF5ID0gKGFycmF5IHx8IFtdKS52YWx1ZU9mKClcclxuXHJcbiAgLy8gaWYgYXJyYXkgaXMgZW1wdHkgYW5kIGZhbGxiYWNrIGlzIHByb3ZpZGVkLCB1c2UgZmFsbGJhY2tcclxuICBpZiAoYXJyYXkubGVuZ3RoID09IDAgJiYgZmFsbGJhY2spXHJcbiAgICBhcnJheSA9IGZhbGxiYWNrLnZhbHVlT2YoKVxyXG5cclxuICAvLyBwYXJzZSBhcnJheVxyXG4gIHRoaXMudmFsdWUgPSB0aGlzLnBhcnNlKGFycmF5KVxyXG59XHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5BcnJheSwge1xyXG4gIC8vIE1ha2UgYXJyYXkgbW9ycGhhYmxlXHJcbiAgbW9ycGg6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gdGhpcy5wYXJzZShhcnJheSlcclxuXHJcbiAgICAvLyBub3JtYWxpemUgbGVuZ3RoIG9mIGFycmF5c1xyXG4gICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoICE9IHRoaXMuZGVzdGluYXRpb24ubGVuZ3RoKSB7XHJcbiAgICAgIHZhciBsYXN0VmFsdWUgICAgICAgPSB0aGlzLnZhbHVlW3RoaXMudmFsdWUubGVuZ3RoIC0gMV1cclxuICAgICAgICAsIGxhc3REZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb25bdGhpcy5kZXN0aW5hdGlvbi5sZW5ndGggLSAxXVxyXG5cclxuICAgICAgd2hpbGUodGhpcy52YWx1ZS5sZW5ndGggPiB0aGlzLmRlc3RpbmF0aW9uLmxlbmd0aClcclxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLnB1c2gobGFzdERlc3RpbmF0aW9uKVxyXG4gICAgICB3aGlsZSh0aGlzLnZhbHVlLmxlbmd0aCA8IHRoaXMuZGVzdGluYXRpb24ubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMudmFsdWUucHVzaChsYXN0VmFsdWUpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gQ2xlYW4gdXAgYW55IGR1cGxpY2F0ZSBwb2ludHNcclxuLCBzZXR0bGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gZmluZCBhbGwgdW5pcXVlIHZhbHVlc1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy52YWx1ZS5sZW5ndGgsIHNlZW4gPSBbXTsgaSA8IGlsOyBpKyspXHJcbiAgICAgIGlmIChzZWVuLmluZGV4T2YodGhpcy52YWx1ZVtpXSkgPT0gLTEpXHJcbiAgICAgICAgc2Vlbi5wdXNoKHRoaXMudmFsdWVbaV0pXHJcblxyXG4gICAgLy8gc2V0IG5ldyB2YWx1ZVxyXG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPSBzZWVuXHJcbiAgfVxyXG4gIC8vIEdldCBtb3JwaGVkIGFycmF5IGF0IGdpdmVuIHBvc2l0aW9uXHJcbiwgYXQ6IGZ1bmN0aW9uKHBvcykge1xyXG4gICAgLy8gbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZFxyXG4gICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpc1xyXG5cclxuICAgIC8vIGdlbmVyYXRlIG1vcnBoZWQgYXJyYXlcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoLCBhcnJheSA9IFtdOyBpIDwgaWw7IGkrKylcclxuICAgICAgYXJyYXkucHVzaCh0aGlzLnZhbHVlW2ldICsgKHRoaXMuZGVzdGluYXRpb25baV0gLSB0aGlzLnZhbHVlW2ldKSAqIHBvcylcclxuXHJcbiAgICByZXR1cm4gbmV3IFNWRy5BcnJheShhcnJheSlcclxuICB9XHJcbiAgLy8gQ29udmVydCBhcnJheSB0byBzdHJpbmdcclxuLCB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZS5qb2luKCcgJylcclxuICB9XHJcbiAgLy8gUmVhbCB2YWx1ZVxyXG4sIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWVcclxuICB9XHJcbiAgLy8gUGFyc2Ugd2hpdGVzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nXHJcbiwgcGFyc2U6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICBhcnJheSA9IGFycmF5LnZhbHVlT2YoKVxyXG5cclxuICAgIC8vIGlmIGFscmVhZHkgaXMgYW4gYXJyYXksIG5vIG5lZWQgdG8gcGFyc2UgaXRcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGFycmF5KSkgcmV0dXJuIGFycmF5XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3BsaXQoYXJyYXkpXHJcbiAgfVxyXG4gIC8vIFN0cmlwIHVubmVjZXNzYXJ5IHdoaXRlc3BhY2VcclxuLCBzcGxpdDogZnVuY3Rpb24oc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gc3RyaW5nLnRyaW0oKS5zcGxpdChTVkcucmVnZXguZGVsaW1pdGVyKS5tYXAocGFyc2VGbG9hdClcclxuICB9XHJcbiAgLy8gUmV2ZXJzZSBhcnJheVxyXG4sIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy52YWx1ZS5yZXZlcnNlKClcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuLCBjbG9uZTogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgY2xvbmUgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcigpXHJcbiAgICBjbG9uZS52YWx1ZSA9IGFycmF5X2Nsb25lKHRoaXMudmFsdWUpXHJcbiAgICByZXR1cm4gY2xvbmVcclxuICB9XHJcbn0pXG4vLyBQb2x5IHBvaW50cyBhcnJheVxyXG5TVkcuUG9pbnRBcnJheSA9IGZ1bmN0aW9uKGFycmF5LCBmYWxsYmFjaykge1xyXG4gIFNWRy5BcnJheS5jYWxsKHRoaXMsIGFycmF5LCBmYWxsYmFjayB8fCBbWzAsMF1dKVxyXG59XHJcblxyXG4vLyBJbmhlcml0IGZyb20gU1ZHLkFycmF5XHJcblNWRy5Qb2ludEFycmF5LnByb3RvdHlwZSA9IG5ldyBTVkcuQXJyYXlcclxuU1ZHLlBvaW50QXJyYXkucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU1ZHLlBvaW50QXJyYXlcclxuXHJcblNWRy5leHRlbmQoU1ZHLlBvaW50QXJyYXksIHtcclxuICAvLyBDb252ZXJ0IGFycmF5IHRvIHN0cmluZ1xyXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcclxuICAgIC8vIGNvbnZlcnQgdG8gYSBwb2x5IHBvaW50IHN0cmluZ1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy52YWx1ZS5sZW5ndGgsIGFycmF5ID0gW107IGkgPCBpbDsgaSsrKVxyXG4gICAgICBhcnJheS5wdXNoKHRoaXMudmFsdWVbaV0uam9pbignLCcpKVxyXG5cclxuICAgIHJldHVybiBhcnJheS5qb2luKCcgJylcclxuICB9XHJcbiAgLy8gQ29udmVydCBhcnJheSB0byBsaW5lIG9iamVjdFxyXG4sIHRvTGluZTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4MTogdGhpcy52YWx1ZVswXVswXVxyXG4gICAgLCB5MTogdGhpcy52YWx1ZVswXVsxXVxyXG4gICAgLCB4MjogdGhpcy52YWx1ZVsxXVswXVxyXG4gICAgLCB5MjogdGhpcy52YWx1ZVsxXVsxXVxyXG4gICAgfVxyXG4gIH1cclxuICAvLyBHZXQgbW9ycGhlZCBhcnJheSBhdCBnaXZlbiBwb3NpdGlvblxyXG4sIGF0OiBmdW5jdGlvbihwb3MpIHtcclxuICAgIC8vIG1ha2Ugc3VyZSBhIGRlc3RpbmF0aW9uIGlzIGRlZmluZWRcclxuICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBtb3JwaGVkIHBvaW50IHN0cmluZ1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy52YWx1ZS5sZW5ndGgsIGFycmF5ID0gW107IGkgPCBpbDsgaSsrKVxyXG4gICAgICBhcnJheS5wdXNoKFtcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzBdICsgKHRoaXMuZGVzdGluYXRpb25baV1bMF0gLSB0aGlzLnZhbHVlW2ldWzBdKSAqIHBvc1xyXG4gICAgICAsIHRoaXMudmFsdWVbaV1bMV0gKyAodGhpcy5kZXN0aW5hdGlvbltpXVsxXSAtIHRoaXMudmFsdWVbaV1bMV0pICogcG9zXHJcbiAgICAgIF0pXHJcblxyXG4gICAgcmV0dXJuIG5ldyBTVkcuUG9pbnRBcnJheShhcnJheSlcclxuICB9XHJcbiAgLy8gUGFyc2UgcG9pbnQgc3RyaW5nIGFuZCBmbGF0IGFycmF5XHJcbiwgcGFyc2U6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICB2YXIgcG9pbnRzID0gW11cclxuXHJcbiAgICBhcnJheSA9IGFycmF5LnZhbHVlT2YoKVxyXG5cclxuICAgIC8vIGlmIGl0IGlzIGFuIGFycmF5XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHtcclxuICAgICAgLy8gYW5kIGl0IGlzIG5vdCBmbGF0LCB0aGVyZSBpcyBubyBuZWVkIHRvIHBhcnNlIGl0XHJcbiAgICAgIGlmKEFycmF5LmlzQXJyYXkoYXJyYXlbMF0pKSB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIEVsc2UsIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBzdHJpbmdcclxuICAgICAgLy8gcGFyc2UgcG9pbnRzXHJcbiAgICAgIGFycmF5ID0gYXJyYXkudHJpbSgpLnNwbGl0KFNWRy5yZWdleC5kZWxpbWl0ZXIpLm1hcChwYXJzZUZsb2F0KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHZhbGlkYXRlIHBvaW50cyAtIGh0dHBzOi8vc3Znd2cub3JnL3N2ZzItZHJhZnQvc2hhcGVzLmh0bWwjRGF0YVR5cGVQb2ludHNcclxuICAgIC8vIE9kZCBudW1iZXIgb2YgY29vcmRpbmF0ZXMgaXMgYW4gZXJyb3IuIEluIHN1Y2ggY2FzZXMsIGRyb3AgdGhlIGxhc3Qgb2RkIGNvb3JkaW5hdGUuXHJcbiAgICBpZiAoYXJyYXkubGVuZ3RoICUgMiAhPT0gMCkgYXJyYXkucG9wKClcclxuXHJcbiAgICAvLyB3cmFwIHBvaW50cyBpbiB0d28tdHVwbGVzIGFuZCBwYXJzZSBwb2ludHMgYXMgZmxvYXRzXHJcbiAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkgPSBpICsgMilcclxuICAgICAgcG9pbnRzLnB1c2goWyBhcnJheVtpXSwgYXJyYXlbaSsxXSBdKVxyXG5cclxuICAgIHJldHVybiBwb2ludHNcclxuICB9XHJcbiAgLy8gTW92ZSBwb2ludCBzdHJpbmdcclxuLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICB2YXIgYm94ID0gdGhpcy5iYm94KClcclxuXHJcbiAgICAvLyBnZXQgcmVsYXRpdmUgb2Zmc2V0XHJcbiAgICB4IC09IGJveC54XHJcbiAgICB5IC09IGJveC55XHJcblxyXG4gICAgLy8gbW92ZSBldmVyeSBwb2ludFxyXG4gICAgaWYgKCFpc05hTih4KSAmJiAhaXNOYU4oeSkpXHJcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgIHRoaXMudmFsdWVbaV0gPSBbdGhpcy52YWx1ZVtpXVswXSArIHgsIHRoaXMudmFsdWVbaV1bMV0gKyB5XVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIFJlc2l6ZSBwb2x5IHN0cmluZ1xyXG4sIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIHZhciBpLCBib3ggPSB0aGlzLmJib3goKVxyXG5cclxuICAgIC8vIHJlY2FsY3VsYXRlIHBvc2l0aW9uIG9mIGFsbCBwb2ludHMgYWNjb3JkaW5nIHRvIG5ldyBzaXplXHJcbiAgICBmb3IgKGkgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIGlmKGJveC53aWR0aCkgdGhpcy52YWx1ZVtpXVswXSA9ICgodGhpcy52YWx1ZVtpXVswXSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcclxuICAgICAgaWYoYm94LmhlaWdodCkgdGhpcy52YWx1ZVtpXVsxXSA9ICgodGhpcy52YWx1ZVtpXVsxXSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBHZXQgYm91bmRpbmcgYm94IG9mIHBvaW50c1xyXG4sIGJib3g6IGZ1bmN0aW9uKCkge1xyXG4gICAgU1ZHLnBhcnNlci5wb2x5LnNldEF0dHJpYnV0ZSgncG9pbnRzJywgdGhpcy50b1N0cmluZygpKVxyXG5cclxuICAgIHJldHVybiBTVkcucGFyc2VyLnBvbHkuZ2V0QkJveCgpXHJcbiAgfVxyXG59KVxyXG5cbnZhciBwYXRoSGFuZGxlcnMgPSB7XHJcbiAgTTogZnVuY3Rpb24oYywgcCwgcDApIHtcclxuICAgIHAueCA9IHAwLnggPSBjWzBdXHJcbiAgICBwLnkgPSBwMC55ID0gY1sxXVxyXG5cclxuICAgIHJldHVybiBbJ00nLCBwLngsIHAueV1cclxuICB9LFxyXG4gIEw6IGZ1bmN0aW9uKGMsIHApIHtcclxuICAgIHAueCA9IGNbMF1cclxuICAgIHAueSA9IGNbMV1cclxuICAgIHJldHVybiBbJ0wnLCBjWzBdLCBjWzFdXVxyXG4gIH0sXHJcbiAgSDogZnVuY3Rpb24oYywgcCkge1xyXG4gICAgcC54ID0gY1swXVxyXG4gICAgcmV0dXJuIFsnSCcsIGNbMF1dXHJcbiAgfSxcclxuICBWOiBmdW5jdGlvbihjLCBwKSB7XHJcbiAgICBwLnkgPSBjWzBdXHJcbiAgICByZXR1cm4gWydWJywgY1swXV1cclxuICB9LFxyXG4gIEM6IGZ1bmN0aW9uKGMsIHApIHtcclxuICAgIHAueCA9IGNbNF1cclxuICAgIHAueSA9IGNbNV1cclxuICAgIHJldHVybiBbJ0MnLCBjWzBdLCBjWzFdLCBjWzJdLCBjWzNdLCBjWzRdLCBjWzVdXVxyXG4gIH0sXHJcbiAgUzogZnVuY3Rpb24oYywgcCkge1xyXG4gICAgcC54ID0gY1syXVxyXG4gICAgcC55ID0gY1szXVxyXG4gICAgcmV0dXJuIFsnUycsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM11dXHJcbiAgfSxcclxuICBROiBmdW5jdGlvbihjLCBwKSB7XHJcbiAgICBwLnggPSBjWzJdXHJcbiAgICBwLnkgPSBjWzNdXHJcbiAgICByZXR1cm4gWydRJywgY1swXSwgY1sxXSwgY1syXSwgY1szXV1cclxuICB9LFxyXG4gIFQ6IGZ1bmN0aW9uKGMsIHApIHtcclxuICAgIHAueCA9IGNbMF1cclxuICAgIHAueSA9IGNbMV1cclxuICAgIHJldHVybiBbJ1QnLCBjWzBdLCBjWzFdXVxyXG4gIH0sXHJcbiAgWjogZnVuY3Rpb24oYywgcCwgcDApIHtcclxuICAgIHAueCA9IHAwLnhcclxuICAgIHAueSA9IHAwLnlcclxuICAgIHJldHVybiBbJ1onXVxyXG4gIH0sXHJcbiAgQTogZnVuY3Rpb24oYywgcCkge1xyXG4gICAgcC54ID0gY1s1XVxyXG4gICAgcC55ID0gY1s2XVxyXG4gICAgcmV0dXJuIFsnQScsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM10sIGNbNF0sIGNbNV0sIGNbNl1dXHJcbiAgfVxyXG59XHJcblxyXG52YXIgbWxodnF0Y3NhID0gJ21saHZxdGNzYXonLnNwbGl0KCcnKVxyXG5cclxuZm9yKHZhciBpID0gMCwgaWwgPSBtbGh2cXRjc2EubGVuZ3RoOyBpIDwgaWw7ICsraSl7XHJcbiAgcGF0aEhhbmRsZXJzW21saHZxdGNzYVtpXV0gPSAoZnVuY3Rpb24oaSl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oYywgcCwgcDApIHtcclxuICAgICAgaWYoaSA9PSAnSCcpIGNbMF0gPSBjWzBdICsgcC54XHJcbiAgICAgIGVsc2UgaWYoaSA9PSAnVicpIGNbMF0gPSBjWzBdICsgcC55XHJcbiAgICAgIGVsc2UgaWYoaSA9PSAnQScpe1xyXG4gICAgICAgIGNbNV0gPSBjWzVdICsgcC54LFxyXG4gICAgICAgIGNbNl0gPSBjWzZdICsgcC55XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGZvcih2YXIgaiA9IDAsIGpsID0gYy5sZW5ndGg7IGogPCBqbDsgKytqKSB7XHJcbiAgICAgICAgICBjW2pdID0gY1tqXSArIChqJTIgPyBwLnkgOiBwLngpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHBhdGhIYW5kbGVyc1tpXShjLCBwLCBwMClcclxuICAgIH1cclxuICB9KShtbGh2cXRjc2FbaV0udG9VcHBlckNhc2UoKSlcclxufVxyXG5cclxuLy8gUGF0aCBwb2ludHMgYXJyYXlcclxuU1ZHLlBhdGhBcnJheSA9IGZ1bmN0aW9uKGFycmF5LCBmYWxsYmFjaykge1xyXG4gIFNWRy5BcnJheS5jYWxsKHRoaXMsIGFycmF5LCBmYWxsYmFjayB8fCBbWydNJywgMCwgMF1dKVxyXG59XHJcblxyXG4vLyBJbmhlcml0IGZyb20gU1ZHLkFycmF5XHJcblNWRy5QYXRoQXJyYXkucHJvdG90eXBlID0gbmV3IFNWRy5BcnJheVxyXG5TVkcuUGF0aEFycmF5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNWRy5QYXRoQXJyYXlcclxuXHJcblNWRy5leHRlbmQoU1ZHLlBhdGhBcnJheSwge1xyXG4gIC8vIENvbnZlcnQgYXJyYXkgdG8gc3RyaW5nXHJcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGFycmF5VG9TdHJpbmcodGhpcy52YWx1ZSlcclxuICB9XHJcbiAgLy8gTW92ZSBwYXRoIHN0cmluZ1xyXG4sIG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIC8vIGdldCBib3VuZGluZyBib3ggb2YgY3VycmVudCBzaXR1YXRpb25cclxuICAgIHZhciBib3ggPSB0aGlzLmJib3goKVxyXG5cclxuICAgIC8vIGdldCByZWxhdGl2ZSBvZmZzZXRcclxuICAgIHggLT0gYm94LnhcclxuICAgIHkgLT0gYm94LnlcclxuXHJcbiAgICBpZiAoIWlzTmFOKHgpICYmICFpc05hTih5KSkge1xyXG4gICAgICAvLyBtb3ZlIGV2ZXJ5IHBvaW50XHJcbiAgICAgIGZvciAodmFyIGwsIGkgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgbCA9IHRoaXMudmFsdWVbaV1bMF1cclxuXHJcbiAgICAgICAgaWYgKGwgPT0gJ00nIHx8IGwgPT0gJ0wnIHx8IGwgPT0gJ1QnKSAge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSArPSB4XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzJdICs9IHlcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChsID09ICdIJykgIHtcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gKz0geFxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ1YnKSAge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSArPSB5XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobCA9PSAnQycgfHwgbCA9PSAnUycgfHwgbCA9PSAnUScpICB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzFdICs9IHhcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMl0gKz0geVxyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVszXSArPSB4XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzRdICs9IHlcclxuXHJcbiAgICAgICAgICBpZiAobCA9PSAnQycpICB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVbaV1bNV0gKz0geFxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzZdICs9IHlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChsID09ICdBJykgIHtcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bNl0gKz0geFxyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVs3XSArPSB5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIFJlc2l6ZSBwYXRoIHN0cmluZ1xyXG4sIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8vIGdldCBib3VuZGluZyBib3ggb2YgY3VycmVudCBzaXR1YXRpb25cclxuICAgIHZhciBpLCBsLCBib3ggPSB0aGlzLmJib3goKVxyXG5cclxuICAgIC8vIHJlY2FsY3VsYXRlIHBvc2l0aW9uIG9mIGFsbCBwb2ludHMgYWNjb3JkaW5nIHRvIG5ldyBzaXplXHJcbiAgICBmb3IgKGkgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIGwgPSB0aGlzLnZhbHVlW2ldWzBdXHJcblxyXG4gICAgICBpZiAobCA9PSAnTScgfHwgbCA9PSAnTCcgfHwgbCA9PSAnVCcpICB7XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSA9ICgodGhpcy52YWx1ZVtpXVsxXSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzJdID0gKCh0aGlzLnZhbHVlW2ldWzJdIC0gYm94LnkpICogaGVpZ2h0KSAvIGJveC5oZWlnaHQgKyBib3gueVxyXG5cclxuICAgICAgfSBlbHNlIGlmIChsID09ICdIJykgIHtcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzFdID0gKCh0aGlzLnZhbHVlW2ldWzFdIC0gYm94LngpICogd2lkdGgpICAvIGJveC53aWR0aCAgKyBib3gueFxyXG5cclxuICAgICAgfSBlbHNlIGlmIChsID09ICdWJykgIHtcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzFdID0gKCh0aGlzLnZhbHVlW2ldWzFdIC0gYm94LnkpICogaGVpZ2h0KSAvIGJveC5oZWlnaHQgKyBib3gueVxyXG5cclxuICAgICAgfSBlbHNlIGlmIChsID09ICdDJyB8fCBsID09ICdTJyB8fCBsID09ICdRJykgIHtcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzFdID0gKCh0aGlzLnZhbHVlW2ldWzFdIC0gYm94LngpICogd2lkdGgpICAvIGJveC53aWR0aCAgKyBib3gueFxyXG4gICAgICAgIHRoaXMudmFsdWVbaV1bMl0gPSAoKHRoaXMudmFsdWVbaV1bMl0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVszXSA9ICgodGhpcy52YWx1ZVtpXVszXSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzRdID0gKCh0aGlzLnZhbHVlW2ldWzRdIC0gYm94LnkpICogaGVpZ2h0KSAvIGJveC5oZWlnaHQgKyBib3gueVxyXG5cclxuICAgICAgICBpZiAobCA9PSAnQycpICB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzVdID0gKCh0aGlzLnZhbHVlW2ldWzVdIC0gYm94LngpICogd2lkdGgpICAvIGJveC53aWR0aCAgKyBib3gueFxyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVs2XSA9ICgodGhpcy52YWx1ZVtpXVs2XSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKGwgPT0gJ0EnKSAge1xyXG4gICAgICAgIC8vIHJlc2l6ZSByYWRpaVxyXG4gICAgICAgIHRoaXMudmFsdWVbaV1bMV0gPSAodGhpcy52YWx1ZVtpXVsxXSAqIHdpZHRoKSAgLyBib3gud2lkdGhcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzJdID0gKHRoaXMudmFsdWVbaV1bMl0gKiBoZWlnaHQpIC8gYm94LmhlaWdodFxyXG5cclxuICAgICAgICAvLyBtb3ZlIHBvc2l0aW9uIHZhbHVlc1xyXG4gICAgICAgIHRoaXMudmFsdWVbaV1bNl0gPSAoKHRoaXMudmFsdWVbaV1bNl0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVs3XSA9ICgodGhpcy52YWx1ZVtpXVs3XSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBUZXN0IGlmIHRoZSBwYXNzZWQgcGF0aCBhcnJheSB1c2UgdGhlIHNhbWUgcGF0aCBkYXRhIGNvbW1hbmRzIGFzIHRoaXMgcGF0aCBhcnJheVxyXG4sIGVxdWFsQ29tbWFuZHM6IGZ1bmN0aW9uKHBhdGhBcnJheSkge1xyXG4gICAgdmFyIGksIGlsLCBlcXVhbENvbW1hbmRzXHJcblxyXG4gICAgcGF0aEFycmF5ID0gbmV3IFNWRy5QYXRoQXJyYXkocGF0aEFycmF5KVxyXG5cclxuICAgIGVxdWFsQ29tbWFuZHMgPSB0aGlzLnZhbHVlLmxlbmd0aCA9PT0gcGF0aEFycmF5LnZhbHVlLmxlbmd0aFxyXG4gICAgZm9yKGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoOyBlcXVhbENvbW1hbmRzICYmIGkgPCBpbDsgaSsrKSB7XHJcbiAgICAgIGVxdWFsQ29tbWFuZHMgPSB0aGlzLnZhbHVlW2ldWzBdID09PSBwYXRoQXJyYXkudmFsdWVbaV1bMF1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXF1YWxDb21tYW5kc1xyXG4gIH1cclxuICAvLyBNYWtlIHBhdGggYXJyYXkgbW9ycGhhYmxlXHJcbiwgbW9ycGg6IGZ1bmN0aW9uKHBhdGhBcnJheSkge1xyXG4gICAgcGF0aEFycmF5ID0gbmV3IFNWRy5QYXRoQXJyYXkocGF0aEFycmF5KVxyXG5cclxuICAgIGlmKHRoaXMuZXF1YWxDb21tYW5kcyhwYXRoQXJyYXkpKSB7XHJcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBwYXRoQXJyYXlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gR2V0IG1vcnBoZWQgcGF0aCBhcnJheSBhdCBnaXZlbiBwb3NpdGlvblxyXG4sIGF0OiBmdW5jdGlvbihwb3MpIHtcclxuICAgIC8vIG1ha2Ugc3VyZSBhIGRlc3RpbmF0aW9uIGlzIGRlZmluZWRcclxuICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICB2YXIgc291cmNlQXJyYXkgPSB0aGlzLnZhbHVlXHJcbiAgICAgICwgZGVzdGluYXRpb25BcnJheSA9IHRoaXMuZGVzdGluYXRpb24udmFsdWVcclxuICAgICAgLCBhcnJheSA9IFtdLCBwYXRoQXJyYXkgPSBuZXcgU1ZHLlBhdGhBcnJheSgpXHJcbiAgICAgICwgaSwgaWwsIGosIGpsXHJcblxyXG4gICAgLy8gQW5pbWF0ZSBoYXMgc3BlY2lmaWVkIGluIHRoZSBTVkcgc3BlY1xyXG4gICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHMTEvcGF0aHMuaHRtbCNQYXRoRWxlbWVudFxyXG4gICAgZm9yIChpID0gMCwgaWwgPSBzb3VyY2VBcnJheS5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XHJcbiAgICAgIGFycmF5W2ldID0gW3NvdXJjZUFycmF5W2ldWzBdXVxyXG4gICAgICBmb3IoaiA9IDEsIGpsID0gc291cmNlQXJyYXlbaV0ubGVuZ3RoOyBqIDwgamw7IGorKykge1xyXG4gICAgICAgIGFycmF5W2ldW2pdID0gc291cmNlQXJyYXlbaV1bal0gKyAoZGVzdGluYXRpb25BcnJheVtpXVtqXSAtIHNvdXJjZUFycmF5W2ldW2pdKSAqIHBvc1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEZvciB0aGUgdHdvIGZsYWdzIG9mIHRoZSBlbGxpcHRpY2FsIGFyYyBjb21tYW5kLCB0aGUgU1ZHIHNwZWMgc2F5OlxyXG4gICAgICAvLyBGbGFncyBhbmQgYm9vbGVhbnMgYXJlIGludGVycG9sYXRlZCBhcyBmcmFjdGlvbnMgYmV0d2VlbiB6ZXJvIGFuZCBvbmUsIHdpdGggYW55IG5vbi16ZXJvIHZhbHVlIGNvbnNpZGVyZWQgdG8gYmUgYSB2YWx1ZSBvZiBvbmUvdHJ1ZVxyXG4gICAgICAvLyBFbGxpcHRpY2FsIGFyYyBjb21tYW5kIGFzIGFuIGFycmF5IGZvbGxvd2VkIGJ5IGNvcnJlc3BvbmRpbmcgaW5kZXhlczpcclxuICAgICAgLy8gWydBJywgcngsIHJ5LCB4LWF4aXMtcm90YXRpb24sIGxhcmdlLWFyYy1mbGFnLCBzd2VlcC1mbGFnLCB4LCB5XVxyXG4gICAgICAvLyAgIDAgICAgMSAgIDIgICAgICAgIDMgICAgICAgICAgICAgICAgIDQgICAgICAgICAgICAgNSAgICAgIDYgIDdcclxuICAgICAgaWYoYXJyYXlbaV1bMF0gPT09ICdBJykge1xyXG4gICAgICAgIGFycmF5W2ldWzRdID0gKyhhcnJheVtpXVs0XSAhPSAwKVxyXG4gICAgICAgIGFycmF5W2ldWzVdID0gKyhhcnJheVtpXVs1XSAhPSAwKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGlyZWN0bHkgbW9kaWZ5IHRoZSB2YWx1ZSBvZiBhIHBhdGggYXJyYXksIHRoaXMgaXMgZG9uZSB0aGlzIHdheSBmb3IgcGVyZm9ybWFuY2VcclxuICAgIHBhdGhBcnJheS52YWx1ZSA9IGFycmF5XHJcbiAgICByZXR1cm4gcGF0aEFycmF5XHJcbiAgfVxyXG4gIC8vIEFic29sdXRpemUgYW5kIHBhcnNlIHBhdGggdG8gYXJyYXlcclxuLCBwYXJzZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgIC8vIGlmIGl0J3MgYWxyZWFkeSBhIHBhdGhhcnJheSwgbm8gbmVlZCB0byBwYXJzZSBpdFxyXG4gICAgaWYgKGFycmF5IGluc3RhbmNlb2YgU1ZHLlBhdGhBcnJheSkgcmV0dXJuIGFycmF5LnZhbHVlT2YoKVxyXG5cclxuICAgIC8vIHByZXBhcmUgZm9yIHBhcnNpbmdcclxuICAgIHZhciBpLCB4MCwgeTAsIHMsIHNlZywgYXJyXHJcbiAgICAgICwgeCA9IDBcclxuICAgICAgLCB5ID0gMFxyXG4gICAgICAsIHBhcmFtQ250ID0geyAnTSc6MiwgJ0wnOjIsICdIJzoxLCAnVic6MSwgJ0MnOjYsICdTJzo0LCAnUSc6NCwgJ1QnOjIsICdBJzo3LCAnWic6MCB9XHJcblxyXG4gICAgaWYodHlwZW9mIGFycmF5ID09ICdzdHJpbmcnKXtcclxuXHJcbiAgICAgIGFycmF5ID0gYXJyYXlcclxuICAgICAgICAucmVwbGFjZShTVkcucmVnZXgubnVtYmVyc1dpdGhEb3RzLCBwYXRoUmVnUmVwbGFjZSkgLy8gY29udmVydCA0NS4xMjMuMTIzIHRvIDQ1LjEyMyAuMTIzXHJcbiAgICAgICAgLnJlcGxhY2UoU1ZHLnJlZ2V4LnBhdGhMZXR0ZXJzLCAnICQmICcpIC8vIHB1dCBzb21lIHJvb20gYmV0d2VlbiBsZXR0ZXJzIGFuZCBudW1iZXJzXHJcbiAgICAgICAgLnJlcGxhY2UoU1ZHLnJlZ2V4Lmh5cGhlbiwgJyQxIC0nKSAgICAgIC8vIGFkZCBzcGFjZSBiZWZvcmUgaHlwaGVuXHJcbiAgICAgICAgLnRyaW0oKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyaW1cclxuICAgICAgICAuc3BsaXQoU1ZHLnJlZ2V4LmRlbGltaXRlcikgICAvLyBzcGxpdCBpbnRvIGFycmF5XHJcblxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGFycmF5ID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpe1xyXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQuY2FsbChwcmV2LCBjdXJyKVxyXG4gICAgICB9LCBbXSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBhcnJheSBub3cgaXMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgcGFydHMgb2YgYSBwYXRoIGUuZy4gWydNJywgJzAnLCAnMCcsICdMJywgJzMwJywgJzMwJyAuLi5dXHJcbiAgICB2YXIgYXJyID0gW11cclxuICAgICAgLCBwID0gbmV3IFNWRy5Qb2ludCgpXHJcbiAgICAgICwgcDAgPSBuZXcgU1ZHLlBvaW50KClcclxuICAgICAgLCBpbmRleCA9IDBcclxuICAgICAgLCBsZW4gPSBhcnJheS5sZW5ndGhcclxuXHJcbiAgICBkb3tcclxuICAgICAgLy8gVGVzdCBpZiB3ZSBoYXZlIGEgcGF0aCBsZXR0ZXJcclxuICAgICAgaWYoU1ZHLnJlZ2V4LmlzUGF0aExldHRlci50ZXN0KGFycmF5W2luZGV4XSkpe1xyXG4gICAgICAgIHMgPSBhcnJheVtpbmRleF1cclxuICAgICAgICArK2luZGV4XHJcbiAgICAgIC8vIElmIGxhc3QgbGV0dGVyIHdhcyBhIG1vdmUgY29tbWFuZCBhbmQgd2UgZ290IG5vIG5ldywgaXQgZGVmYXVsdHMgdG8gW0xdaW5lXHJcbiAgICAgIH1lbHNlIGlmKHMgPT0gJ00nKXtcclxuICAgICAgICBzID0gJ0wnXHJcbiAgICAgIH1lbHNlIGlmKHMgPT0gJ20nKXtcclxuICAgICAgICBzID0gJ2wnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFyci5wdXNoKHBhdGhIYW5kbGVyc1tzXS5jYWxsKG51bGwsXHJcbiAgICAgICAgICBhcnJheS5zbGljZShpbmRleCwgKGluZGV4ID0gaW5kZXggKyBwYXJhbUNudFtzLnRvVXBwZXJDYXNlKCldKSkubWFwKHBhcnNlRmxvYXQpLFxyXG4gICAgICAgICAgcCwgcDBcclxuICAgICAgICApXHJcbiAgICAgIClcclxuXHJcbiAgICB9d2hpbGUobGVuID4gaW5kZXgpXHJcblxyXG4gICAgcmV0dXJuIGFyclxyXG5cclxuICB9XHJcbiAgLy8gR2V0IGJvdW5kaW5nIGJveCBvZiBwYXRoXHJcbiwgYmJveDogZnVuY3Rpb24oKSB7XHJcbiAgICBTVkcucGFyc2VyLnBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy50b1N0cmluZygpKVxyXG5cclxuICAgIHJldHVybiBTVkcucGFyc2VyLnBhdGguZ2V0QkJveCgpXHJcbiAgfVxyXG5cclxufSlcclxuXG4vLyBNb2R1bGUgZm9yIHVuaXQgY29udmVydGlvbnNcclxuU1ZHLk51bWJlciA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKHZhbHVlLCB1bml0KSB7XHJcbiAgICAvLyBpbml0aWFsaXplIGRlZmF1bHRzXHJcbiAgICB0aGlzLnZhbHVlID0gMFxyXG4gICAgdGhpcy51bml0ICA9IHVuaXQgfHwgJydcclxuXHJcbiAgICAvLyBwYXJzZSB2YWx1ZVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgLy8gZW5zdXJlIGEgdmFsaWQgbnVtZXJpYyB2YWx1ZVxyXG4gICAgICB0aGlzLnZhbHVlID0gaXNOYU4odmFsdWUpID8gMCA6ICFpc0Zpbml0ZSh2YWx1ZSkgPyAodmFsdWUgPCAwID8gLTMuNGUrMzggOiArMy40ZSszOCkgOiB2YWx1ZVxyXG5cclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICB1bml0ID0gdmFsdWUubWF0Y2goU1ZHLnJlZ2V4Lm51bWJlckFuZFVuaXQpXHJcblxyXG4gICAgICBpZiAodW5pdCkge1xyXG4gICAgICAgIC8vIG1ha2UgdmFsdWUgbnVtZXJpY1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KHVuaXRbMV0pXHJcblxyXG4gICAgICAgIC8vIG5vcm1hbGl6ZVxyXG4gICAgICAgIGlmICh1bml0WzVdID09ICclJylcclxuICAgICAgICAgIHRoaXMudmFsdWUgLz0gMTAwXHJcbiAgICAgICAgZWxzZSBpZiAodW5pdFs1XSA9PSAncycpXHJcbiAgICAgICAgICB0aGlzLnZhbHVlICo9IDEwMDBcclxuXHJcbiAgICAgICAgLy8gc3RvcmUgdW5pdFxyXG4gICAgICAgIHRoaXMudW5pdCA9IHVuaXRbNV1cclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNWRy5OdW1iZXIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWVPZigpXHJcbiAgICAgICAgdGhpcy51bml0ICA9IHZhbHVlLnVuaXRcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgLy8gQWRkIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIFN0cmluZ2FsaXplXHJcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy51bml0ID09ICclJyA/XHJcbiAgICAgICAgICB+fih0aGlzLnZhbHVlICogMWU4KSAvIDFlNjpcclxuICAgICAgICB0aGlzLnVuaXQgPT0gJ3MnID9cclxuICAgICAgICAgIHRoaXMudmFsdWUgLyAxZTMgOlxyXG4gICAgICAgICAgdGhpcy52YWx1ZVxyXG4gICAgICApICsgdGhpcy51bml0XHJcbiAgICB9XHJcbiAgLCB0b0pTT046IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpXHJcbiAgICB9XHJcbiAgLCAvLyBDb252ZXJ0IHRvIHByaW1pdGl2ZVxyXG4gICAgdmFsdWVPZjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXHJcbiAgICB9XHJcbiAgICAvLyBBZGQgbnVtYmVyXHJcbiAgLCBwbHVzOiBmdW5jdGlvbihudW1iZXIpIHtcclxuICAgICAgbnVtYmVyID0gbmV3IFNWRy5OdW1iZXIobnVtYmVyKVxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5OdW1iZXIodGhpcyArIG51bWJlciwgdGhpcy51bml0IHx8IG51bWJlci51bml0KVxyXG4gICAgfVxyXG4gICAgLy8gU3VidHJhY3QgbnVtYmVyXHJcbiAgLCBtaW51czogZnVuY3Rpb24obnVtYmVyKSB7XHJcbiAgICAgIG51bWJlciA9IG5ldyBTVkcuTnVtYmVyKG51bWJlcilcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuTnVtYmVyKHRoaXMgLSBudW1iZXIsIHRoaXMudW5pdCB8fCBudW1iZXIudW5pdClcclxuICAgIH1cclxuICAgIC8vIE11bHRpcGx5IG51bWJlclxyXG4gICwgdGltZXM6IGZ1bmN0aW9uKG51bWJlcikge1xyXG4gICAgICBudW1iZXIgPSBuZXcgU1ZHLk51bWJlcihudW1iZXIpXHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk51bWJlcih0aGlzICogbnVtYmVyLCB0aGlzLnVuaXQgfHwgbnVtYmVyLnVuaXQpXHJcbiAgICB9XHJcbiAgICAvLyBEaXZpZGUgbnVtYmVyXHJcbiAgLCBkaXZpZGU6IGZ1bmN0aW9uKG51bWJlcikge1xyXG4gICAgICBudW1iZXIgPSBuZXcgU1ZHLk51bWJlcihudW1iZXIpXHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk51bWJlcih0aGlzIC8gbnVtYmVyLCB0aGlzLnVuaXQgfHwgbnVtYmVyLnVuaXQpXHJcbiAgICB9XHJcbiAgICAvLyBDb252ZXJ0IHRvIGRpZmZlcmVudCB1bml0XHJcbiAgLCB0bzogZnVuY3Rpb24odW5pdCkge1xyXG4gICAgICB2YXIgbnVtYmVyID0gbmV3IFNWRy5OdW1iZXIodGhpcylcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgdW5pdCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgbnVtYmVyLnVuaXQgPSB1bml0XHJcblxyXG4gICAgICByZXR1cm4gbnVtYmVyXHJcbiAgICB9XHJcbiAgICAvLyBNYWtlIG51bWJlciBtb3JwaGFibGVcclxuICAsIG1vcnBoOiBmdW5jdGlvbihudW1iZXIpIHtcclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTVkcuTnVtYmVyKG51bWJlcilcclxuXHJcbiAgICAgIGlmKG51bWJlci5yZWxhdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24udmFsdWUgKz0gdGhpcy52YWx1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IG1vcnBoZWQgbnVtYmVyIGF0IGdpdmVuIHBvc2l0aW9uXHJcbiAgLCBhdDogZnVuY3Rpb24ocG9zKSB7XHJcbiAgICAgIC8vIE1ha2Ugc3VyZSBhIGRlc3RpbmF0aW9uIGlzIGRlZmluZWRcclxuICAgICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpc1xyXG5cclxuICAgICAgLy8gR2VuZXJhdGUgbmV3IG1vcnBoZWQgbnVtYmVyXHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk51bWJlcih0aGlzLmRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgLm1pbnVzKHRoaXMpXHJcbiAgICAgICAgICAudGltZXMocG9zKVxyXG4gICAgICAgICAgLnBsdXModGhpcylcclxuICAgIH1cclxuXHJcbiAgfVxyXG59KVxyXG5cblxyXG5TVkcuRWxlbWVudCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgLy8gbWFrZSBzdHJva2UgdmFsdWUgYWNjZXNzaWJsZSBkeW5hbWljYWxseVxyXG4gICAgdGhpcy5fc3Ryb2tlID0gU1ZHLmRlZmF1bHRzLmF0dHJzLnN0cm9rZVxyXG4gICAgdGhpcy5fZXZlbnQgPSBudWxsXHJcblxyXG4gICAgLy8gaW5pdGlhbGl6ZSBkYXRhIG9iamVjdFxyXG4gICAgdGhpcy5kb20gPSB7fVxyXG5cclxuICAgIC8vIGNyZWF0ZSBjaXJjdWxhciByZWZlcmVuY2VcclxuICAgIGlmICh0aGlzLm5vZGUgPSBub2RlKSB7XHJcbiAgICAgIHRoaXMudHlwZSA9IG5vZGUubm9kZU5hbWVcclxuICAgICAgdGhpcy5ub2RlLmluc3RhbmNlID0gdGhpc1xyXG5cclxuICAgICAgLy8gc3RvcmUgY3VycmVudCBhdHRyaWJ1dGUgdmFsdWVcclxuICAgICAgdGhpcy5fc3Ryb2tlID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ3N0cm9rZScpIHx8IHRoaXMuX3N0cm9rZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIE1vdmUgb3ZlciB4LWF4aXNcclxuICAgIHg6IGZ1bmN0aW9uKHgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIHgpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIG92ZXIgeS1heGlzXHJcbiAgLCB5OiBmdW5jdGlvbih5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3knLCB5KVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB4LWF4aXNcclxuICAsIGN4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLngoKSArIHRoaXMud2lkdGgoKSAvIDIgOiB0aGlzLngoeCAtIHRoaXMud2lkdGgoKSAvIDIpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIGJ5IGNlbnRlciBvdmVyIHktYXhpc1xyXG4gICwgY3k6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMueSgpICsgdGhpcy5oZWlnaHQoKSAvIDIgOiB0aGlzLnkoeSAtIHRoaXMuaGVpZ2h0KCkgLyAyKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBlbGVtZW50IHRvIGdpdmVuIHggYW5kIHkgdmFsdWVzXHJcbiAgLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLngoeCkueSh5KVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBlbGVtZW50IGJ5IGl0cyBjZW50ZXJcclxuICAsIGNlbnRlcjogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jeCh4KS5jeSh5KVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcclxuICAsIHdpZHRoOiBmdW5jdGlvbih3aWR0aCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd3aWR0aCcsIHdpZHRoKVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XHJcbiAgLCBoZWlnaHQ6IGZ1bmN0aW9uKGhlaWdodCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcclxuICAsIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIC53aWR0aChuZXcgU1ZHLk51bWJlcihwLndpZHRoKSlcclxuICAgICAgICAuaGVpZ2h0KG5ldyBTVkcuTnVtYmVyKHAuaGVpZ2h0KSlcclxuICAgIH1cclxuICAgIC8vIENsb25lIGVsZW1lbnRcclxuICAsIGNsb25lOiBmdW5jdGlvbihwYXJlbnQsIHdpdGhEYXRhKSB7XHJcbiAgICAgIC8vIHdyaXRlIGRvbSBkYXRhIHRvIHRoZSBkb20gc28gdGhlIGNsb25lIGNhbiBwaWNrdXAgdGhlIGRhdGFcclxuICAgICAgdGhpcy53cml0ZURhdGFUb0RvbSgpXHJcblxyXG4gICAgICAvLyBjbG9uZSBlbGVtZW50IGFuZCBhc3NpZ24gbmV3IGlkXHJcbiAgICAgIHZhciBjbG9uZSA9IGFzc2lnbk5ld0lkKHRoaXMubm9kZS5jbG9uZU5vZGUodHJ1ZSkpXHJcblxyXG4gICAgICAvLyBpbnNlcnQgdGhlIGNsb25lIGluIHRoZSBnaXZlbiBwYXJlbnQgb3IgYWZ0ZXIgbXlzZWxmXHJcbiAgICAgIGlmKHBhcmVudCkgcGFyZW50LmFkZChjbG9uZSlcclxuICAgICAgZWxzZSB0aGlzLmFmdGVyKGNsb25lKVxyXG5cclxuICAgICAgcmV0dXJuIGNsb25lXHJcbiAgICB9XHJcbiAgICAvLyBSZW1vdmUgZWxlbWVudFxyXG4gICwgcmVtb3ZlOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMucGFyZW50KCkpXHJcbiAgICAgICAgdGhpcy5wYXJlbnQoKS5yZW1vdmVFbGVtZW50KHRoaXMpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVwbGFjZSBlbGVtZW50XHJcbiAgLCByZXBsYWNlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuYWZ0ZXIoZWxlbWVudCkucmVtb3ZlKClcclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgZWxlbWVudCB0byBnaXZlbiBjb250YWluZXIgYW5kIHJldHVybiBzZWxmXHJcbiAgLCBhZGRUbzogZnVuY3Rpb24ocGFyZW50KSB7XHJcbiAgICAgIHJldHVybiBwYXJlbnQucHV0KHRoaXMpXHJcbiAgICB9XHJcbiAgICAvLyBBZGQgZWxlbWVudCB0byBnaXZlbiBjb250YWluZXIgYW5kIHJldHVybiBjb250YWluZXJcclxuICAsIHB1dEluOiBmdW5jdGlvbihwYXJlbnQpIHtcclxuICAgICAgcmV0dXJuIHBhcmVudC5hZGQodGhpcylcclxuICAgIH1cclxuICAgIC8vIEdldCAvIHNldCBpZFxyXG4gICwgaWQ6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2lkJywgaWQpXHJcbiAgICB9XHJcbiAgICAvLyBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gcG9pbnQgaW5zaWRlIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGVsZW1lbnRcclxuICAsIGluc2lkZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgICB2YXIgYm94ID0gdGhpcy5iYm94KClcclxuXHJcbiAgICAgIHJldHVybiB4ID4gYm94LnhcclxuICAgICAgICAgICYmIHkgPiBib3gueVxyXG4gICAgICAgICAgJiYgeCA8IGJveC54ICsgYm94LndpZHRoXHJcbiAgICAgICAgICAmJiB5IDwgYm94LnkgKyBib3guaGVpZ2h0XHJcbiAgICB9XHJcbiAgICAvLyBTaG93IGVsZW1lbnRcclxuICAsIHNob3c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdHlsZSgnZGlzcGxheScsICcnKVxyXG4gICAgfVxyXG4gICAgLy8gSGlkZSBlbGVtZW50XHJcbiAgLCBoaWRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpXHJcbiAgICB9XHJcbiAgICAvLyBJcyBlbGVtZW50IHZpc2libGU/XHJcbiAgLCB2aXNpYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3R5bGUoJ2Rpc3BsYXknKSAhPSAnbm9uZSdcclxuICAgIH1cclxuICAgIC8vIFJldHVybiBpZCBvbiBzdHJpbmcgY29udmVyc2lvblxyXG4gICwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdpZCcpXHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY2xhc3NlcyBvbiB0aGUgbm9kZVxyXG4gICwgY2xhc3NlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBhdHRyID0gdGhpcy5hdHRyKCdjbGFzcycpXHJcblxyXG4gICAgICByZXR1cm4gYXR0ciA9PSBudWxsID8gW10gOiBhdHRyLnRyaW0oKS5zcGxpdChTVkcucmVnZXguZGVsaW1pdGVyKVxyXG4gICAgfVxyXG4gICAgLy8gUmV0dXJuIHRydWUgaWYgY2xhc3MgZXhpc3RzIG9uIHRoZSBub2RlLCBmYWxzZSBvdGhlcndpc2VcclxuICAsIGhhc0NsYXNzOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzZXMoKS5pbmRleE9mKG5hbWUpICE9IC0xXHJcbiAgICB9XHJcbiAgICAvLyBBZGQgY2xhc3MgdG8gdGhlIG5vZGVcclxuICAsIGFkZENsYXNzOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNDbGFzcyhuYW1lKSkge1xyXG4gICAgICAgIHZhciBhcnJheSA9IHRoaXMuY2xhc3NlcygpXHJcbiAgICAgICAgYXJyYXkucHVzaChuYW1lKVxyXG4gICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCBhcnJheS5qb2luKCcgJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBSZW1vdmUgY2xhc3MgZnJvbSB0aGUgbm9kZVxyXG4gICwgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzQ2xhc3MobmFtZSkpIHtcclxuICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgdGhpcy5jbGFzc2VzKCkuZmlsdGVyKGZ1bmN0aW9uKGMpIHtcclxuICAgICAgICAgIHJldHVybiBjICE9IG5hbWVcclxuICAgICAgICB9KS5qb2luKCcgJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBUb2dnbGUgdGhlIHByZXNlbmNlIG9mIGEgY2xhc3Mgb24gdGhlIG5vZGVcclxuICAsIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc0NsYXNzKG5hbWUpID8gdGhpcy5yZW1vdmVDbGFzcyhuYW1lKSA6IHRoaXMuYWRkQ2xhc3MobmFtZSlcclxuICAgIH1cclxuICAgIC8vIEdldCByZWZlcmVuY2VkIGVsZW1lbnQgZm9ybSBhdHRyaWJ1dGUgdmFsdWVcclxuICAsIHJlZmVyZW5jZTogZnVuY3Rpb24oYXR0cikge1xyXG4gICAgICByZXR1cm4gU1ZHLmdldCh0aGlzLmF0dHIoYXR0cikpXHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm5zIHRoZSBwYXJlbnQgZWxlbWVudCBpbnN0YW5jZVxyXG4gICwgcGFyZW50OiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzXHJcblxyXG4gICAgICAvLyBjaGVjayBmb3IgcGFyZW50XHJcbiAgICAgIGlmKCFwYXJlbnQubm9kZS5wYXJlbnROb2RlKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgLy8gZ2V0IHBhcmVudCBlbGVtZW50XHJcbiAgICAgIHBhcmVudCA9IFNWRy5hZG9wdChwYXJlbnQubm9kZS5wYXJlbnROb2RlKVxyXG5cclxuICAgICAgaWYoIXR5cGUpIHJldHVybiBwYXJlbnRcclxuXHJcbiAgICAgIC8vIGxvb3AgdHJvdWdoIGFuY2VzdG9ycyBpZiB0eXBlIGlzIGdpdmVuXHJcbiAgICAgIHdoaWxlKHBhcmVudCAmJiBwYXJlbnQubm9kZSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50KXtcclxuICAgICAgICBpZih0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnQubWF0Y2hlcyh0eXBlKSA6IHBhcmVudCBpbnN0YW5jZW9mIHR5cGUpIHJldHVybiBwYXJlbnRcclxuICAgICAgICBpZihwYXJlbnQubm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09ICcjZG9jdW1lbnQnKSByZXR1cm4gbnVsbCAvLyAjNzIwXHJcbiAgICAgICAgcGFyZW50ID0gU1ZHLmFkb3B0KHBhcmVudC5ub2RlLnBhcmVudE5vZGUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIEdldCBwYXJlbnQgZG9jdW1lbnRcclxuICAsIGRvYzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgU1ZHLkRvYyA/IHRoaXMgOiB0aGlzLnBhcmVudChTVkcuRG9jKVxyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuIGFycmF5IG9mIGFsbCBhbmNlc3RvcnMgb2YgZ2l2ZW4gdHlwZSB1cCB0byB0aGUgcm9vdCBzdmdcclxuICAsIHBhcmVudHM6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgdmFyIHBhcmVudHMgPSBbXSwgcGFyZW50ID0gdGhpc1xyXG5cclxuICAgICAgZG97XHJcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCh0eXBlKVxyXG4gICAgICAgIGlmKCFwYXJlbnQgfHwgIXBhcmVudC5ub2RlKSBicmVha1xyXG5cclxuICAgICAgICBwYXJlbnRzLnB1c2gocGFyZW50KVxyXG4gICAgICB9IHdoaWxlKHBhcmVudC5wYXJlbnQpXHJcblxyXG4gICAgICByZXR1cm4gcGFyZW50c1xyXG4gICAgfVxyXG4gICAgLy8gbWF0Y2hlcyB0aGUgZWxlbWVudCB2cyBhIGNzcyBzZWxlY3RvclxyXG4gICwgbWF0Y2hlczogZnVuY3Rpb24oc2VsZWN0b3Ipe1xyXG4gICAgICByZXR1cm4gbWF0Y2hlcyh0aGlzLm5vZGUsIHNlbGVjdG9yKVxyXG4gICAgfVxyXG4gICAgLy8gUmV0dXJucyB0aGUgc3ZnIG5vZGUgdG8gY2FsbCBuYXRpdmUgc3ZnIG1ldGhvZHMgb24gaXRcclxuICAsIG5hdGl2ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5vZGVcclxuICAgIH1cclxuICAgIC8vIEltcG9ydCByYXcgc3ZnXHJcbiAgLCBzdmc6IGZ1bmN0aW9uKHN2Zykge1xyXG4gICAgICAvLyBjcmVhdGUgdGVtcG9yYXJ5IGhvbGRlclxyXG4gICAgICB2YXIgd2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N2ZycpXHJcblxyXG4gICAgICAvLyBhY3QgYXMgYSBzZXR0ZXIgaWYgc3ZnIGlzIGdpdmVuXHJcbiAgICAgIGlmIChzdmcgJiYgdGhpcyBpbnN0YW5jZW9mIFNWRy5QYXJlbnQpIHtcclxuICAgICAgICAvLyBkdW1wIHJhdyBzdmdcclxuICAgICAgICB3ZWxsLmlubmVySFRNTCA9ICc8c3ZnPicgKyBzdmcucmVwbGFjZSgvXFxuLywgJycpLnJlcGxhY2UoLzwoXFx3KykoW148XSs/KVxcLz4vZywgJzwkMSQyPjwvJDE+JykgKyAnPC9zdmc+J1xyXG5cclxuICAgICAgICAvLyB0cmFuc3BsYW50IG5vZGVzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gd2VsbC5maXJzdENoaWxkLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgaWw7IGkrKylcclxuICAgICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZCh3ZWxsLmZpcnN0Q2hpbGQuZmlyc3RDaGlsZClcclxuXHJcbiAgICAgIC8vIG90aGVyd2lzZSBhY3QgYXMgYSBnZXR0ZXJcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBjcmVhdGUgYSB3cmFwcGluZyBzdmcgZWxlbWVudCBpbiBjYXNlIG9mIHBhcnRpYWwgY29udGVudFxyXG4gICAgICAgIHdlbGwuYXBwZW5kQ2hpbGQoc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3ZnJykpXHJcblxyXG4gICAgICAgIC8vIHdyaXRlIHN2Z2pzIGRhdGEgdG8gdGhlIGRvbVxyXG4gICAgICAgIHRoaXMud3JpdGVEYXRhVG9Eb20oKVxyXG5cclxuICAgICAgICAvLyBpbnNlcnQgYSBjb3B5IG9mIHRoaXMgbm9kZVxyXG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZCh0aGlzLm5vZGUuY2xvbmVOb2RlKHRydWUpKVxyXG5cclxuICAgICAgICAvLyByZXR1cm4gdGFyZ2V0IGVsZW1lbnRcclxuICAgICAgICByZXR1cm4gd2VsbC5pbm5lckhUTUwucmVwbGFjZSgvXjxzdmc+LywgJycpLnJlcGxhY2UoLzxcXC9zdmc+JC8sICcnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIC8vIHdyaXRlIHN2Z2pzIGRhdGEgdG8gdGhlIGRvbVxyXG4gICwgd3JpdGVEYXRhVG9Eb206IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgLy8gZHVtcCB2YXJpYWJsZXMgcmVjdXJzaXZlbHlcclxuICAgICAgaWYodGhpcy5lYWNoIHx8IHRoaXMubGluZXMpe1xyXG4gICAgICAgIHZhciBmbiA9IHRoaXMuZWFjaCA/IHRoaXMgOiB0aGlzLmxpbmVzKCk7XHJcbiAgICAgICAgZm4uZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdGhpcy53cml0ZURhdGFUb0RvbSgpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzbHkgc2V0IGRhdGFcclxuICAgICAgdGhpcy5ub2RlLnJlbW92ZUF0dHJpYnV0ZSgnc3ZnanM6ZGF0YScpXHJcblxyXG4gICAgICBpZihPYmplY3Qua2V5cyh0aGlzLmRvbSkubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoJ3N2Z2pzOmRhdGEnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmRvbSkpIC8vIHNlZSAjNDI4XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIC8vIHNldCBnaXZlbiBkYXRhIHRvIHRoZSBlbGVtZW50cyBkYXRhIHByb3BlcnR5XHJcbiAgLCBzZXREYXRhOiBmdW5jdGlvbihvKXtcclxuICAgICAgdGhpcy5kb20gPSBvXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgLCBpczogZnVuY3Rpb24ob2JqKXtcclxuICAgICAgcmV0dXJuIGlzKHRoaXMsIG9iailcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxuU1ZHLmVhc2luZyA9IHtcclxuICAnLSc6IGZ1bmN0aW9uKHBvcyl7cmV0dXJuIHBvc31cclxuLCAnPD4nOmZ1bmN0aW9uKHBvcyl7cmV0dXJuIC1NYXRoLmNvcyhwb3MgKiBNYXRoLlBJKSAvIDIgKyAwLjV9XHJcbiwgJz4nOiBmdW5jdGlvbihwb3Mpe3JldHVybiAgTWF0aC5zaW4ocG9zICogTWF0aC5QSSAvIDIpfVxyXG4sICc8JzogZnVuY3Rpb24ocG9zKXtyZXR1cm4gLU1hdGguY29zKHBvcyAqIE1hdGguUEkgLyAyKSArIDF9XHJcbn1cclxuXHJcblNWRy5tb3JwaCA9IGZ1bmN0aW9uKHBvcyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGZyb20sIHRvKSB7XHJcbiAgICByZXR1cm4gbmV3IFNWRy5Nb3JwaE9iaihmcm9tLCB0bykuYXQocG9zKVxyXG4gIH1cclxufVxyXG5cclxuU1ZHLlNpdHVhdGlvbiA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBjcmVhdGU6IGZ1bmN0aW9uKG8pe1xyXG4gICAgdGhpcy5pbml0ID0gZmFsc2VcclxuICAgIHRoaXMucmV2ZXJzZWQgPSBmYWxzZVxyXG4gICAgdGhpcy5yZXZlcnNpbmcgPSBmYWxzZVxyXG5cclxuICAgIHRoaXMuZHVyYXRpb24gPSBuZXcgU1ZHLk51bWJlcihvLmR1cmF0aW9uKS52YWx1ZU9mKClcclxuICAgIHRoaXMuZGVsYXkgPSBuZXcgU1ZHLk51bWJlcihvLmRlbGF5KS52YWx1ZU9mKClcclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gK25ldyBEYXRlKCkgKyB0aGlzLmRlbGF5XHJcbiAgICB0aGlzLmZpbmlzaCA9IHRoaXMuc3RhcnQgKyB0aGlzLmR1cmF0aW9uXHJcbiAgICB0aGlzLmVhc2UgPSBvLmVhc2VcclxuXHJcbiAgICAvLyB0aGlzLmxvb3AgaXMgaW5jcmVtZW50ZWQgZnJvbSAwIHRvIHRoaXMubG9vcHNcclxuICAgIC8vIGl0IGlzIGFsc28gaW5jcmVtZW50ZWQgd2hlbiBpbiBhbiBpbmZpbml0ZSBsb29wICh3aGVuIHRoaXMubG9vcHMgaXMgdHJ1ZSlcclxuICAgIHRoaXMubG9vcCA9IDBcclxuICAgIHRoaXMubG9vcHMgPSBmYWxzZVxyXG5cclxuICAgIHRoaXMuYW5pbWF0aW9ucyA9IHtcclxuICAgICAgLy8gZnVuY3Rpb25Ub0NhbGw6IFtsaXN0IG9mIG1vcnBoYWJsZSBvYmplY3RzXVxyXG4gICAgICAvLyBlLmcuIG1vdmU6IFtTVkcuTnVtYmVyLCBTVkcuTnVtYmVyXVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXR0cnMgPSB7XHJcbiAgICAgIC8vIGhvbGRzIGFsbCBhdHRyaWJ1dGVzIHdoaWNoIGFyZSBub3QgcmVwcmVzZW50ZWQgZnJvbSBhIGZ1bmN0aW9uIHN2Zy5qcyBwcm92aWRlc1xyXG4gICAgICAvLyBlLmcuIHNvbWVBdHRyOiBTVkcuTnVtYmVyXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdHlsZXMgPSB7XHJcbiAgICAgIC8vIGhvbGRzIGFsbCBzdHlsZXMgd2hpY2ggc2hvdWxkIGJlIGFuaW1hdGVkXHJcbiAgICAgIC8vIGUuZy4gZmlsbC1jb2xvcjogU1ZHLkNvbG9yXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmFuc2Zvcm1zID0gW1xyXG4gICAgICAvLyBob2xkcyBhbGwgdHJhbnNmb3JtYXRpb25zIGFzIHRyYW5zZm9ybWF0aW9uIG9iamVjdHNcclxuICAgICAgLy8gZS5nLiBbU1ZHLlJvdGF0ZSwgU1ZHLlRyYW5zbGF0ZSwgU1ZHLk1hdHJpeF1cclxuICAgIF1cclxuXHJcbiAgICB0aGlzLm9uY2UgPSB7XHJcbiAgICAgIC8vIGZ1bmN0aW9ucyB0byBmaXJlIGF0IGEgc3BlY2lmaWMgcG9zaXRpb25cclxuICAgICAgLy8gZS5nLiBcIjAuNVwiOiBmdW5jdGlvbiBmb28oKXt9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5cclxuU1ZHLkZYID0gU1ZHLmludmVudCh7XHJcblxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgdGhpcy5fdGFyZ2V0ID0gZWxlbWVudFxyXG4gICAgdGhpcy5zaXR1YXRpb25zID0gW11cclxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcclxuICAgIHRoaXMuc2l0dWF0aW9uID0gbnVsbFxyXG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZVxyXG4gICAgdGhpcy5sYXN0UG9zID0gMFxyXG4gICAgdGhpcy5wb3MgPSAwXHJcbiAgICAvLyBUaGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgYW4gYW5pbWF0aW9uIGlzIGl0cyBwb3NpdGlvbiBpbiB0aGUgY29udGV4dCBvZiBpdHMgY29tcGxldGUgZHVyYXRpb24gKGluY2x1ZGluZyBkZWxheSBhbmQgbG9vcHMpXHJcbiAgICAvLyBXaGVuIHBlcmZvcm1pbmcgYSBkZWxheSwgYWJzUG9zIGlzIGJlbG93IDAgYW5kIHdoZW4gcGVyZm9ybWluZyBhIGxvb3AsIGl0cyB2YWx1ZSBpcyBhYm92ZSAxXHJcbiAgICB0aGlzLmFic1BvcyA9IDBcclxuICAgIHRoaXMuX3NwZWVkID0gMVxyXG4gIH1cclxuXHJcbiwgZXh0ZW5kOiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG9yIHJldHVybnMgdGhlIHRhcmdldCBvZiB0aGlzIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIG8gb2JqZWN0IHx8IG51bWJlciBJbiBjYXNlIG9mIE9iamVjdCBpdCBob2xkcyBhbGwgcGFyYW1ldGVycy4gSW4gY2FzZSBvZiBudW1iZXIgaXRzIHRoZSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gZWFzZSBmdW5jdGlvbiB8fCBzdHJpbmcgRnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIHVzZWQgZm9yIGVhc2luZyBvciBlYXNpbmcga2V5d29yZFxyXG4gICAgICogQHBhcmFtIGRlbGF5IE51bWJlciBpbmRpY2F0aW5nIHRoZSBkZWxheSBiZWZvcmUgdGhlIGFuaW1hdGlvbiBzdGFydHNcclxuICAgICAqIEByZXR1cm4gdGFyZ2V0IHx8IHRoaXNcclxuICAgICAqL1xyXG4gICAgYW5pbWF0ZTogZnVuY3Rpb24obywgZWFzZSwgZGVsYXkpe1xyXG5cclxuICAgICAgaWYodHlwZW9mIG8gPT0gJ29iamVjdCcpe1xyXG4gICAgICAgIGVhc2UgPSBvLmVhc2VcclxuICAgICAgICBkZWxheSA9IG8uZGVsYXlcclxuICAgICAgICBvID0gby5kdXJhdGlvblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc2l0dWF0aW9uID0gbmV3IFNWRy5TaXR1YXRpb24oe1xyXG4gICAgICAgIGR1cmF0aW9uOiBvIHx8IDEwMDAsXHJcbiAgICAgICAgZGVsYXk6IGRlbGF5IHx8IDAsXHJcbiAgICAgICAgZWFzZTogU1ZHLmVhc2luZ1tlYXNlIHx8ICctJ10gfHwgZWFzZVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGhpcy5xdWV1ZShzaXR1YXRpb24pXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBhIGRlbGF5IGJlZm9yZSB0aGUgbmV4dCBlbGVtZW50IG9mIHRoZSBxdWV1ZSBpcyBjYWxsZWRcclxuICAgICAqIEBwYXJhbSBkZWxheSBEdXJhdGlvbiBvZiBkZWxheSBpbiBtaWxsaXNlY29uZHNcclxuICAgICAqIEByZXR1cm4gdGhpcy50YXJnZXQoKVxyXG4gICAgICovXHJcbiAgLCBkZWxheTogZnVuY3Rpb24oZGVsYXkpe1xyXG4gICAgICAvLyBUaGUgZGVsYXkgaXMgcGVyZm9ybWVkIGJ5IGFuIGVtcHR5IHNpdHVhdGlvbiB3aXRoIGl0cyBkdXJhdGlvblxyXG4gICAgICAvLyBhdHRyaWJ1dGUgc2V0IHRvIHRoZSBkdXJhdGlvbiBvZiB0aGUgZGVsYXlcclxuICAgICAgdmFyIHNpdHVhdGlvbiA9IG5ldyBTVkcuU2l0dWF0aW9uKHtcclxuICAgICAgICBkdXJhdGlvbjogZGVsYXksXHJcbiAgICAgICAgZGVsYXk6IDAsXHJcbiAgICAgICAgZWFzZTogU1ZHLmVhc2luZ1snLSddXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5xdWV1ZShzaXR1YXRpb24pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG9yIHJldHVybnMgdGhlIHRhcmdldCBvZiB0aGlzIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIG51bGwgfHwgdGFyZ2V0IFNWRy5FbGVtZW50IHdoaWNoIHNob3VsZCBiZSBzZXQgYXMgbmV3IHRhcmdldFxyXG4gICAgICogQHJldHVybiB0YXJnZXQgfHwgdGhpc1xyXG4gICAgICovXHJcbiAgLCB0YXJnZXQ6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICAgIGlmKHRhcmdldCAmJiB0YXJnZXQgaW5zdGFuY2VvZiBTVkcuRWxlbWVudCl7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldFxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgdGhlIGFic29sdXRlIHBvc2l0aW9uIGF0IGEgZ2l2ZW4gdGltZVxyXG4gICwgdGltZVRvQWJzUG9zOiBmdW5jdGlvbih0aW1lc3RhbXApe1xyXG4gICAgICByZXR1cm4gKHRpbWVzdGFtcCAtIHRoaXMuc2l0dWF0aW9uLnN0YXJ0KSAvICh0aGlzLnNpdHVhdGlvbi5kdXJhdGlvbi90aGlzLl9zcGVlZClcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIHRoZSB0aW1lc3RhbXAgZnJvbSBhIGdpdmVuIGFic29sdXRlIHBvc2l0b25cclxuICAsIGFic1Bvc1RvVGltZTogZnVuY3Rpb24oYWJzUG9zKXtcclxuICAgICAgcmV0dXJuIHRoaXMuc2l0dWF0aW9uLmR1cmF0aW9uL3RoaXMuX3NwZWVkICogYWJzUG9zICsgdGhpcy5zaXR1YXRpb24uc3RhcnRcclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGFydHMgdGhlIGFuaW1hdGlvbmxvb3BcclxuICAsIHN0YXJ0QW5pbUZyYW1lOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLnN0b3BBbmltRnJhbWUoKVxyXG4gICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpeyB0aGlzLnN0ZXAoKSB9LmJpbmQodGhpcykpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FuY2VscyB0aGUgYW5pbWF0aW9uZnJhbWVcclxuICAsIHN0b3BBbmltRnJhbWU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGtpY2tzIG9mZiB0aGUgYW5pbWF0aW9uIC0gb25seSBkb2VzIHNvbWV0aGluZyB3aGVuIHRoZSBxdWV1ZSBpcyBjdXJyZW50bHkgbm90IGFjdGl2ZSBhbmQgYXQgbGVhc3Qgb25lIHNpdHVhdGlvbiBpcyBzZXRcclxuICAsIHN0YXJ0OiBmdW5jdGlvbigpe1xyXG4gICAgICAvLyBkb250IHN0YXJ0IGlmIGFscmVhZHkgc3RhcnRlZFxyXG4gICAgICBpZighdGhpcy5hY3RpdmUgJiYgdGhpcy5zaXR1YXRpb24pe1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc3RhcnRDdXJyZW50KClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGFydCB0aGUgY3VycmVudCBzaXR1YXRpb25cclxuICAsIHN0YXJ0Q3VycmVudDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5zaXR1YXRpb24uc3RhcnQgPSArbmV3IERhdGUgKyB0aGlzLnNpdHVhdGlvbi5kZWxheS90aGlzLl9zcGVlZFxyXG4gICAgICB0aGlzLnNpdHVhdGlvbi5maW5pc2ggPSB0aGlzLnNpdHVhdGlvbi5zdGFydCArIHRoaXMuc2l0dWF0aW9uLmR1cmF0aW9uL3RoaXMuX3NwZWVkXHJcbiAgICAgIHJldHVybiB0aGlzLmluaXRBbmltYXRpb25zKCkuc3RlcCgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGRzIGEgZnVuY3Rpb24gLyBTaXR1YXRpb24gdG8gdGhlIGFuaW1hdGlvbiBxdWV1ZVxyXG4gICAgICogQHBhcmFtIGZuIGZ1bmN0aW9uIC8gc2l0dWF0aW9uIHRvIGFkZFxyXG4gICAgICogQHJldHVybiB0aGlzXHJcbiAgICAgKi9cclxuICAsIHF1ZXVlOiBmdW5jdGlvbihmbil7XHJcbiAgICAgIGlmKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nIHx8IGZuIGluc3RhbmNlb2YgU1ZHLlNpdHVhdGlvbilcclxuICAgICAgICB0aGlzLnNpdHVhdGlvbnMucHVzaChmbilcclxuXHJcbiAgICAgIGlmKCF0aGlzLnNpdHVhdGlvbikgdGhpcy5zaXR1YXRpb24gPSB0aGlzLnNpdHVhdGlvbnMuc2hpZnQoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHB1bGxzIG5leHQgZWxlbWVudCBmcm9tIHRoZSBxdWV1ZSBhbmQgZXhlY3V0ZSBpdFxyXG4gICAgICogQHJldHVybiB0aGlzXHJcbiAgICAgKi9cclxuICAsIGRlcXVldWU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIC8vIHN0b3AgY3VycmVudCBhbmltYXRpb25cclxuICAgICAgdGhpcy5zdG9wKClcclxuXHJcbiAgICAgIC8vIGdldCBuZXh0IGFuaW1hdGlvbiBmcm9tIHF1ZXVlXHJcbiAgICAgIHRoaXMuc2l0dWF0aW9uID0gdGhpcy5zaXR1YXRpb25zLnNoaWZ0KClcclxuXHJcbiAgICAgIGlmKHRoaXMuc2l0dWF0aW9uKXtcclxuICAgICAgICBpZih0aGlzLnNpdHVhdGlvbiBpbnN0YW5jZW9mIFNWRy5TaXR1YXRpb24pIHtcclxuICAgICAgICAgIHRoaXMuc3RhcnQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBJZiBpdCBpcyBub3QgYSBTVkcuU2l0dWF0aW9uLCB0aGVuIGl0IGlzIGEgZnVuY3Rpb24sIHdlIGV4ZWN1dGUgaXRcclxuICAgICAgICAgIHRoaXMuc2l0dWF0aW9uLmNhbGwodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlcyBhbGwgYW5pbWF0aW9ucyB0byB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZWxlbWVudFxyXG4gICAgLy8gdGhpcyBpcyBpbXBvcnRhbnQgd2hlbiBvbmUgcHJvcGVydHkgY291bGQgYmUgY2hhbmdlZCBmcm9tIGFub3RoZXIgcHJvcGVydHlcclxuICAsIGluaXRBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGksIGosIHNvdXJjZVxyXG4gICAgICB2YXIgcyA9IHRoaXMuc2l0dWF0aW9uXHJcblxyXG4gICAgICBpZihzLmluaXQpIHJldHVybiB0aGlzXHJcblxyXG4gICAgICBmb3IoaSBpbiBzLmFuaW1hdGlvbnMpe1xyXG4gICAgICAgIHNvdXJjZSA9IHRoaXMudGFyZ2V0KClbaV0oKVxyXG5cclxuICAgICAgICBpZighQXJyYXkuaXNBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICBzb3VyY2UgPSBbc291cmNlXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkocy5hbmltYXRpb25zW2ldKSkge1xyXG4gICAgICAgICAgcy5hbmltYXRpb25zW2ldID0gW3MuYW5pbWF0aW9uc1tpXV1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYocy5hbmltYXRpb25zW2ldLmxlbmd0aCA+IHNvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAvLyAgc291cmNlLmNvbmNhdCA9IHNvdXJjZS5jb25jYXQocy5hbmltYXRpb25zW2ldLnNsaWNlKHNvdXJjZS5sZW5ndGgsIHMuYW5pbWF0aW9uc1tpXS5sZW5ndGgpKVxyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICBmb3IoaiA9IHNvdXJjZS5sZW5ndGg7IGotLTspIHtcclxuICAgICAgICAgIC8vIFRoZSBjb25kaXRpb24gaXMgYmVjYXVzZSBzb21lIG1ldGhvZHMgcmV0dXJuIGEgbm9ybWFsIG51bWJlciBpbnN0ZWFkXHJcbiAgICAgICAgICAvLyBvZiBhIFNWRy5OdW1iZXJcclxuICAgICAgICAgIGlmKHMuYW5pbWF0aW9uc1tpXVtqXSBpbnN0YW5jZW9mIFNWRy5OdW1iZXIpXHJcbiAgICAgICAgICAgIHNvdXJjZVtqXSA9IG5ldyBTVkcuTnVtYmVyKHNvdXJjZVtqXSlcclxuXHJcbiAgICAgICAgICBzLmFuaW1hdGlvbnNbaV1bal0gPSBzb3VyY2Vbal0ubW9ycGgocy5hbmltYXRpb25zW2ldW2pdKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yKGkgaW4gcy5hdHRycyl7XHJcbiAgICAgICAgcy5hdHRyc1tpXSA9IG5ldyBTVkcuTW9ycGhPYmoodGhpcy50YXJnZXQoKS5hdHRyKGkpLCBzLmF0dHJzW2ldKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IoaSBpbiBzLnN0eWxlcyl7XHJcbiAgICAgICAgcy5zdHlsZXNbaV0gPSBuZXcgU1ZHLk1vcnBoT2JqKHRoaXMudGFyZ2V0KCkuc3R5bGUoaSksIHMuc3R5bGVzW2ldKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzLmluaXRpYWxUcmFuc2Zvcm1hdGlvbiA9IHRoaXMudGFyZ2V0KCkubWF0cml4aWZ5KClcclxuXHJcbiAgICAgIHMuaW5pdCA9IHRydWVcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAsIGNsZWFyUXVldWU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMuc2l0dWF0aW9ucyA9IFtdXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgLCBjbGVhckN1cnJlbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMuc2l0dWF0aW9uID0gbnVsbFxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLyoqIHN0b3BzIHRoZSBhbmltYXRpb24gaW1tZWRpYXRlbHlcclxuICAgICAqIEBwYXJhbSBqdW1wVG9FbmQgQSBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0byBjb21wbGV0ZSB0aGUgY3VycmVudCBhbmltYXRpb24gaW1tZWRpYXRlbHkuXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJRdWV1ZSBBIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRvIHJlbW92ZSBxdWV1ZWQgYW5pbWF0aW9uIGFzIHdlbGwuXHJcbiAgICAgKiBAcmV0dXJuIHRoaXNcclxuICAgICAqL1xyXG4gICwgc3RvcDogZnVuY3Rpb24oanVtcFRvRW5kLCBjbGVhclF1ZXVlKXtcclxuICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuYWN0aXZlXHJcbiAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgIGlmKGNsZWFyUXVldWUpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJRdWV1ZSgpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKGp1bXBUb0VuZCAmJiB0aGlzLnNpdHVhdGlvbil7XHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgc2l0dWF0aW9uIGlmIGl0IHdhcyBub3RcclxuICAgICAgICAhYWN0aXZlICYmIHRoaXMuc3RhcnRDdXJyZW50KClcclxuICAgICAgICB0aGlzLmF0RW5kKClcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdG9wQW5pbUZyYW1lKClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyQ3VycmVudCgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc2V0cyB0aGUgZWxlbWVudCB0byB0aGUgc3RhdGUgd2hlcmUgdGhlIGN1cnJlbnQgZWxlbWVudCBoYXMgc3RhcnRlZFxyXG4gICAgICogQHJldHVybiB0aGlzXHJcbiAgICAgKi9cclxuICAsIHJlc2V0OiBmdW5jdGlvbigpe1xyXG4gICAgICBpZih0aGlzLnNpdHVhdGlvbil7XHJcbiAgICAgICAgdmFyIHRlbXAgPSB0aGlzLnNpdHVhdGlvblxyXG4gICAgICAgIHRoaXMuc3RvcCgpXHJcbiAgICAgICAgdGhpcy5zaXR1YXRpb24gPSB0ZW1wXHJcbiAgICAgICAgdGhpcy5hdFN0YXJ0KClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0b3AgdGhlIGN1cnJlbnRseS1ydW5uaW5nIGFuaW1hdGlvbiwgcmVtb3ZlIGFsbCBxdWV1ZWQgYW5pbWF0aW9ucywgYW5kIGNvbXBsZXRlIGFsbCBhbmltYXRpb25zIGZvciB0aGUgZWxlbWVudC5cclxuICAsIGZpbmlzaDogZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgIHRoaXMuc3RvcCh0cnVlLCBmYWxzZSlcclxuXHJcbiAgICAgIHdoaWxlKHRoaXMuZGVxdWV1ZSgpLnNpdHVhdGlvbiAmJiB0aGlzLnN0b3AodHJ1ZSwgZmFsc2UpKTtcclxuXHJcbiAgICAgIHRoaXMuY2xlYXJRdWV1ZSgpLmNsZWFyQ3VycmVudCgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNldCB0aGUgaW50ZXJuYWwgYW5pbWF0aW9uIHBvaW50ZXIgYXQgdGhlIHN0YXJ0IHBvc2l0aW9uLCBiZWZvcmUgYW55IGxvb3BzLCBhbmQgdXBkYXRlcyB0aGUgdmlzdWFsaXNhdGlvblxyXG4gICwgYXRTdGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0KDAsIHRydWUpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0IHRoZSBpbnRlcm5hbCBhbmltYXRpb24gcG9pbnRlciBhdCB0aGUgZW5kIHBvc2l0aW9uLCBhZnRlciBhbGwgdGhlIGxvb3BzLCBhbmQgdXBkYXRlcyB0aGUgdmlzdWFsaXNhdGlvblxyXG4gICwgYXRFbmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5zaXR1YXRpb24ubG9vcHMgPT09IHRydWUpIHtcclxuICAgICAgICAvLyBJZiBpbiBhIGluZmluaXRlIGxvb3AsIHdlIGVuZCB0aGUgY3VycmVudCBpdGVyYXRpb25cclxuICAgICAgICB0aGlzLnNpdHVhdGlvbi5sb29wcyA9IHRoaXMuc2l0dWF0aW9uLmxvb3AgKyAxXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKHR5cGVvZiB0aGlzLnNpdHVhdGlvbi5sb29wcyA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgIC8vIElmIHBlcmZvcm1pbmcgYSBmaW5pdGUgbnVtYmVyIG9mIGxvb3BzLCB3ZSBnbyBhZnRlciBhbGwgdGhlIGxvb3BzXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXQodGhpcy5zaXR1YXRpb24ubG9vcHMsIHRydWUpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSWYgbm8gbG9vcHMsIHdlIGp1c3QgZ28gYXQgdGhlIGVuZFxyXG4gICAgICAgIHJldHVybiB0aGlzLmF0KDEsIHRydWUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXQgdGhlIGludGVybmFsIGFuaW1hdGlvbiBwb2ludGVyIHRvIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gYW5kIHVwZGF0ZXMgdGhlIHZpc3VhbGlzYXRpb25cclxuICAgIC8vIGlmIGlzQWJzUG9zIGlzIHRydWUsIHBvcyBpcyB0cmVhdGVkIGFzIGFuIGFic29sdXRlIHBvc2l0aW9uXHJcbiAgLCBhdDogZnVuY3Rpb24ocG9zLCBpc0Fic1Bvcyl7XHJcbiAgICAgIHZhciBkdXJEaXZTcGQgPSB0aGlzLnNpdHVhdGlvbi5kdXJhdGlvbi90aGlzLl9zcGVlZFxyXG5cclxuICAgICAgdGhpcy5hYnNQb3MgPSBwb3NcclxuICAgICAgLy8gSWYgcG9zIGlzIG5vdCBhbiBhYnNvbHV0ZSBwb3NpdGlvbiwgd2UgY29udmVydCBpdCBpbnRvIG9uZVxyXG4gICAgICBpZiAoIWlzQWJzUG9zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2l0dWF0aW9uLnJldmVyc2VkKSB0aGlzLmFic1BvcyA9IDEgLSB0aGlzLmFic1Bvc1xyXG4gICAgICAgIHRoaXMuYWJzUG9zICs9IHRoaXMuc2l0dWF0aW9uLmxvb3BcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zaXR1YXRpb24uc3RhcnQgPSArbmV3IERhdGUgLSB0aGlzLmFic1BvcyAqIGR1ckRpdlNwZFxyXG4gICAgICB0aGlzLnNpdHVhdGlvbi5maW5pc2ggPSB0aGlzLnNpdHVhdGlvbi5zdGFydCArIGR1ckRpdlNwZFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc3RlcCh0cnVlKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvciByZXR1cm5zIHRoZSBzcGVlZCBvZiB0aGUgYW5pbWF0aW9uc1xyXG4gICAgICogQHBhcmFtIHNwZWVkIG51bGwgfHwgTnVtYmVyIFRoZSBuZXcgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbnNcclxuICAgICAqIEByZXR1cm4gTnVtYmVyIHx8IHRoaXNcclxuICAgICAqL1xyXG4gICwgc3BlZWQ6IGZ1bmN0aW9uKHNwZWVkKXtcclxuICAgICAgaWYgKHNwZWVkID09PSAwKSByZXR1cm4gdGhpcy5wYXVzZSgpXHJcblxyXG4gICAgICBpZiAoc3BlZWQpIHtcclxuICAgICAgICB0aGlzLl9zcGVlZCA9IHNwZWVkXHJcbiAgICAgICAgLy8gV2UgdXNlIGFuIGFic29sdXRlIHBvc2l0aW9uIGhlcmUgc28gdGhhdCBzcGVlZCBjYW4gYWZmZWN0IHRoZSBkZWxheSBiZWZvcmUgdGhlIGFuaW1hdGlvblxyXG4gICAgICAgIHJldHVybiB0aGlzLmF0KHRoaXMuYWJzUG9zLCB0cnVlKVxyXG4gICAgICB9IGVsc2UgcmV0dXJuIHRoaXMuX3NwZWVkXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWFrZSBsb29wYWJsZVxyXG4gICwgbG9vcDogZnVuY3Rpb24odGltZXMsIHJldmVyc2UpIHtcclxuICAgICAgdmFyIGMgPSB0aGlzLmxhc3QoKVxyXG5cclxuICAgICAgLy8gc3RvcmUgdG90YWwgbG9vcHNcclxuICAgICAgYy5sb29wcyA9ICh0aW1lcyAhPSBudWxsKSA/IHRpbWVzIDogdHJ1ZVxyXG4gICAgICBjLmxvb3AgPSAwXHJcblxyXG4gICAgICBpZihyZXZlcnNlKSBjLnJldmVyc2luZyA9IHRydWVcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvLyBwYXVzZXMgdGhlIGFuaW1hdGlvblxyXG4gICwgcGF1c2U6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZVxyXG4gICAgICB0aGlzLnN0b3BBbmltRnJhbWUoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvLyB1bnBhdXNlIHRoZSBhbmltYXRpb25cclxuICAsIHBsYXk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKCF0aGlzLnBhdXNlZCkgcmV0dXJuIHRoaXNcclxuICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZVxyXG4gICAgICAvLyBXZSB1c2UgYW4gYWJzb2x1dGUgcG9zaXRpb24gaGVyZSBzbyB0aGF0IHRoZSBkZWxheSBiZWZvcmUgdGhlIGFuaW1hdGlvbiBjYW4gYmUgcGF1c2VkXHJcbiAgICAgIHJldHVybiB0aGlzLmF0KHRoaXMuYWJzUG9zLCB0cnVlKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdG9nZ2xlIG9yIHNldCB0aGUgZGlyZWN0aW9uIG9mIHRoZSBhbmltYXRpb25cclxuICAgICAqIHRydWUgc2V0cyBkaXJlY3Rpb24gdG8gYmFja3dhcmRzIHdoaWxlIGZhbHNlIHNldHMgaXQgdG8gZm9yd2FyZHNcclxuICAgICAqIEBwYXJhbSByZXZlcnNlZCBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0byByZXZlcnNlIHRoZSBhbmltYXRpb24gb3Igbm90IChkZWZhdWx0OiB0b2dnbGUgdGhlIHJldmVyc2Ugc3RhdHVzKVxyXG4gICAgICogQHJldHVybiB0aGlzXHJcbiAgICAgKi9cclxuICAsIHJldmVyc2U6IGZ1bmN0aW9uKHJldmVyc2VkKXtcclxuICAgICAgdmFyIGMgPSB0aGlzLmxhc3QoKVxyXG5cclxuICAgICAgaWYodHlwZW9mIHJldmVyc2VkID09ICd1bmRlZmluZWQnKSBjLnJldmVyc2VkID0gIWMucmV2ZXJzZWRcclxuICAgICAgZWxzZSBjLnJldmVyc2VkID0gcmV2ZXJzZWRcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIGZsb2F0IGZyb20gMC0xIGluZGljYXRpbmcgdGhlIHByb2dyZXNzIG9mIHRoZSBjdXJyZW50IGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGVhc2VkIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSByZXR1cm5lZCBwb3NpdGlvbiBzaG91bGQgYmUgZWFzZWQgb3Igbm90XHJcbiAgICAgKiBAcmV0dXJuIG51bWJlclxyXG4gICAgICovXHJcbiAgLCBwcm9ncmVzczogZnVuY3Rpb24oZWFzZUl0KXtcclxuICAgICAgcmV0dXJuIGVhc2VJdCA/IHRoaXMuc2l0dWF0aW9uLmVhc2UodGhpcy5wb3MpIDogdGhpcy5wb3NcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZHMgYSBjYWxsYmFjayBmdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgd2hlbiB0aGUgY3VycmVudCBhbmltYXRpb24gaXMgZmluaXNoZWRcclxuICAgICAqIEBwYXJhbSBmbiBGdW5jdGlvbiB3aGljaCBzaG91bGQgYmUgZXhlY3V0ZWQgYXMgY2FsbGJhY2tcclxuICAgICAqIEByZXR1cm4gbnVtYmVyXHJcbiAgICAgKi9cclxuICAsIGFmdGVyOiBmdW5jdGlvbihmbil7XHJcbiAgICAgIHZhciBjID0gdGhpcy5sYXN0KClcclxuICAgICAgICAsIHdyYXBwZXIgPSBmdW5jdGlvbiB3cmFwcGVyKGUpe1xyXG4gICAgICAgICAgICBpZihlLmRldGFpbC5zaXR1YXRpb24gPT0gYyl7XHJcbiAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBjKVxyXG4gICAgICAgICAgICAgIHRoaXMub2ZmKCdmaW5pc2hlZC5meCcsIHdyYXBwZXIpIC8vIHByZXZlbnQgbWVtb3J5IGxlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy50YXJnZXQoKS5vbignZmluaXNoZWQuZngnLCB3cmFwcGVyKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX2NhbGxTdGFydCgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkcyBhIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCB3aGVuZXZlciBvbmUgYW5pbWF0aW9uIHN0ZXAgaXMgcGVyZm9ybWVkXHJcbiAgLCBkdXJpbmc6IGZ1bmN0aW9uKGZuKXtcclxuICAgICAgdmFyIGMgPSB0aGlzLmxhc3QoKVxyXG4gICAgICAgICwgd3JhcHBlciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBpZihlLmRldGFpbC5zaXR1YXRpb24gPT0gYyl7XHJcbiAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBlLmRldGFpbC5wb3MsIFNWRy5tb3JwaChlLmRldGFpbC5wb3MpLCBlLmRldGFpbC5lYXNlZCwgYylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgLy8gc2VlIGFib3ZlXHJcbiAgICAgIHRoaXMudGFyZ2V0KCkub2ZmKCdkdXJpbmcuZngnLCB3cmFwcGVyKS5vbignZHVyaW5nLmZ4Jywgd3JhcHBlcilcclxuXHJcbiAgICAgIHRoaXMuYWZ0ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLm9mZignZHVyaW5nLmZ4Jywgd3JhcHBlcilcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9jYWxsU3RhcnQoKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGxzIGFmdGVyIEFMTCBhbmltYXRpb25zIGluIHRoZSBxdWV1ZSBhcmUgZmluaXNoZWRcclxuICAsIGFmdGVyQWxsOiBmdW5jdGlvbihmbil7XHJcbiAgICAgIHZhciB3cmFwcGVyID0gZnVuY3Rpb24gd3JhcHBlcihlKXtcclxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzKVxyXG4gICAgICAgICAgICB0aGlzLm9mZignYWxsZmluaXNoZWQuZngnLCB3cmFwcGVyKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgLy8gc2VlIGFib3ZlXHJcbiAgICAgIHRoaXMudGFyZ2V0KCkub2ZmKCdhbGxmaW5pc2hlZC5meCcsIHdyYXBwZXIpLm9uKCdhbGxmaW5pc2hlZC5meCcsIHdyYXBwZXIpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fY2FsbFN0YXJ0KClcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxscyBvbiBldmVyeSBhbmltYXRpb24gc3RlcCBmb3IgYWxsIGFuaW1hdGlvbnNcclxuICAsIGR1cmluZ0FsbDogZnVuY3Rpb24oZm4pe1xyXG4gICAgICB2YXIgd3JhcHBlciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGUuZGV0YWlsLnBvcywgU1ZHLm1vcnBoKGUuZGV0YWlsLnBvcyksIGUuZGV0YWlsLmVhc2VkLCBlLmRldGFpbC5zaXR1YXRpb24pXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRhcmdldCgpLm9mZignZHVyaW5nLmZ4Jywgd3JhcHBlcikub24oJ2R1cmluZy5meCcsIHdyYXBwZXIpXHJcblxyXG4gICAgICB0aGlzLmFmdGVyQWxsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5vZmYoJ2R1cmluZy5meCcsIHdyYXBwZXIpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fY2FsbFN0YXJ0KClcclxuICAgIH1cclxuXHJcbiAgLCBsYXN0OiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpcy5zaXR1YXRpb25zLmxlbmd0aCA/IHRoaXMuc2l0dWF0aW9uc1t0aGlzLnNpdHVhdGlvbnMubGVuZ3RoLTFdIDogdGhpcy5zaXR1YXRpb25cclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGRzIG9uZSBwcm9wZXJ0eSB0byB0aGUgYW5pbWF0aW9uc1xyXG4gICwgYWRkOiBmdW5jdGlvbihtZXRob2QsIGFyZ3MsIHR5cGUpe1xyXG4gICAgICB0aGlzLmxhc3QoKVt0eXBlIHx8ICdhbmltYXRpb25zJ11bbWV0aG9kXSA9IGFyZ3NcclxuICAgICAgcmV0dXJuIHRoaXMuX2NhbGxTdGFydCgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBlcmZvcm0gb25lIHN0ZXAgb2YgdGhlIGFuaW1hdGlvblxyXG4gICAgICogIEBwYXJhbSBpZ25vcmVUaW1lIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGlnbm9yZSB0aW1lIGFuZCB1c2UgcG9zaXRpb24gZGlyZWN0bHkgb3IgcmVjYWxjdWxhdGUgcG9zaXRpb24gYmFzZWQgb24gdGltZVxyXG4gICAgICogIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgLCBzdGVwOiBmdW5jdGlvbihpZ25vcmVUaW1lKXtcclxuXHJcbiAgICAgIC8vIGNvbnZlcnQgY3VycmVudCB0aW1lIHRvIGFuIGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgIGlmKCFpZ25vcmVUaW1lKSB0aGlzLmFic1BvcyA9IHRoaXMudGltZVRvQWJzUG9zKCtuZXcgRGF0ZSlcclxuXHJcbiAgICAgIC8vIFRoaXMgcGFydCBjb252ZXJ0IGFuIGFic29sdXRlIHBvc2l0aW9uIHRvIGEgcG9zaXRpb25cclxuICAgICAgaWYodGhpcy5zaXR1YXRpb24ubG9vcHMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgdmFyIGFic1BvcywgYWJzUG9zSW50LCBsYXN0TG9vcFxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgYWJzb2x1dGUgcG9zaXRpb24gaXMgYmVsb3cgMCwgd2UganVzdCB0cmVhdCBpdCBhcyBpZiBpdCB3YXMgMFxyXG4gICAgICAgIGFic1BvcyA9IE1hdGgubWF4KHRoaXMuYWJzUG9zLCAwKVxyXG4gICAgICAgIGFic1Bvc0ludCA9IE1hdGguZmxvb3IoYWJzUG9zKVxyXG5cclxuICAgICAgICBpZih0aGlzLnNpdHVhdGlvbi5sb29wcyA9PT0gdHJ1ZSB8fCBhYnNQb3NJbnQgPCB0aGlzLnNpdHVhdGlvbi5sb29wcykge1xyXG4gICAgICAgICAgdGhpcy5wb3MgPSBhYnNQb3MgLSBhYnNQb3NJbnRcclxuICAgICAgICAgIGxhc3RMb29wID0gdGhpcy5zaXR1YXRpb24ubG9vcFxyXG4gICAgICAgICAgdGhpcy5zaXR1YXRpb24ubG9vcCA9IGFic1Bvc0ludFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmFic1BvcyA9IHRoaXMuc2l0dWF0aW9uLmxvb3BzXHJcbiAgICAgICAgICB0aGlzLnBvcyA9IDFcclxuICAgICAgICAgIC8vIFRoZSAtMSBoZXJlIGlzIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byB0b2dnbGUgcmV2ZXJzZWQgd2hlbiBhbGwgdGhlIGxvb3BzIGhhdmUgYmVlbiBjb21wbGV0ZWRcclxuICAgICAgICAgIGxhc3RMb29wID0gdGhpcy5zaXR1YXRpb24ubG9vcCAtIDFcclxuICAgICAgICAgIHRoaXMuc2l0dWF0aW9uLmxvb3AgPSB0aGlzLnNpdHVhdGlvbi5sb29wc1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5zaXR1YXRpb24ucmV2ZXJzaW5nKSB7XHJcbiAgICAgICAgICAvLyBUb2dnbGUgcmV2ZXJzZWQgaWYgYW4gb2RkIG51bWJlciBvZiBsb29wcyBhcyBvY2N1cmVkIHNpbmNlIHRoZSBsYXN0IGNhbGwgb2Ygc3RlcFxyXG4gICAgICAgICAgdGhpcy5zaXR1YXRpb24ucmV2ZXJzZWQgPSB0aGlzLnNpdHVhdGlvbi5yZXZlcnNlZCAhPSBCb29sZWFuKCh0aGlzLnNpdHVhdGlvbi5sb29wIC0gbGFzdExvb3ApICUgMilcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBsb29wLCB0aGUgYWJzb2x1dGUgcG9zaXRpb24gbXVzdCBub3QgYmUgYWJvdmUgMVxyXG4gICAgICAgIHRoaXMuYWJzUG9zID0gTWF0aC5taW4odGhpcy5hYnNQb3MsIDEpXHJcbiAgICAgICAgdGhpcy5wb3MgPSB0aGlzLmFic1Bvc1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB3aGlsZSB0aGUgYWJzb2x1dGUgcG9zaXRpb24gY2FuIGJlIGJlbG93IDAsIHRoZSBwb3NpdGlvbiBtdXN0IG5vdCBiZSBiZWxvdyAwXHJcbiAgICAgIGlmKHRoaXMucG9zIDwgMCkgdGhpcy5wb3MgPSAwXHJcblxyXG4gICAgICBpZih0aGlzLnNpdHVhdGlvbi5yZXZlcnNlZCkgdGhpcy5wb3MgPSAxIC0gdGhpcy5wb3NcclxuXHJcblxyXG4gICAgICAvLyBhcHBseSBlYXNpbmdcclxuICAgICAgdmFyIGVhc2VkID0gdGhpcy5zaXR1YXRpb24uZWFzZSh0aGlzLnBvcylcclxuXHJcbiAgICAgIC8vIGNhbGwgb25jZS1jYWxsYmFja3NcclxuICAgICAgZm9yKHZhciBpIGluIHRoaXMuc2l0dWF0aW9uLm9uY2Upe1xyXG4gICAgICAgIGlmKGkgPiB0aGlzLmxhc3RQb3MgJiYgaSA8PSBlYXNlZCl7XHJcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5vbmNlW2ldLmNhbGwodGhpcy50YXJnZXQoKSwgdGhpcy5wb3MsIGVhc2VkKVxyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuc2l0dWF0aW9uLm9uY2VbaV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGZpcmUgZHVyaW5nIGNhbGxiYWNrIHdpdGggcG9zaXRpb24sIGVhc2VkIHBvc2l0aW9uIGFuZCBjdXJyZW50IHNpdHVhdGlvbiBhcyBwYXJhbWV0ZXJcclxuICAgICAgaWYodGhpcy5hY3RpdmUpIHRoaXMudGFyZ2V0KCkuZmlyZSgnZHVyaW5nJywge3BvczogdGhpcy5wb3MsIGVhc2VkOiBlYXNlZCwgZng6IHRoaXMsIHNpdHVhdGlvbjogdGhpcy5zaXR1YXRpb259KVxyXG5cclxuICAgICAgLy8gdGhlIHVzZXIgbWF5IGNhbGwgc3RvcCBvciBmaW5pc2ggaW4gdGhlIGR1cmluZyBjYWxsYmFja1xyXG4gICAgICAvLyBzbyBtYWtlIHN1cmUgdGhhdCB3ZSBzdGlsbCBoYXZlIGEgdmFsaWQgc2l0dWF0aW9uXHJcbiAgICAgIGlmKCF0aGlzLnNpdHVhdGlvbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYXBwbHkgdGhlIGFjdHVhbCBhbmltYXRpb24gdG8gZXZlcnkgcHJvcGVydHlcclxuICAgICAgdGhpcy5lYWNoQXQoKVxyXG5cclxuICAgICAgLy8gZG8gZmluYWwgY29kZSB3aGVuIHNpdHVhdGlvbiBpcyBmaW5pc2hlZFxyXG4gICAgICBpZigodGhpcy5wb3MgPT0gMSAmJiAhdGhpcy5zaXR1YXRpb24ucmV2ZXJzZWQpIHx8ICh0aGlzLnNpdHVhdGlvbi5yZXZlcnNlZCAmJiB0aGlzLnBvcyA9PSAwKSl7XHJcblxyXG4gICAgICAgIC8vIHN0b3AgYW5pbWF0aW9uIGNhbGxiYWNrXHJcbiAgICAgICAgdGhpcy5zdG9wQW5pbUZyYW1lKClcclxuXHJcbiAgICAgICAgLy8gZmlyZSBmaW5pc2hlZCBjYWxsYmFjayB3aXRoIGN1cnJlbnQgc2l0dWF0aW9uIGFzIHBhcmFtZXRlclxyXG4gICAgICAgIHRoaXMudGFyZ2V0KCkuZmlyZSgnZmluaXNoZWQnLCB7Zng6dGhpcywgc2l0dWF0aW9uOiB0aGlzLnNpdHVhdGlvbn0pXHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnNpdHVhdGlvbnMubGVuZ3RoKXtcclxuICAgICAgICAgIHRoaXMudGFyZ2V0KCkuZmlyZSgnYWxsZmluaXNoZWQnKVxyXG5cclxuICAgICAgICAgIC8vIFJlY2hlY2sgdGhlIGxlbmd0aCBzaW5jZSB0aGUgdXNlciBtYXkgY2FsbCBhbmltYXRlIGluIHRoZSBhZnRlckFsbCBjYWxsYmFja1xyXG4gICAgICAgICAgaWYoIXRoaXMuc2l0dWF0aW9ucy5sZW5ndGgpe1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldCgpLm9mZignLmZ4JykgLy8gdGhlcmUgc2hvdWxkbnQgYmUgYW55IGJpbmRpbmcgbGVmdCwgYnV0IHRvIG1ha2Ugc3VyZS4uLlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzdGFydCBuZXh0IGFuaW1hdGlvblxyXG4gICAgICAgIGlmKHRoaXMuYWN0aXZlKSB0aGlzLmRlcXVldWUoKVxyXG4gICAgICAgIGVsc2UgdGhpcy5jbGVhckN1cnJlbnQoKVxyXG5cclxuICAgICAgfWVsc2UgaWYoIXRoaXMucGF1c2VkICYmIHRoaXMuYWN0aXZlKXtcclxuICAgICAgICAvLyB3ZSBjb250aW51ZSBhbmltYXRpbmcgd2hlbiB3ZSBhcmUgbm90IGF0IHRoZSBlbmRcclxuICAgICAgICB0aGlzLnN0YXJ0QW5pbUZyYW1lKClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2F2ZSBsYXN0IGVhc2VkIHBvc2l0aW9uIGZvciBvbmNlIGNhbGxiYWNrIHRyaWdnZXJpbmdcclxuICAgICAgdGhpcy5sYXN0UG9zID0gZWFzZWRcclxuICAgICAgcmV0dXJuIHRoaXNcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlcyB0aGUgc3RlcCBmb3IgZXZlcnkgcHJvcGVydHkgYW5kIGNhbGxzIGJsb2NrIHdpdGggaXRcclxuICAsIGVhY2hBdDogZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIGksIGxlbiwgYXQsIHNlbGYgPSB0aGlzLCB0YXJnZXQgPSB0aGlzLnRhcmdldCgpLCBzID0gdGhpcy5zaXR1YXRpb25cclxuXHJcbiAgICAgIC8vIGFwcGx5IGFuaW1hdGlvbnMgd2hpY2ggY2FuIGJlIGNhbGxlZCB0cm91Z2ggYSBtZXRob2RcclxuICAgICAgZm9yKGkgaW4gcy5hbmltYXRpb25zKXtcclxuXHJcbiAgICAgICAgYXQgPSBbXS5jb25jYXQocy5hbmltYXRpb25zW2ldKS5tYXAoZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBlbCAhPT0gJ3N0cmluZycgJiYgZWwuYXQgPyBlbC5hdChzLmVhc2Uoc2VsZi5wb3MpLCBzZWxmLnBvcykgOiBlbFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRhcmdldFtpXS5hcHBseSh0YXJnZXQsIGF0KVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYXBwbHkgYW5pbWF0aW9uIHdoaWNoIGhhcyB0byBiZSBhcHBsaWVkIHdpdGggYXR0cigpXHJcbiAgICAgIGZvcihpIGluIHMuYXR0cnMpe1xyXG5cclxuICAgICAgICBhdCA9IFtpXS5jb25jYXQocy5hdHRyc1tpXSkubWFwKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgIHJldHVybiB0eXBlb2YgZWwgIT09ICdzdHJpbmcnICYmIGVsLmF0ID8gZWwuYXQocy5lYXNlKHNlbGYucG9zKSwgc2VsZi5wb3MpIDogZWxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0YXJnZXQuYXR0ci5hcHBseSh0YXJnZXQsIGF0KVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYXBwbHkgYW5pbWF0aW9uIHdoaWNoIGhhcyB0byBiZSBhcHBsaWVkIHdpdGggc3R5bGUoKVxyXG4gICAgICBmb3IoaSBpbiBzLnN0eWxlcyl7XHJcblxyXG4gICAgICAgIGF0ID0gW2ldLmNvbmNhdChzLnN0eWxlc1tpXSkubWFwKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgIHJldHVybiB0eXBlb2YgZWwgIT09ICdzdHJpbmcnICYmIGVsLmF0ID8gZWwuYXQocy5lYXNlKHNlbGYucG9zKSwgc2VsZi5wb3MpIDogZWxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0YXJnZXQuc3R5bGUuYXBwbHkodGFyZ2V0LCBhdClcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFuaW1hdGUgaW5pdGlhbFRyYW5zZm9ybWF0aW9uIHdoaWNoIGhhcyB0byBiZSBjaGFpbmVkXHJcbiAgICAgIGlmKHMudHJhbnNmb3Jtcy5sZW5ndGgpe1xyXG5cclxuICAgICAgICAvLyBnZXQgaW5pdGlhbCBpbml0aWFsVHJhbnNmb3JtYXRpb25cclxuICAgICAgICBhdCA9IHMuaW5pdGlhbFRyYW5zZm9ybWF0aW9uXHJcbiAgICAgICAgZm9yKGkgPSAwLCBsZW4gPSBzLnRyYW5zZm9ybXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG5cclxuICAgICAgICAgIC8vIGdldCBuZXh0IHRyYW5zZm9ybWF0aW9uIGluIGNoYWluXHJcbiAgICAgICAgICB2YXIgYSA9IHMudHJhbnNmb3Jtc1tpXVxyXG5cclxuICAgICAgICAgIC8vIG11bHRpcGx5IG1hdHJpeCBkaXJlY3RseVxyXG4gICAgICAgICAgaWYoYSBpbnN0YW5jZW9mIFNWRy5NYXRyaXgpe1xyXG5cclxuICAgICAgICAgICAgaWYoYS5yZWxhdGl2ZSl7XHJcbiAgICAgICAgICAgICAgYXQgPSBhdC5tdWx0aXBseShuZXcgU1ZHLk1hdHJpeCgpLm1vcnBoKGEpLmF0KHMuZWFzZSh0aGlzLnBvcykpKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICBhdCA9IGF0Lm1vcnBoKGEpLmF0KHMuZWFzZSh0aGlzLnBvcykpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyB3aGVuIHRyYW5zZm9ybWF0aW9uIGlzIGFic29sdXRlIHdlIGhhdmUgdG8gcmVzZXQgdGhlIG5lZWRlZCB0cmFuc2Zvcm1hdGlvbiBmaXJzdFxyXG4gICAgICAgICAgaWYoIWEucmVsYXRpdmUpXHJcbiAgICAgICAgICAgIGEudW5kbyhhdC5leHRyYWN0KCkpXHJcblxyXG4gICAgICAgICAgLy8gYW5kIHJlYXBwbHkgaXQgYWZ0ZXJcclxuICAgICAgICAgIGF0ID0gYXQubXVsdGlwbHkoYS5hdChzLmVhc2UodGhpcy5wb3MpKSlcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgbmV3IG1hdHJpeCBvbiBlbGVtZW50XHJcbiAgICAgICAgdGFyZ2V0Lm1hdHJpeChhdClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIGFkZHMgYW4gb25jZS1jYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgYXQgYSBzcGVjaWZpYyBwb3NpdGlvbiBhbmQgbmV2ZXIgYWdhaW5cclxuICAsIG9uY2U6IGZ1bmN0aW9uKHBvcywgZm4sIGlzRWFzZWQpe1xyXG4gICAgICB2YXIgYyA9IHRoaXMubGFzdCgpXHJcbiAgICAgIGlmKCFpc0Vhc2VkKSBwb3MgPSBjLmVhc2UocG9zKVxyXG5cclxuICAgICAgYy5vbmNlW3Bvc10gPSBmblxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgLCBfY2FsbFN0YXJ0OiBmdW5jdGlvbigpIHtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuc3RhcnQoKX0uYmluZCh0aGlzKSwgMClcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuLCBwYXJlbnQ6IFNWRy5FbGVtZW50XHJcblxyXG4gIC8vIEFkZCBtZXRob2QgdG8gcGFyZW50IGVsZW1lbnRzXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBHZXQgZnggbW9kdWxlIG9yIGNyZWF0ZSBhIG5ldyBvbmUsIHRoZW4gYW5pbWF0ZSB3aXRoIGdpdmVuIGR1cmF0aW9uIGFuZCBlYXNlXHJcbiAgICBhbmltYXRlOiBmdW5jdGlvbihvLCBlYXNlLCBkZWxheSkge1xyXG4gICAgICByZXR1cm4gKHRoaXMuZnggfHwgKHRoaXMuZnggPSBuZXcgU1ZHLkZYKHRoaXMpKSkuYW5pbWF0ZShvLCBlYXNlLCBkZWxheSlcclxuICAgIH1cclxuICAsIGRlbGF5OiBmdW5jdGlvbihkZWxheSl7XHJcbiAgICAgIHJldHVybiAodGhpcy5meCB8fCAodGhpcy5meCA9IG5ldyBTVkcuRlgodGhpcykpKS5kZWxheShkZWxheSlcclxuICAgIH1cclxuICAsIHN0b3A6IGZ1bmN0aW9uKGp1bXBUb0VuZCwgY2xlYXJRdWV1ZSkge1xyXG4gICAgICBpZiAodGhpcy5meClcclxuICAgICAgICB0aGlzLmZ4LnN0b3AoanVtcFRvRW5kLCBjbGVhclF1ZXVlKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAsIGZpbmlzaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmZ4KVxyXG4gICAgICAgIHRoaXMuZnguZmluaXNoKClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBQYXVzZSBjdXJyZW50IGFuaW1hdGlvblxyXG4gICwgcGF1c2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5meClcclxuICAgICAgICB0aGlzLmZ4LnBhdXNlKClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBQbGF5IHBhdXNlZCBjdXJyZW50IGFuaW1hdGlvblxyXG4gICwgcGxheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmZ4KVxyXG4gICAgICAgIHRoaXMuZngucGxheSgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gU2V0L0dldCB0aGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbnNcclxuICAsIHNwZWVkOiBmdW5jdGlvbihzcGVlZCkge1xyXG4gICAgICBpZiAodGhpcy5meClcclxuICAgICAgICBpZiAoc3BlZWQgPT0gbnVsbClcclxuICAgICAgICAgIHJldHVybiB0aGlzLmZ4LnNwZWVkKClcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aGlzLmZ4LnNwZWVkKHNwZWVkKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cclxuLy8gTW9ycGhPYmogaXMgdXNlZCB3aGVuZXZlciBubyBtb3JwaGFibGUgb2JqZWN0IGlzIGdpdmVuXHJcblNWRy5Nb3JwaE9iaiA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBjcmVhdGU6IGZ1bmN0aW9uKGZyb20sIHRvKXtcclxuICAgIC8vIHByZXBhcmUgY29sb3IgZm9yIG1vcnBoaW5nXHJcbiAgICBpZihTVkcuQ29sb3IuaXNDb2xvcih0bykpIHJldHVybiBuZXcgU1ZHLkNvbG9yKGZyb20pLm1vcnBoKHRvKVxyXG4gICAgLy8gcHJlcGFyZSB2YWx1ZSBsaXN0IGZvciBtb3JwaGluZ1xyXG4gICAgaWYoU1ZHLnJlZ2V4LmRlbGltaXRlci50ZXN0KGZyb20pKSByZXR1cm4gbmV3IFNWRy5BcnJheShmcm9tKS5tb3JwaCh0bylcclxuICAgIC8vIHByZXBhcmUgbnVtYmVyIGZvciBtb3JwaGluZ1xyXG4gICAgaWYoU1ZHLnJlZ2V4Lm51bWJlckFuZFVuaXQudGVzdCh0bykpIHJldHVybiBuZXcgU1ZHLk51bWJlcihmcm9tKS5tb3JwaCh0bylcclxuXHJcbiAgICAvLyBwcmVwYXJlIGZvciBwbGFpbiBtb3JwaGluZ1xyXG4gICAgdGhpcy52YWx1ZSA9IGZyb21cclxuICAgIHRoaXMuZGVzdGluYXRpb24gPSB0b1xyXG4gIH1cclxuXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICBhdDogZnVuY3Rpb24ocG9zLCByZWFsKXtcclxuICAgICAgcmV0dXJuIHJlYWwgPCAxID8gdGhpcy52YWx1ZSA6IHRoaXMuZGVzdGluYXRpb25cclxuICAgIH0sXHJcblxyXG4gICAgdmFsdWVPZjogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWVcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRlgsIHtcclxuICAvLyBBZGQgYW5pbWF0YWJsZSBhdHRyaWJ1dGVzXHJcbiAgYXR0cjogZnVuY3Rpb24oYSwgdiwgcmVsYXRpdmUpIHtcclxuICAgIC8vIGFwcGx5IGF0dHJpYnV0ZXMgaW5kaXZpZHVhbGx5XHJcbiAgICBpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHtcclxuICAgICAgZm9yICh2YXIga2V5IGluIGEpXHJcbiAgICAgICAgdGhpcy5hdHRyKGtleSwgYVtrZXldKVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkKGEsIHYsICdhdHRycycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgc3R5bGVzXHJcbiwgc3R5bGU6IGZ1bmN0aW9uKHMsIHYpIHtcclxuICAgIGlmICh0eXBlb2YgcyA9PSAnb2JqZWN0JylcclxuICAgICAgZm9yICh2YXIga2V5IGluIHMpXHJcbiAgICAgICAgdGhpcy5zdHlsZShrZXksIHNba2V5XSlcclxuXHJcbiAgICBlbHNlXHJcbiAgICAgIHRoaXMuYWRkKHMsIHYsICdzdHlsZXMnKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIEFuaW1hdGFibGUgeC1heGlzXHJcbiwgeDogZnVuY3Rpb24oeCwgcmVsYXRpdmUpIHtcclxuICAgIGlmKHRoaXMudGFyZ2V0KCkgaW5zdGFuY2VvZiBTVkcuRyl7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtKHt4Onh9LCByZWxhdGl2ZSlcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbnVtID0gbmV3IFNWRy5OdW1iZXIoeClcclxuICAgIG51bS5yZWxhdGl2ZSA9IHJlbGF0aXZlXHJcbiAgICByZXR1cm4gdGhpcy5hZGQoJ3gnLCBudW0pXHJcbiAgfVxyXG4gIC8vIEFuaW1hdGFibGUgeS1heGlzXHJcbiwgeTogZnVuY3Rpb24oeSwgcmVsYXRpdmUpIHtcclxuICAgIGlmKHRoaXMudGFyZ2V0KCkgaW5zdGFuY2VvZiBTVkcuRyl7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtKHt5Onl9LCByZWxhdGl2ZSlcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbnVtID0gbmV3IFNWRy5OdW1iZXIoeSlcclxuICAgIG51bS5yZWxhdGl2ZSA9IHJlbGF0aXZlXHJcbiAgICByZXR1cm4gdGhpcy5hZGQoJ3knLCBudW0pXHJcbiAgfVxyXG4gIC8vIEFuaW1hdGFibGUgY2VudGVyIHgtYXhpc1xyXG4sIGN4OiBmdW5jdGlvbih4KSB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGQoJ2N4JywgbmV3IFNWRy5OdW1iZXIoeCkpXHJcbiAgfVxyXG4gIC8vIEFuaW1hdGFibGUgY2VudGVyIHktYXhpc1xyXG4sIGN5OiBmdW5jdGlvbih5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGQoJ2N5JywgbmV3IFNWRy5OdW1iZXIoeSkpXHJcbiAgfVxyXG4gIC8vIEFkZCBhbmltYXRhYmxlIG1vdmVcclxuLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICByZXR1cm4gdGhpcy54KHgpLnkoeSlcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgY2VudGVyXHJcbiwgY2VudGVyOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jeCh4KS5jeSh5KVxyXG4gIH1cclxuICAvLyBBZGQgYW5pbWF0YWJsZSBzaXplXHJcbiwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgaWYgKHRoaXMudGFyZ2V0KCkgaW5zdGFuY2VvZiBTVkcuVGV4dCkge1xyXG4gICAgICAvLyBhbmltYXRlIGZvbnQgc2l6ZSBmb3IgVGV4dCBlbGVtZW50c1xyXG4gICAgICB0aGlzLmF0dHIoJ2ZvbnQtc2l6ZScsIHdpZHRoKVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGFuaW1hdGUgYmJveCBiYXNlZCBzaXplIGZvciBhbGwgb3RoZXIgZWxlbWVudHNcclxuICAgICAgdmFyIGJveFxyXG5cclxuICAgICAgaWYoIXdpZHRoIHx8ICFoZWlnaHQpe1xyXG4gICAgICAgIGJveCA9IHRoaXMudGFyZ2V0KCkuYmJveCgpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCF3aWR0aCl7XHJcbiAgICAgICAgd2lkdGggPSBib3gud2lkdGggLyBib3guaGVpZ2h0ICAqIGhlaWdodFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZighaGVpZ2h0KXtcclxuICAgICAgICBoZWlnaHQgPSBib3guaGVpZ2h0IC8gYm94LndpZHRoICAqIHdpZHRoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYWRkKCd3aWR0aCcgLCBuZXcgU1ZHLk51bWJlcih3aWR0aCkpXHJcbiAgICAgICAgICAuYWRkKCdoZWlnaHQnLCBuZXcgU1ZHLk51bWJlcihoZWlnaHQpKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBBZGQgYW5pbWF0YWJsZSB3aWR0aFxyXG4sIHdpZHRoOiBmdW5jdGlvbih3aWR0aCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkKCd3aWR0aCcsIG5ldyBTVkcuTnVtYmVyKHdpZHRoKSlcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgaGVpZ2h0XHJcbiwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcclxuICAgIHJldHVybiB0aGlzLmFkZCgnaGVpZ2h0JywgbmV3IFNWRy5OdW1iZXIoaGVpZ2h0KSlcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgcGxvdFxyXG4sIHBsb3Q6IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcclxuICAgIC8vIExpbmVzIGNhbiBiZSBwbG90dGVkIHdpdGggNCBhcmd1bWVudHNcclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wbG90KFthLCBiLCBjLCBkXSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5hZGQoJ3Bsb3QnLCBuZXcgKHRoaXMudGFyZ2V0KCkubW9ycGhBcnJheSkoYSkpXHJcbiAgfVxyXG4gIC8vIEFkZCBsZWFkaW5nIG1ldGhvZFxyXG4sIGxlYWRpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdGhpcy50YXJnZXQoKS5sZWFkaW5nID9cclxuICAgICAgdGhpcy5hZGQoJ2xlYWRpbmcnLCBuZXcgU1ZHLk51bWJlcih2YWx1ZSkpIDpcclxuICAgICAgdGhpc1xyXG4gIH1cclxuICAvLyBBZGQgYW5pbWF0YWJsZSB2aWV3Ym94XHJcbiwgdmlld2JveDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgaWYgKHRoaXMudGFyZ2V0KCkgaW5zdGFuY2VvZiBTVkcuQ29udGFpbmVyKSB7XHJcbiAgICAgIHRoaXMuYWRkKCd2aWV3Ym94JywgbmV3IFNWRy5WaWV3Qm94KHgsIHksIHdpZHRoLCBoZWlnaHQpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4sIHVwZGF0ZTogZnVuY3Rpb24obykge1xyXG4gICAgaWYgKHRoaXMudGFyZ2V0KCkgaW5zdGFuY2VvZiBTVkcuU3RvcCkge1xyXG4gICAgICBpZiAodHlwZW9mIG8gPT0gJ251bWJlcicgfHwgbyBpbnN0YW5jZW9mIFNWRy5OdW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGUoe1xyXG4gICAgICAgICAgb2Zmc2V0OiAgYXJndW1lbnRzWzBdXHJcbiAgICAgICAgLCBjb2xvcjogICBhcmd1bWVudHNbMV1cclxuICAgICAgICAsIG9wYWNpdHk6IGFyZ3VtZW50c1syXVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLm9wYWNpdHkgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLW9wYWNpdHknLCBvLm9wYWNpdHkpXHJcbiAgICAgIGlmIChvLmNvbG9yICAgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLWNvbG9yJywgby5jb2xvcilcclxuICAgICAgaWYgKG8ub2Zmc2V0ICAhPSBudWxsKSB0aGlzLmF0dHIoJ29mZnNldCcsIG8ub2Zmc2V0KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59KVxyXG5cblNWRy5Cb3ggPSBTVkcuaW52ZW50KHtcclxuICBjcmVhdGU6IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIGlmICh0eXBlb2YgeCA9PSAnb2JqZWN0JyAmJiAhKHggaW5zdGFuY2VvZiBTVkcuRWxlbWVudCkpIHtcclxuICAgICAgLy8gY2hyb21lcyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaGFzIG5vIHggYW5kIHkgcHJvcGVydHlcclxuICAgICAgcmV0dXJuIFNWRy5Cb3guY2FsbCh0aGlzLCB4LmxlZnQgIT0gbnVsbCA/IHgubGVmdCA6IHgueCAsIHgudG9wICE9IG51bGwgPyB4LnRvcCA6IHgueSwgeC53aWR0aCwgeC5oZWlnaHQpXHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gNCkge1xyXG4gICAgICB0aGlzLnggPSB4XHJcbiAgICAgIHRoaXMueSA9IHlcclxuICAgICAgdGhpcy53aWR0aCA9IHdpZHRoXHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkIGNlbnRlciwgcmlnaHQsIGJvdHRvbS4uLlxyXG4gICAgZnVsbEJveCh0aGlzKVxyXG4gIH1cclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIE1lcmdlIHJlY3QgYm94IHdpdGggYW5vdGhlciwgcmV0dXJuIGEgbmV3IGluc3RhbmNlXHJcbiAgICBtZXJnZTogZnVuY3Rpb24oYm94KSB7XHJcbiAgICAgIHZhciBiID0gbmV3IHRoaXMuY29uc3RydWN0b3IoKVxyXG5cclxuICAgICAgLy8gbWVyZ2UgYm94ZXNcclxuICAgICAgYi54ICAgICAgPSBNYXRoLm1pbih0aGlzLngsIGJveC54KVxyXG4gICAgICBiLnkgICAgICA9IE1hdGgubWluKHRoaXMueSwgYm94LnkpXHJcbiAgICAgIGIud2lkdGggID0gTWF0aC5tYXgodGhpcy54ICsgdGhpcy53aWR0aCwgIGJveC54ICsgYm94LndpZHRoKSAgLSBiLnhcclxuICAgICAgYi5oZWlnaHQgPSBNYXRoLm1heCh0aGlzLnkgKyB0aGlzLmhlaWdodCwgYm94LnkgKyBib3guaGVpZ2h0KSAtIGIueVxyXG5cclxuICAgICAgcmV0dXJuIGZ1bGxCb3goYilcclxuICAgIH1cclxuXHJcbiAgLCB0cmFuc2Zvcm06IGZ1bmN0aW9uKG0pIHtcclxuICAgICAgdmFyIHhNaW4gPSBJbmZpbml0eSwgeE1heCA9IC1JbmZpbml0eSwgeU1pbiA9IEluZmluaXR5LCB5TWF4ID0gLUluZmluaXR5LCBwLCBiYm94XHJcblxyXG4gICAgICB2YXIgcHRzID0gW1xyXG4gICAgICAgIG5ldyBTVkcuUG9pbnQodGhpcy54LCB0aGlzLnkpLFxyXG4gICAgICAgIG5ldyBTVkcuUG9pbnQodGhpcy54MiwgdGhpcy55KSxcclxuICAgICAgICBuZXcgU1ZHLlBvaW50KHRoaXMueCwgdGhpcy55MiksXHJcbiAgICAgICAgbmV3IFNWRy5Qb2ludCh0aGlzLngyLCB0aGlzLnkyKVxyXG4gICAgICBdXHJcblxyXG4gICAgICBwdHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgcCA9IHAudHJhbnNmb3JtKG0pXHJcbiAgICAgICAgeE1pbiA9IE1hdGgubWluKHhNaW4scC54KVxyXG4gICAgICAgIHhNYXggPSBNYXRoLm1heCh4TWF4LHAueClcclxuICAgICAgICB5TWluID0gTWF0aC5taW4oeU1pbixwLnkpXHJcbiAgICAgICAgeU1heCA9IE1hdGgubWF4KHlNYXgscC55KVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgYmJveCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKClcclxuICAgICAgYmJveC54ID0geE1pblxyXG4gICAgICBiYm94LndpZHRoID0geE1heC14TWluXHJcbiAgICAgIGJib3gueSA9IHlNaW5cclxuICAgICAgYmJveC5oZWlnaHQgPSB5TWF4LXlNaW5cclxuXHJcbiAgICAgIGZ1bGxCb3goYmJveClcclxuXHJcbiAgICAgIHJldHVybiBiYm94XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLkJCb3ggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICBTVkcuQm94LmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuXHJcbiAgICAvLyBnZXQgdmFsdWVzIGlmIGVsZW1lbnQgaXMgZ2l2ZW5cclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU1ZHLkVsZW1lbnQpIHtcclxuICAgICAgdmFyIGJveFxyXG5cclxuICAgICAgLy8geWVzIHRoaXMgaXMgdWdseSwgYnV0IEZpcmVmb3ggY2FuIGJlIGEgcGFpbiB3aGVuIGl0IGNvbWVzIHRvIGVsZW1lbnRzIHRoYXQgYXJlIG5vdCB5ZXQgcmVuZGVyZWRcclxuICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgaWYgKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMpe1xyXG4gICAgICAgICAgLy8gVGhpcyBpcyBJRSAtIGl0IGRvZXMgbm90IHN1cHBvcnQgY29udGFpbnMoKSBmb3IgdG9wLWxldmVsIFNWR3NcclxuICAgICAgICAgIHZhciB0b3BQYXJlbnQgPSBlbGVtZW50Lm5vZGVcclxuICAgICAgICAgIHdoaWxlICh0b3BQYXJlbnQucGFyZW50Tm9kZSl7XHJcbiAgICAgICAgICAgIHRvcFBhcmVudCA9IHRvcFBhcmVudC5wYXJlbnROb2RlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodG9wUGFyZW50ICE9IGRvY3VtZW50KSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdFbGVtZW50IG5vdCBpbiB0aGUgZG9tJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gdGhlIGVsZW1lbnQgaXMgTk9UIGluIHRoZSBkb20sIHRocm93IGVycm9yXHJcbiAgICAgICAgICBpZighZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zKGVsZW1lbnQubm9kZSkpIHRocm93IG5ldyBFeGNlcHRpb24oJ0VsZW1lbnQgbm90IGluIHRoZSBkb20nKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluZCBuYXRpdmUgYmJveFxyXG4gICAgICAgIGJveCA9IGVsZW1lbnQubm9kZS5nZXRCQm94KClcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIFNWRy5TaGFwZSl7XHJcbiAgICAgICAgICB2YXIgY2xvbmUgPSBlbGVtZW50LmNsb25lKFNWRy5wYXJzZXIuZHJhdy5pbnN0YW5jZSkuc2hvdygpXHJcbiAgICAgICAgICBib3ggPSBjbG9uZS5ub2RlLmdldEJCb3goKVxyXG4gICAgICAgICAgY2xvbmUucmVtb3ZlKClcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJveCA9IHtcclxuICAgICAgICAgICAgeDogICAgICBlbGVtZW50Lm5vZGUuY2xpZW50TGVmdFxyXG4gICAgICAgICAgLCB5OiAgICAgIGVsZW1lbnQubm9kZS5jbGllbnRUb3BcclxuICAgICAgICAgICwgd2lkdGg6ICBlbGVtZW50Lm5vZGUuY2xpZW50V2lkdGhcclxuICAgICAgICAgICwgaGVpZ2h0OiBlbGVtZW50Lm5vZGUuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBTVkcuQm94LmNhbGwodGhpcywgYm94KVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8vIERlZmluZSBhbmNlc3RvclxyXG4sIGluaGVyaXQ6IFNWRy5Cb3hcclxuXHJcbiAgLy8gRGVmaW5lIFBhcmVudFxyXG4sIHBhcmVudDogU1ZHLkVsZW1lbnRcclxuXHJcbiAgLy8gQ29uc3RydWN0b3JcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIEdldCBib3VuZGluZyBib3hcclxuICAgIGJib3g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5CQm94KHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5CQm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNWRy5CQm94XHJcblxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIHRib3g6IGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLndhcm4oJ1VzZSBvZiBUQm94IGlzIGRlcHJlY2F0ZWQgYW5kIG1hcHBlZCB0byBSQm94LiBVc2UgLnJib3goKSBpbnN0ZWFkLicpXHJcbiAgICByZXR1cm4gdGhpcy5yYm94KHRoaXMuZG9jKCkpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLlJCb3ggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICBTVkcuQm94LmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuXHJcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFNWRy5FbGVtZW50KSB7XHJcbiAgICAgIFNWRy5Cb3guY2FsbCh0aGlzLCBlbGVtZW50Lm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuLCBpbmhlcml0OiBTVkcuQm94XHJcblxyXG4gIC8vIGRlZmluZSBQYXJlbnRcclxuLCBwYXJlbnQ6IFNWRy5FbGVtZW50XHJcblxyXG4sIGV4dGVuZDoge1xyXG4gICAgYWRkT2Zmc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gb2Zmc2V0IGJ5IHdpbmRvdyBzY3JvbGwgcG9zaXRpb24sIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGNoYW5nZXMgd2hlbiB3aW5kb3cgaXMgc2Nyb2xsZWRcclxuICAgICAgdGhpcy54ICs9IHdpbmRvdy5wYWdlWE9mZnNldFxyXG4gICAgICB0aGlzLnkgKz0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBDb25zdHJ1Y3RvclxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gR2V0IHJlY3QgYm94XHJcbiAgICByYm94OiBmdW5jdGlvbihlbCkge1xyXG4gICAgICBpZiAoZWwpIHJldHVybiBuZXcgU1ZHLlJCb3godGhpcykudHJhbnNmb3JtKGVsLnNjcmVlbkNUTSgpLmludmVyc2UoKSlcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuUkJveCh0aGlzKS5hZGRPZmZzZXQoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuUkJveC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTVkcuUkJveFxyXG5cblNWRy5NYXRyaXggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihzb3VyY2UpIHtcclxuICAgIHZhciBpLCBiYXNlID0gYXJyYXlUb01hdHJpeChbMSwgMCwgMCwgMSwgMCwgMF0pXHJcblxyXG4gICAgLy8gZW5zdXJlIHNvdXJjZSBhcyBvYmplY3RcclxuICAgIHNvdXJjZSA9IHNvdXJjZSBpbnN0YW5jZW9mIFNWRy5FbGVtZW50ID9cclxuICAgICAgc291cmNlLm1hdHJpeGlmeSgpIDpcclxuICAgIHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnID9cclxuICAgICAgYXJyYXlUb01hdHJpeChzb3VyY2Uuc3BsaXQoU1ZHLnJlZ2V4LmRlbGltaXRlcikubWFwKHBhcnNlRmxvYXQpKSA6XHJcbiAgICBhcmd1bWVudHMubGVuZ3RoID09IDYgP1xyXG4gICAgICBhcnJheVRvTWF0cml4KFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOlxyXG4gICAgQXJyYXkuaXNBcnJheShzb3VyY2UpID9cclxuICAgICAgYXJyYXlUb01hdHJpeChzb3VyY2UpIDpcclxuICAgIHR5cGVvZiBzb3VyY2UgPT09ICdvYmplY3QnID9cclxuICAgICAgc291cmNlIDogYmFzZVxyXG5cclxuICAgIC8vIG1lcmdlIHNvdXJjZVxyXG4gICAgZm9yIChpID0gYWJjZGVmLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKVxyXG4gICAgICB0aGlzW2FiY2RlZltpXV0gPSBzb3VyY2VbYWJjZGVmW2ldXSAhPSBudWxsID9cclxuICAgICAgICBzb3VyY2VbYWJjZGVmW2ldXSA6IGJhc2VbYWJjZGVmW2ldXVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIEV4dHJhY3QgaW5kaXZpZHVhbCB0cmFuc2Zvcm1hdGlvbnNcclxuICAgIGV4dHJhY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBmaW5kIGRlbHRhIHRyYW5zZm9ybSBwb2ludHNcclxuICAgICAgdmFyIHB4ICAgID0gZGVsdGFUcmFuc2Zvcm1Qb2ludCh0aGlzLCAwLCAxKVxyXG4gICAgICAgICwgcHkgICAgPSBkZWx0YVRyYW5zZm9ybVBvaW50KHRoaXMsIDEsIDApXHJcbiAgICAgICAgLCBza2V3WCA9IDE4MCAvIE1hdGguUEkgKiBNYXRoLmF0YW4yKHB4LnksIHB4LngpIC0gOTBcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gdHJhbnNsYXRpb25cclxuICAgICAgICB4OiAgICAgICAgdGhpcy5lXHJcbiAgICAgICwgeTogICAgICAgIHRoaXMuZlxyXG4gICAgICAsIHRyYW5zZm9ybWVkWDoodGhpcy5lICogTWF0aC5jb3Moc2tld1ggKiBNYXRoLlBJIC8gMTgwKSArIHRoaXMuZiAqIE1hdGguc2luKHNrZXdYICogTWF0aC5QSSAvIDE4MCkpIC8gTWF0aC5zcXJ0KHRoaXMuYSAqIHRoaXMuYSArIHRoaXMuYiAqIHRoaXMuYilcclxuICAgICAgLCB0cmFuc2Zvcm1lZFk6KHRoaXMuZiAqIE1hdGguY29zKHNrZXdYICogTWF0aC5QSSAvIDE4MCkgKyB0aGlzLmUgKiBNYXRoLnNpbigtc2tld1ggKiBNYXRoLlBJIC8gMTgwKSkgLyBNYXRoLnNxcnQodGhpcy5jICogdGhpcy5jICsgdGhpcy5kICogdGhpcy5kKVxyXG4gICAgICAgIC8vIHNrZXdcclxuICAgICAgLCBza2V3WDogICAgLXNrZXdYXHJcbiAgICAgICwgc2tld1k6ICAgIDE4MCAvIE1hdGguUEkgKiBNYXRoLmF0YW4yKHB5LnksIHB5LngpXHJcbiAgICAgICAgLy8gc2NhbGVcclxuICAgICAgLCBzY2FsZVg6ICAgTWF0aC5zcXJ0KHRoaXMuYSAqIHRoaXMuYSArIHRoaXMuYiAqIHRoaXMuYilcclxuICAgICAgLCBzY2FsZVk6ICAgTWF0aC5zcXJ0KHRoaXMuYyAqIHRoaXMuYyArIHRoaXMuZCAqIHRoaXMuZClcclxuICAgICAgICAvLyByb3RhdGlvblxyXG4gICAgICAsIHJvdGF0aW9uOiBza2V3WFxyXG4gICAgICAsIGE6IHRoaXMuYVxyXG4gICAgICAsIGI6IHRoaXMuYlxyXG4gICAgICAsIGM6IHRoaXMuY1xyXG4gICAgICAsIGQ6IHRoaXMuZFxyXG4gICAgICAsIGU6IHRoaXMuZVxyXG4gICAgICAsIGY6IHRoaXMuZlxyXG4gICAgICAsIG1hdHJpeDogbmV3IFNWRy5NYXRyaXgodGhpcylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gQ2xvbmUgbWF0cml4XHJcbiAgLCBjbG9uZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk1hdHJpeCh0aGlzKVxyXG4gICAgfVxyXG4gICAgLy8gTW9ycGggb25lIG1hdHJpeCBpbnRvIGFub3RoZXJcclxuICAsIG1vcnBoOiBmdW5jdGlvbihtYXRyaXgpIHtcclxuICAgICAgLy8gc3RvcmUgbmV3IGRlc3RpbmF0aW9uXHJcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgU1ZHLk1hdHJpeChtYXRyaXgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IG1vcnBoZWQgbWF0cml4IGF0IGEgZ2l2ZW4gcG9zaXRpb25cclxuICAsIGF0OiBmdW5jdGlvbihwb3MpIHtcclxuICAgICAgLy8gbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZFxyXG4gICAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzXHJcblxyXG4gICAgICAvLyBjYWxjdWxhdGUgbW9ycGhlZCBtYXRyaXggYXQgYSBnaXZlbiBwb3NpdGlvblxyXG4gICAgICB2YXIgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgoe1xyXG4gICAgICAgIGE6IHRoaXMuYSArICh0aGlzLmRlc3RpbmF0aW9uLmEgLSB0aGlzLmEpICogcG9zXHJcbiAgICAgICwgYjogdGhpcy5iICsgKHRoaXMuZGVzdGluYXRpb24uYiAtIHRoaXMuYikgKiBwb3NcclxuICAgICAgLCBjOiB0aGlzLmMgKyAodGhpcy5kZXN0aW5hdGlvbi5jIC0gdGhpcy5jKSAqIHBvc1xyXG4gICAgICAsIGQ6IHRoaXMuZCArICh0aGlzLmRlc3RpbmF0aW9uLmQgLSB0aGlzLmQpICogcG9zXHJcbiAgICAgICwgZTogdGhpcy5lICsgKHRoaXMuZGVzdGluYXRpb24uZSAtIHRoaXMuZSkgKiBwb3NcclxuICAgICAgLCBmOiB0aGlzLmYgKyAodGhpcy5kZXN0aW5hdGlvbi5mIC0gdGhpcy5mKSAqIHBvc1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIG1hdHJpeFxyXG4gICAgfVxyXG4gICAgLy8gTXVsdGlwbGllcyBieSBnaXZlbiBtYXRyaXhcclxuICAsIG11bHRpcGx5OiBmdW5jdGlvbihtYXRyaXgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuTWF0cml4KHRoaXMubmF0aXZlKCkubXVsdGlwbHkocGFyc2VNYXRyaXgobWF0cml4KS5uYXRpdmUoKSkpXHJcbiAgICB9XHJcbiAgICAvLyBJbnZlcnNlcyBtYXRyaXhcclxuICAsIGludmVyc2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5NYXRyaXgodGhpcy5uYXRpdmUoKS5pbnZlcnNlKCkpXHJcbiAgICB9XHJcbiAgICAvLyBUcmFuc2xhdGUgbWF0cml4XHJcbiAgLCB0cmFuc2xhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuTWF0cml4KHRoaXMubmF0aXZlKCkudHJhbnNsYXRlKHggfHwgMCwgeSB8fCAwKSlcclxuICAgIH1cclxuICAgIC8vIFNjYWxlIG1hdHJpeFxyXG4gICwgc2NhbGU6IGZ1bmN0aW9uKHgsIHksIGN4LCBjeSkge1xyXG4gICAgICAvLyBzdXBwb3J0IHVuaWZvcm1hbCBzY2FsZVxyXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgeSA9IHhcclxuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcclxuICAgICAgICBjeSA9IGN4XHJcbiAgICAgICAgY3ggPSB5XHJcbiAgICAgICAgeSA9IHhcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXJvdW5kKGN4LCBjeSwgbmV3IFNWRy5NYXRyaXgoeCwgMCwgMCwgeSwgMCwgMCkpXHJcbiAgICB9XHJcbiAgICAvLyBSb3RhdGUgbWF0cml4XHJcbiAgLCByb3RhdGU6IGZ1bmN0aW9uKHIsIGN4LCBjeSkge1xyXG4gICAgICAvLyBjb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xyXG4gICAgICByID0gU1ZHLnV0aWxzLnJhZGlhbnMocilcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmFyb3VuZChjeCwgY3ksIG5ldyBTVkcuTWF0cml4KE1hdGguY29zKHIpLCBNYXRoLnNpbihyKSwgLU1hdGguc2luKHIpLCBNYXRoLmNvcyhyKSwgMCwgMCkpXHJcbiAgICB9XHJcbiAgICAvLyBGbGlwIG1hdHJpeCBvbiB4IG9yIHksIGF0IGEgZ2l2ZW4gb2Zmc2V0XHJcbiAgLCBmbGlwOiBmdW5jdGlvbihhLCBvKSB7XHJcbiAgICAgIHJldHVybiBhID09ICd4JyA/XHJcbiAgICAgICAgICB0aGlzLnNjYWxlKC0xLCAxLCBvLCAwKSA6XHJcbiAgICAgICAgYSA9PSAneScgP1xyXG4gICAgICAgICAgdGhpcy5zY2FsZSgxLCAtMSwgMCwgbykgOlxyXG4gICAgICAgICAgdGhpcy5zY2FsZSgtMSwgLTEsIGEsIG8gIT0gbnVsbCA/IG8gOiBhKVxyXG4gICAgfVxyXG4gICAgLy8gU2tld1xyXG4gICwgc2tldzogZnVuY3Rpb24oeCwgeSwgY3gsIGN5KSB7XHJcbiAgICAgIC8vIHN1cHBvcnQgdW5pZm9ybWFsIHNrZXdcclxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgIHkgPSB4XHJcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgY3kgPSBjeFxyXG4gICAgICAgIGN4ID0geVxyXG4gICAgICAgIHkgPSB4XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXHJcbiAgICAgIHggPSBTVkcudXRpbHMucmFkaWFucyh4KVxyXG4gICAgICB5ID0gU1ZHLnV0aWxzLnJhZGlhbnMoeSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmFyb3VuZChjeCwgY3ksIG5ldyBTVkcuTWF0cml4KDEsIE1hdGgudGFuKHkpLCBNYXRoLnRhbih4KSwgMSwgMCwgMCkpXHJcbiAgICB9XHJcbiAgICAvLyBTa2V3WFxyXG4gICwgc2tld1g6IGZ1bmN0aW9uKHgsIGN4LCBjeSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5za2V3KHgsIDAsIGN4LCBjeSlcclxuICAgIH1cclxuICAgIC8vIFNrZXdZXHJcbiAgLCBza2V3WTogZnVuY3Rpb24oeSwgY3gsIGN5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNrZXcoMCwgeSwgY3gsIGN5KVxyXG4gICAgfVxyXG4gICAgLy8gVHJhbnNmb3JtIGFyb3VuZCBhIGNlbnRlciBwb2ludFxyXG4gICwgYXJvdW5kOiBmdW5jdGlvbihjeCwgY3ksIG1hdHJpeCkge1xyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIC5tdWx0aXBseShuZXcgU1ZHLk1hdHJpeCgxLCAwLCAwLCAxLCBjeCB8fCAwLCBjeSB8fCAwKSlcclxuICAgICAgICAubXVsdGlwbHkobWF0cml4KVxyXG4gICAgICAgIC5tdWx0aXBseShuZXcgU1ZHLk1hdHJpeCgxLCAwLCAwLCAxLCAtY3ggfHwgMCwgLWN5IHx8IDApKVxyXG4gICAgfVxyXG4gICAgLy8gQ29udmVydCB0byBuYXRpdmUgU1ZHTWF0cml4XHJcbiAgLCBuYXRpdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjcmVhdGUgbmV3IG1hdHJpeFxyXG4gICAgICB2YXIgbWF0cml4ID0gU1ZHLnBhcnNlci5uYXRpdmUuY3JlYXRlU1ZHTWF0cml4KClcclxuXHJcbiAgICAgIC8vIHVwZGF0ZSB3aXRoIGN1cnJlbnQgdmFsdWVzXHJcbiAgICAgIGZvciAodmFyIGkgPSBhYmNkZWYubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgbWF0cml4W2FiY2RlZltpXV0gPSB0aGlzW2FiY2RlZltpXV1cclxuXHJcbiAgICAgIHJldHVybiBtYXRyaXhcclxuICAgIH1cclxuICAgIC8vIENvbnZlcnQgbWF0cml4IHRvIHN0cmluZ1xyXG4gICwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gJ21hdHJpeCgnICsgdGhpcy5hICsgJywnICsgdGhpcy5iICsgJywnICsgdGhpcy5jICsgJywnICsgdGhpcy5kICsgJywnICsgdGhpcy5lICsgJywnICsgdGhpcy5mICsgJyknXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWZpbmUgcGFyZW50XHJcbiwgcGFyZW50OiBTVkcuRWxlbWVudFxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gR2V0IGN1cnJlbnQgbWF0cml4XHJcbiAgICBjdG06IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5NYXRyaXgodGhpcy5ub2RlLmdldENUTSgpKVxyXG4gICAgfSxcclxuICAgIC8vIEdldCBjdXJyZW50IHNjcmVlbiBtYXRyaXhcclxuICAgIHNjcmVlbkNUTTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8qIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTEzNDQ1MzdcclxuICAgICAgICAgVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBGRiBkb2VzIG5vdCByZXR1cm4gdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxyXG4gICAgICAgICBmb3IgdGhlIGlubmVyIGNvb3JkaW5hdGUgc3lzdGVtIHdoZW4gZ2V0U2NyZWVuQ1RNKCkgaXMgY2FsbGVkIG9uIG5lc3RlZCBzdmdzLlxyXG4gICAgICAgICBIb3dldmVyIGFsbCBvdGhlciBCcm93c2VycyBkbyB0aGF0ICovXHJcbiAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBTVkcuTmVzdGVkKSB7XHJcbiAgICAgICAgdmFyIHJlY3QgPSB0aGlzLnJlY3QoMSwxKVxyXG4gICAgICAgIHZhciBtID0gcmVjdC5ub2RlLmdldFNjcmVlbkNUTSgpXHJcbiAgICAgICAgcmVjdC5yZW1vdmUoKVxyXG4gICAgICAgIHJldHVybiBuZXcgU1ZHLk1hdHJpeChtKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk1hdHJpeCh0aGlzLm5vZGUuZ2V0U2NyZWVuQ1RNKCkpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn0pXHJcblxuU1ZHLlBvaW50ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oeCx5KSB7XHJcbiAgICB2YXIgaSwgc291cmNlLCBiYXNlID0ge3g6MCwgeTowfVxyXG5cclxuICAgIC8vIGVuc3VyZSBzb3VyY2UgYXMgb2JqZWN0XHJcbiAgICBzb3VyY2UgPSBBcnJheS5pc0FycmF5KHgpID9cclxuICAgICAge3g6eFswXSwgeTp4WzFdfSA6XHJcbiAgICB0eXBlb2YgeCA9PT0gJ29iamVjdCcgP1xyXG4gICAgICB7eDp4LngsIHk6eC55fSA6XHJcbiAgICB4ICE9IG51bGwgP1xyXG4gICAgICB7eDp4LCB5Oih5ICE9IG51bGwgPyB5IDogeCl9IDogYmFzZSAvLyBJZiB5IGhhcyBubyB2YWx1ZSwgdGhlbiB4IGlzIHVzZWQgaGFzIGl0cyB2YWx1ZVxyXG5cclxuICAgIC8vIG1lcmdlIHNvdXJjZVxyXG4gICAgdGhpcy54ID0gc291cmNlLnhcclxuICAgIHRoaXMueSA9IHNvdXJjZS55XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gQ2xvbmUgcG9pbnRcclxuICAgIGNsb25lOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuUG9pbnQodGhpcylcclxuICAgIH1cclxuICAgIC8vIE1vcnBoIG9uZSBwb2ludCBpbnRvIGFub3RoZXJcclxuICAsIG1vcnBoOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgIC8vIHN0b3JlIG5ldyBkZXN0aW5hdGlvblxyXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNWRy5Qb2ludCh4LCB5KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIEdldCBtb3JwaGVkIHBvaW50IGF0IGEgZ2l2ZW4gcG9zaXRpb25cclxuICAsIGF0OiBmdW5jdGlvbihwb3MpIHtcclxuICAgICAgLy8gbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZFxyXG4gICAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzXHJcblxyXG4gICAgICAvLyBjYWxjdWxhdGUgbW9ycGhlZCBtYXRyaXggYXQgYSBnaXZlbiBwb3NpdGlvblxyXG4gICAgICB2YXIgcG9pbnQgPSBuZXcgU1ZHLlBvaW50KHtcclxuICAgICAgICB4OiB0aGlzLnggKyAodGhpcy5kZXN0aW5hdGlvbi54IC0gdGhpcy54KSAqIHBvc1xyXG4gICAgICAsIHk6IHRoaXMueSArICh0aGlzLmRlc3RpbmF0aW9uLnkgLSB0aGlzLnkpICogcG9zXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gcG9pbnRcclxuICAgIH1cclxuICAgIC8vIENvbnZlcnQgdG8gbmF0aXZlIFNWR1BvaW50XHJcbiAgLCBuYXRpdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjcmVhdGUgbmV3IHBvaW50XHJcbiAgICAgIHZhciBwb2ludCA9IFNWRy5wYXJzZXIubmF0aXZlLmNyZWF0ZVNWR1BvaW50KClcclxuXHJcbiAgICAgIC8vIHVwZGF0ZSB3aXRoIGN1cnJlbnQgdmFsdWVzXHJcbiAgICAgIHBvaW50LnggPSB0aGlzLnhcclxuICAgICAgcG9pbnQueSA9IHRoaXMueVxyXG5cclxuICAgICAgcmV0dXJuIHBvaW50XHJcbiAgICB9XHJcbiAgICAvLyB0cmFuc2Zvcm0gcG9pbnQgd2l0aCBtYXRyaXhcclxuICAsIHRyYW5zZm9ybTogZnVuY3Rpb24obWF0cml4KSB7XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLlBvaW50KHRoaXMubmF0aXZlKCkubWF0cml4VHJhbnNmb3JtKG1hdHJpeC5uYXRpdmUoKSkpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcblxyXG4gIC8vIEdldCBwb2ludFxyXG4gIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IFNWRy5Qb2ludCh4LHkpLnRyYW5zZm9ybSh0aGlzLnNjcmVlbkNUTSgpLmludmVyc2UoKSk7XHJcbiAgfVxyXG5cclxufSlcclxuXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gU2V0IHN2ZyBlbGVtZW50IGF0dHJpYnV0ZVxyXG4gIGF0dHI6IGZ1bmN0aW9uKGEsIHYsIG4pIHtcclxuICAgIC8vIGFjdCBhcyBmdWxsIGdldHRlclxyXG4gICAgaWYgKGEgPT0gbnVsbCkge1xyXG4gICAgICAvLyBnZXQgYW4gb2JqZWN0IG9mIGF0dHJpYnV0ZXNcclxuICAgICAgYSA9IHt9XHJcbiAgICAgIHYgPSB0aGlzLm5vZGUuYXR0cmlidXRlc1xyXG4gICAgICBmb3IgKG4gPSB2Lmxlbmd0aCAtIDE7IG4gPj0gMDsgbi0tKVxyXG4gICAgICAgIGFbdltuXS5ub2RlTmFtZV0gPSBTVkcucmVnZXguaXNOdW1iZXIudGVzdCh2W25dLm5vZGVWYWx1ZSkgPyBwYXJzZUZsb2F0KHZbbl0ubm9kZVZhbHVlKSA6IHZbbl0ubm9kZVZhbHVlXHJcblxyXG4gICAgICByZXR1cm4gYVxyXG5cclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHtcclxuICAgICAgLy8gYXBwbHkgZXZlcnkgYXR0cmlidXRlIGluZGl2aWR1YWxseSBpZiBhbiBvYmplY3QgaXMgcGFzc2VkXHJcbiAgICAgIGZvciAodiBpbiBhKSB0aGlzLmF0dHIodiwgYVt2XSlcclxuXHJcbiAgICB9IGVsc2UgaWYgKHYgPT09IG51bGwpIHtcclxuICAgICAgICAvLyByZW1vdmUgdmFsdWVcclxuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQXR0cmlidXRlKGEpXHJcblxyXG4gICAgfSBlbHNlIGlmICh2ID09IG51bGwpIHtcclxuICAgICAgLy8gYWN0IGFzIGEgZ2V0dGVyIGlmIHRoZSBmaXJzdCBhbmQgb25seSBhcmd1bWVudCBpcyBub3QgYW4gb2JqZWN0XHJcbiAgICAgIHYgPSB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKGEpXHJcbiAgICAgIHJldHVybiB2ID09IG51bGwgP1xyXG4gICAgICAgIFNWRy5kZWZhdWx0cy5hdHRyc1thXSA6XHJcbiAgICAgIFNWRy5yZWdleC5pc051bWJlci50ZXN0KHYpID9cclxuICAgICAgICBwYXJzZUZsb2F0KHYpIDogdlxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEJVRyBGSVg6IHNvbWUgYnJvd3NlcnMgd2lsbCByZW5kZXIgYSBzdHJva2UgaWYgYSBjb2xvciBpcyBnaXZlbiBldmVuIHRob3VnaCBzdHJva2Ugd2lkdGggaXMgMFxyXG4gICAgICBpZiAoYSA9PSAnc3Ryb2tlLXdpZHRoJylcclxuICAgICAgICB0aGlzLmF0dHIoJ3N0cm9rZScsIHBhcnNlRmxvYXQodikgPiAwID8gdGhpcy5fc3Ryb2tlIDogbnVsbClcclxuICAgICAgZWxzZSBpZiAoYSA9PSAnc3Ryb2tlJylcclxuICAgICAgICB0aGlzLl9zdHJva2UgPSB2XHJcblxyXG4gICAgICAvLyBjb252ZXJ0IGltYWdlIGZpbGwgYW5kIHN0cm9rZSB0byBwYXR0ZXJuc1xyXG4gICAgICBpZiAoYSA9PSAnZmlsbCcgfHwgYSA9PSAnc3Ryb2tlJykge1xyXG4gICAgICAgIGlmIChTVkcucmVnZXguaXNJbWFnZS50ZXN0KHYpKVxyXG4gICAgICAgICAgdiA9IHRoaXMuZG9jKCkuZGVmcygpLmltYWdlKHYsIDAsIDApXHJcblxyXG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgU1ZHLkltYWdlKVxyXG4gICAgICAgICAgdiA9IHRoaXMuZG9jKCkuZGVmcygpLnBhdHRlcm4oMCwgMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHYpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBlbnN1cmUgY29ycmVjdCBudW1lcmljIHZhbHVlcyAoYWxzbyBhY2NlcHRzIE5hTiBhbmQgSW5maW5pdHkpXHJcbiAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpXHJcbiAgICAgICAgdiA9IG5ldyBTVkcuTnVtYmVyKHYpXHJcblxyXG4gICAgICAvLyBlbnN1cmUgZnVsbCBoZXggY29sb3JcclxuICAgICAgZWxzZSBpZiAoU1ZHLkNvbG9yLmlzQ29sb3IodikpXHJcbiAgICAgICAgdiA9IG5ldyBTVkcuQ29sb3IodilcclxuXHJcbiAgICAgIC8vIHBhcnNlIGFycmF5IHZhbHVlc1xyXG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHYpKVxyXG4gICAgICAgIHYgPSBuZXcgU1ZHLkFycmF5KHYpXHJcblxyXG4gICAgICAvLyBpZiB0aGUgcGFzc2VkIGF0dHJpYnV0ZSBpcyBsZWFkaW5nLi4uXHJcbiAgICAgIGlmIChhID09ICdsZWFkaW5nJykge1xyXG4gICAgICAgIC8vIC4uLiBjYWxsIHRoZSBsZWFkaW5nIG1ldGhvZCBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKHRoaXMubGVhZGluZylcclxuICAgICAgICAgIHRoaXMubGVhZGluZyh2KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHNldCBnaXZlbiBhdHRyaWJ1dGUgb24gbm9kZVxyXG4gICAgICAgIHR5cGVvZiBuID09PSAnc3RyaW5nJyA/XHJcbiAgICAgICAgICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlTlMobiwgYSwgdi50b1N0cmluZygpKSA6XHJcbiAgICAgICAgICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKGEsIHYudG9TdHJpbmcoKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmVidWlsZCBpZiByZXF1aXJlZFxyXG4gICAgICBpZiAodGhpcy5yZWJ1aWxkICYmIChhID09ICdmb250LXNpemUnIHx8IGEgPT0gJ3gnKSlcclxuICAgICAgICB0aGlzLnJlYnVpbGQoYSwgdilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufSlcblNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcclxuICAvLyBBZGQgdHJhbnNmb3JtYXRpb25zXHJcbiAgdHJhbnNmb3JtOiBmdW5jdGlvbihvLCByZWxhdGl2ZSkge1xyXG4gICAgLy8gZ2V0IHRhcmdldCBpbiBjYXNlIG9mIHRoZSBmeCBtb2R1bGUsIG90aGVyd2lzZSByZWZlcmVuY2UgdGhpc1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXNcclxuICAgICAgLCBtYXRyaXgsIGJib3hcclxuXHJcbiAgICAvLyBhY3QgYXMgYSBnZXR0ZXJcclxuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgLy8gZ2V0IGN1cnJlbnQgbWF0cml4XHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuTWF0cml4KHRhcmdldCkuZXh0cmFjdCgpXHJcblxyXG4gICAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbWF0cml4W29dIDogbWF0cml4XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZ2V0IGN1cnJlbnQgbWF0cml4XHJcbiAgICBtYXRyaXggPSBuZXcgU1ZHLk1hdHJpeCh0YXJnZXQpXHJcblxyXG4gICAgLy8gZW5zdXJlIHJlbGF0aXZlIGZsYWdcclxuICAgIHJlbGF0aXZlID0gISFyZWxhdGl2ZSB8fCAhIW8ucmVsYXRpdmVcclxuXHJcbiAgICAvLyBhY3Qgb24gbWF0cml4XHJcbiAgICBpZiAoby5hICE9IG51bGwpIHtcclxuICAgICAgbWF0cml4ID0gcmVsYXRpdmUgP1xyXG4gICAgICAgIC8vIHJlbGF0aXZlXHJcbiAgICAgICAgbWF0cml4Lm11bHRpcGx5KG5ldyBTVkcuTWF0cml4KG8pKSA6XHJcbiAgICAgICAgLy8gYWJzb2x1dGVcclxuICAgICAgICBuZXcgU1ZHLk1hdHJpeChvKVxyXG5cclxuICAgIC8vIGFjdCBvbiByb3RhdGlvblxyXG4gICAgfSBlbHNlIGlmIChvLnJvdGF0aW9uICE9IG51bGwpIHtcclxuICAgICAgLy8gZW5zdXJlIGNlbnRyZSBwb2ludFxyXG4gICAgICBlbnN1cmVDZW50cmUobywgdGFyZ2V0KVxyXG5cclxuICAgICAgLy8gYXBwbHkgdHJhbnNmb3JtYXRpb25cclxuICAgICAgbWF0cml4ID0gcmVsYXRpdmUgP1xyXG4gICAgICAgIC8vIHJlbGF0aXZlXHJcbiAgICAgICAgbWF0cml4LnJvdGF0ZShvLnJvdGF0aW9uLCBvLmN4LCBvLmN5KSA6XHJcbiAgICAgICAgLy8gYWJzb2x1dGVcclxuICAgICAgICBtYXRyaXgucm90YXRlKG8ucm90YXRpb24gLSBtYXRyaXguZXh0cmFjdCgpLnJvdGF0aW9uLCBvLmN4LCBvLmN5KVxyXG5cclxuICAgIC8vIGFjdCBvbiBzY2FsZVxyXG4gICAgfSBlbHNlIGlmIChvLnNjYWxlICE9IG51bGwgfHwgby5zY2FsZVggIT0gbnVsbCB8fCBvLnNjYWxlWSAhPSBudWxsKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBjZW50cmUgcG9pbnRcclxuICAgICAgZW5zdXJlQ2VudHJlKG8sIHRhcmdldClcclxuXHJcbiAgICAgIC8vIGVuc3VyZSBzY2FsZSB2YWx1ZXMgb24gYm90aCBheGVzXHJcbiAgICAgIG8uc2NhbGVYID0gby5zY2FsZSAhPSBudWxsID8gby5zY2FsZSA6IG8uc2NhbGVYICE9IG51bGwgPyBvLnNjYWxlWCA6IDFcclxuICAgICAgby5zY2FsZVkgPSBvLnNjYWxlICE9IG51bGwgPyBvLnNjYWxlIDogby5zY2FsZVkgIT0gbnVsbCA/IG8uc2NhbGVZIDogMVxyXG5cclxuICAgICAgaWYgKCFyZWxhdGl2ZSkge1xyXG4gICAgICAgIC8vIGFic29sdXRlOyBtdWx0aXBseSBpbnZlcnNlZCB2YWx1ZXNcclxuICAgICAgICB2YXIgZSA9IG1hdHJpeC5leHRyYWN0KClcclxuICAgICAgICBvLnNjYWxlWCA9IG8uc2NhbGVYICogMSAvIGUuc2NhbGVYXHJcbiAgICAgICAgby5zY2FsZVkgPSBvLnNjYWxlWSAqIDEgLyBlLnNjYWxlWVxyXG4gICAgICB9XHJcblxyXG4gICAgICBtYXRyaXggPSBtYXRyaXguc2NhbGUoby5zY2FsZVgsIG8uc2NhbGVZLCBvLmN4LCBvLmN5KVxyXG5cclxuICAgIC8vIGFjdCBvbiBza2V3XHJcbiAgICB9IGVsc2UgaWYgKG8uc2tldyAhPSBudWxsIHx8IG8uc2tld1ggIT0gbnVsbCB8fCBvLnNrZXdZICE9IG51bGwpIHtcclxuICAgICAgLy8gZW5zdXJlIGNlbnRyZSBwb2ludFxyXG4gICAgICBlbnN1cmVDZW50cmUobywgdGFyZ2V0KVxyXG5cclxuICAgICAgLy8gZW5zdXJlIHNrZXcgdmFsdWVzIG9uIGJvdGggYXhlc1xyXG4gICAgICBvLnNrZXdYID0gby5za2V3ICE9IG51bGwgPyBvLnNrZXcgOiBvLnNrZXdYICE9IG51bGwgPyBvLnNrZXdYIDogMFxyXG4gICAgICBvLnNrZXdZID0gby5za2V3ICE9IG51bGwgPyBvLnNrZXcgOiBvLnNrZXdZICE9IG51bGwgPyBvLnNrZXdZIDogMFxyXG5cclxuICAgICAgaWYgKCFyZWxhdGl2ZSkge1xyXG4gICAgICAgIC8vIGFic29sdXRlOyByZXNldCBza2V3IHZhbHVlc1xyXG4gICAgICAgIHZhciBlID0gbWF0cml4LmV4dHJhY3QoKVxyXG4gICAgICAgIG1hdHJpeCA9IG1hdHJpeC5tdWx0aXBseShuZXcgU1ZHLk1hdHJpeCgpLnNrZXcoZS5za2V3WCwgZS5za2V3WSwgby5jeCwgby5jeSkuaW52ZXJzZSgpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBtYXRyaXggPSBtYXRyaXguc2tldyhvLnNrZXdYLCBvLnNrZXdZLCBvLmN4LCBvLmN5KVxyXG5cclxuICAgIC8vIGFjdCBvbiBmbGlwXHJcbiAgICB9IGVsc2UgaWYgKG8uZmxpcCkge1xyXG4gICAgICBpZihvLmZsaXAgPT0gJ3gnIHx8IG8uZmxpcCA9PSAneScpIHtcclxuICAgICAgICBvLm9mZnNldCA9IG8ub2Zmc2V0ID09IG51bGwgPyB0YXJnZXQuYmJveCgpWydjJyArIG8uZmxpcF0gOiBvLm9mZnNldFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKG8ub2Zmc2V0ID09IG51bGwpIHtcclxuICAgICAgICAgIGJib3ggPSB0YXJnZXQuYmJveCgpXHJcbiAgICAgICAgICBvLmZsaXAgPSBiYm94LmN4XHJcbiAgICAgICAgICBvLm9mZnNldCA9IGJib3guY3lcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgby5mbGlwID0gby5vZmZzZXRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuTWF0cml4KCkuZmxpcChvLmZsaXAsIG8ub2Zmc2V0KVxyXG5cclxuICAgIC8vIGFjdCBvbiB0cmFuc2xhdGVcclxuICAgIH0gZWxzZSBpZiAoby54ICE9IG51bGwgfHwgby55ICE9IG51bGwpIHtcclxuICAgICAgaWYgKHJlbGF0aXZlKSB7XHJcbiAgICAgICAgLy8gcmVsYXRpdmVcclxuICAgICAgICBtYXRyaXggPSBtYXRyaXgudHJhbnNsYXRlKG8ueCwgby55KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGFic29sdXRlXHJcbiAgICAgICAgaWYgKG8ueCAhPSBudWxsKSBtYXRyaXguZSA9IG8ueFxyXG4gICAgICAgIGlmIChvLnkgIT0gbnVsbCkgbWF0cml4LmYgPSBvLnlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIG1hdHJpeClcclxuICB9XHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5GWCwge1xyXG4gIHRyYW5zZm9ybTogZnVuY3Rpb24obywgcmVsYXRpdmUpIHtcclxuICAgIC8vIGdldCB0YXJnZXQgaW4gY2FzZSBvZiB0aGUgZnggbW9kdWxlLCBvdGhlcndpc2UgcmVmZXJlbmNlIHRoaXNcclxuICAgIHZhciB0YXJnZXQgPSB0aGlzLnRhcmdldCgpXHJcbiAgICAgICwgbWF0cml4LCBiYm94XHJcblxyXG4gICAgLy8gYWN0IGFzIGEgZ2V0dGVyXHJcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnKSB7XHJcbiAgICAgIC8vIGdldCBjdXJyZW50IG1hdHJpeFxyXG4gICAgICBtYXRyaXggPSBuZXcgU1ZHLk1hdHJpeCh0YXJnZXQpLmV4dHJhY3QoKVxyXG5cclxuICAgICAgcmV0dXJuIHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG1hdHJpeFtvXSA6IG1hdHJpeFxyXG4gICAgfVxyXG5cclxuICAgIC8vIGVuc3VyZSByZWxhdGl2ZSBmbGFnXHJcbiAgICByZWxhdGl2ZSA9ICEhcmVsYXRpdmUgfHwgISFvLnJlbGF0aXZlXHJcblxyXG4gICAgLy8gYWN0IG9uIG1hdHJpeFxyXG4gICAgaWYgKG8uYSAhPSBudWxsKSB7XHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuTWF0cml4KG8pXHJcblxyXG4gICAgLy8gYWN0IG9uIHJvdGF0aW9uXHJcbiAgICB9IGVsc2UgaWYgKG8ucm90YXRpb24gIT0gbnVsbCkge1xyXG4gICAgICAvLyBlbnN1cmUgY2VudHJlIHBvaW50XHJcbiAgICAgIGVuc3VyZUNlbnRyZShvLCB0YXJnZXQpXHJcblxyXG4gICAgICAvLyBhcHBseSB0cmFuc2Zvcm1hdGlvblxyXG4gICAgICBtYXRyaXggPSBuZXcgU1ZHLlJvdGF0ZShvLnJvdGF0aW9uLCBvLmN4LCBvLmN5KVxyXG5cclxuICAgIC8vIGFjdCBvbiBzY2FsZVxyXG4gICAgfSBlbHNlIGlmIChvLnNjYWxlICE9IG51bGwgfHwgby5zY2FsZVggIT0gbnVsbCB8fCBvLnNjYWxlWSAhPSBudWxsKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBjZW50cmUgcG9pbnRcclxuICAgICAgZW5zdXJlQ2VudHJlKG8sIHRhcmdldClcclxuXHJcbiAgICAgIC8vIGVuc3VyZSBzY2FsZSB2YWx1ZXMgb24gYm90aCBheGVzXHJcbiAgICAgIG8uc2NhbGVYID0gby5zY2FsZSAhPSBudWxsID8gby5zY2FsZSA6IG8uc2NhbGVYICE9IG51bGwgPyBvLnNjYWxlWCA6IDFcclxuICAgICAgby5zY2FsZVkgPSBvLnNjYWxlICE9IG51bGwgPyBvLnNjYWxlIDogby5zY2FsZVkgIT0gbnVsbCA/IG8uc2NhbGVZIDogMVxyXG5cclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5TY2FsZShvLnNjYWxlWCwgby5zY2FsZVksIG8uY3gsIG8uY3kpXHJcblxyXG4gICAgLy8gYWN0IG9uIHNrZXdcclxuICAgIH0gZWxzZSBpZiAoby5za2V3WCAhPSBudWxsIHx8IG8uc2tld1kgIT0gbnVsbCkge1xyXG4gICAgICAvLyBlbnN1cmUgY2VudHJlIHBvaW50XHJcbiAgICAgIGVuc3VyZUNlbnRyZShvLCB0YXJnZXQpXHJcblxyXG4gICAgICAvLyBlbnN1cmUgc2tldyB2YWx1ZXMgb24gYm90aCBheGVzXHJcbiAgICAgIG8uc2tld1ggPSBvLnNrZXdYICE9IG51bGwgPyBvLnNrZXdYIDogMFxyXG4gICAgICBvLnNrZXdZID0gby5za2V3WSAhPSBudWxsID8gby5za2V3WSA6IDBcclxuXHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuU2tldyhvLnNrZXdYLCBvLnNrZXdZLCBvLmN4LCBvLmN5KVxyXG5cclxuICAgIC8vIGFjdCBvbiBmbGlwXHJcbiAgICB9IGVsc2UgaWYgKG8uZmxpcCkge1xyXG4gICAgICBpZihvLmZsaXAgPT0gJ3gnIHx8IG8uZmxpcCA9PSAneScpIHtcclxuICAgICAgICBvLm9mZnNldCA9IG8ub2Zmc2V0ID09IG51bGwgPyB0YXJnZXQuYmJveCgpWydjJyArIG8uZmxpcF0gOiBvLm9mZnNldFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKG8ub2Zmc2V0ID09IG51bGwpIHtcclxuICAgICAgICAgIGJib3ggPSB0YXJnZXQuYmJveCgpXHJcbiAgICAgICAgICBvLmZsaXAgPSBiYm94LmN4XHJcbiAgICAgICAgICBvLm9mZnNldCA9IGJib3guY3lcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgby5mbGlwID0gby5vZmZzZXRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuTWF0cml4KCkuZmxpcChvLmZsaXAsIG8ub2Zmc2V0KVxyXG5cclxuICAgIC8vIGFjdCBvbiB0cmFuc2xhdGVcclxuICAgIH0gZWxzZSBpZiAoby54ICE9IG51bGwgfHwgby55ICE9IG51bGwpIHtcclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5UcmFuc2xhdGUoby54LCBvLnkpXHJcbiAgICB9XHJcblxyXG4gICAgaWYoIW1hdHJpeCkgcmV0dXJuIHRoaXNcclxuXHJcbiAgICBtYXRyaXgucmVsYXRpdmUgPSByZWxhdGl2ZVxyXG5cclxuICAgIHRoaXMubGFzdCgpLnRyYW5zZm9ybXMucHVzaChtYXRyaXgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2NhbGxTdGFydCgpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIFJlc2V0IGFsbCB0cmFuc2Zvcm1hdGlvbnNcclxuICB1bnRyYW5zZm9ybTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBudWxsKVxyXG4gIH0sXHJcbiAgLy8gbWVyZ2UgdGhlIHdob2xlIHRyYW5zZm9ybWF0aW9uIGNoYWluIGludG8gb25lIG1hdHJpeCBhbmQgcmV0dXJucyBpdFxyXG4gIG1hdHJpeGlmeTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIG1hdHJpeCA9ICh0aGlzLmF0dHIoJ3RyYW5zZm9ybScpIHx8ICcnKVxyXG4gICAgICAvLyBzcGxpdCB0cmFuc2Zvcm1hdGlvbnNcclxuICAgICAgLnNwbGl0KFNWRy5yZWdleC50cmFuc2Zvcm1zKS5zbGljZSgwLC0xKS5tYXAoZnVuY3Rpb24oc3RyKXtcclxuICAgICAgICAvLyBnZW5lcmF0ZSBrZXkgPT4gdmFsdWUgcGFpcnNcclxuICAgICAgICB2YXIga3YgPSBzdHIudHJpbSgpLnNwbGl0KCcoJylcclxuICAgICAgICByZXR1cm4gW2t2WzBdLCBrdlsxXS5zcGxpdChTVkcucmVnZXguZGVsaW1pdGVyKS5tYXAoZnVuY3Rpb24oc3RyKXsgcmV0dXJuIHBhcnNlRmxvYXQoc3RyKSB9KV1cclxuICAgICAgfSlcclxuICAgICAgLy8gbWVyZ2UgZXZlcnkgdHJhbnNmb3JtYXRpb24gaW50byBvbmUgbWF0cml4XHJcbiAgICAgIC5yZWR1Y2UoZnVuY3Rpb24obWF0cml4LCB0cmFuc2Zvcm0pe1xyXG5cclxuICAgICAgICBpZih0cmFuc2Zvcm1bMF0gPT0gJ21hdHJpeCcpIHJldHVybiBtYXRyaXgubXVsdGlwbHkoYXJyYXlUb01hdHJpeCh0cmFuc2Zvcm1bMV0pKVxyXG4gICAgICAgIHJldHVybiBtYXRyaXhbdHJhbnNmb3JtWzBdXS5hcHBseShtYXRyaXgsIHRyYW5zZm9ybVsxXSlcclxuXHJcbiAgICAgIH0sIG5ldyBTVkcuTWF0cml4KCkpXHJcblxyXG4gICAgcmV0dXJuIG1hdHJpeFxyXG4gIH0sXHJcbiAgLy8gYWRkIGFuIGVsZW1lbnQgdG8gYW5vdGhlciBwYXJlbnQgd2l0aG91dCBjaGFuZ2luZyB0aGUgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9uIHRoZSBzY3JlZW5cclxuICB0b1BhcmVudDogZnVuY3Rpb24ocGFyZW50KSB7XHJcbiAgICBpZih0aGlzID09IHBhcmVudCkgcmV0dXJuIHRoaXNcclxuICAgIHZhciBjdG0gPSB0aGlzLnNjcmVlbkNUTSgpXHJcbiAgICB2YXIgcEN0bSA9IHBhcmVudC5zY3JlZW5DVE0oKS5pbnZlcnNlKClcclxuXHJcbiAgICB0aGlzLmFkZFRvKHBhcmVudCkudW50cmFuc2Zvcm0oKS50cmFuc2Zvcm0ocEN0bS5tdWx0aXBseShjdG0pKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfSxcclxuICAvLyBzYW1lIGFzIGFib3ZlIHdpdGggcGFyZW50IGVxdWFscyByb290LXN2Z1xyXG4gIHRvRG9jOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnRvUGFyZW50KHRoaXMuZG9jKCkpXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5UcmFuc2Zvcm1hdGlvbiA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBjcmVhdGU6IGZ1bmN0aW9uKHNvdXJjZSwgaW52ZXJzZWQpe1xyXG5cclxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIHR5cGVvZiBpbnZlcnNlZCAhPSAnYm9vbGVhbicpe1xyXG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuICAgIH1cclxuXHJcbiAgICBpZihBcnJheS5pc0FycmF5KHNvdXJjZSkpe1xyXG4gICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47ICsraSl7XHJcbiAgICAgICAgdGhpc1t0aGlzLmFyZ3VtZW50c1tpXV0gPSBzb3VyY2VbaV1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmKHR5cGVvZiBzb3VyY2UgPT0gJ29iamVjdCcpe1xyXG4gICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47ICsraSl7XHJcbiAgICAgICAgdGhpc1t0aGlzLmFyZ3VtZW50c1tpXV0gPSBzb3VyY2VbdGhpcy5hcmd1bWVudHNbaV1dXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmludmVyc2VkID0gZmFsc2VcclxuXHJcbiAgICBpZihpbnZlcnNlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgIHRoaXMuaW52ZXJzZWQgPSB0cnVlXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiwgZXh0ZW5kOiB7XHJcblxyXG4gICAgYXJndW1lbnRzOiBbXVxyXG4gICwgbWV0aG9kOiAnJ1xyXG5cclxuICAsIGF0OiBmdW5jdGlvbihwb3Mpe1xyXG5cclxuICAgICAgdmFyIHBhcmFtcyA9IFtdXHJcblxyXG4gICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47ICsraSl7XHJcbiAgICAgICAgcGFyYW1zLnB1c2godGhpc1t0aGlzLmFyZ3VtZW50c1tpXV0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBtID0gdGhpcy5fdW5kbyB8fCBuZXcgU1ZHLk1hdHJpeCgpXHJcblxyXG4gICAgICBtID0gbmV3IFNWRy5NYXRyaXgoKS5tb3JwaChTVkcuTWF0cml4LnByb3RvdHlwZVt0aGlzLm1ldGhvZF0uYXBwbHkobSwgcGFyYW1zKSkuYXQocG9zKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuaW52ZXJzZWQgPyBtLmludmVyc2UoKSA6IG1cclxuXHJcbiAgICB9XHJcblxyXG4gICwgdW5kbzogZnVuY3Rpb24obyl7XHJcbiAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKXtcclxuICAgICAgICBvW3RoaXMuYXJndW1lbnRzW2ldXSA9IHR5cGVvZiB0aGlzW3RoaXMuYXJndW1lbnRzW2ldXSA9PSAndW5kZWZpbmVkJyA/IDAgOiBvW3RoaXMuYXJndW1lbnRzW2ldXVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGUgbWV0aG9kIFNWRy5NYXRyaXguZXh0cmFjdCB3aGljaCB3YXMgdXNlZCBiZWZvcmUgY2FsbGluZyB0aGlzXHJcbiAgICAgIC8vIG1ldGhvZCB0byBvYnRhaW4gYSB2YWx1ZSBmb3IgdGhlIHBhcmFtZXRlciBvIGRvZXNuJ3QgcmV0dXJuIGEgY3ggYW5kXHJcbiAgICAgIC8vIGEgY3kgc28gd2UgdXNlIHRoZSBvbmVzIHRoYXQgd2VyZSBwcm92aWRlZCB0byB0aGlzIG9iamVjdCBhdCBpdHMgY3JlYXRpb25cclxuICAgICAgby5jeCA9IHRoaXMuY3hcclxuICAgICAgby5jeSA9IHRoaXMuY3lcclxuXHJcbiAgICAgIHRoaXMuX3VuZG8gPSBuZXcgU1ZHW2NhcGl0YWxpemUodGhpcy5tZXRob2QpXShvLCB0cnVlKS5hdCgxKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5UcmFuc2xhdGUgPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgcGFyZW50OiBTVkcuTWF0cml4XHJcbiwgaW5oZXJpdDogU1ZHLlRyYW5zZm9ybWF0aW9uXHJcblxyXG4sIGNyZWF0ZTogZnVuY3Rpb24oc291cmNlLCBpbnZlcnNlZCl7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuICB9XHJcblxyXG4sIGV4dGVuZDoge1xyXG4gICAgYXJndW1lbnRzOiBbJ3RyYW5zZm9ybWVkWCcsICd0cmFuc2Zvcm1lZFknXVxyXG4gICwgbWV0aG9kOiAndHJhbnNsYXRlJ1xyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuUm90YXRlID0gU1ZHLmludmVudCh7XHJcblxyXG4gIHBhcmVudDogU1ZHLk1hdHJpeFxyXG4sIGluaGVyaXQ6IFNWRy5UcmFuc2Zvcm1hdGlvblxyXG5cclxuLCBjcmVhdGU6IGZ1bmN0aW9uKHNvdXJjZSwgaW52ZXJzZWQpe1xyXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgfVxyXG5cclxuLCBleHRlbmQ6IHtcclxuICAgIGFyZ3VtZW50czogWydyb3RhdGlvbicsICdjeCcsICdjeSddXHJcbiAgLCBtZXRob2Q6ICdyb3RhdGUnXHJcbiAgLCBhdDogZnVuY3Rpb24ocG9zKXtcclxuICAgICAgdmFyIG0gPSBuZXcgU1ZHLk1hdHJpeCgpLnJvdGF0ZShuZXcgU1ZHLk51bWJlcigpLm1vcnBoKHRoaXMucm90YXRpb24gLSAodGhpcy5fdW5kbyA/IHRoaXMuX3VuZG8ucm90YXRpb24gOiAwKSkuYXQocG9zKSwgdGhpcy5jeCwgdGhpcy5jeSlcclxuICAgICAgcmV0dXJuIHRoaXMuaW52ZXJzZWQgPyBtLmludmVyc2UoKSA6IG1cclxuICAgIH1cclxuICAsIHVuZG86IGZ1bmN0aW9uKG8pe1xyXG4gICAgICB0aGlzLl91bmRvID0gb1xyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuU2NhbGUgPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgcGFyZW50OiBTVkcuTWF0cml4XHJcbiwgaW5oZXJpdDogU1ZHLlRyYW5zZm9ybWF0aW9uXHJcblxyXG4sIGNyZWF0ZTogZnVuY3Rpb24oc291cmNlLCBpbnZlcnNlZCl7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuICB9XHJcblxyXG4sIGV4dGVuZDoge1xyXG4gICAgYXJndW1lbnRzOiBbJ3NjYWxlWCcsICdzY2FsZVknLCAnY3gnLCAnY3knXVxyXG4gICwgbWV0aG9kOiAnc2NhbGUnXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5Ta2V3ID0gU1ZHLmludmVudCh7XHJcblxyXG4gIHBhcmVudDogU1ZHLk1hdHJpeFxyXG4sIGluaGVyaXQ6IFNWRy5UcmFuc2Zvcm1hdGlvblxyXG5cclxuLCBjcmVhdGU6IGZ1bmN0aW9uKHNvdXJjZSwgaW52ZXJzZWQpe1xyXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgfVxyXG5cclxuLCBleHRlbmQ6IHtcclxuICAgIGFyZ3VtZW50czogWydza2V3WCcsICdza2V3WScsICdjeCcsICdjeSddXHJcbiAgLCBtZXRob2Q6ICdza2V3J1xyXG4gIH1cclxuXHJcbn0pXHJcblxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIER5bmFtaWMgc3R5bGUgZ2VuZXJhdG9yXHJcbiAgc3R5bGU6IGZ1bmN0aW9uKHMsIHYpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcclxuICAgICAgLy8gZ2V0IGZ1bGwgc3R5bGVcclxuICAgICAgcmV0dXJuIHRoaXMubm9kZS5zdHlsZS5jc3NUZXh0IHx8ICcnXHJcblxyXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xyXG4gICAgICAvLyBhcHBseSBldmVyeSBzdHlsZSBpbmRpdmlkdWFsbHkgaWYgYW4gb2JqZWN0IGlzIHBhc3NlZFxyXG4gICAgICBpZiAodHlwZW9mIHMgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBmb3IgKHYgaW4gcykgdGhpcy5zdHlsZSh2LCBzW3ZdKVxyXG5cclxuICAgICAgfSBlbHNlIGlmIChTVkcucmVnZXguaXNDc3MudGVzdChzKSkge1xyXG4gICAgICAgIC8vIHBhcnNlIGNzcyBzdHJpbmdcclxuICAgICAgICBzID0gcy5zcGxpdCgvXFxzKjtcXHMqLylcclxuICAgICAgICAgIC8vIGZpbHRlciBvdXQgc3VmZml4IDsgYW5kIHN0dWZmIGxpa2UgOztcclxuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZSkgeyByZXR1cm4gISFlIH0pXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKGUpeyByZXR1cm4gZS5zcGxpdCgvXFxzKjpcXHMqLykgfSlcclxuXHJcbiAgICAgICAgLy8gYXBwbHkgZXZlcnkgZGVmaW5pdGlvbiBpbmRpdmlkdWFsbHlcclxuICAgICAgICB3aGlsZSAodiA9IHMucG9wKCkpIHtcclxuICAgICAgICAgIHRoaXMuc3R5bGUodlswXSwgdlsxXSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gYWN0IGFzIGEgZ2V0dGVyIGlmIHRoZSBmaXJzdCBhbmQgb25seSBhcmd1bWVudCBpcyBub3QgYW4gb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5zdHlsZVtjYW1lbENhc2UocyldXHJcbiAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5vZGUuc3R5bGVbY2FtZWxDYXNlKHMpXSA9IHYgPT09IG51bGwgfHwgU1ZHLnJlZ2V4LmlzQmxhbmsudGVzdCh2KSA/ICcnIDogdlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59KVxuU1ZHLlBhcmVudCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIGVsZW1lbnQpXHJcbiAgfVxyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuRWxlbWVudFxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gUmV0dXJucyBhbGwgY2hpbGQgZWxlbWVudHNcclxuICAgIGNoaWxkcmVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFNWRy51dGlscy5tYXAoU1ZHLnV0aWxzLmZpbHRlclNWR0VsZW1lbnRzKHRoaXMubm9kZS5jaGlsZE5vZGVzKSwgZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgIHJldHVybiBTVkcuYWRvcHQobm9kZSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIC8vIEFkZCBnaXZlbiBlbGVtZW50IGF0IGEgcG9zaXRpb25cclxuICAsIGFkZDogZnVuY3Rpb24oZWxlbWVudCwgaSkge1xyXG4gICAgICBpZiAoaSA9PSBudWxsKVxyXG4gICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChlbGVtZW50Lm5vZGUpXHJcbiAgICAgIGVsc2UgaWYgKGVsZW1lbnQubm9kZSAhPSB0aGlzLm5vZGUuY2hpbGROb2Rlc1tpXSlcclxuICAgICAgICB0aGlzLm5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQubm9kZSwgdGhpcy5ub2RlLmNoaWxkTm9kZXNbaV0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gQmFzaWNhbGx5IGRvZXMgdGhlIHNhbWUgYXMgYGFkZCgpYCBidXQgcmV0dXJucyB0aGUgYWRkZWQgZWxlbWVudCBpbnN0ZWFkXHJcbiAgLCBwdXQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGkpIHtcclxuICAgICAgdGhpcy5hZGQoZWxlbWVudCwgaSlcclxuICAgICAgcmV0dXJuIGVsZW1lbnRcclxuICAgIH1cclxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGNoaWxkXHJcbiAgLCBoYXM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgoZWxlbWVudCkgPj0gMFxyXG4gICAgfVxyXG4gICAgLy8gR2V0cyBpbmRleCBvZiBnaXZlbiBlbGVtZW50XHJcbiAgLCBpbmRleDogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLm5vZGUuY2hpbGROb2RlcykuaW5kZXhPZihlbGVtZW50Lm5vZGUpXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgYSBlbGVtZW50IGF0IHRoZSBnaXZlbiBpbmRleFxyXG4gICwgZ2V0OiBmdW5jdGlvbihpKSB7XHJcbiAgICAgIHJldHVybiBTVkcuYWRvcHQodGhpcy5ub2RlLmNoaWxkTm9kZXNbaV0pXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgZmlyc3QgY2hpbGRcclxuICAsIGZpcnN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KDApXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgdGhlIGxhc3QgY2hpbGRcclxuICAsIGxhc3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy5ub2RlLmNoaWxkTm9kZXMubGVuZ3RoIC0gMSlcclxuICAgIH1cclxuICAgIC8vIEl0ZXJhdGVzIG92ZXIgYWxsIGNoaWxkcmVuIGFuZCBpbnZva2VzIGEgZ2l2ZW4gYmxvY2tcclxuICAsIGVhY2g6IGZ1bmN0aW9uKGJsb2NrLCBkZWVwKSB7XHJcbiAgICAgIHZhciBpLCBpbFxyXG4gICAgICAgICwgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKClcclxuXHJcbiAgICAgIGZvciAoaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xyXG4gICAgICAgIGlmIChjaGlsZHJlbltpXSBpbnN0YW5jZW9mIFNWRy5FbGVtZW50KVxyXG4gICAgICAgICAgYmxvY2suYXBwbHkoY2hpbGRyZW5baV0sIFtpLCBjaGlsZHJlbl0pXHJcblxyXG4gICAgICAgIGlmIChkZWVwICYmIChjaGlsZHJlbltpXSBpbnN0YW5jZW9mIFNWRy5Db250YWluZXIpKVxyXG4gICAgICAgICAgY2hpbGRyZW5baV0uZWFjaChibG9jaywgZGVlcClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIFJlbW92ZSBhIGdpdmVuIGNoaWxkXHJcbiAgLCByZW1vdmVFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZChlbGVtZW50Lm5vZGUpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGFsbCBlbGVtZW50cyBpbiB0aGlzIGNvbnRhaW5lclxyXG4gICwgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyByZW1vdmUgY2hpbGRyZW5cclxuICAgICAgd2hpbGUodGhpcy5ub2RlLmhhc0NoaWxkTm9kZXMoKSlcclxuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlLmxhc3RDaGlsZClcclxuXHJcbiAgICAgIC8vIHJlbW92ZSBkZWZzIHJlZmVyZW5jZVxyXG4gICAgICBkZWxldGUgdGhpcy5fZGVmc1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAsIC8vIEdldCBkZWZzXHJcbiAgICBkZWZzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZG9jKCkuZGVmcygpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXG5TVkcuZXh0ZW5kKFNWRy5QYXJlbnQsIHtcclxuXHJcbiAgdW5ncm91cDogZnVuY3Rpb24ocGFyZW50LCBkZXB0aCkge1xyXG4gICAgaWYoZGVwdGggPT09IDAgfHwgdGhpcyBpbnN0YW5jZW9mIFNWRy5EZWZzIHx8IHRoaXMubm9kZSA9PSBTVkcucGFyc2VyLmRyYXcpIHJldHVybiB0aGlzXHJcblxyXG4gICAgcGFyZW50ID0gcGFyZW50IHx8ICh0aGlzIGluc3RhbmNlb2YgU1ZHLkRvYyA/IHRoaXMgOiB0aGlzLnBhcmVudChTVkcuUGFyZW50KSlcclxuICAgIGRlcHRoID0gZGVwdGggfHwgSW5maW5pdHlcclxuXHJcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIFNWRy5EZWZzKSByZXR1cm4gdGhpc1xyXG4gICAgICBpZih0aGlzIGluc3RhbmNlb2YgU1ZHLlBhcmVudCkgcmV0dXJuIHRoaXMudW5ncm91cChwYXJlbnQsIGRlcHRoLTEpXHJcbiAgICAgIHJldHVybiB0aGlzLnRvUGFyZW50KHBhcmVudClcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5ub2RlLmZpcnN0Q2hpbGQgfHwgdGhpcy5yZW1vdmUoKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfSxcclxuXHJcbiAgZmxhdHRlbjogZnVuY3Rpb24ocGFyZW50LCBkZXB0aCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5ncm91cChwYXJlbnQsIGRlcHRoKVxyXG4gIH1cclxuXHJcbn0pXG5TVkcuQ29udGFpbmVyID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZWxlbWVudClcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5QYXJlbnRcclxuXHJcbn0pXG5cclxuU1ZHLlZpZXdCb3ggPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihzb3VyY2UpIHtcclxuICAgIHZhciBpLCBiYXNlID0gWzAsIDAsIDAsIDBdXHJcblxyXG4gICAgdmFyIHgsIHksIHdpZHRoLCBoZWlnaHQsIGJveCwgdmlldywgd2UsIGhlXHJcbiAgICAgICwgd20gICA9IDEgLy8gd2lkdGggbXVsdGlwbGllclxyXG4gICAgICAsIGhtICAgPSAxIC8vIGhlaWdodCBtdWx0aXBsaWVyXHJcbiAgICAgICwgcmVnICA9IC9bKy1dPyg/OlxcZCsoPzpcXC5cXGQqKT98XFwuXFxkKykoPzplWystXT9cXGQrKT8vZ2lcclxuXHJcbiAgICBpZihzb3VyY2UgaW5zdGFuY2VvZiBTVkcuRWxlbWVudCl7XHJcblxyXG4gICAgICB3ZSA9IHNvdXJjZVxyXG4gICAgICBoZSA9IHNvdXJjZVxyXG4gICAgICB2aWV3ID0gKHNvdXJjZS5hdHRyKCd2aWV3Qm94JykgfHwgJycpLm1hdGNoKHJlZylcclxuICAgICAgYm94ID0gc291cmNlLmJib3hcclxuXHJcbiAgICAgIC8vIGdldCBkaW1lbnNpb25zIG9mIGN1cnJlbnQgbm9kZVxyXG4gICAgICB3aWR0aCAgPSBuZXcgU1ZHLk51bWJlcihzb3VyY2Uud2lkdGgoKSlcclxuICAgICAgaGVpZ2h0ID0gbmV3IFNWRy5OdW1iZXIoc291cmNlLmhlaWdodCgpKVxyXG5cclxuICAgICAgLy8gZmluZCBuZWFyZXN0IG5vbi1wZXJjZW50dWFsIGRpbWVuc2lvbnNcclxuICAgICAgd2hpbGUgKHdpZHRoLnVuaXQgPT0gJyUnKSB7XHJcbiAgICAgICAgd20gKj0gd2lkdGgudmFsdWVcclxuICAgICAgICB3aWR0aCA9IG5ldyBTVkcuTnVtYmVyKHdlIGluc3RhbmNlb2YgU1ZHLkRvYyA/IHdlLnBhcmVudCgpLm9mZnNldFdpZHRoIDogd2UucGFyZW50KCkud2lkdGgoKSlcclxuICAgICAgICB3ZSA9IHdlLnBhcmVudCgpXHJcbiAgICAgIH1cclxuICAgICAgd2hpbGUgKGhlaWdodC51bml0ID09ICclJykge1xyXG4gICAgICAgIGhtICo9IGhlaWdodC52YWx1ZVxyXG4gICAgICAgIGhlaWdodCA9IG5ldyBTVkcuTnVtYmVyKGhlIGluc3RhbmNlb2YgU1ZHLkRvYyA/IGhlLnBhcmVudCgpLm9mZnNldEhlaWdodCA6IGhlLnBhcmVudCgpLmhlaWdodCgpKVxyXG4gICAgICAgIGhlID0gaGUucGFyZW50KClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZW5zdXJlIGRlZmF1bHRzXHJcbiAgICAgIHRoaXMueCAgICAgID0gMFxyXG4gICAgICB0aGlzLnkgICAgICA9IDBcclxuICAgICAgdGhpcy53aWR0aCAgPSB3aWR0aCAgKiB3bVxyXG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCAqIGhtXHJcbiAgICAgIHRoaXMuem9vbSAgID0gMVxyXG5cclxuICAgICAgaWYgKHZpZXcpIHtcclxuICAgICAgICAvLyBnZXQgd2lkdGggYW5kIGhlaWdodCBmcm9tIHZpZXdib3hcclxuICAgICAgICB4ICAgICAgPSBwYXJzZUZsb2F0KHZpZXdbMF0pXHJcbiAgICAgICAgeSAgICAgID0gcGFyc2VGbG9hdCh2aWV3WzFdKVxyXG4gICAgICAgIHdpZHRoICA9IHBhcnNlRmxvYXQodmlld1syXSlcclxuICAgICAgICBoZWlnaHQgPSBwYXJzZUZsb2F0KHZpZXdbM10pXHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB6b29tIGFjY29yaW5nIHRvIHZpZXdib3hcclxuICAgICAgICB0aGlzLnpvb20gPSAoKHRoaXMud2lkdGggLyB0aGlzLmhlaWdodCkgPiAod2lkdGggLyBoZWlnaHQpKSA/XHJcbiAgICAgICAgICB0aGlzLmhlaWdodCAvIGhlaWdodCA6XHJcbiAgICAgICAgICB0aGlzLndpZHRoICAvIHdpZHRoXHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByZWFsIHBpeGVsIGRpbWVuc2lvbnMgb24gcGFyZW50IFNWRy5Eb2MgZWxlbWVudFxyXG4gICAgICAgIHRoaXMueCAgICAgID0geFxyXG4gICAgICAgIHRoaXMueSAgICAgID0geVxyXG4gICAgICAgIHRoaXMud2lkdGggID0gd2lkdGhcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH1lbHNle1xyXG5cclxuICAgICAgLy8gZW5zdXJlIHNvdXJjZSBhcyBvYmplY3RcclxuICAgICAgc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgP1xyXG4gICAgICAgIHNvdXJjZS5tYXRjaChyZWcpLm1hcChmdW5jdGlvbihlbCl7IHJldHVybiBwYXJzZUZsb2F0KGVsKSB9KSA6XHJcbiAgICAgIEFycmF5LmlzQXJyYXkoc291cmNlKSA/XHJcbiAgICAgICAgc291cmNlIDpcclxuICAgICAgdHlwZW9mIHNvdXJjZSA9PSAnb2JqZWN0JyA/XHJcbiAgICAgICAgW3NvdXJjZS54LCBzb3VyY2UueSwgc291cmNlLndpZHRoLCBzb3VyY2UuaGVpZ2h0XSA6XHJcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT0gNCA/XHJcbiAgICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpIDpcclxuICAgICAgICBiYXNlXHJcblxyXG4gICAgICB0aGlzLnggPSBzb3VyY2VbMF1cclxuICAgICAgdGhpcy55ID0gc291cmNlWzFdXHJcbiAgICAgIHRoaXMud2lkdGggPSBzb3VyY2VbMl1cclxuICAgICAgdGhpcy5oZWlnaHQgPSBzb3VyY2VbM11cclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbiwgZXh0ZW5kOiB7XHJcblxyXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy54ICsgJyAnICsgdGhpcy55ICsgJyAnICsgdGhpcy53aWR0aCArICcgJyArIHRoaXMuaGVpZ2h0XHJcbiAgICB9XHJcbiAgLCBtb3JwaDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgU1ZHLlZpZXdCb3goeCwgeSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgLCBhdDogZnVuY3Rpb24ocG9zKSB7XHJcblxyXG4gICAgICBpZighdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLlZpZXdCb3goW1xyXG4gICAgICAgICAgdGhpcy54ICsgKHRoaXMuZGVzdGluYXRpb24ueCAtIHRoaXMueCkgKiBwb3NcclxuICAgICAgICAsIHRoaXMueSArICh0aGlzLmRlc3RpbmF0aW9uLnkgLSB0aGlzLnkpICogcG9zXHJcbiAgICAgICAgLCB0aGlzLndpZHRoICsgKHRoaXMuZGVzdGluYXRpb24ud2lkdGggLSB0aGlzLndpZHRoKSAqIHBvc1xyXG4gICAgICAgICwgdGhpcy5oZWlnaHQgKyAodGhpcy5kZXN0aW5hdGlvbi5oZWlnaHQgLSB0aGlzLmhlaWdodCkgKiBwb3NcclxuICAgICAgXSlcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gRGVmaW5lIHBhcmVudFxyXG4sIHBhcmVudDogU1ZHLkNvbnRhaW5lclxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG5cclxuICAgIC8vIGdldC9zZXQgdmlld2JveFxyXG4gICAgdmlld2JveDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIC8vIGFjdCBhcyBhIGdldHRlciBpZiB0aGVyZSBhcmUgbm8gYXJndW1lbnRzXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTVkcuVmlld0JveCh0aGlzKVxyXG5cclxuICAgICAgLy8gb3RoZXJ3aXNlIGFjdCBhcyBhIHNldHRlclxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd2aWV3Qm94JywgbmV3IFNWRy5WaWV3Qm94KHgsIHksIHdpZHRoLCBoZWlnaHQpKVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59KVxuLy8gQWRkIGV2ZW50cyB0byBlbGVtZW50c1xyXG47WyAgJ2NsaWNrJ1xyXG4gICwgJ2RibGNsaWNrJ1xyXG4gICwgJ21vdXNlZG93bidcclxuICAsICdtb3VzZXVwJ1xyXG4gICwgJ21vdXNlb3ZlcidcclxuICAsICdtb3VzZW91dCdcclxuICAsICdtb3VzZW1vdmUnXHJcbiAgLy8gLCAnbW91c2VlbnRlcicgLT4gbm90IHN1cHBvcnRlZCBieSBJRVxyXG4gIC8vICwgJ21vdXNlbGVhdmUnIC0+IG5vdCBzdXBwb3J0ZWQgYnkgSUVcclxuICAsICd0b3VjaHN0YXJ0J1xyXG4gICwgJ3RvdWNobW92ZSdcclxuICAsICd0b3VjaGxlYXZlJ1xyXG4gICwgJ3RvdWNoZW5kJ1xyXG4gICwgJ3RvdWNoY2FuY2VsJyBdLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgLy8gYWRkIGV2ZW50IHRvIFNWRy5FbGVtZW50XHJcbiAgU1ZHLkVsZW1lbnQucHJvdG90eXBlW2V2ZW50XSA9IGZ1bmN0aW9uKGYpIHtcclxuICAgIC8vIGJpbmQgZXZlbnQgdG8gZWxlbWVudCByYXRoZXIgdGhhbiBlbGVtZW50IG5vZGVcclxuICAgIFNWRy5vbih0aGlzLm5vZGUsIGV2ZW50LCBmKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn0pXHJcblxyXG4vLyBJbml0aWFsaXplIGxpc3RlbmVycyBzdGFja1xyXG5TVkcubGlzdGVuZXJzID0gW11cclxuU1ZHLmhhbmRsZXJNYXAgPSBbXVxyXG5TVkcubGlzdGVuZXJJZCA9IDBcclxuXHJcbi8vIEFkZCBldmVudCBiaW5kZXIgaW4gdGhlIFNWRyBuYW1lc3BhY2VcclxuU1ZHLm9uID0gZnVuY3Rpb24obm9kZSwgZXZlbnQsIGxpc3RlbmVyLCBiaW5kaW5nLCBvcHRpb25zKSB7XHJcbiAgLy8gY3JlYXRlIGxpc3RlbmVyLCBnZXQgb2JqZWN0LWluZGV4XHJcbiAgdmFyIGwgICAgID0gbGlzdGVuZXIuYmluZChiaW5kaW5nIHx8IG5vZGUuaW5zdGFuY2UgfHwgbm9kZSlcclxuICAgICwgaW5kZXggPSAoU1ZHLmhhbmRsZXJNYXAuaW5kZXhPZihub2RlKSArIDEgfHwgU1ZHLmhhbmRsZXJNYXAucHVzaChub2RlKSkgLSAxXHJcbiAgICAsIGV2ICAgID0gZXZlbnQuc3BsaXQoJy4nKVswXVxyXG4gICAgLCBucyAgICA9IGV2ZW50LnNwbGl0KCcuJylbMV0gfHwgJyonXHJcblxyXG5cclxuICAvLyBlbnN1cmUgdmFsaWQgb2JqZWN0XHJcbiAgU1ZHLmxpc3RlbmVyc1tpbmRleF0gICAgICAgICA9IFNWRy5saXN0ZW5lcnNbaW5kZXhdICAgICAgICAgfHwge31cclxuICBTVkcubGlzdGVuZXJzW2luZGV4XVtldl0gICAgID0gU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdICAgICB8fCB7fVxyXG4gIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XVtuc10gPSBTVkcubGlzdGVuZXJzW2luZGV4XVtldl1bbnNdIHx8IHt9XHJcblxyXG4gIGlmKCFsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkKVxyXG4gICAgbGlzdGVuZXIuX3N2Z2pzTGlzdGVuZXJJZCA9ICsrU1ZHLmxpc3RlbmVySWRcclxuXHJcbiAgLy8gcmVmZXJlbmNlIGxpc3RlbmVyXHJcbiAgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zXVtsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkXSA9IGxcclxuXHJcbiAgLy8gYWRkIGxpc3RlbmVyXHJcbiAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2LCBsLCBvcHRpb25zIHx8IGZhbHNlKVxyXG59XHJcblxyXG4vLyBBZGQgZXZlbnQgdW5iaW5kZXIgaW4gdGhlIFNWRyBuYW1lc3BhY2VcclxuU1ZHLm9mZiA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50LCBsaXN0ZW5lcikge1xyXG4gIHZhciBpbmRleCA9IFNWRy5oYW5kbGVyTWFwLmluZGV4T2Yobm9kZSlcclxuICAgICwgZXYgICAgPSBldmVudCAmJiBldmVudC5zcGxpdCgnLicpWzBdXHJcbiAgICAsIG5zICAgID0gZXZlbnQgJiYgZXZlbnQuc3BsaXQoJy4nKVsxXVxyXG4gICAgLCBuYW1lc3BhY2UgPSAnJ1xyXG5cclxuICBpZihpbmRleCA9PSAtMSkgcmV0dXJuXHJcblxyXG4gIGlmIChsaXN0ZW5lcikge1xyXG4gICAgaWYodHlwZW9mIGxpc3RlbmVyID09ICdmdW5jdGlvbicpIGxpc3RlbmVyID0gbGlzdGVuZXIuX3N2Z2pzTGlzdGVuZXJJZFxyXG4gICAgaWYoIWxpc3RlbmVyKSByZXR1cm5cclxuXHJcbiAgICAvLyByZW1vdmUgbGlzdGVuZXIgcmVmZXJlbmNlXHJcbiAgICBpZiAoU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdICYmIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XVtucyB8fCAnKiddKSB7XHJcbiAgICAgIC8vIHJlbW92ZSBsaXN0ZW5lclxyXG4gICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXYsIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XVtucyB8fCAnKiddW2xpc3RlbmVyXSwgZmFsc2UpXHJcblxyXG4gICAgICBkZWxldGUgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zIHx8ICcqJ11bbGlzdGVuZXJdXHJcbiAgICB9XHJcblxyXG4gIH0gZWxzZSBpZiAobnMgJiYgZXYpIHtcclxuICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciBhIG5hbWVzcGFjZWQgZXZlbnRcclxuICAgIGlmIChTVkcubGlzdGVuZXJzW2luZGV4XVtldl0gJiYgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zXSkge1xyXG4gICAgICBmb3IgKGxpc3RlbmVyIGluIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XVtuc10pXHJcbiAgICAgICAgU1ZHLm9mZihub2RlLCBbZXYsIG5zXS5qb2luKCcuJyksIGxpc3RlbmVyKVxyXG5cclxuICAgICAgZGVsZXRlIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XVtuc11cclxuICAgIH1cclxuXHJcbiAgfSBlbHNlIGlmIChucyl7XHJcbiAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgYSBzcGVjaWZpYyBuYW1lc3BhY2VcclxuICAgIGZvcihldmVudCBpbiBTVkcubGlzdGVuZXJzW2luZGV4XSl7XHJcbiAgICAgICAgZm9yKG5hbWVzcGFjZSBpbiBTVkcubGlzdGVuZXJzW2luZGV4XVtldmVudF0pe1xyXG4gICAgICAgICAgICBpZihucyA9PT0gbmFtZXNwYWNlKXtcclxuICAgICAgICAgICAgICAgIFNWRy5vZmYobm9kZSwgW2V2ZW50LCBuc10uam9pbignLicpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9IGVsc2UgaWYgKGV2KSB7XHJcbiAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50XHJcbiAgICBpZiAoU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdKSB7XHJcbiAgICAgIGZvciAobmFtZXNwYWNlIGluIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XSlcclxuICAgICAgICBTVkcub2ZmKG5vZGUsIFtldiwgbmFtZXNwYWNlXS5qb2luKCcuJykpXHJcblxyXG4gICAgICBkZWxldGUgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdXHJcbiAgICB9XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVycyBvbiBhIGdpdmVuIG5vZGVcclxuICAgIGZvciAoZXZlbnQgaW4gU1ZHLmxpc3RlbmVyc1tpbmRleF0pXHJcbiAgICAgIFNWRy5vZmYobm9kZSwgZXZlbnQpXHJcblxyXG4gICAgZGVsZXRlIFNWRy5saXN0ZW5lcnNbaW5kZXhdXHJcbiAgICBkZWxldGUgU1ZHLmhhbmRsZXJNYXBbaW5kZXhdXHJcblxyXG4gIH1cclxufVxyXG5cclxuLy9cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIEJpbmQgZ2l2ZW4gZXZlbnQgdG8gbGlzdGVuZXJcclxuICBvbjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyLCBiaW5kaW5nLCBvcHRpb25zKSB7XHJcbiAgICBTVkcub24odGhpcy5ub2RlLCBldmVudCwgbGlzdGVuZXIsIGJpbmRpbmcsIG9wdGlvbnMpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gVW5iaW5kIGV2ZW50IGZyb20gbGlzdGVuZXJcclxuLCBvZmY6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xyXG4gICAgU1ZHLm9mZih0aGlzLm5vZGUsIGV2ZW50LCBsaXN0ZW5lcilcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBGaXJlIGdpdmVuIGV2ZW50XHJcbiwgZmlyZTogZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcclxuXHJcbiAgICAvLyBEaXNwYXRjaCBldmVudFxyXG4gICAgaWYoZXZlbnQgaW5zdGFuY2VvZiB3aW5kb3cuRXZlbnQpe1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQgPSBuZXcgd2luZG93LkN1c3RvbUV2ZW50KGV2ZW50LCB7ZGV0YWlsOmRhdGEsIGNhbmNlbGFibGU6IHRydWV9KSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9ldmVudCA9IGV2ZW50XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuLCBldmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRcclxuICB9XHJcbn0pXHJcblxuXHJcblNWRy5EZWZzID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnZGVmcydcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxufSlcblNWRy5HID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnZydcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gTW92ZSBvdmVyIHgtYXhpc1xyXG4gICAgeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy50cmFuc2Zvcm0oJ3gnKSA6IHRoaXMudHJhbnNmb3JtKHsgeDogeCAtIHRoaXMueCgpIH0sIHRydWUpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIG92ZXIgeS1heGlzXHJcbiAgLCB5OiBmdW5jdGlvbih5KSB7XHJcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLnRyYW5zZm9ybSgneScpIDogdGhpcy50cmFuc2Zvcm0oeyB5OiB5IC0gdGhpcy55KCkgfSwgdHJ1ZSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeC1heGlzXHJcbiAgLCBjeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5nYm94KCkuY3ggOiB0aGlzLngoeCAtIHRoaXMuZ2JveCgpLndpZHRoIC8gMilcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeS1heGlzXHJcbiAgLCBjeTogZnVuY3Rpb24oeSkge1xyXG4gICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy5nYm94KCkuY3kgOiB0aGlzLnkoeSAtIHRoaXMuZ2JveCgpLmhlaWdodCAvIDIpXHJcbiAgICB9XHJcbiAgLCBnYm94OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIHZhciBiYm94ICA9IHRoaXMuYmJveCgpXHJcbiAgICAgICAgLCB0cmFucyA9IHRoaXMudHJhbnNmb3JtKClcclxuXHJcbiAgICAgIGJib3gueCAgKz0gdHJhbnMueFxyXG4gICAgICBiYm94LngyICs9IHRyYW5zLnhcclxuICAgICAgYmJveC5jeCArPSB0cmFucy54XHJcblxyXG4gICAgICBiYm94LnkgICs9IHRyYW5zLnlcclxuICAgICAgYmJveC55MiArPSB0cmFucy55XHJcbiAgICAgIGJib3guY3kgKz0gdHJhbnMueVxyXG5cclxuICAgICAgcmV0dXJuIGJib3hcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgYSBncm91cCBlbGVtZW50XHJcbiAgICBncm91cDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkcpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cbi8vICMjIyBUaGlzIG1vZHVsZSBhZGRzIGJhY2t3YXJkIC8gZm9yd2FyZCBmdW5jdGlvbmFsaXR5IHRvIGVsZW1lbnRzLlxyXG5cclxuLy9cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIEdldCBhbGwgc2libGluZ3MsIGluY2x1ZGluZyBteXNlbGZcclxuICBzaWJsaW5nczogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQoKS5jaGlsZHJlbigpXHJcbiAgfVxyXG4gIC8vIEdldCB0aGUgY3VyZW50IHBvc2l0aW9uIHNpYmxpbmdzXHJcbiwgcG9zaXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucGFyZW50KCkuaW5kZXgodGhpcylcclxuICB9XHJcbiAgLy8gR2V0IHRoZSBuZXh0IGVsZW1lbnQgKHdpbGwgcmV0dXJuIG51bGwgaWYgdGhlcmUgaXMgbm9uZSlcclxuLCBuZXh0OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNpYmxpbmdzKClbdGhpcy5wb3NpdGlvbigpICsgMV1cclxuICB9XHJcbiAgLy8gR2V0IHRoZSBuZXh0IGVsZW1lbnQgKHdpbGwgcmV0dXJuIG51bGwgaWYgdGhlcmUgaXMgbm9uZSlcclxuLCBwcmV2aW91czogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zaWJsaW5ncygpW3RoaXMucG9zaXRpb24oKSAtIDFdXHJcbiAgfVxyXG4gIC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBvbmUgc3RlcCBmb3J3YXJkXHJcbiwgZm9yd2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKSArIDFcclxuICAgICAgLCBwID0gdGhpcy5wYXJlbnQoKVxyXG5cclxuICAgIC8vIG1vdmUgbm9kZSBvbmUgc3RlcCBmb3J3YXJkXHJcbiAgICBwLnJlbW92ZUVsZW1lbnQodGhpcykuYWRkKHRoaXMsIGkpXHJcblxyXG4gICAgLy8gbWFrZSBzdXJlIGRlZnMgbm9kZSBpcyBhbHdheXMgYXQgdGhlIHRvcFxyXG4gICAgaWYgKHAgaW5zdGFuY2VvZiBTVkcuRG9jKVxyXG4gICAgICBwLm5vZGUuYXBwZW5kQ2hpbGQocC5kZWZzKCkubm9kZSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBTZW5kIGdpdmVuIGVsZW1lbnQgb25lIHN0ZXAgYmFja3dhcmRcclxuLCBiYWNrd2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKVxyXG5cclxuICAgIGlmIChpID4gMClcclxuICAgICAgdGhpcy5wYXJlbnQoKS5yZW1vdmVFbGVtZW50KHRoaXMpLmFkZCh0aGlzLCBpIC0gMSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBTZW5kIGdpdmVuIGVsZW1lbnQgYWxsIHRoZSB3YXkgdG8gdGhlIGZyb250XHJcbiwgZnJvbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHAgPSB0aGlzLnBhcmVudCgpXHJcblxyXG4gICAgLy8gTW92ZSBub2RlIGZvcndhcmRcclxuICAgIHAubm9kZS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpXHJcblxyXG4gICAgLy8gTWFrZSBzdXJlIGRlZnMgbm9kZSBpcyBhbHdheXMgYXQgdGhlIHRvcFxyXG4gICAgaWYgKHAgaW5zdGFuY2VvZiBTVkcuRG9jKVxyXG4gICAgICBwLm5vZGUuYXBwZW5kQ2hpbGQocC5kZWZzKCkubm9kZSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBTZW5kIGdpdmVuIGVsZW1lbnQgYWxsIHRoZSB3YXkgdG8gdGhlIGJhY2tcclxuLCBiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLnBvc2l0aW9uKCkgPiAwKVxyXG4gICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUVsZW1lbnQodGhpcykuYWRkKHRoaXMsIDApXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gSW5zZXJ0cyBhIGdpdmVuIGVsZW1lbnQgYmVmb3JlIHRoZSB0YXJnZXRlZCBlbGVtZW50XHJcbiwgYmVmb3JlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICBlbGVtZW50LnJlbW92ZSgpXHJcblxyXG4gICAgdmFyIGkgPSB0aGlzLnBvc2l0aW9uKClcclxuXHJcbiAgICB0aGlzLnBhcmVudCgpLmFkZChlbGVtZW50LCBpKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIEluc3RlcnMgYSBnaXZlbiBlbGVtZW50IGFmdGVyIHRoZSB0YXJnZXRlZCBlbGVtZW50XHJcbiwgYWZ0ZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQucmVtb3ZlKClcclxuXHJcbiAgICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKVxyXG5cclxuICAgIHRoaXMucGFyZW50KCkuYWRkKGVsZW1lbnQsIGkgKyAxKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxufSlcblNWRy5NYXNrID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCdtYXNrJykpXHJcblxyXG4gICAgLy8ga2VlcCByZWZlcmVuY2VzIHRvIG1hc2tlZCBlbGVtZW50c1xyXG4gICAgdGhpcy50YXJnZXRzID0gW11cclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5Db250YWluZXJcclxuXHJcbiAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIFVubWFzayBhbGwgbWFza2VkIGVsZW1lbnRzIGFuZCByZW1vdmUgaXRzZWxmXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyB1bm1hc2sgYWxsIHRhcmdldHNcclxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudGFyZ2V0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICBpZiAodGhpcy50YXJnZXRzW2ldKVxyXG4gICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnVubWFzaygpXHJcbiAgICAgIHRoaXMudGFyZ2V0cyA9IFtdXHJcblxyXG4gICAgICAvLyByZW1vdmUgbWFzayBmcm9tIHBhcmVudFxyXG4gICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUVsZW1lbnQodGhpcylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIG1hc2tpbmcgZWxlbWVudFxyXG4gICAgbWFzazogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5wdXQobmV3IFNWRy5NYXNrKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gRGlzdHJpYnV0ZSBtYXNrIHRvIHN2ZyBlbGVtZW50XHJcbiAgbWFza1dpdGg6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIC8vIHVzZSBnaXZlbiBtYXNrIG9yIGNyZWF0ZSBhIG5ldyBvbmVcclxuICAgIHRoaXMubWFza2VyID0gZWxlbWVudCBpbnN0YW5jZW9mIFNWRy5NYXNrID8gZWxlbWVudCA6IHRoaXMucGFyZW50KCkubWFzaygpLmFkZChlbGVtZW50KVxyXG5cclxuICAgIC8vIHN0b3JlIHJldmVyZW5jZSBvbiBzZWxmIGluIG1hc2tcclxuICAgIHRoaXMubWFza2VyLnRhcmdldHMucHVzaCh0aGlzKVxyXG5cclxuICAgIC8vIGFwcGx5IG1hc2tcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ21hc2snLCAndXJsKFwiIycgKyB0aGlzLm1hc2tlci5hdHRyKCdpZCcpICsgJ1wiKScpXHJcbiAgfVxyXG4gIC8vIFVubWFzayBlbGVtZW50XHJcbiwgdW5tYXNrOiBmdW5jdGlvbigpIHtcclxuICAgIGRlbGV0ZSB0aGlzLm1hc2tlclxyXG4gICAgcmV0dXJuIHRoaXMuYXR0cignbWFzaycsIG51bGwpXHJcbiAgfVxyXG5cclxufSlcclxuXG5TVkcuQ2xpcFBhdGggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoJ2NsaXBQYXRoJykpXHJcblxyXG4gICAgLy8ga2VlcCByZWZlcmVuY2VzIHRvIGNsaXBwZWQgZWxlbWVudHNcclxuICAgIHRoaXMudGFyZ2V0cyA9IFtdXHJcbiAgfVxyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBVbmNsaXAgYWxsIGNsaXBwZWQgZWxlbWVudHMgYW5kIHJlbW92ZSBpdHNlbGZcclxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIHVuY2xpcCBhbGwgdGFyZ2V0c1xyXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldHNbaV0pXHJcbiAgICAgICAgICB0aGlzLnRhcmdldHNbaV0udW5jbGlwKClcclxuICAgICAgdGhpcy50YXJnZXRzID0gW11cclxuXHJcbiAgICAgIC8vIHJlbW92ZSBjbGlwUGF0aCBmcm9tIHBhcmVudFxyXG4gICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUVsZW1lbnQodGhpcylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGNsaXBwaW5nIGVsZW1lbnRcclxuICAgIGNsaXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5kZWZzKCkucHV0KG5ldyBTVkcuQ2xpcFBhdGgpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuLy9cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIERpc3RyaWJ1dGUgY2xpcFBhdGggdG8gc3ZnIGVsZW1lbnRcclxuICBjbGlwV2l0aDogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgLy8gdXNlIGdpdmVuIGNsaXAgb3IgY3JlYXRlIGEgbmV3IG9uZVxyXG4gICAgdGhpcy5jbGlwcGVyID0gZWxlbWVudCBpbnN0YW5jZW9mIFNWRy5DbGlwUGF0aCA/IGVsZW1lbnQgOiB0aGlzLnBhcmVudCgpLmNsaXAoKS5hZGQoZWxlbWVudClcclxuXHJcbiAgICAvLyBzdG9yZSByZXZlcmVuY2Ugb24gc2VsZiBpbiBtYXNrXHJcbiAgICB0aGlzLmNsaXBwZXIudGFyZ2V0cy5wdXNoKHRoaXMpXHJcblxyXG4gICAgLy8gYXBwbHkgbWFza1xyXG4gICAgcmV0dXJuIHRoaXMuYXR0cignY2xpcC1wYXRoJywgJ3VybChcIiMnICsgdGhpcy5jbGlwcGVyLmF0dHIoJ2lkJykgKyAnXCIpJylcclxuICB9XHJcbiAgLy8gVW5jbGlwIGVsZW1lbnRcclxuLCB1bmNsaXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgZGVsZXRlIHRoaXMuY2xpcHBlclxyXG4gICAgcmV0dXJuIHRoaXMuYXR0cignY2xpcC1wYXRoJywgbnVsbClcclxuICB9XHJcblxyXG59KVxuU1ZHLkdyYWRpZW50ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgU1ZHLmNyZWF0ZSh0eXBlICsgJ0dyYWRpZW50JykpXHJcblxyXG4gICAgLy8gc3RvcmUgdHlwZVxyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gIH1cclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gQWRkIGEgY29sb3Igc3RvcFxyXG4gICAgYXQ6IGZ1bmN0aW9uKG9mZnNldCwgY29sb3IsIG9wYWNpdHkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuU3RvcCkudXBkYXRlKG9mZnNldCwgY29sb3IsIG9wYWNpdHkpXHJcbiAgICB9XHJcbiAgICAvLyBVcGRhdGUgZ3JhZGllbnRcclxuICAsIHVwZGF0ZTogZnVuY3Rpb24oYmxvY2spIHtcclxuICAgICAgLy8gcmVtb3ZlIGFsbCBzdG9wc1xyXG4gICAgICB0aGlzLmNsZWFyKClcclxuXHJcbiAgICAgIC8vIGludm9rZSBwYXNzZWQgYmxvY2tcclxuICAgICAgaWYgKHR5cGVvZiBibG9jayA9PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgIGJsb2NrLmNhbGwodGhpcywgdGhpcylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm4gdGhlIGZpbGwgaWRcclxuICAsIGZpbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gJ3VybCgjJyArIHRoaXMuaWQoKSArICcpJ1xyXG4gICAgfVxyXG4gICAgLy8gQWxpYXMgc3RyaW5nIGNvbnZlcnRpb24gdG8gZmlsbFxyXG4gICwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5maWxsKClcclxuICAgIH1cclxuICAgIC8vIGN1c3RvbSBhdHRyIHRvIGhhbmRsZSB0cmFuc2Zvcm1cclxuICAsIGF0dHI6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcclxuICAgICAgaWYoYSA9PSAndHJhbnNmb3JtJykgYSA9ICdncmFkaWVudFRyYW5zZm9ybSdcclxuICAgICAgcmV0dXJuIFNWRy5Db250YWluZXIucHJvdG90eXBlLmF0dHIuY2FsbCh0aGlzLCBhLCBiLCBjKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBncmFkaWVudCBlbGVtZW50IGluIGRlZnNcclxuICAgIGdyYWRpZW50OiBmdW5jdGlvbih0eXBlLCBibG9jaykge1xyXG4gICAgICByZXR1cm4gdGhpcy5kZWZzKCkuZ3JhZGllbnQodHlwZSwgYmxvY2spXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuLy8gQWRkIGFuaW1hdGFibGUgbWV0aG9kcyB0byBib3RoIGdyYWRpZW50IGFuZCBmeCBtb2R1bGVcclxuU1ZHLmV4dGVuZChTVkcuR3JhZGllbnQsIFNWRy5GWCwge1xyXG4gIC8vIEZyb20gcG9zaXRpb25cclxuICBmcm9tOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICByZXR1cm4gKHRoaXMuX3RhcmdldCB8fCB0aGlzKS50eXBlID09ICdyYWRpYWwnID9cclxuICAgICAgdGhpcy5hdHRyKHsgZng6IG5ldyBTVkcuTnVtYmVyKHgpLCBmeTogbmV3IFNWRy5OdW1iZXIoeSkgfSkgOlxyXG4gICAgICB0aGlzLmF0dHIoeyB4MTogbmV3IFNWRy5OdW1iZXIoeCksIHkxOiBuZXcgU1ZHLk51bWJlcih5KSB9KVxyXG4gIH1cclxuICAvLyBUbyBwb3NpdGlvblxyXG4sIHRvOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICByZXR1cm4gKHRoaXMuX3RhcmdldCB8fCB0aGlzKS50eXBlID09ICdyYWRpYWwnID9cclxuICAgICAgdGhpcy5hdHRyKHsgY3g6IG5ldyBTVkcuTnVtYmVyKHgpLCBjeTogbmV3IFNWRy5OdW1iZXIoeSkgfSkgOlxyXG4gICAgICB0aGlzLmF0dHIoeyB4MjogbmV3IFNWRy5OdW1iZXIoeCksIHkyOiBuZXcgU1ZHLk51bWJlcih5KSB9KVxyXG4gIH1cclxufSlcclxuXHJcbi8vIEJhc2UgZ3JhZGllbnQgZ2VuZXJhdGlvblxyXG5TVkcuZXh0ZW5kKFNWRy5EZWZzLCB7XHJcbiAgLy8gZGVmaW5lIGdyYWRpZW50XHJcbiAgZ3JhZGllbnQ6IGZ1bmN0aW9uKHR5cGUsIGJsb2NrKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5HcmFkaWVudCh0eXBlKSkudXBkYXRlKGJsb2NrKVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuU3RvcCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ3N0b3AnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5FbGVtZW50XHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBhZGQgY29sb3Igc3RvcHNcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24obykge1xyXG4gICAgICBpZiAodHlwZW9mIG8gPT0gJ251bWJlcicgfHwgbyBpbnN0YW5jZW9mIFNWRy5OdW1iZXIpIHtcclxuICAgICAgICBvID0ge1xyXG4gICAgICAgICAgb2Zmc2V0OiAgYXJndW1lbnRzWzBdXHJcbiAgICAgICAgLCBjb2xvcjogICBhcmd1bWVudHNbMV1cclxuICAgICAgICAsIG9wYWNpdHk6IGFyZ3VtZW50c1syXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2V0IGF0dHJpYnV0ZXNcclxuICAgICAgaWYgKG8ub3BhY2l0eSAhPSBudWxsKSB0aGlzLmF0dHIoJ3N0b3Atb3BhY2l0eScsIG8ub3BhY2l0eSlcclxuICAgICAgaWYgKG8uY29sb3IgICAhPSBudWxsKSB0aGlzLmF0dHIoJ3N0b3AtY29sb3InLCBvLmNvbG9yKVxyXG4gICAgICBpZiAoby5vZmZzZXQgICE9IG51bGwpIHRoaXMuYXR0cignb2Zmc2V0JywgbmV3IFNWRy5OdW1iZXIoby5vZmZzZXQpKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cblNWRy5QYXR0ZXJuID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAncGF0dGVybidcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gUmV0dXJuIHRoZSBmaWxsIGlkXHJcbiAgICBmaWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuICd1cmwoIycgKyB0aGlzLmlkKCkgKyAnKSdcclxuICAgIH1cclxuICAgIC8vIFVwZGF0ZSBwYXR0ZXJuIGJ5IHJlYnVpbGRpbmdcclxuICAsIHVwZGF0ZTogZnVuY3Rpb24oYmxvY2spIHtcclxuICAgICAgLy8gcmVtb3ZlIGNvbnRlbnRcclxuICAgICAgdGhpcy5jbGVhcigpXHJcblxyXG4gICAgICAvLyBpbnZva2UgcGFzc2VkIGJsb2NrXHJcbiAgICAgIGlmICh0eXBlb2YgYmxvY2sgPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICBibG9jay5jYWxsKHRoaXMsIHRoaXMpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gQWxpYXMgc3RyaW5nIGNvbnZlcnRpb24gdG8gZmlsbFxyXG4gICwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5maWxsKClcclxuICAgIH1cclxuICAgIC8vIGN1c3RvbSBhdHRyIHRvIGhhbmRsZSB0cmFuc2Zvcm1cclxuICAsIGF0dHI6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcclxuICAgICAgaWYoYSA9PSAndHJhbnNmb3JtJykgYSA9ICdwYXR0ZXJuVHJhbnNmb3JtJ1xyXG4gICAgICByZXR1cm4gU1ZHLkNvbnRhaW5lci5wcm90b3R5cGUuYXR0ci5jYWxsKHRoaXMsIGEsIGIsIGMpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBwYXR0ZXJuIGVsZW1lbnQgaW4gZGVmc1xyXG4gICAgcGF0dGVybjogZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgYmxvY2spIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGVmcygpLnBhdHRlcm4od2lkdGgsIGhlaWdodCwgYmxvY2spXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRGVmcywge1xyXG4gIC8vIERlZmluZSBncmFkaWVudFxyXG4gIHBhdHRlcm46IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGJsb2NrKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5QYXR0ZXJuKS51cGRhdGUoYmxvY2spLmF0dHIoe1xyXG4gICAgICB4OiAgICAgICAgICAgIDBcclxuICAgICwgeTogICAgICAgICAgICAwXHJcbiAgICAsIHdpZHRoOiAgICAgICAgd2lkdGhcclxuICAgICwgaGVpZ2h0OiAgICAgICBoZWlnaHRcclxuICAgICwgcGF0dGVyblVuaXRzOiAndXNlclNwYWNlT25Vc2UnXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbn0pXG5TVkcuRG9jID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAvLyBlbnN1cmUgdGhlIHByZXNlbmNlIG9mIGEgZG9tIGVsZW1lbnRcclxuICAgICAgZWxlbWVudCA9IHR5cGVvZiBlbGVtZW50ID09ICdzdHJpbmcnID9cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KSA6XHJcbiAgICAgICAgZWxlbWVudFxyXG5cclxuICAgICAgLy8gSWYgdGhlIHRhcmdldCBpcyBhbiBzdmcgZWxlbWVudCwgdXNlIHRoYXQgZWxlbWVudCBhcyB0aGUgbWFpbiB3cmFwcGVyLlxyXG4gICAgICAvLyBUaGlzIGFsbG93cyBzdmcuanMgdG8gd29yayB3aXRoIHN2ZyBkb2N1bWVudHMgYXMgd2VsbC5cclxuICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT0gJ3N2ZycpIHtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZWxlbWVudClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgU1ZHLmNyZWF0ZSgnc3ZnJykpXHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpXHJcbiAgICAgICAgdGhpcy5zaXplKCcxMDAlJywgJzEwMCUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBzZXQgc3ZnIGVsZW1lbnQgYXR0cmlidXRlcyBhbmQgZW5zdXJlIGRlZnMgbm9kZVxyXG4gICAgICB0aGlzLm5hbWVzcGFjZSgpLmRlZnMoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gQWRkIG5hbWVzcGFjZXNcclxuICAgIG5hbWVzcGFjZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgLmF0dHIoeyB4bWxuczogU1ZHLm5zLCB2ZXJzaW9uOiAnMS4xJyB9KVxyXG4gICAgICAgIC5hdHRyKCd4bWxuczp4bGluaycsIFNWRy54bGluaywgU1ZHLnhtbG5zKVxyXG4gICAgICAgIC5hdHRyKCd4bWxuczpzdmdqcycsIFNWRy5zdmdqcywgU1ZHLnhtbG5zKVxyXG4gICAgfVxyXG4gICAgLy8gQ3JlYXRlcyBhbmQgcmV0dXJucyBkZWZzIGVsZW1lbnRcclxuICAsIGRlZnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoIXRoaXMuX2RlZnMpIHtcclxuICAgICAgICB2YXIgZGVmc1xyXG5cclxuICAgICAgICAvLyBGaW5kIG9yIGNyZWF0ZSBhIGRlZnMgZWxlbWVudCBpbiB0aGlzIGluc3RhbmNlXHJcbiAgICAgICAgaWYgKGRlZnMgPSB0aGlzLm5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RlZnMnKVswXSlcclxuICAgICAgICAgIHRoaXMuX2RlZnMgPSBTVkcuYWRvcHQoZGVmcylcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aGlzLl9kZWZzID0gbmV3IFNWRy5EZWZzXHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgZGVmcyBub2RlIGlzIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWNrXHJcbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHRoaXMuX2RlZnMubm9kZSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX2RlZnNcclxuICAgIH1cclxuICAgIC8vIGN1c3RvbSBwYXJlbnQgbWV0aG9kXHJcbiAgLCBwYXJlbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5ub2RlLnBhcmVudE5vZGUubm9kZU5hbWUgPT0gJyNkb2N1bWVudCcgPyBudWxsIDogdGhpcy5ub2RlLnBhcmVudE5vZGVcclxuICAgIH1cclxuICAgIC8vIEZpeCBmb3IgcG9zc2libGUgc3ViLXBpeGVsIG9mZnNldC4gU2VlOlxyXG4gICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjA4ODEyXHJcbiAgLCBzcG9mOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHBvcyA9IHRoaXMubm9kZS5nZXRTY3JlZW5DVE0oKVxyXG5cclxuICAgICAgaWYgKHBvcylcclxuICAgICAgICB0aGlzXHJcbiAgICAgICAgICAuc3R5bGUoJ2xlZnQnLCAoLXBvcy5lICUgMSkgKyAncHgnKVxyXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCAgKC1wb3MuZiAlIDEpICsgJ3B4JylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmVzIHRoZSBkb2MgZnJvbSB0aGUgRE9NXHJcbiAgLCByZW1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZih0aGlzLnBhcmVudCgpKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQoKS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgLCBjbGVhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIHJlbW92ZSBjaGlsZHJlblxyXG4gICAgICB3aGlsZSh0aGlzLm5vZGUuaGFzQ2hpbGROb2RlcygpKVxyXG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUubGFzdENoaWxkKVxyXG5cclxuICAgICAgLy8gcmVtb3ZlIGRlZnMgcmVmZXJlbmNlXHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9kZWZzXHJcblxyXG4gICAgICAvLyBhZGQgYmFjayBwYXJzZXJcclxuICAgICAgaWYoIVNWRy5wYXJzZXIuZHJhdy5wYXJlbnROb2RlKVxyXG4gICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChTVkcucGFyc2VyLmRyYXcpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxuU1ZHLlNoYXBlID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZWxlbWVudClcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5FbGVtZW50XHJcblxyXG59KVxuXHJcblNWRy5CYXJlID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCwgaW5oZXJpdCkge1xyXG4gICAgLy8gY29uc3RydWN0IGVsZW1lbnRcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKGVsZW1lbnQpKVxyXG5cclxuICAgIC8vIGluaGVyaXQgY3VzdG9tIG1ldGhvZHNcclxuICAgIGlmIChpbmhlcml0KVxyXG4gICAgICBmb3IgKHZhciBtZXRob2QgaW4gaW5oZXJpdC5wcm90b3R5cGUpXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbmhlcml0LnByb3RvdHlwZVttZXRob2RdID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgdGhpc1ttZXRob2RdID0gaW5oZXJpdC5wcm90b3R5cGVbbWV0aG9kXVxyXG4gIH1cclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkVsZW1lbnRcclxuXHJcbiAgLy8gQWRkIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIEluc2VydCBzb21lIHBsYWluIHRleHRcclxuICAgIHdvcmRzOiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIC8vIHJlbW92ZSBjb250ZW50c1xyXG4gICAgICB3aGlsZSAodGhpcy5ub2RlLmhhc0NoaWxkTm9kZXMoKSlcclxuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlLmxhc3RDaGlsZClcclxuXHJcbiAgICAgIC8vIGNyZWF0ZSB0ZXh0IG5vZGVcclxuICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5cclxuU1ZHLmV4dGVuZChTVkcuUGFyZW50LCB7XHJcbiAgLy8gQ3JlYXRlIGFuIGVsZW1lbnQgdGhhdCBpcyBub3QgZGVzY3JpYmVkIGJ5IFNWRy5qc1xyXG4gIGVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGluaGVyaXQpIHtcclxuICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkJhcmUoZWxlbWVudCwgaW5oZXJpdCkpXHJcbiAgfVxyXG59KVxyXG5cblNWRy5TeW1ib2wgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdzeW1ib2wnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5Db250YWluZXJcclxuXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBjcmVhdGUgc3ltYm9sXHJcbiAgICBzeW1ib2w6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5TeW1ib2wpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cblNWRy5Vc2UgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICd1c2UnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gVXNlIGVsZW1lbnQgYXMgYSByZWZlcmVuY2VcclxuICAgIGVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGZpbGUpIHtcclxuICAgICAgLy8gU2V0IGxpbmVkIGVsZW1lbnRcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignaHJlZicsIChmaWxlIHx8ICcnKSArICcjJyArIGVsZW1lbnQsIFNWRy54bGluaylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgYSB1c2UgZWxlbWVudFxyXG4gICAgdXNlOiBmdW5jdGlvbihlbGVtZW50LCBmaWxlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlVzZSkuZWxlbWVudChlbGVtZW50LCBmaWxlKVxyXG4gICAgfVxyXG4gIH1cclxufSlcblNWRy5SZWN0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAncmVjdCdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgYSByZWN0IGVsZW1lbnRcclxuICAgIHJlY3Q6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuUmVjdCgpKS5zaXplKHdpZHRoLCBoZWlnaHQpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxuU1ZHLkNpcmNsZSA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ2NpcmNsZSdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgY2lyY2xlIGVsZW1lbnQsIGJhc2VkIG9uIGVsbGlwc2VcclxuICAgIGNpcmNsZTogZnVuY3Rpb24oc2l6ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5DaXJjbGUpLnJ4KG5ldyBTVkcuTnVtYmVyKHNpemUpLmRpdmlkZSgyKSkubW92ZSgwLCAwKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkNpcmNsZSwgU1ZHLkZYLCB7XHJcbiAgLy8gUmFkaXVzIHggdmFsdWVcclxuICByeDogZnVuY3Rpb24ocngpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3InLCByeClcclxuICB9XHJcbiAgLy8gQWxpYXMgcmFkaXVzIHggdmFsdWVcclxuLCByeTogZnVuY3Rpb24ocnkpIHtcclxuICAgIHJldHVybiB0aGlzLnJ4KHJ5KVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5FbGxpcHNlID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnZWxsaXBzZSdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgYW4gZWxsaXBzZVxyXG4gICAgZWxsaXBzZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5FbGxpcHNlKS5zaXplKHdpZHRoLCBoZWlnaHQpLm1vdmUoMCwgMClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGxpcHNlLCBTVkcuUmVjdCwgU1ZHLkZYLCB7XHJcbiAgLy8gUmFkaXVzIHggdmFsdWVcclxuICByeDogZnVuY3Rpb24ocngpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3J4JywgcngpXHJcbiAgfVxyXG4gIC8vIFJhZGl1cyB5IHZhbHVlXHJcbiwgcnk6IGZ1bmN0aW9uKHJ5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCdyeScsIHJ5KVxyXG4gIH1cclxufSlcclxuXHJcbi8vIEFkZCBjb21tb24gbWV0aG9kXHJcblNWRy5leHRlbmQoU1ZHLkNpcmNsZSwgU1ZHLkVsbGlwc2UsIHtcclxuICAgIC8vIE1vdmUgb3ZlciB4LWF4aXNcclxuICAgIHg6IGZ1bmN0aW9uKHgpIHtcclxuICAgICAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMuY3goKSAtIHRoaXMucngoKSA6IHRoaXMuY3goeCArIHRoaXMucngoKSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcclxuICAsIHk6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuY3koKSAtIHRoaXMucnkoKSA6IHRoaXMuY3koeSArIHRoaXMucnkoKSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeC1heGlzXHJcbiAgLCBjeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5hdHRyKCdjeCcpIDogdGhpcy5hdHRyKCdjeCcsIHgpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIGJ5IGNlbnRlciBvdmVyIHktYXhpc1xyXG4gICwgY3k6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYXR0cignY3knKSA6IHRoaXMuYXR0cignY3knLCB5KVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcclxuICAsIHdpZHRoOiBmdW5jdGlvbih3aWR0aCkge1xyXG4gICAgICByZXR1cm4gd2lkdGggPT0gbnVsbCA/IHRoaXMucngoKSAqIDIgOiB0aGlzLnJ4KG5ldyBTVkcuTnVtYmVyKHdpZHRoKS5kaXZpZGUoMikpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcclxuICAsIGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XHJcbiAgICAgIHJldHVybiBoZWlnaHQgPT0gbnVsbCA/IHRoaXMucnkoKSAqIDIgOiB0aGlzLnJ5KG5ldyBTVkcuTnVtYmVyKGhlaWdodCkuZGl2aWRlKDIpKVxyXG4gICAgfVxyXG4gICAgLy8gQ3VzdG9tIHNpemUgZnVuY3Rpb25cclxuICAsIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgIC5yeChuZXcgU1ZHLk51bWJlcihwLndpZHRoKS5kaXZpZGUoMikpXHJcbiAgICAgICAgLnJ5KG5ldyBTVkcuTnVtYmVyKHAuaGVpZ2h0KS5kaXZpZGUoMikpXHJcbiAgICB9XHJcbn0pXG5TVkcuTGluZSA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ2xpbmUnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gR2V0IGFycmF5XHJcbiAgICBhcnJheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLlBvaW50QXJyYXkoW1xyXG4gICAgICAgIFsgdGhpcy5hdHRyKCd4MScpLCB0aGlzLmF0dHIoJ3kxJykgXVxyXG4gICAgICAsIFsgdGhpcy5hdHRyKCd4MicpLCB0aGlzLmF0dHIoJ3kyJykgXVxyXG4gICAgICBdKVxyXG4gICAgfVxyXG4gICAgLy8gT3ZlcndyaXRlIG5hdGl2ZSBwbG90KCkgbWV0aG9kXHJcbiAgLCBwbG90OiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICBpZiAoeDEgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheSgpXHJcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiB5MSAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgeDEgPSB7IHgxOiB4MSwgeTE6IHkxLCB4MjogeDIsIHkyOiB5MiB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB4MSA9IG5ldyBTVkcuUG9pbnRBcnJheSh4MSkudG9MaW5lKClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoeDEpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxyXG4gICwgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKHRoaXMuYXJyYXkoKS5tb3ZlKHgsIHkpLnRvTGluZSgpKVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IGVsZW1lbnQgc2l6ZSB0byBnaXZlbiB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cih0aGlzLmFycmF5KCkuc2l6ZShwLndpZHRoLCBwLmhlaWdodCkudG9MaW5lKCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGEgbGluZSBlbGVtZW50XHJcbiAgICBsaW5lOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAvLyBtYWtlIHN1cmUgcGxvdCBpcyBjYWxsZWQgYXMgYSBzZXR0ZXJcclxuICAgICAgLy8geDEgaXMgbm90IG5lY2Vzc2FyaWx5IGEgbnVtYmVyLCBpdCBjYW4gYWxzbyBiZSBhbiBhcnJheSwgYSBzdHJpbmcgYW5kIGEgU1ZHLlBvaW50QXJyYXlcclxuICAgICAgcmV0dXJuIFNWRy5MaW5lLnByb3RvdHlwZS5wbG90LmFwcGx5KFxyXG4gICAgICAgIHRoaXMucHV0KG5ldyBTVkcuTGluZSlcclxuICAgICAgLCB4MSAhPSBudWxsID8gW3gxLCB5MSwgeDIsIHkyXSA6IFswLCAwLCAwLCAwXVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cblNWRy5Qb2x5bGluZSA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ3BvbHlsaW5lJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcG9seWxpbmUgZWxlbWVudFxyXG4gICAgcG9seWxpbmU6IGZ1bmN0aW9uKHApIHtcclxuICAgICAgLy8gbWFrZSBzdXJlIHBsb3QgaXMgY2FsbGVkIGFzIGEgc2V0dGVyXHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlBvbHlsaW5lKS5wbG90KHAgfHwgbmV3IFNWRy5Qb2ludEFycmF5KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5Qb2x5Z29uID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAncG9seWdvbidcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgYSB3cmFwcGVkIHBvbHlnb24gZWxlbWVudFxyXG4gICAgcG9seWdvbjogZnVuY3Rpb24ocCkge1xyXG4gICAgICAvLyBtYWtlIHN1cmUgcGxvdCBpcyBjYWxsZWQgYXMgYSBzZXR0ZXJcclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuUG9seWdvbikucGxvdChwIHx8IG5ldyBTVkcuUG9pbnRBcnJheSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG4vLyBBZGQgcG9seWdvbi1zcGVjaWZpYyBmdW5jdGlvbnNcclxuU1ZHLmV4dGVuZChTVkcuUG9seWxpbmUsIFNWRy5Qb2x5Z29uLCB7XHJcbiAgLy8gR2V0IGFycmF5XHJcbiAgYXJyYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2FycmF5IHx8ICh0aGlzLl9hcnJheSA9IG5ldyBTVkcuUG9pbnRBcnJheSh0aGlzLmF0dHIoJ3BvaW50cycpKSlcclxuICB9XHJcbiAgLy8gUGxvdCBuZXcgcGF0aFxyXG4sIHBsb3Q6IGZ1bmN0aW9uKHApIHtcclxuICAgIHJldHVybiAocCA9PSBudWxsKSA/XHJcbiAgICAgIHRoaXMuYXJyYXkoKSA6XHJcbiAgICAgIHRoaXMuY2xlYXIoKS5hdHRyKCdwb2ludHMnLCB0eXBlb2YgcCA9PSAnc3RyaW5nJyA/IHAgOiAodGhpcy5fYXJyYXkgPSBuZXcgU1ZHLlBvaW50QXJyYXkocCkpKVxyXG4gIH1cclxuICAvLyBDbGVhciBhcnJheSBjYWNoZVxyXG4sIGNsZWFyOiBmdW5jdGlvbigpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9hcnJheVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXJcclxuLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCdwb2ludHMnLCB0aGlzLmFycmF5KCkubW92ZSh4LCB5KSlcclxuICB9XHJcbiAgLy8gU2V0IGVsZW1lbnQgc2l6ZSB0byBnaXZlbiB3aWR0aCBhbmQgaGVpZ2h0XHJcbiwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYXR0cigncG9pbnRzJywgdGhpcy5hcnJheSgpLnNpemUocC53aWR0aCwgcC5oZWlnaHQpKVxyXG4gIH1cclxuXHJcbn0pXHJcblxuLy8gdW5pZnkgYWxsIHBvaW50IHRvIHBvaW50IGVsZW1lbnRzXHJcblNWRy5leHRlbmQoU1ZHLkxpbmUsIFNWRy5Qb2x5bGluZSwgU1ZHLlBvbHlnb24sIHtcclxuICAvLyBEZWZpbmUgbW9ycGhhYmxlIGFycmF5XHJcbiAgbW9ycGhBcnJheTogIFNWRy5Qb2ludEFycmF5XHJcbiAgLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXIgb3ZlciB4LWF4aXNcclxuLCB4OiBmdW5jdGlvbih4KSB7XHJcbiAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5iYm94KCkueCA6IHRoaXMubW92ZSh4LCB0aGlzLmJib3goKS55KVxyXG4gIH1cclxuICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHktYXhpc1xyXG4sIHk6IGZ1bmN0aW9uKHkpIHtcclxuICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmJib3goKS55IDogdGhpcy5tb3ZlKHRoaXMuYmJveCgpLngsIHkpXHJcbiAgfVxyXG4gIC8vIFNldCB3aWR0aCBvZiBlbGVtZW50XHJcbiwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XHJcbiAgICB2YXIgYiA9IHRoaXMuYmJveCgpXHJcblxyXG4gICAgcmV0dXJuIHdpZHRoID09IG51bGwgPyBiLndpZHRoIDogdGhpcy5zaXplKHdpZHRoLCBiLmhlaWdodClcclxuICB9XHJcbiAgLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XHJcbiwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcclxuICAgIHZhciBiID0gdGhpcy5iYm94KClcclxuXHJcbiAgICByZXR1cm4gaGVpZ2h0ID09IG51bGwgPyBiLmhlaWdodCA6IHRoaXMuc2l6ZShiLndpZHRoLCBoZWlnaHQpXHJcbiAgfVxyXG59KVxuU1ZHLlBhdGggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdwYXRoJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIERlZmluZSBtb3JwaGFibGUgYXJyYXlcclxuICAgIG1vcnBoQXJyYXk6ICBTVkcuUGF0aEFycmF5XHJcbiAgICAvLyBHZXQgYXJyYXlcclxuICAsIGFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2FycmF5IHx8ICh0aGlzLl9hcnJheSA9IG5ldyBTVkcuUGF0aEFycmF5KHRoaXMuYXR0cignZCcpKSlcclxuICAgIH1cclxuICAgIC8vIFBsb3QgbmV3IHBhdGhcclxuICAsIHBsb3Q6IGZ1bmN0aW9uKGQpIHtcclxuICAgICAgcmV0dXJuIChkID09IG51bGwpID9cclxuICAgICAgICB0aGlzLmFycmF5KCkgOlxyXG4gICAgICAgIHRoaXMuY2xlYXIoKS5hdHRyKCdkJywgdHlwZW9mIGQgPT0gJ3N0cmluZycgPyBkIDogKHRoaXMuX2FycmF5ID0gbmV3IFNWRy5QYXRoQXJyYXkoZCkpKVxyXG4gICAgfVxyXG4gICAgLy8gQ2xlYXIgYXJyYXkgY2FjaGVcclxuICAsIGNsZWFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX2FycmF5XHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxyXG4gICwgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdkJywgdGhpcy5hcnJheSgpLm1vdmUoeCwgeSkpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHgtYXhpc1xyXG4gICwgeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5iYm94KCkueCA6IHRoaXMubW92ZSh4LCB0aGlzLmJib3goKS55KVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXIgb3ZlciB5LWF4aXNcclxuICAsIHk6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYmJveCgpLnkgOiB0aGlzLm1vdmUodGhpcy5iYm94KCkueCwgeSlcclxuICAgIH1cclxuICAgIC8vIFNldCBlbGVtZW50IHNpemUgdG8gZ2l2ZW4gd2lkdGggYW5kIGhlaWdodFxyXG4gICwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2QnLCB0aGlzLmFycmF5KCkuc2l6ZShwLndpZHRoLCBwLmhlaWdodCkpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxyXG4gICwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XHJcbiAgICAgIHJldHVybiB3aWR0aCA9PSBudWxsID8gdGhpcy5iYm94KCkud2lkdGggOiB0aGlzLnNpemUod2lkdGgsIHRoaXMuYmJveCgpLmhlaWdodClcclxuICAgIH1cclxuICAgIC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxyXG4gICwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcclxuICAgICAgcmV0dXJuIGhlaWdodCA9PSBudWxsID8gdGhpcy5iYm94KCkuaGVpZ2h0IDogdGhpcy5zaXplKHRoaXMuYmJveCgpLndpZHRoLCBoZWlnaHQpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcGF0aCBlbGVtZW50XHJcbiAgICBwYXRoOiBmdW5jdGlvbihkKSB7XHJcbiAgICAgIC8vIG1ha2Ugc3VyZSBwbG90IGlzIGNhbGxlZCBhcyBhIHNldHRlclxyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5QYXRoKS5wbG90KGQgfHwgbmV3IFNWRy5QYXRoQXJyYXkpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cblNWRy5JbWFnZSA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ2ltYWdlJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIChyZSlsb2FkIGltYWdlXHJcbiAgICBsb2FkOiBmdW5jdGlvbih1cmwpIHtcclxuICAgICAgaWYgKCF1cmwpIHJldHVybiB0aGlzXHJcblxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgICAgICAsIGltZyAgPSBuZXcgd2luZG93LkltYWdlKClcclxuXHJcbiAgICAgIC8vIHByZWxvYWQgaW1hZ2VcclxuICAgICAgU1ZHLm9uKGltZywgJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBTVkcub2ZmKGltZylcclxuXHJcbiAgICAgICAgdmFyIHAgPSBzZWxmLnBhcmVudChTVkcuUGF0dGVybilcclxuXHJcbiAgICAgICAgaWYocCA9PT0gbnVsbCkgcmV0dXJuXHJcblxyXG4gICAgICAgIC8vIGVuc3VyZSBpbWFnZSBzaXplXHJcbiAgICAgICAgaWYgKHNlbGYud2lkdGgoKSA9PSAwICYmIHNlbGYuaGVpZ2h0KCkgPT0gMClcclxuICAgICAgICAgIHNlbGYuc2l6ZShpbWcud2lkdGgsIGltZy5oZWlnaHQpXHJcblxyXG4gICAgICAgIC8vIGVuc3VyZSBwYXR0ZXJuIHNpemUgaWYgbm90IHNldFxyXG4gICAgICAgIGlmIChwICYmIHAud2lkdGgoKSA9PSAwICYmIHAuaGVpZ2h0KCkgPT0gMClcclxuICAgICAgICAgIHAuc2l6ZShzZWxmLndpZHRoKCksIHNlbGYuaGVpZ2h0KCkpXHJcblxyXG4gICAgICAgIC8vIGNhbGxiYWNrXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmLl9sb2FkZWQgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICBzZWxmLl9sb2FkZWQuY2FsbChzZWxmLCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAgaW1nLndpZHRoXHJcbiAgICAgICAgICAsIGhlaWdodDogaW1nLmhlaWdodFxyXG4gICAgICAgICAgLCByYXRpbzogIGltZy53aWR0aCAvIGltZy5oZWlnaHRcclxuICAgICAgICAgICwgdXJsOiAgICB1cmxcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBTVkcub24oaW1nLCAnZXJyb3InLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBTVkcub2ZmKGltZylcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmLl9lcnJvciA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgIHNlbGYuX2Vycm9yLmNhbGwoc2VsZiwgZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgKGltZy5zcmMgPSB0aGlzLnNyYyA9IHVybCksIFNWRy54bGluaylcclxuICAgIH1cclxuICAgIC8vIEFkZCBsb2FkZWQgY2FsbGJhY2tcclxuICAsIGxvYWRlZDogZnVuY3Rpb24obG9hZGVkKSB7XHJcbiAgICAgIHRoaXMuX2xvYWRlZCA9IGxvYWRlZFxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAsIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICB0aGlzLl9lcnJvciA9IGVycm9yXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gY3JlYXRlIGltYWdlIGVsZW1lbnQsIGxvYWQgaW1hZ2UgYW5kIHNldCBpdHMgc2l6ZVxyXG4gICAgaW1hZ2U6IGZ1bmN0aW9uKHNvdXJjZSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5JbWFnZSkubG9hZChzb3VyY2UpLnNpemUod2lkdGggfHwgMCwgaGVpZ2h0IHx8IHdpZHRoIHx8IDApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcblNWRy5UZXh0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCd0ZXh0JykpXHJcblxyXG4gICAgdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkcuTnVtYmVyKDEuMykgICAgLy8gc3RvcmUgbGVhZGluZyB2YWx1ZSBmb3IgcmVidWlsZGluZ1xyXG4gICAgdGhpcy5fcmVidWlsZCA9IHRydWUgICAgICAgICAgICAgICAgICAgICAgLy8gZW5hYmxlIGF1dG9tYXRpYyB1cGRhdGluZyBvZiBkeSB2YWx1ZXNcclxuICAgIHRoaXMuX2J1aWxkICAgPSBmYWxzZSAgICAgICAgICAgICAgICAgICAgIC8vIGRpc2FibGUgYnVpbGQgbW9kZSBmb3IgYWRkaW5nIG11bHRpcGxlIGxpbmVzXHJcblxyXG4gICAgLy8gc2V0IGRlZmF1bHQgZm9udFxyXG4gICAgdGhpcy5hdHRyKCdmb250LWZhbWlseScsIFNWRy5kZWZhdWx0cy5hdHRyc1snZm9udC1mYW1pbHknXSlcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gTW92ZSBvdmVyIHgtYXhpc1xyXG4gICAgeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICAvLyBhY3QgYXMgZ2V0dGVyXHJcbiAgICAgIGlmICh4ID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd4JywgeClcclxuICAgIH1cclxuICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcclxuICAsIHk6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgdmFyIG95ID0gdGhpcy5hdHRyKCd5JylcclxuICAgICAgICAsIG8gID0gdHlwZW9mIG95ID09PSAnbnVtYmVyJyA/IG95IC0gdGhpcy5iYm94KCkueSA6IDBcclxuXHJcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcclxuICAgICAgaWYgKHkgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdHlwZW9mIG95ID09PSAnbnVtYmVyJyA/IG95IC0gbyA6IG95XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgdHlwZW9mIHkgPT09ICdudW1iZXInID8geSArIG8gOiB5KVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBjZW50ZXIgb3ZlciB4LWF4aXNcclxuICAsIGN4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmJib3goKS5jeCA6IHRoaXMueCh4IC0gdGhpcy5iYm94KCkud2lkdGggLyAyKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBjZW50ZXIgb3ZlciB5LWF4aXNcclxuICAsIGN5OiBmdW5jdGlvbih5KSB7XHJcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmJib3goKS5jeSA6IHRoaXMueSh5IC0gdGhpcy5iYm94KCkuaGVpZ2h0IC8gMilcclxuICAgIH1cclxuICAgIC8vIFNldCB0aGUgdGV4dCBjb250ZW50XHJcbiAgLCB0ZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcclxuICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgdmFyIHRleHQgPSAnJ1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZE5vZGVzXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpe1xyXG5cclxuICAgICAgICAgIC8vIGFkZCBuZXdsaW5lIGlmIGl0cyBub3QgdGhlIGZpcnN0IGNoaWxkIGFuZCBuZXdMaW5lZCBpcyBzZXQgdG8gdHJ1ZVxyXG4gICAgICAgICAgaWYoaSAhPSAwICYmIGNoaWxkcmVuW2ldLm5vZGVUeXBlICE9IDMgJiYgU1ZHLmFkb3B0KGNoaWxkcmVuW2ldKS5kb20ubmV3TGluZWQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHRleHQgKz0gJ1xcbidcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBhZGQgY29udGVudCBvZiB0aGlzIG5vZGVcclxuICAgICAgICAgIHRleHQgKz0gY2hpbGRyZW5baV0udGV4dENvbnRlbnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXh0XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHJlbW92ZSBleGlzdGluZyBjb250ZW50XHJcbiAgICAgIHRoaXMuY2xlYXIoKS5idWlsZCh0cnVlKVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gY2FsbCBibG9ja1xyXG4gICAgICAgIHRleHQuY2FsbCh0aGlzLCB0aGlzKVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBzdG9yZSB0ZXh0IGFuZCBtYWtlIHN1cmUgdGV4dCBpcyBub3QgYmxhbmtcclxuICAgICAgICB0ZXh0ID0gdGV4dC5zcGxpdCgnXFxuJylcclxuXHJcbiAgICAgICAgLy8gYnVpbGQgbmV3IGxpbmVzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGV4dC5sZW5ndGg7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgICAgdGhpcy50c3Bhbih0ZXh0W2ldKS5uZXdMaW5lKClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZGlzYWJsZSBidWlsZCBtb2RlIGFuZCByZWJ1aWxkIGxpbmVzXHJcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkKGZhbHNlKS5yZWJ1aWxkKClcclxuICAgIH1cclxuICAgIC8vIFNldCBmb250IHNpemVcclxuICAsIHNpemU6IGZ1bmN0aW9uKHNpemUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZm9udC1zaXplJywgc2l6ZSkucmVidWlsZCgpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgLyBnZXQgbGVhZGluZ1xyXG4gICwgbGVhZGluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgLy8gYWN0IGFzIGdldHRlclxyXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdGhpcy5kb20ubGVhZGluZ1xyXG5cclxuICAgICAgLy8gYWN0IGFzIHNldHRlclxyXG4gICAgICB0aGlzLmRvbS5sZWFkaW5nID0gbmV3IFNWRy5OdW1iZXIodmFsdWUpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5yZWJ1aWxkKClcclxuICAgIH1cclxuICAgIC8vIEdldCBhbGwgdGhlIGZpcnN0IGxldmVsIGxpbmVzXHJcbiAgLCBsaW5lczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBub2RlID0gKHRoaXMudGV4dFBhdGggJiYgdGhpcy50ZXh0UGF0aCgpIHx8IHRoaXMpLm5vZGVcclxuXHJcbiAgICAgIC8vIGZpbHRlciB0c3BhbnMgYW5kIG1hcCB0aGVtIHRvIFNWRy5qcyBpbnN0YW5jZXNcclxuICAgICAgdmFyIGxpbmVzID0gU1ZHLnV0aWxzLm1hcChTVkcudXRpbHMuZmlsdGVyU1ZHRWxlbWVudHMobm9kZS5jaGlsZE5vZGVzKSwgZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgIHJldHVybiBTVkcuYWRvcHQoZWwpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgU1ZHLnNldFxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5TZXQobGluZXMpXHJcbiAgICB9XHJcbiAgICAvLyBSZWJ1aWxkIGFwcGVhcmFuY2UgdHlwZVxyXG4gICwgcmVidWlsZDogZnVuY3Rpb24ocmVidWlsZCkge1xyXG4gICAgICAvLyBzdG9yZSBuZXcgcmVidWlsZCBmbGFnIGlmIGdpdmVuXHJcbiAgICAgIGlmICh0eXBlb2YgcmVidWlsZCA9PSAnYm9vbGVhbicpXHJcbiAgICAgICAgdGhpcy5fcmVidWlsZCA9IHJlYnVpbGRcclxuXHJcbiAgICAgIC8vIGRlZmluZSBwb3NpdGlvbiBvZiBhbGwgbGluZXNcclxuICAgICAgaWYgKHRoaXMuX3JlYnVpbGQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgICAgICAgICwgYmxhbmtMaW5lT2Zmc2V0ID0gMFxyXG4gICAgICAgICAgLCBkeSA9IHRoaXMuZG9tLmxlYWRpbmcgKiBuZXcgU1ZHLk51bWJlcih0aGlzLmF0dHIoJ2ZvbnQtc2l6ZScpKVxyXG5cclxuICAgICAgICB0aGlzLmxpbmVzKCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmRvbS5uZXdMaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoIXNlbGYudGV4dFBhdGgoKSlcclxuICAgICAgICAgICAgICB0aGlzLmF0dHIoJ3gnLCBzZWxmLmF0dHIoJ3gnKSlcclxuICAgICAgICAgICAgaWYodGhpcy50ZXh0KCkgPT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICBibGFua0xpbmVPZmZzZXQgKz0gZHlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgdGhpcy5hdHRyKCdkeScsIGR5ICsgYmxhbmtMaW5lT2Zmc2V0KVxyXG4gICAgICAgICAgICAgIGJsYW5rTGluZU9mZnNldCA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuZmlyZSgncmVidWlsZCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBFbmFibGUgLyBkaXNhYmxlIGJ1aWxkIG1vZGVcclxuICAsIGJ1aWxkOiBmdW5jdGlvbihidWlsZCkge1xyXG4gICAgICB0aGlzLl9idWlsZCA9ICEhYnVpbGRcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIG92ZXJ3cml0ZSBtZXRob2QgZnJvbSBwYXJlbnQgdG8gc2V0IGRhdGEgcHJvcGVybHlcclxuICAsIHNldERhdGE6IGZ1bmN0aW9uKG8pe1xyXG4gICAgICB0aGlzLmRvbSA9IG9cclxuICAgICAgdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkcuTnVtYmVyKG8ubGVhZGluZyB8fCAxLjMpXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIHRleHQgZWxlbWVudFxyXG4gICAgdGV4dDogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5UZXh0KS50ZXh0KHRleHQpXHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGUgcGxhaW4gdGV4dCBlbGVtZW50XHJcbiAgLCBwbGFpbjogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5UZXh0KS5wbGFpbih0ZXh0KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuVHNwYW4gPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICd0c3BhbidcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBTZXQgdGV4dCBjb250ZW50XHJcbiAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIGlmKHRleHQgPT0gbnVsbCkgcmV0dXJuIHRoaXMubm9kZS50ZXh0Q29udGVudCArICh0aGlzLmRvbS5uZXdMaW5lZCA/ICdcXG4nIDogJycpXHJcblxyXG4gICAgICB0eXBlb2YgdGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IHRleHQuY2FsbCh0aGlzLCB0aGlzKSA6IHRoaXMucGxhaW4odGV4dClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBTaG9ydGN1dCBkeFxyXG4gICwgZHg6IGZ1bmN0aW9uKGR4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2R4JywgZHgpXHJcbiAgICB9XHJcbiAgICAvLyBTaG9ydGN1dCBkeVxyXG4gICwgZHk6IGZ1bmN0aW9uKGR5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2R5JywgZHkpXHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGUgbmV3IGxpbmVcclxuICAsIG5ld0xpbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBmZXRjaCB0ZXh0IHBhcmVudFxyXG4gICAgICB2YXIgdCA9IHRoaXMucGFyZW50KFNWRy5UZXh0KVxyXG5cclxuICAgICAgLy8gbWFyayBuZXcgbGluZVxyXG4gICAgICB0aGlzLmRvbS5uZXdMaW5lZCA9IHRydWVcclxuXHJcbiAgICAgIC8vIGFwcGx5IG5ldyBoecKhblxyXG4gICAgICByZXR1cm4gdGhpcy5keSh0LmRvbS5sZWFkaW5nICogdC5hdHRyKCdmb250LXNpemUnKSkuYXR0cigneCcsIHQueCgpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5UZXh0LCBTVkcuVHNwYW4sIHtcclxuICAvLyBDcmVhdGUgcGxhaW4gdGV4dCBub2RlXHJcbiAgcGxhaW46IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgIC8vIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWRcclxuICAgIGlmICh0aGlzLl9idWlsZCA9PT0gZmFsc2UpXHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgIC8vIGNyZWF0ZSB0ZXh0IG5vZGVcclxuICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBDcmVhdGUgYSB0c3BhblxyXG4sIHRzcGFuOiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICB2YXIgbm9kZSAgPSAodGhpcy50ZXh0UGF0aCAmJiB0aGlzLnRleHRQYXRoKCkgfHwgdGhpcykubm9kZVxyXG4gICAgICAsIHRzcGFuID0gbmV3IFNWRy5Uc3BhblxyXG5cclxuICAgIC8vIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWRcclxuICAgIGlmICh0aGlzLl9idWlsZCA9PT0gZmFsc2UpXHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgIC8vIGFkZCBuZXcgdHNwYW5cclxuICAgIG5vZGUuYXBwZW5kQ2hpbGQodHNwYW4ubm9kZSlcclxuXHJcbiAgICByZXR1cm4gdHNwYW4udGV4dCh0ZXh0KVxyXG4gIH1cclxuICAvLyBDbGVhciBhbGwgbGluZXNcclxuLCBjbGVhcjogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbm9kZSA9ICh0aGlzLnRleHRQYXRoICYmIHRoaXMudGV4dFBhdGgoKSB8fCB0aGlzKS5ub2RlXHJcblxyXG4gICAgLy8gcmVtb3ZlIGV4aXN0aW5nIGNoaWxkIG5vZGVzXHJcbiAgICB3aGlsZSAobm9kZS5oYXNDaGlsZE5vZGVzKCkpXHJcbiAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5sYXN0Q2hpbGQpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gR2V0IGxlbmd0aCBvZiB0ZXh0IGVsZW1lbnRcclxuLCBsZW5ndGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKVxyXG4gIH1cclxufSlcclxuXG5TVkcuVGV4dFBhdGggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICd0ZXh0UGF0aCdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlBhcmVudFxyXG5cclxuICAvLyBEZWZpbmUgcGFyZW50IGNsYXNzXHJcbiwgcGFyZW50OiBTVkcuVGV4dFxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgbW9ycGhBcnJheTogU1ZHLlBhdGhBcnJheVxyXG4gICAgLy8gQ3JlYXRlIHBhdGggZm9yIHRleHQgdG8gcnVuIG9uXHJcbiAgLCBwYXRoOiBmdW5jdGlvbihkKSB7XHJcbiAgICAgIC8vIGNyZWF0ZSB0ZXh0UGF0aCBlbGVtZW50XHJcbiAgICAgIHZhciBwYXRoICA9IG5ldyBTVkcuVGV4dFBhdGhcclxuICAgICAgICAsIHRyYWNrID0gdGhpcy5kb2MoKS5kZWZzKCkucGF0aChkKVxyXG5cclxuICAgICAgLy8gbW92ZSBsaW5lcyB0byB0ZXh0cGF0aFxyXG4gICAgICB3aGlsZSAodGhpcy5ub2RlLmhhc0NoaWxkTm9kZXMoKSlcclxuICAgICAgICBwYXRoLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy5ub2RlLmZpcnN0Q2hpbGQpXHJcblxyXG4gICAgICAvLyBhZGQgdGV4dFBhdGggZWxlbWVudCBhcyBjaGlsZCBub2RlXHJcbiAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChwYXRoLm5vZGUpXHJcblxyXG4gICAgICAvLyBsaW5rIHRleHRQYXRoIHRvIHBhdGggYW5kIGFkZCBjb250ZW50XHJcbiAgICAgIHBhdGguYXR0cignaHJlZicsICcjJyArIHRyYWNrLCBTVkcueGxpbmspXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuIHRoZSBhcnJheSBvZiB0aGUgcGF0aCB0cmFjayBlbGVtZW50XHJcbiAgLCBhcnJheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB0cmFjayA9IHRoaXMudHJhY2soKVxyXG5cclxuICAgICAgcmV0dXJuIHRyYWNrID8gdHJhY2suYXJyYXkoKSA6IG51bGxcclxuICAgIH1cclxuICAgIC8vIFBsb3QgcGF0aCBpZiBhbnlcclxuICAsIHBsb3Q6IGZ1bmN0aW9uKGQpIHtcclxuICAgICAgdmFyIHRyYWNrID0gdGhpcy50cmFjaygpXHJcbiAgICAgICAgLCBwYXRoQXJyYXkgPSBudWxsXHJcblxyXG4gICAgICBpZiAodHJhY2spIHtcclxuICAgICAgICBwYXRoQXJyYXkgPSB0cmFjay5wbG90KGQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoZCA9PSBudWxsKSA/IHBhdGhBcnJheSA6IHRoaXNcclxuICAgIH1cclxuICAgIC8vIEdldCB0aGUgcGF0aCB0cmFjayBlbGVtZW50XHJcbiAgLCB0cmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBwYXRoID0gdGhpcy50ZXh0UGF0aCgpXHJcblxyXG4gICAgICBpZiAocGF0aClcclxuICAgICAgICByZXR1cm4gcGF0aC5yZWZlcmVuY2UoJ2hyZWYnKVxyXG4gICAgfVxyXG4gICAgLy8gR2V0IHRoZSB0ZXh0UGF0aCBjaGlsZFxyXG4gICwgdGV4dFBhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLmZpcnN0Q2hpbGQgJiYgdGhpcy5ub2RlLmZpcnN0Q2hpbGQubm9kZU5hbWUgPT0gJ3RleHRQYXRoJylcclxuICAgICAgICByZXR1cm4gU1ZHLmFkb3B0KHRoaXMubm9kZS5maXJzdENoaWxkKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXG5TVkcuTmVzdGVkID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCdzdmcnKSlcclxuXHJcbiAgICB0aGlzLnN0eWxlKCdvdmVyZmxvdycsICd2aXNpYmxlJylcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5Db250YWluZXJcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBuZXN0ZWQgc3ZnIGRvY3VtZW50XHJcbiAgICBuZXN0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5OZXN0ZWQpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxuU1ZHLkEgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdhJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBMaW5rIHVybFxyXG4gICAgdG86IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgdXJsLCBTVkcueGxpbmspXHJcbiAgICB9XHJcbiAgICAvLyBMaW5rIHNob3cgYXR0cmlidXRlXHJcbiAgLCBzaG93OiBmdW5jdGlvbih0YXJnZXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignc2hvdycsIHRhcmdldCwgU1ZHLnhsaW5rKVxyXG4gICAgfVxyXG4gICAgLy8gTGluayB0YXJnZXQgYXR0cmlidXRlXHJcbiAgLCB0YXJnZXQ6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGEgaHlwZXJsaW5rIGVsZW1lbnRcclxuICAgIGxpbms6IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5BKS50byh1cmwpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIENyZWF0ZSBhIGh5cGVybGluayBlbGVtZW50XHJcbiAgbGlua1RvOiBmdW5jdGlvbih1cmwpIHtcclxuICAgIHZhciBsaW5rID0gbmV3IFNWRy5BXHJcblxyXG4gICAgaWYgKHR5cGVvZiB1cmwgPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgdXJsLmNhbGwobGluaywgbGluaylcclxuICAgIGVsc2VcclxuICAgICAgbGluay50byh1cmwpXHJcblxyXG4gICAgcmV0dXJuIHRoaXMucGFyZW50KCkucHV0KGxpbmspLnB1dCh0aGlzKVxyXG4gIH1cclxuXHJcbn0pXG5TVkcuTWFya2VyID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnbWFya2VyJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxyXG4gICAgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hcmtlcldpZHRoJywgd2lkdGgpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcclxuICAsIGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hcmtlckhlaWdodCcsIGhlaWdodClcclxuICAgIH1cclxuICAgIC8vIFNldCBtYXJrZXIgcmVmWCBhbmQgcmVmWVxyXG4gICwgcmVmOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3JlZlgnLCB4KS5hdHRyKCdyZWZZJywgeSlcclxuICAgIH1cclxuICAgIC8vIFVwZGF0ZSBtYXJrZXJcclxuICAsIHVwZGF0ZTogZnVuY3Rpb24oYmxvY2spIHtcclxuICAgICAgLy8gcmVtb3ZlIGFsbCBjb250ZW50XHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgICAgLy8gaW52b2tlIHBhc3NlZCBibG9ja1xyXG4gICAgICBpZiAodHlwZW9mIGJsb2NrID09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgYmxvY2suY2FsbCh0aGlzLCB0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIFJldHVybiB0aGUgZmlsbCBpZFxyXG4gICwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gJ3VybCgjJyArIHRoaXMuaWQoKSArICcpJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIG1hcmtlcjogZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgYmxvY2spIHtcclxuICAgICAgLy8gQ3JlYXRlIG1hcmtlciBlbGVtZW50IGluIGRlZnNcclxuICAgICAgcmV0dXJuIHRoaXMuZGVmcygpLm1hcmtlcih3aWR0aCwgaGVpZ2h0LCBibG9jaylcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRGVmcywge1xyXG4gIC8vIENyZWF0ZSBtYXJrZXJcclxuICBtYXJrZXI6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGJsb2NrKSB7XHJcbiAgICAvLyBTZXQgZGVmYXVsdCB2aWV3Ym94IHRvIG1hdGNoIHRoZSB3aWR0aCBhbmQgaGVpZ2h0LCBzZXQgcmVmIHRvIGN4IGFuZCBjeSBhbmQgc2V0IG9yaWVudCB0byBhdXRvXHJcbiAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5NYXJrZXIpXHJcbiAgICAgIC5zaXplKHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgIC5yZWYod2lkdGggLyAyLCBoZWlnaHQgLyAyKVxyXG4gICAgICAudmlld2JveCgwLCAwLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxyXG4gICAgICAudXBkYXRlKGJsb2NrKVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5MaW5lLCBTVkcuUG9seWxpbmUsIFNWRy5Qb2x5Z29uLCBTVkcuUGF0aCwge1xyXG4gIC8vIENyZWF0ZSBhbmQgYXR0YWNoIG1hcmtlcnNcclxuICBtYXJrZXI6IGZ1bmN0aW9uKG1hcmtlciwgd2lkdGgsIGhlaWdodCwgYmxvY2spIHtcclxuICAgIHZhciBhdHRyID0gWydtYXJrZXInXVxyXG5cclxuICAgIC8vIEJ1aWxkIGF0dHJpYnV0ZSBuYW1lXHJcbiAgICBpZiAobWFya2VyICE9ICdhbGwnKSBhdHRyLnB1c2gobWFya2VyKVxyXG4gICAgYXR0ciA9IGF0dHIuam9pbignLScpXHJcblxyXG4gICAgLy8gU2V0IG1hcmtlciBhdHRyaWJ1dGVcclxuICAgIG1hcmtlciA9IGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIFNWRy5NYXJrZXIgP1xyXG4gICAgICBhcmd1bWVudHNbMV0gOlxyXG4gICAgICB0aGlzLmRvYygpLm1hcmtlcih3aWR0aCwgaGVpZ2h0LCBibG9jaylcclxuXHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKGF0dHIsIG1hcmtlcilcclxuICB9XHJcblxyXG59KVxuLy8gRGVmaW5lIGxpc3Qgb2YgYXZhaWxhYmxlIGF0dHJpYnV0ZXMgZm9yIHN0cm9rZSBhbmQgZmlsbFxyXG52YXIgc3VnYXIgPSB7XHJcbiAgc3Ryb2tlOiBbJ2NvbG9yJywgJ3dpZHRoJywgJ29wYWNpdHknLCAnbGluZWNhcCcsICdsaW5lam9pbicsICdtaXRlcmxpbWl0JywgJ2Rhc2hhcnJheScsICdkYXNob2Zmc2V0J11cclxuLCBmaWxsOiAgIFsnY29sb3InLCAnb3BhY2l0eScsICdydWxlJ11cclxuLCBwcmVmaXg6IGZ1bmN0aW9uKHQsIGEpIHtcclxuICAgIHJldHVybiBhID09ICdjb2xvcicgPyB0IDogdCArICctJyArIGFcclxuICB9XHJcbn1cclxuXHJcbi8vIEFkZCBzdWdhciBmb3IgZmlsbCBhbmQgc3Ryb2tlXHJcbjtbJ2ZpbGwnLCAnc3Ryb2tlJ10uZm9yRWFjaChmdW5jdGlvbihtKSB7XHJcbiAgdmFyIGksIGV4dGVuc2lvbiA9IHt9XHJcblxyXG4gIGV4dGVuc2lvblttXSA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIGlmICh0eXBlb2YgbyA9PSAndW5kZWZpbmVkJylcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJyB8fCBTVkcuQ29sb3IuaXNSZ2IobykgfHwgKG8gJiYgdHlwZW9mIG8uZmlsbCA9PT0gJ2Z1bmN0aW9uJykpXHJcbiAgICAgIHRoaXMuYXR0cihtLCBvKVxyXG5cclxuICAgIGVsc2VcclxuICAgICAgLy8gc2V0IGFsbCBhdHRyaWJ1dGVzIGZyb20gc3VnYXIuZmlsbCBhbmQgc3VnYXIuc3Ryb2tlIGxpc3RcclxuICAgICAgZm9yIChpID0gc3VnYXJbbV0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgaWYgKG9bc3VnYXJbbV1baV1dICE9IG51bGwpXHJcbiAgICAgICAgICB0aGlzLmF0dHIoc3VnYXIucHJlZml4KG0sIHN1Z2FyW21dW2ldKSwgb1tzdWdhclttXVtpXV0pXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIFNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIFNWRy5GWCwgZXh0ZW5zaW9uKVxyXG5cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIFNWRy5GWCwge1xyXG4gIC8vIE1hcCByb3RhdGlvbiB0byB0cmFuc2Zvcm1cclxuICByb3RhdGU6IGZ1bmN0aW9uKGQsIGN4LCBjeSkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHsgcm90YXRpb246IGQsIGN4OiBjeCwgY3k6IGN5IH0pXHJcbiAgfVxyXG4gIC8vIE1hcCBza2V3IHRvIHRyYW5zZm9ybVxyXG4sIHNrZXc6IGZ1bmN0aW9uKHgsIHksIGN4LCBjeSkge1xyXG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT0gMSAgfHwgYXJndW1lbnRzLmxlbmd0aCA9PSAzID9cclxuICAgICAgdGhpcy50cmFuc2Zvcm0oeyBza2V3OiB4LCBjeDogeSwgY3k6IGN4IH0pIDpcclxuICAgICAgdGhpcy50cmFuc2Zvcm0oeyBza2V3WDogeCwgc2tld1k6IHksIGN4OiBjeCwgY3k6IGN5IH0pXHJcbiAgfVxyXG4gIC8vIE1hcCBzY2FsZSB0byB0cmFuc2Zvcm1cclxuLCBzY2FsZTogZnVuY3Rpb24oeCwgeSwgY3gsIGN5KSB7XHJcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PSAxICB8fCBhcmd1bWVudHMubGVuZ3RoID09IDMgP1xyXG4gICAgICB0aGlzLnRyYW5zZm9ybSh7IHNjYWxlOiB4LCBjeDogeSwgY3k6IGN4IH0pIDpcclxuICAgICAgdGhpcy50cmFuc2Zvcm0oeyBzY2FsZVg6IHgsIHNjYWxlWTogeSwgY3g6IGN4LCBjeTogY3kgfSlcclxuICB9XHJcbiAgLy8gTWFwIHRyYW5zbGF0ZSB0byB0cmFuc2Zvcm1cclxuLCB0cmFuc2xhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7IHg6IHgsIHk6IHkgfSlcclxuICB9XHJcbiAgLy8gTWFwIGZsaXAgdG8gdHJhbnNmb3JtXHJcbiwgZmxpcDogZnVuY3Rpb24oYSwgbykge1xyXG4gICAgbyA9IHR5cGVvZiBhID09ICdudW1iZXInID8gYSA6IG9cclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7IGZsaXA6IGEgfHwgJ2JvdGgnLCBvZmZzZXQ6IG8gfSlcclxuICB9XHJcbiAgLy8gTWFwIG1hdHJpeCB0byB0cmFuc2Zvcm1cclxuLCBtYXRyaXg6IGZ1bmN0aW9uKG0pIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIG5ldyBTVkcuTWF0cml4KGFyZ3VtZW50cy5sZW5ndGggPT0gNiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSA6IG0pKVxyXG4gIH1cclxuICAvLyBPcGFjaXR5XHJcbiwgb3BhY2l0eTogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ29wYWNpdHknLCB2YWx1ZSlcclxuICB9XHJcbiAgLy8gUmVsYXRpdmUgbW92ZSBvdmVyIHggYXhpc1xyXG4sIGR4OiBmdW5jdGlvbih4KSB7XHJcbiAgICByZXR1cm4gdGhpcy54KG5ldyBTVkcuTnVtYmVyKHgpLnBsdXModGhpcyBpbnN0YW5jZW9mIFNWRy5GWCA/IDAgOiB0aGlzLngoKSksIHRydWUpXHJcbiAgfVxyXG4gIC8vIFJlbGF0aXZlIG1vdmUgb3ZlciB5IGF4aXNcclxuLCBkeTogZnVuY3Rpb24oeSkge1xyXG4gICAgcmV0dXJuIHRoaXMueShuZXcgU1ZHLk51bWJlcih5KS5wbHVzKHRoaXMgaW5zdGFuY2VvZiBTVkcuRlggPyAwIDogdGhpcy55KCkpLCB0cnVlKVxyXG4gIH1cclxuICAvLyBSZWxhdGl2ZSBtb3ZlIG92ZXIgeCBhbmQgeSBheGVzXHJcbiwgZG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiB0aGlzLmR4KHgpLmR5KHkpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuUmVjdCwgU1ZHLkVsbGlwc2UsIFNWRy5DaXJjbGUsIFNWRy5HcmFkaWVudCwgU1ZHLkZYLCB7XHJcbiAgLy8gQWRkIHggYW5kIHkgcmFkaXVzXHJcbiAgcmFkaXVzOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICB2YXIgdHlwZSA9ICh0aGlzLl90YXJnZXQgfHwgdGhpcykudHlwZTtcclxuICAgIHJldHVybiB0eXBlID09ICdyYWRpYWwnIHx8IHR5cGUgPT0gJ2NpcmNsZScgP1xyXG4gICAgICB0aGlzLmF0dHIoJ3InLCBuZXcgU1ZHLk51bWJlcih4KSkgOlxyXG4gICAgICB0aGlzLnJ4KHgpLnJ5KHkgPT0gbnVsbCA/IHggOiB5KVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLlBhdGgsIHtcclxuICAvLyBHZXQgcGF0aCBsZW5ndGhcclxuICBsZW5ndGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZS5nZXRUb3RhbExlbmd0aCgpXHJcbiAgfVxyXG4gIC8vIEdldCBwb2ludCBhdCBsZW5ndGhcclxuLCBwb2ludEF0OiBmdW5jdGlvbihsZW5ndGgpIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0UG9pbnRBdExlbmd0aChsZW5ndGgpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuUGFyZW50LCBTVkcuVGV4dCwgU1ZHLlRzcGFuLCBTVkcuRlgsIHtcclxuICAvLyBTZXQgZm9udFxyXG4gIGZvbnQ6IGZ1bmN0aW9uKGEsIHYpIHtcclxuICAgIGlmICh0eXBlb2YgYSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKHYgaW4gYSkgdGhpcy5mb250KHYsIGFbdl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGEgPT0gJ2xlYWRpbmcnID9cclxuICAgICAgICB0aGlzLmxlYWRpbmcodikgOlxyXG4gICAgICBhID09ICdhbmNob3InID9cclxuICAgICAgICB0aGlzLmF0dHIoJ3RleHQtYW5jaG9yJywgdikgOlxyXG4gICAgICBhID09ICdzaXplJyB8fCBhID09ICdmYW1pbHknIHx8IGEgPT0gJ3dlaWdodCcgfHwgYSA9PSAnc3RyZXRjaCcgfHwgYSA9PSAndmFyaWFudCcgfHwgYSA9PSAnc3R5bGUnID9cclxuICAgICAgICB0aGlzLmF0dHIoJ2ZvbnQtJysgYSwgdikgOlxyXG4gICAgICAgIHRoaXMuYXR0cihhLCB2KVxyXG4gIH1cclxufSlcclxuXG5TVkcuU2V0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24obWVtYmVycykge1xyXG4gICAgLy8gU2V0IGluaXRpYWwgc3RhdGVcclxuICAgIEFycmF5LmlzQXJyYXkobWVtYmVycykgPyB0aGlzLm1lbWJlcnMgPSBtZW1iZXJzIDogdGhpcy5jbGVhcigpXHJcbiAgfVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gQWRkIGVsZW1lbnQgdG8gc2V0XHJcbiAgICBhZGQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgaSwgaWwsIGVsZW1lbnRzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcblxyXG4gICAgICBmb3IgKGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLnB1c2goZWxlbWVudHNbaV0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGVsZW1lbnQgZnJvbSBzZXRcclxuICAsIHJlbW92ZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICB2YXIgaSA9IHRoaXMuaW5kZXgoZWxlbWVudClcclxuXHJcbiAgICAgIC8vIHJlbW92ZSBnaXZlbiBjaGlsZFxyXG4gICAgICBpZiAoaSA+IC0xKVxyXG4gICAgICAgIHRoaXMubWVtYmVycy5zcGxpY2UoaSwgMSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIG1lbWJlcnNcclxuICAsIGVhY2g6IGZ1bmN0aW9uKGJsb2NrKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMubWVtYmVycy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGJsb2NrLmFwcGx5KHRoaXMubWVtYmVyc1tpXSwgW2ksIHRoaXMubWVtYmVyc10pXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVzdG9yZSB0byBkZWZhdWx0c1xyXG4gICwgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBpbml0aWFsaXplIHN0b3JlXHJcbiAgICAgIHRoaXMubWVtYmVycyA9IFtdXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgYSBzZXRcclxuICAsIGxlbmd0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1lbWJlcnMubGVuZ3RoXHJcbiAgICB9XHJcbiAgICAvLyBDaGVja3MgaWYgYSBnaXZlbiBlbGVtZW50IGlzIHByZXNlbnQgaW4gc2V0XHJcbiAgLCBoYXM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgoZWxlbWVudCkgPj0gMFxyXG4gICAgfVxyXG4gICAgLy8gcmV0dW5zIGluZGV4IG9mIGdpdmVuIGVsZW1lbnQgaW4gc2V0XHJcbiAgLCBpbmRleDogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tZW1iZXJzLmluZGV4T2YoZWxlbWVudClcclxuICAgIH1cclxuICAgIC8vIEdldCBtZW1iZXIgYXQgZ2l2ZW4gaW5kZXhcclxuICAsIGdldDogZnVuY3Rpb24oaSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tZW1iZXJzW2ldXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgZmlyc3QgbWVtYmVyXHJcbiAgLCBmaXJzdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldCgwKVxyXG4gICAgfVxyXG4gICAgLy8gR2V0IGxhc3QgbWVtYmVyXHJcbiAgLCBsYXN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMubWVtYmVycy5sZW5ndGggLSAxKVxyXG4gICAgfVxyXG4gICAgLy8gRGVmYXVsdCB2YWx1ZVxyXG4gICwgdmFsdWVPZjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1lbWJlcnNcclxuICAgIH1cclxuICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIGFsbCBtZW1iZXJzIGluY2x1ZGVkIG9yIGVtcHR5IGJveCBpZiBzZXQgaGFzIG5vIGl0ZW1zXHJcbiAgLCBiYm94OiBmdW5jdGlvbigpe1xyXG4gICAgICAvLyByZXR1cm4gYW4gZW1wdHkgYm94IG9mIHRoZXJlIGFyZSBubyBtZW1iZXJzXHJcbiAgICAgIGlmICh0aGlzLm1lbWJlcnMubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTVkcuUkJveCgpXHJcblxyXG4gICAgICAvLyBnZXQgdGhlIGZpcnN0IHJib3ggYW5kIHVwZGF0ZSB0aGUgdGFyZ2V0IGJib3hcclxuICAgICAgdmFyIHJib3ggPSB0aGlzLm1lbWJlcnNbMF0ucmJveCh0aGlzLm1lbWJlcnNbMF0uZG9jKCkpXHJcblxyXG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gdXNlciByYm94IGZvciBjb3JyZWN0IHBvc2l0aW9uIGFuZCB2aXN1YWwgcmVwcmVzZW50YXRpb25cclxuICAgICAgICByYm94ID0gcmJveC5tZXJnZSh0aGlzLnJib3godGhpcy5kb2MoKSkpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gcmJveFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBzZXRcclxuICAgIHNldDogZnVuY3Rpb24obWVtYmVycykge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5TZXQobWVtYmVycylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5TVkcuRlguU2V0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihzZXQpIHtcclxuICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBzZXRcclxuICAgIHRoaXMuc2V0ID0gc2V0XHJcbiAgfVxyXG5cclxufSlcclxuXHJcbi8vIEFsaWFzIG1ldGhvZHNcclxuU1ZHLlNldC5pbmhlcml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG1cclxuICAgICwgbWV0aG9kcyA9IFtdXHJcblxyXG4gIC8vIGdhdGhlciBzaGFwZSBtZXRob2RzXHJcbiAgZm9yKHZhciBtIGluIFNWRy5TaGFwZS5wcm90b3R5cGUpXHJcbiAgICBpZiAodHlwZW9mIFNWRy5TaGFwZS5wcm90b3R5cGVbbV0gPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU1ZHLlNldC5wcm90b3R5cGVbbV0gIT0gJ2Z1bmN0aW9uJylcclxuICAgICAgbWV0aG9kcy5wdXNoKG0pXHJcblxyXG4gIC8vIGFwcGx5IHNoYXBlIGFsaWFzc2VzXHJcbiAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgU1ZHLlNldC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLm1lbWJlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBpZiAodGhpcy5tZW1iZXJzW2ldICYmIHR5cGVvZiB0aGlzLm1lbWJlcnNbaV1bbWV0aG9kXSA9PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgdGhpcy5tZW1iZXJzW2ldW21ldGhvZF0uYXBwbHkodGhpcy5tZW1iZXJzW2ldLCBhcmd1bWVudHMpXHJcblxyXG4gICAgICByZXR1cm4gbWV0aG9kID09ICdhbmltYXRlJyA/ICh0aGlzLmZ4IHx8ICh0aGlzLmZ4ID0gbmV3IFNWRy5GWC5TZXQodGhpcykpKSA6IHRoaXNcclxuICAgIH1cclxuICB9KVxyXG5cclxuICAvLyBjbGVhciBtZXRob2RzIGZvciB0aGUgbmV4dCByb3VuZFxyXG4gIG1ldGhvZHMgPSBbXVxyXG5cclxuICAvLyBnYXRoZXIgZnggbWV0aG9kc1xyXG4gIGZvcih2YXIgbSBpbiBTVkcuRlgucHJvdG90eXBlKVxyXG4gICAgaWYgKHR5cGVvZiBTVkcuRlgucHJvdG90eXBlW21dID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFNWRy5GWC5TZXQucHJvdG90eXBlW21dICE9ICdmdW5jdGlvbicpXHJcbiAgICAgIG1ldGhvZHMucHVzaChtKVxyXG5cclxuICAvLyBhcHBseSBmeCBhbGlhc3Nlc1xyXG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcclxuICAgIFNWRy5GWC5TZXQucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5zZXQubWVtYmVycy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIHRoaXMuc2V0Lm1lbWJlcnNbaV0uZnhbbWV0aG9kXS5hcHBseSh0aGlzLnNldC5tZW1iZXJzW2ldLmZ4LCBhcmd1bWVudHMpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gU3RvcmUgZGF0YSB2YWx1ZXMgb24gc3ZnIG5vZGVzXHJcbiAgZGF0YTogZnVuY3Rpb24oYSwgdiwgcikge1xyXG4gICAgaWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7XHJcbiAgICAgIGZvciAodiBpbiBhKVxyXG4gICAgICAgIHRoaXMuZGF0YSh2LCBhW3ZdKVxyXG5cclxuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmF0dHIoJ2RhdGEtJyArIGEpKVxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCdkYXRhLScgKyBhKVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hdHRyKFxyXG4gICAgICAgICdkYXRhLScgKyBhXHJcbiAgICAgICwgdiA9PT0gbnVsbCA/XHJcbiAgICAgICAgICBudWxsIDpcclxuICAgICAgICByID09PSB0cnVlIHx8IHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdiA9PT0gJ251bWJlcicgP1xyXG4gICAgICAgICAgdiA6XHJcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh2KVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn0pXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gUmVtZW1iZXIgYXJiaXRyYXJ5IGRhdGFcclxuICByZW1lbWJlcjogZnVuY3Rpb24oaywgdikge1xyXG4gICAgLy8gcmVtZW1iZXIgZXZlcnkgaXRlbSBpbiBhbiBvYmplY3QgaW5kaXZpZHVhbGx5XHJcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PSAnb2JqZWN0JylcclxuICAgICAgZm9yICh2YXIgdiBpbiBrKVxyXG4gICAgICAgIHRoaXMucmVtZW1iZXIodiwga1t2XSlcclxuXHJcbiAgICAvLyByZXRyaWV2ZSBtZW1vcnlcclxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSlcclxuICAgICAgcmV0dXJuIHRoaXMubWVtb3J5KClba11cclxuXHJcbiAgICAvLyBzdG9yZSBtZW1vcnlcclxuICAgIGVsc2VcclxuICAgICAgdGhpcy5tZW1vcnkoKVtrXSA9IHZcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gRXJhc2UgYSBnaXZlbiBtZW1vcnlcclxuLCBmb3JnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMClcclxuICAgICAgdGhpcy5fbWVtb3J5ID0ge31cclxuICAgIGVsc2VcclxuICAgICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICBkZWxldGUgdGhpcy5tZW1vcnkoKVthcmd1bWVudHNbaV1dXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpemUgb3IgcmV0dXJuIGxvY2FsIG1lbW9yeSBvYmplY3RcclxuLCBtZW1vcnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21lbW9yeSB8fCAodGhpcy5fbWVtb3J5ID0ge30pXHJcbiAgfVxyXG5cclxufSlcbi8vIE1ldGhvZCBmb3IgZ2V0dGluZyBhbiBlbGVtZW50IGJ5IGlkXHJcblNWRy5nZXQgPSBmdW5jdGlvbihpZCkge1xyXG4gIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRGcm9tUmVmZXJlbmNlKGlkKSB8fCBpZClcclxuICByZXR1cm4gU1ZHLmFkb3B0KG5vZGUpXHJcbn1cclxuXHJcbi8vIFNlbGVjdCBlbGVtZW50cyBieSBxdWVyeSBzdHJpbmdcclxuU1ZHLnNlbGVjdCA9IGZ1bmN0aW9uKHF1ZXJ5LCBwYXJlbnQpIHtcclxuICByZXR1cm4gbmV3IFNWRy5TZXQoXHJcbiAgICBTVkcudXRpbHMubWFwKChwYXJlbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIHJldHVybiBTVkcuYWRvcHQobm9kZSlcclxuICAgIH0pXHJcbiAgKVxyXG59XHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5QYXJlbnQsIHtcclxuICAvLyBTY29wZWQgc2VsZWN0IG1ldGhvZFxyXG4gIHNlbGVjdDogZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgIHJldHVybiBTVkcuc2VsZWN0KHF1ZXJ5LCB0aGlzLm5vZGUpXHJcbiAgfVxyXG5cclxufSlcbmZ1bmN0aW9uIHBhdGhSZWdSZXBsYWNlKGEsIGIsIGMsIGQpIHtcclxuICByZXR1cm4gYyArIGQucmVwbGFjZShTVkcucmVnZXguZG90cywgJyAuJylcclxufVxyXG5cclxuLy8gY3JlYXRlcyBkZWVwIGNsb25lIG9mIGFycmF5XHJcbmZ1bmN0aW9uIGFycmF5X2Nsb25lKGFycil7XHJcbiAgdmFyIGNsb25lID0gYXJyLnNsaWNlKDApXHJcbiAgZm9yKHZhciBpID0gY2xvbmUubGVuZ3RoOyBpLS07KXtcclxuICAgIGlmKEFycmF5LmlzQXJyYXkoY2xvbmVbaV0pKXtcclxuICAgICAgY2xvbmVbaV0gPSBhcnJheV9jbG9uZShjbG9uZVtpXSlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNsb25lXHJcbn1cclxuXHJcbi8vIHRlc3RzIGlmIGEgZ2l2ZW4gZWxlbWVudCBpcyBpbnN0YW5jZSBvZiBhbiBvYmplY3RcclxuZnVuY3Rpb24gaXMoZWwsIG9iail7XHJcbiAgcmV0dXJuIGVsIGluc3RhbmNlb2Ygb2JqXHJcbn1cclxuXHJcbi8vIHRlc3RzIGlmIGEgZ2l2ZW4gc2VsZWN0b3IgbWF0Y2hlcyBhbiBlbGVtZW50XHJcbmZ1bmN0aW9uIG1hdGNoZXMoZWwsIHNlbGVjdG9yKSB7XHJcbiAgcmV0dXJuIChlbC5tYXRjaGVzIHx8IGVsLm1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvciB8fCBlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm9NYXRjaGVzU2VsZWN0b3IpLmNhbGwoZWwsIHNlbGVjdG9yKTtcclxufVxyXG5cclxuLy8gQ29udmVydCBkYXNoLXNlcGFyYXRlZC1zdHJpbmcgdG8gY2FtZWxDYXNlXHJcbmZ1bmN0aW9uIGNhbWVsQ2FzZShzKSB7XHJcbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uKG0sIGcpIHtcclxuICAgIHJldHVybiBnLnRvVXBwZXJDYXNlKClcclxuICB9KVxyXG59XHJcblxyXG4vLyBDYXBpdGFsaXplIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZ1xyXG5mdW5jdGlvbiBjYXBpdGFsaXplKHMpIHtcclxuICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSlcclxufVxyXG5cclxuLy8gRW5zdXJlIHRvIHNpeC1iYXNlZCBoZXhcclxuZnVuY3Rpb24gZnVsbEhleChoZXgpIHtcclxuICByZXR1cm4gaGV4Lmxlbmd0aCA9PSA0ID9cclxuICAgIFsgJyMnLFxyXG4gICAgICBoZXguc3Vic3RyaW5nKDEsIDIpLCBoZXguc3Vic3RyaW5nKDEsIDIpXHJcbiAgICAsIGhleC5zdWJzdHJpbmcoMiwgMyksIGhleC5zdWJzdHJpbmcoMiwgMylcclxuICAgICwgaGV4LnN1YnN0cmluZygzLCA0KSwgaGV4LnN1YnN0cmluZygzLCA0KVxyXG4gICAgXS5qb2luKCcnKSA6IGhleFxyXG59XHJcblxyXG4vLyBDb21wb25lbnQgdG8gaGV4IHZhbHVlXHJcbmZ1bmN0aW9uIGNvbXBUb0hleChjb21wKSB7XHJcbiAgdmFyIGhleCA9IGNvbXAudG9TdHJpbmcoMTYpXHJcbiAgcmV0dXJuIGhleC5sZW5ndGggPT0gMSA/ICcwJyArIGhleCA6IGhleFxyXG59XHJcblxyXG4vLyBDYWxjdWxhdGUgcHJvcG9ydGlvbmFsIHdpZHRoIGFuZCBoZWlnaHQgdmFsdWVzIHdoZW4gbmVjZXNzYXJ5XHJcbmZ1bmN0aW9uIHByb3BvcnRpb25hbFNpemUoZWxlbWVudCwgd2lkdGgsIGhlaWdodCkge1xyXG4gIGlmICh3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsKSB7XHJcbiAgICB2YXIgYm94ID0gZWxlbWVudC5iYm94KClcclxuXHJcbiAgICBpZiAod2lkdGggPT0gbnVsbClcclxuICAgICAgd2lkdGggPSBib3gud2lkdGggLyBib3guaGVpZ2h0ICogaGVpZ2h0XHJcbiAgICBlbHNlIGlmIChoZWlnaHQgPT0gbnVsbClcclxuICAgICAgaGVpZ2h0ID0gYm94LmhlaWdodCAvIGJveC53aWR0aCAqIHdpZHRoXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2lkdGg6ICB3aWR0aFxyXG4gICwgaGVpZ2h0OiBoZWlnaHRcclxuICB9XHJcbn1cclxuXHJcbi8vIERlbHRhIHRyYW5zZm9ybSBwb2ludFxyXG5mdW5jdGlvbiBkZWx0YVRyYW5zZm9ybVBvaW50KG1hdHJpeCwgeCwgeSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB4OiB4ICogbWF0cml4LmEgKyB5ICogbWF0cml4LmMgKyAwXHJcbiAgLCB5OiB4ICogbWF0cml4LmIgKyB5ICogbWF0cml4LmQgKyAwXHJcbiAgfVxyXG59XHJcblxyXG4vLyBNYXAgbWF0cml4IGFycmF5IHRvIG9iamVjdFxyXG5mdW5jdGlvbiBhcnJheVRvTWF0cml4KGEpIHtcclxuICByZXR1cm4geyBhOiBhWzBdLCBiOiBhWzFdLCBjOiBhWzJdLCBkOiBhWzNdLCBlOiBhWzRdLCBmOiBhWzVdIH1cclxufVxyXG5cclxuLy8gUGFyc2UgbWF0cml4IGlmIHJlcXVpcmVkXHJcbmZ1bmN0aW9uIHBhcnNlTWF0cml4KG1hdHJpeCkge1xyXG4gIGlmICghKG1hdHJpeCBpbnN0YW5jZW9mIFNWRy5NYXRyaXgpKVxyXG4gICAgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgobWF0cml4KVxyXG5cclxuICByZXR1cm4gbWF0cml4XHJcbn1cclxuXHJcbi8vIEFkZCBjZW50cmUgcG9pbnQgdG8gdHJhbnNmb3JtIG9iamVjdFxyXG5mdW5jdGlvbiBlbnN1cmVDZW50cmUobywgdGFyZ2V0KSB7XHJcbiAgby5jeCA9IG8uY3ggPT0gbnVsbCA/IHRhcmdldC5iYm94KCkuY3ggOiBvLmN4XHJcbiAgby5jeSA9IG8uY3kgPT0gbnVsbCA/IHRhcmdldC5iYm94KCkuY3kgOiBvLmN5XHJcbn1cclxuXHJcbi8vIFBhdGhBcnJheSBIZWxwZXJzXHJcbmZ1bmN0aW9uIGFycmF5VG9TdHJpbmcoYSkge1xyXG4gIGZvciAodmFyIGkgPSAwLCBpbCA9IGEubGVuZ3RoLCBzID0gJyc7IGkgPCBpbDsgaSsrKSB7XHJcbiAgICBzICs9IGFbaV1bMF1cclxuXHJcbiAgICBpZiAoYVtpXVsxXSAhPSBudWxsKSB7XHJcbiAgICAgIHMgKz0gYVtpXVsxXVxyXG5cclxuICAgICAgaWYgKGFbaV1bMl0gIT0gbnVsbCkge1xyXG4gICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgcyArPSBhW2ldWzJdXHJcblxyXG4gICAgICAgIGlmIChhW2ldWzNdICE9IG51bGwpIHtcclxuICAgICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgICBzICs9IGFbaV1bM11cclxuICAgICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgICBzICs9IGFbaV1bNF1cclxuXHJcbiAgICAgICAgICBpZiAoYVtpXVs1XSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgICAgIHMgKz0gYVtpXVs1XVxyXG4gICAgICAgICAgICBzICs9ICcgJ1xyXG4gICAgICAgICAgICBzICs9IGFbaV1bNl1cclxuXHJcbiAgICAgICAgICAgIGlmIChhW2ldWzddICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICBzICs9ICcgJ1xyXG4gICAgICAgICAgICAgIHMgKz0gYVtpXVs3XVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcyArICcgJ1xyXG59XHJcblxyXG4vLyBEZWVwIG5ldyBpZCBhc3NpZ25tZW50XHJcbmZ1bmN0aW9uIGFzc2lnbk5ld0lkKG5vZGUpIHtcclxuICAvLyBkbyB0aGUgc2FtZSBmb3IgU1ZHIGNoaWxkIG5vZGVzIGFzIHdlbGxcclxuICBmb3IgKHZhciBpID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgaWYgKG5vZGUuY2hpbGROb2Rlc1tpXSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50KVxyXG4gICAgICBhc3NpZ25OZXdJZChub2RlLmNoaWxkTm9kZXNbaV0pXHJcblxyXG4gIHJldHVybiBTVkcuYWRvcHQobm9kZSkuaWQoU1ZHLmVpZChub2RlLm5vZGVOYW1lKSlcclxufVxyXG5cclxuLy8gQWRkIG1vcmUgYm91bmRpbmcgYm94IHByb3BlcnRpZXNcclxuZnVuY3Rpb24gZnVsbEJveChiKSB7XHJcbiAgaWYgKGIueCA9PSBudWxsKSB7XHJcbiAgICBiLnggICAgICA9IDBcclxuICAgIGIueSAgICAgID0gMFxyXG4gICAgYi53aWR0aCAgPSAwXHJcbiAgICBiLmhlaWdodCA9IDBcclxuICB9XHJcblxyXG4gIGIudyAgPSBiLndpZHRoXHJcbiAgYi5oICA9IGIuaGVpZ2h0XHJcbiAgYi54MiA9IGIueCArIGIud2lkdGhcclxuICBiLnkyID0gYi55ICsgYi5oZWlnaHRcclxuICBiLmN4ID0gYi54ICsgYi53aWR0aCAvIDJcclxuICBiLmN5ID0gYi55ICsgYi5oZWlnaHQgLyAyXHJcblxyXG4gIHJldHVybiBiXHJcbn1cclxuXHJcbi8vIEdldCBpZCBmcm9tIHJlZmVyZW5jZSBzdHJpbmdcclxuZnVuY3Rpb24gaWRGcm9tUmVmZXJlbmNlKHVybCkge1xyXG4gIHZhciBtID0gdXJsLnRvU3RyaW5nKCkubWF0Y2goU1ZHLnJlZ2V4LnJlZmVyZW5jZSlcclxuXHJcbiAgaWYgKG0pIHJldHVybiBtWzFdXHJcbn1cclxuXHJcbi8vIENyZWF0ZSBtYXRyaXggYXJyYXkgZm9yIGxvb3BpbmdcclxudmFyIGFiY2RlZiA9ICdhYmNkZWYnLnNwbGl0KCcnKVxuLy8gQWRkIEN1c3RvbUV2ZW50IHRvIElFOSBhbmQgSUUxMFxyXG5pZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gIC8vIENvZGUgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50XHJcbiAgdmFyIEN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9XHJcbiAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpXHJcbiAgICBlLmluaXRDdXN0b21FdmVudChldmVudCwgb3B0aW9ucy5idWJibGVzLCBvcHRpb25zLmNhbmNlbGFibGUsIG9wdGlvbnMuZGV0YWlsKVxyXG4gICAgcmV0dXJuIGVcclxuICB9XHJcblxyXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGVcclxuXHJcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnRcclxufVxyXG5cclxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIC8gY2FuY2VsQW5pbWF0aW9uRnJhbWUgUG9seWZpbGwgd2l0aCBmYWxsYmFjayBiYXNlZCBvbiBQYXVsIElyaXNoXHJcbihmdW5jdGlvbih3KSB7XHJcbiAgdmFyIGxhc3RUaW1lID0gMFxyXG4gIHZhciB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0J11cclxuXHJcbiAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgIHcucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICB3LmNhbmNlbEFuaW1hdGlvbkZyYW1lICA9IHdbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gIH1cclxuXHJcbiAgdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSlcclxuXHJcbiAgICAgIHZhciBpZCA9IHcuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpXHJcbiAgICAgIH0sIHRpbWVUb0NhbGwpXHJcblxyXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxyXG4gICAgICByZXR1cm4gaWRcclxuICAgIH1cclxuXHJcbiAgdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHcuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgdy5jbGVhclRpbWVvdXQ7XHJcblxyXG59KHdpbmRvdykpXHJcblxyXG5yZXR1cm4gU1ZHXHJcblxyXG59KSk7XHJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmcuanMvZGlzdC9zdmcuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgU1ZHIGZyb20gJ3N2Zy5qcydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yUmVzdWx0IHtcclxuICB2YWxpZDogYm9vbGVhblxyXG4gIGVycm9yPzogc3RyaW5nXHJcbn1cclxuY29uc3QgbWlzc2luZ00gPSAnbWlzc2luZyBNIGluIHRoZSBiZWdpbmluZydcclxuXHJcbmV4cG9ydCBjbGFzcyBIZWxwZXIge1xyXG4gIHN0YXRpYyByb3RhdGUoaW5wdXQ6IFNWRy5QYXRoQXJyYXksIHJvdGF0ZTogbnVtYmVyKTogU1ZHLlBhdGhBcnJheSB7XHJcbiAgICBjb25zdCBwYXRoID0gbmV3IFNWRy5QYXRoKClcclxuICAgIHBhdGgucGxvdChpbnB1dClcclxuICAgIGNvbnN0IG1hdHJpeCA9IHBhdGgucm90YXRlKHJvdGF0ZSkudHJhbnNmb3JtKCkubWF0cml4XHJcbiAgICBpbnB1dC52YWx1ZS5mb3JFYWNoKChlbGVtZW50OiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVsZW1lbnQubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgbGV0IHBvaW50OiBhbnkgPSBuZXcgU1ZHLlBvaW50KFtlbGVtZW50WzFdLCBlbGVtZW50WzJdXSlcclxuICAgICAgICBwb2ludCA9IHBvaW50LnRyYW5zZm9ybShtYXRyaXgpXHJcbiAgICAgICAgZWxlbWVudFsxXSA9IHBvaW50LnhcclxuICAgICAgICBlbGVtZW50WzJdID0gcG9pbnQueVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGlucHV0XHJcbiAgfVxyXG4gIHN0YXRpYyB2YWxpZGF0ZUlucHV0KGlucHV0OiBzdHJpbmcpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgaWYgKGlucHV0WzBdICE9PSAnTScgJiYgaW5wdXRbMF0gIT09ICdtJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnRFcnJvcihtaXNzaW5nTSlcclxuICAgIH1cclxuICAgIGNvbnN0IHJlZ2V4ID0gLyhNfG18THxsfFp8enxIfGh8Vnx2KS9cclxuICAgIGxldCByZXN1bHQgPSBbXVxyXG4gICAgbGV0IHNwbGl0ZWRTdHJpbmcgPSBpbnB1dC5zcGxpdChyZWdleClcclxuICAgIGlmIChzcGxpdGVkU3RyaW5nWzBdID09PSAnJykge1xyXG4gICAgICBzcGxpdGVkU3RyaW5nLnNoaWZ0KClcclxuICAgIH1cclxuICAgIGlmIChzcGxpdGVkU3RyaW5nW3NwbGl0ZWRTdHJpbmcubGVuZ3RoIC0gMV0gPT09ICcnKSB7XHJcbiAgICAgIHNwbGl0ZWRTdHJpbmcucG9wKClcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIHNwbGl0ZWRTdHJpbmcuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5sZW5ndGggIT09IDEpIHtcclxuICAgICAgICAgIGNvbnN0IHBvaW50cyA9IGVsZW1lbnQudHJpbSgpLnNwbGl0KCcgJylcclxuICAgICAgICAgIGlmIChwb2ludHMubGVuZ3RoICUgMiA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1zIGxlbmd0aCcpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBwb2ludHNJbnQgPSBwb2ludHMubWFwKHBvaW50ID0+IHBhcnNlSW50KHBvaW50KSlcclxuICAgICAgICAgIHBvaW50c0ludC5mb3JFYWNoKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwb2ludCAhPT0gJ251bWJlcicgfHwgaXNOYU4ocG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSBudW1iZXInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydEVycm9yKGVycm9yLm1lc3NhZ2UpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5yZXBvcnRTdWNjZXNzKClcclxuICB9XHJcbiAgc3RhdGljIHBhcnNlUGF0aChpbnB1dDogc3RyaW5nKTogYW55W10ge1xyXG4gICAgY29uc3QgcmVnZXggPSAvKE18bXxMfGx8Wnx6KS9cclxuICAgIGxldCByZXN1bHQgPSBbXVxyXG4gICAgbGV0IHNwbGl0ZWRTdHJpbmcgPSBpbnB1dC5zcGxpdChyZWdleClcclxuICAgIGlmIChzcGxpdGVkU3RyaW5nWzBdID09PSAnJykge1xyXG4gICAgICBzcGxpdGVkU3RyaW5nLnNoaWZ0KClcclxuICAgIH1cclxuICAgIGlmIChzcGxpdGVkU3RyaW5nW3NwbGl0ZWRTdHJpbmcubGVuZ3RoIC0gMV0gPT09ICcnKSB7XHJcbiAgICAgIHNwbGl0ZWRTdHJpbmcucG9wKClcclxuICAgIH1cclxuICAgIHNwbGl0ZWRTdHJpbmcuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgaWYgKGVsZW1lbnQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudC50cmltKCkpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gZWxlbWVudC5zcGxpdCgnICcpLm1hcChwb2ludCA9PiBwYXJzZUludChwb2ludC50cmltKCkpKVxyXG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoICUgMiA9PT0gMSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmFtcyBsZW5ndGgnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHBvaW50ICE9PSAnbnVtYmVyJyB8fCBpc05hTihwb2ludCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSBudW1iZXInKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc3QgcG9pbnRzQXJyYXkgPSBbXVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgICAgICBwb2ludHNBcnJheS5wdXNoKFtwb2ludHNbaV0sIHBvaW50c1tpICsgMV1dKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHQucHVzaChwb2ludHNBcnJheSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXN1bHRcclxuICB9XHJcbiAgc3RhdGljIGJ1aWxkUGF0aChpbnB1dDogYW55W10pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gaW5wdXQucmVkdWNlKChhY2MsIGN1cnIpID0+IHtcclxuICAgICAgcmV0dXJuIGFjYyArIGN1cnIudG9TdHJpbmcoKVxyXG4gICAgfSwgJycpXHJcbiAgICByZXR1cm4gcmVzdWx0LnJlcGxhY2UoLywvZywgJyAnKVxyXG4gIH1cclxuICBzdGF0aWMgc2NhbGUoaW5wdXQ6IFNWRy5QYXRoQXJyYXksIHNjYWxlRmFjdG9yOiBudW1iZXIpIHtcclxuICAgIGlucHV0WzFdWzBdID0gaW5wdXRbMV1bMF0ubWFwKGNvcmQgPT4gY29yZCAqIHNjYWxlRmFjdG9yKVxyXG4gICAgaW5wdXRbM10gPSBpbnB1dFszXS5tYXAoY29yZCA9PiBjb3JkLm1hcChwb2ludCA9PiBwb2ludCAqIHNjYWxlRmFjdG9yKSlcclxuICAgIHJldHVybiBpbnB1dFxyXG4gIH1cclxuICBzdGF0aWMgc2NhbGVQYXRoKGlucHV0OiBTVkcuUGF0aEFycmF5LCBzY2FsZUZhY3RvcjogbnVtYmVyKSB7XHJcbiAgICBpbnB1dC52YWx1ZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnRbMV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgZWxlbWVudFsxXSA9IGVsZW1lbnRbMV0gKiBzY2FsZUZhY3RvclxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudFsyXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBlbGVtZW50WzJdID0gZWxlbWVudFsyXSAqIHNjYWxlRmFjdG9yXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gaW5wdXRcclxuICB9XHJcbiAgc3RhdGljIHRyYW5zbGF0ZVgoaW5wdXQ6IGFueVtdLCB0cmFuc2xhdGVYRmFjdG9yOiBudW1iZXIpOiBhbnlbXSB7XHJcbiAgICBpbnB1dFsxXVswXVswXSA9IGlucHV0WzFdWzBdWzBdICsgdHJhbnNsYXRlWEZhY3RvclxyXG4gICAgaW5wdXRbM10gPSBpbnB1dFszXS5tYXAoY29yZCA9PiBbXHJcbiAgICAgIChjb3JkWzBdID0gY29yZFswXSArIHRyYW5zbGF0ZVhGYWN0b3IpLFxyXG4gICAgICBjb3JkWzFdLFxyXG4gICAgXSlcclxuICAgIHJldHVybiBpbnB1dFxyXG4gIH1cclxuICBzdGF0aWMgdHJhbnNsYXRlWFBhdGgoXHJcbiAgICBpbnB1dDogU1ZHLlBhdGhBcnJheSxcclxuICAgIHRyYW5zbGF0ZVhGYWN0b3I6IG51bWJlcixcclxuICApOiBTVkcuUGF0aEFycmF5IHtcclxuICAgIGlucHV0LnZhbHVlLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudFsxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBlbGVtZW50WzFdID0gZWxlbWVudFsxXSArIHRyYW5zbGF0ZVhGYWN0b3JcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBpbnB1dFxyXG4gIH1cclxuICBzdGF0aWMgdHJhbnNsYXRlWShpbnB1dDogYW55W10sIHRyYW5zbGF0ZVlGYWN0b3I6IG51bWJlcik6IGFueVtdIHtcclxuICAgIGlucHV0WzFdWzBdWzFdID0gaW5wdXRbMV1bMF1bMV0gKyB0cmFuc2xhdGVZRmFjdG9yXHJcbiAgICBpbnB1dFszXSA9IGlucHV0WzNdLm1hcChjb3JkID0+IFtcclxuICAgICAgY29yZFswXSxcclxuICAgICAgKGNvcmRbMV0gPSBjb3JkWzFdICsgdHJhbnNsYXRlWUZhY3RvciksXHJcbiAgICBdKVxyXG4gICAgcmV0dXJuIGlucHV0XHJcbiAgfVxyXG4gIHN0YXRpYyB0cmFuc2xhdGVZUGF0aChcclxuICAgIGlucHV0OiBTVkcuUGF0aEFycmF5LFxyXG4gICAgdHJhbnNsYXRlWUZhY3RvcjogbnVtYmVyLFxyXG4gICk6IFNWRy5QYXRoQXJyYXkge1xyXG4gICAgaW5wdXQudmFsdWUuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50WzJdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGVsZW1lbnRbMl0gPSBlbGVtZW50WzJdICsgdHJhbnNsYXRlWUZhY3RvclxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGlucHV0XHJcbiAgfVxyXG4gIHByaXZhdGUgc3RhdGljIHJlcG9ydEVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZDogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBtZXNzYWdlLFxyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHN0YXRpYyByZXBvcnRTdWNjZXNzKCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZDogdHJ1ZSxcclxuICAgIH1cclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkaXRvci9oZWxwZXJzLnRzIiwiaW1wb3J0ICcuL3N0eWxlL3N0eWxlJ1xyXG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL2VkaXRvci9lZGl0b3InXHJcbmltcG9ydCB7IEVkaXRvcklucHV0IH0gZnJvbSAnLi9lZGl0b3IvaW50ZXJmYWNlcydcclxuaW1wb3J0ICdzdmcuZHJhZ2dhYmxlLmpzJ1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnN0IGVkaXRvciA9IG5ldyBFZGl0b3IoPEVkaXRvcklucHV0PntcclxuICAgIHBhdGhJbnB1dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhdGhJbnB1dCcpLFxyXG4gICAgc2NhbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2FsZScpLFxyXG4gICAgdHJhbnNYOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNYJyksXHJcbiAgICB0cmFuc1k6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc1knKSxcclxuICAgIHJvdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvdGF0ZScpLFxyXG4gICAgb3V0cHV0OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0JyksXHJcbiAgfSlcclxufVxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvcHlCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBjb25zdCBvdXRwdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3V0cHV0JylcclxuICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcclxuICByYW5nZS5zZWxlY3ROb2RlKG91dHB1dClcclxuICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuYWRkUmFuZ2UocmFuZ2UpXHJcbiAgY29uc3Qgc3VjY2Vzc2Z1bCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5JylcclxuICBhbGVydChgUGF0aCBjb3BpZWQ6ICR7b3V0cHV0LnRleHRDb250ZW50fWApXHJcbiAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpXHJcbn0pXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hcHAudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlL3N0eWxlLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRWRpdG9ySW5wdXQsIFNWR0RhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMnXHJcbmltcG9ydCB7IEhlbHBlciB9IGZyb20gJy4vaGVscGVycydcclxuaW1wb3J0IHsgRWRpdG9yRmFjYWRlIH0gZnJvbSAnLi9lZGl0b3JGYWNhZGUnXHJcbmltcG9ydCAqIGFzIFNWRyBmcm9tICdzdmcuanMnXHJcblxyXG5leHBvcnQgY2xhc3MgRWRpdG9yIHtcclxuICBwcml2YXRlIHBhdGhJbnB1dDogSFRNTFRleHRBcmVhRWxlbWVudFxyXG4gIHByaXZhdGUgb3V0cHV0OiBIVE1MUHJlRWxlbWVudFxyXG4gIHByaXZhdGUgc3ZnUGF0aDogU1ZHLlBhdGhcclxuICBwcml2YXRlIHN2Z0RvYzogU1ZHLkRvY1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHRtbDogRWRpdG9ySW5wdXQpIHtcclxuICAgIHRoaXMucGF0aElucHV0ID0gaHRtbC5wYXRoSW5wdXRcclxuICAgIHRoaXMub3V0cHV0ID0gaHRtbC5vdXRwdXRcclxuICAgIHRoaXMuc3ZnUGF0aCA9IHRoaXMuc3ZnUGF0aCB8fCBuZXcgU1ZHLlBhdGgoKVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbWVudCBpbiBodG1sKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAoaHRtbC5oYXNPd25Qcm9wZXJ0eShlbGVtZW50KSAmJlxyXG4gICAgICAgICAgaHRtbFtlbGVtZW50XSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHx8XHJcbiAgICAgICAgaHRtbFtlbGVtZW50XSBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgICAgKSB7XHJcbiAgICAgICAgaHRtbFtlbGVtZW50XS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIF8gPT4ge1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVQYXRoKClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdmdEb2MgPSBTVkcoJ3N2Z091dHB1dCcpLnZpZXdib3goMCwgMCwgMzAwLCAzMDApXHJcbiAgICB0aGlzLmNhbGN1bGF0ZVBhdGgoKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFBvaW50KCkge1xyXG4gICAgY29uc3QgcGF0aCA9IHRoaXMuc3ZnUGF0aC5hcnJheSgpIGFzIGFueVxyXG4gICAgY29uc3QgbGFzdCA9IHBhdGgudmFsdWUucG9wKClcclxuICAgIGlmIChsYXN0WzBdID09ICdaJyB8fCBsYXN0WzBdID09ICd6Jykge1xyXG4gICAgICBwYXRoLnZhbHVlLnB1c2goWydMJywgMTAsIDEwXSlcclxuICAgICAgcGF0aC52YWx1ZS5wdXNoKGxhc3QpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwYXRoLnZhbHVlLnB1c2gobGFzdClcclxuICAgICAgcGF0aC52YWx1ZS5wdXNoKFsnTCcsIDEwLCAxMF0pXHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZHJhdyhwYXRoKVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVQYXRoKGRhdGEgPSB0aGlzLmdldFJhd1ZhbHVlKCkpIHtcclxuICAgIGxldCBwYXRoOiBTVkcuUGF0aEFycmF5XHJcbiAgICB0aGlzLm91dHB1dC50ZXh0Q29udGVudCA9ICcnXHJcbiAgICBjb25zdCByZXN1bHQgPSBIZWxwZXIudmFsaWRhdGVJbnB1dChkYXRhLnBhdGhJbnB1dClcclxuICAgIGlmIChyZXN1bHQudmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgIHRoaXMub3V0cHV0LnRleHRDb250ZW50ID0gcmVzdWx0LmVycm9yXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgcGF0aCA9IEVkaXRvckZhY2FkZS5nZXRUcmFuc2Zvcm1hdGVkUGF0aChkYXRhKVxyXG4gICAgdGhpcy5yZWRyYXcocGF0aClcclxuICB9XHJcbiAgcHJpdmF0ZSByZWRyYXcocGF0aCkge1xyXG4gICAgdGhpcy5zdmdEb2MuY2xlYXIoKVxyXG4gICAgdGhpcy5zdmdEb2MuYWRkKHRoaXMuc3ZnUGF0aClcclxuICAgIHRoaXMuZHJhd1BhdGgocGF0aClcclxuICAgIHRoaXMuYXR0YWNoQW5jb3JzKHBhdGgpXHJcbiAgfVxyXG4gIHByaXZhdGUgZHJhd1BhdGgocGF0aDogU1ZHLlBhdGhBcnJheSkge1xyXG4gICAgOyg8YW55PnRoaXMuc3ZnUGF0aCkuY2xlYXIoKVxyXG4gICAgdGhpcy5zdmdQYXRoLnBsb3QocGF0aClcclxuICAgIHRoaXMub3V0cHV0LnRleHRDb250ZW50ID0gcGF0aC50b1N0cmluZygpXHJcbiAgICB0aGlzLnN2Z1BhdGguZmlsbCgnbm9uZScpXHJcbiAgICB0aGlzLnN2Z1BhdGguc3Ryb2tlKHtcclxuICAgICAgY29sb3I6ICcjOWI0ZGNhJyxcclxuICAgICAgd2lkdGg6IDEsXHJcbiAgICAgIGxpbmVjYXA6ICdyb3VuZCcsXHJcbiAgICAgIGxpbmVqb2luOiAncm91bmQnLFxyXG4gICAgfSlcclxuICB9XHJcbiAgcHJpdmF0ZSBhdHRhY2hBbmNvcnMocGF0aDogU1ZHLlBhdGhBcnJheSkge1xyXG4gICAgcGF0aC52YWx1ZS5tYXAocG9pbnQgPT4gdGhpcy5kcmF3UG9pbnQocG9pbnQgYXMgYW55LCBwYXRoKSlcclxuICB9XHJcbiAgcHJpdmF0ZSBkcmF3UG9pbnQocG9pbnQ6IGFueVtdLCBwYXRoOiBTVkcuUGF0aEFycmF5KSB7XHJcbiAgICBpZiAocG9pbnQubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuc3ZnRG9jLmNpcmNsZSg2KS5tb3ZlKHBvaW50WzFdIC0gMywgcG9pbnRbMl0gLSAzKVxyXG4gICAgICA7KDxhbnk+Y2lyY2xlKS5kcmFnZ2FibGUoKVxyXG4gICAgICBjaXJjbGUub24oJ2RyYWdtb3ZlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgIHBvaW50WzFdID0gZXZlbnQudGFyZ2V0LmN4LmJhc2VWYWwudmFsdWVJblNwZWNpZmllZFVuaXRzXHJcbiAgICAgICAgcG9pbnRbMl0gPSBldmVudC50YXJnZXQuY3kuYmFzZVZhbC52YWx1ZUluU3BlY2lmaWVkVW5pdHNcclxuICAgICAgICB0aGlzLmRyYXdQYXRoKHBhdGgpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFJhd1ZhbHVlKCk6IFNWR0RhdGEge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGF0aElucHV0OiB0aGlzLmh0bWwucGF0aElucHV0LnZhbHVlLFxyXG4gICAgICBzY2FsZTogcGFyc2VJbnQodGhpcy5odG1sLnNjYWxlLnZhbHVlKSxcclxuICAgICAgdHJhbnNYOiBwYXJzZUludCh0aGlzLmh0bWwudHJhbnNYLnZhbHVlKSxcclxuICAgICAgdHJhbnNZOiBwYXJzZUludCh0aGlzLmh0bWwudHJhbnNZLnZhbHVlKSxcclxuICAgICAgcm90YXRlOiBwYXJzZUludCh0aGlzLmh0bWwucm90YXRlLnZhbHVlKSxcclxuICAgIH1cclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkaXRvci9lZGl0b3IudHMiLCJpbXBvcnQgeyBTVkdEYXRhIH0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi9wYXRoJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEVkaXRvckZhY2FkZSB7XHJcbiAgc3RhdGljIGdldFRyYW5zZm9ybWF0ZWRQYXRoKGlucHV0OiBTVkdEYXRhKSB7XHJcbiAgICAvLzEuIHBhcnNlXHJcbiAgICAvLzIuIHNjYWxlXHJcbiAgICAvLzMuIG1vdmVYXHJcbiAgICAvLzQuIG1vdmVZXHJcbiAgICAvLzUuIHJvdGF0ZVxyXG4gICAgLy82LiBwcmludFxyXG4gICAgY29uc3QgcGF0aCA9IG5ldyBQYXRoKGlucHV0LnBhdGhJbnB1dClcclxuICAgICAgLnNjYWxlUGF0aChpbnB1dC5zY2FsZSlcclxuICAgICAgLnRyYW5zbGF0ZVgoaW5wdXQudHJhbnNYKVxyXG4gICAgICAudHJhbnNsYXRlWShpbnB1dC50cmFuc1kpXHJcbiAgICAgIC5yb3RhdGUoaW5wdXQucm90YXRlKVxyXG4gICAgcmV0dXJuIHBhdGguZ2V0UGF0aEFycmF5KClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkaXRvci9lZGl0b3JGYWNhZGUudHMiLCJpbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMnXHJcbmltcG9ydCAqIGFzIFNWRyBmcm9tICdzdmcuanMnXHJcblxyXG5pbnRlcmZhY2UgUGF0aEFycmF5IHt9XHJcblxyXG5leHBvcnQgY2xhc3MgUGF0aCB7XHJcbiAgcHJpdmF0ZSBwYXRoOiBTVkcuUGF0aEFycmF5XHJcbiAgY29uc3RydWN0b3IoaW5wdXQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgcGF0aCA9IG5ldyBTVkcuUGF0aCgpXHJcbiAgICBwYXRoLnBsb3QoaW5wdXQpXHJcbiAgICB0aGlzLnBhdGggPSBwYXRoLmFycmF5KClcclxuICB9XHJcbiAgcHVibGljIHNjYWxlUGF0aChzY2FsZUZhY3Rvcnk6IG51bWJlcik6IFBhdGgge1xyXG4gICAgdGhpcy5wYXRoID0gSGVscGVyLnNjYWxlUGF0aCh0aGlzLnBhdGgsIHNjYWxlRmFjdG9yeSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHB1YmxpYyB0cmFuc2xhdGVYKHRyYW5zWDogbnVtYmVyKTogUGF0aCB7XHJcbiAgICB0aGlzLnBhdGggPSBIZWxwZXIudHJhbnNsYXRlWFBhdGgodGhpcy5wYXRoLCB0cmFuc1gpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwdWJsaWMgdHJhbnNsYXRlWSh0cmFuc1k6IG51bWJlcik6IFBhdGgge1xyXG4gICAgdGhpcy5wYXRoID0gSGVscGVyLnRyYW5zbGF0ZVlQYXRoKHRoaXMucGF0aCwgdHJhbnNZKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcHVibGljIGdldFBhdGhBcnJheSgpOiBTVkcuUGF0aEFycmF5IHtcclxuICAgIHJldHVybiB0aGlzLnBhdGhcclxuICB9XHJcbiAgcHVibGljIHJvdGF0ZShyb3RhdGU6IG51bWJlcik6IFBhdGgge1xyXG4gICAgdGhpcy5wYXRoID0gSGVscGVyLnJvdGF0ZSh0aGlzLnBhdGgsIHJvdGF0ZSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lZGl0b3IvcGF0aC50cyIsIi8qISBzdmcuZHJhZ2dhYmxlLmpzIC0gdjIuMi4xIC0gMjAxNi0wOC0yNVxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS93b3V0L3N2Zy5kcmFnZ2FibGUuanNcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTYgV291dCBGaWVyZW5zOyBMaWNlbnNlZCBNSVQgKi9cclxuOyhmdW5jdGlvbigpIHtcclxuXHJcbiAgLy8gY3JlYXRlcyBoYW5kbGVyLCBzYXZlcyBpdFxyXG4gIGZ1bmN0aW9uIERyYWdIYW5kbGVyKGVsKXtcclxuICAgIGVsLnJlbWVtYmVyKCdfZHJhZ2dhYmxlJywgdGhpcylcclxuICAgIHRoaXMuZWwgPSBlbFxyXG4gIH1cclxuXHJcblxyXG4gIC8vIFNldHMgbmV3IHBhcmFtZXRlciwgc3RhcnRzIGRyYWdnaW5nXHJcbiAgRHJhZ0hhbmRsZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihjb25zdHJhaW50LCB2YWwpe1xyXG4gICAgdmFyIF90aGlzID0gdGhpc1xyXG4gICAgdGhpcy5jb25zdHJhaW50ID0gY29uc3RyYWludFxyXG4gICAgdGhpcy52YWx1ZSA9IHZhbFxyXG4gICAgdGhpcy5lbC5vbignbW91c2Vkb3duLmRyYWcnLCBmdW5jdGlvbihlKXsgX3RoaXMuc3RhcnQoZSkgfSlcclxuICAgIHRoaXMuZWwub24oJ3RvdWNoc3RhcnQuZHJhZycsIGZ1bmN0aW9uKGUpeyBfdGhpcy5zdGFydChlKSB9KVxyXG4gIH1cclxuXHJcbiAgLy8gdHJhbnNmb3JtcyBvbmUgcG9pbnQgZnJvbSBzY3JlZW4gdG8gdXNlciBjb29yZHNcclxuICBEcmFnSGFuZGxlci5wcm90b3R5cGUudHJhbnNmb3JtUG9pbnQgPSBmdW5jdGlvbihldmVudCwgb2Zmc2V0KXtcclxuICAgICAgZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnRcclxuICAgICAgdmFyIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSB8fCBldmVudFxyXG4gICAgICB0aGlzLnAueCA9IHRvdWNoZXMucGFnZVggLSAob2Zmc2V0IHx8IDApXHJcbiAgICAgIHRoaXMucC55ID0gdG91Y2hlcy5wYWdlWVxyXG4gICAgICByZXR1cm4gdGhpcy5wLm1hdHJpeFRyYW5zZm9ybSh0aGlzLm0pXHJcbiAgfVxyXG4gIFxyXG4gIC8vIGdldHMgZWxlbWVudHMgYm91bmRpbmcgYm94IHdpdGggc3BlY2lhbCBoYW5kbGluZyBvZiBncm91cHMsIG5lc3RlZCBhbmQgdXNlXHJcbiAgRHJhZ0hhbmRsZXIucHJvdG90eXBlLmdldEJCb3ggPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBib3ggPSB0aGlzLmVsLmJib3goKVxyXG5cclxuICAgIGlmKHRoaXMuZWwgaW5zdGFuY2VvZiBTVkcuTmVzdGVkKSBib3ggPSB0aGlzLmVsLnJib3goKVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbCBpbnN0YW5jZW9mIFNWRy5HIHx8IHRoaXMuZWwgaW5zdGFuY2VvZiBTVkcuVXNlIHx8IHRoaXMuZWwgaW5zdGFuY2VvZiBTVkcuTmVzdGVkKSB7XHJcbiAgICAgIGJveC54ID0gdGhpcy5lbC54KClcclxuICAgICAgYm94LnkgPSB0aGlzLmVsLnkoKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib3hcclxuICB9XHJcblxyXG4gIC8vIHN0YXJ0IGRyYWdnaW5nXHJcbiAgRHJhZ0hhbmRsZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oZSl7XHJcblxyXG4gICAgLy8gY2hlY2sgZm9yIGxlZnQgYnV0dG9uXHJcbiAgICBpZihlLnR5cGUgPT0gJ2NsaWNrJ3x8IGUudHlwZSA9PSAnbW91c2Vkb3duJyB8fCBlLnR5cGUgPT0gJ21vdXNlbW92ZScpe1xyXG4gICAgICBpZigoZS53aGljaCB8fCBlLmJ1dHRvbnMpICE9IDEpe1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICBcclxuICAgIHZhciBfdGhpcyA9IHRoaXNcclxuXHJcbiAgICAvLyBmaXJlIGJlZm9yZWRyYWcgZXZlbnRcclxuICAgIHRoaXMuZWwuZmlyZSgnYmVmb3JlZHJhZycsIHsgZXZlbnQ6IGUsIGhhbmRsZXI6IHRoaXMgfSlcclxuXHJcbiAgICAvLyBzZWFyY2ggZm9yIHBhcmVudCBvbiB0aGUgZmx5IHRvIG1ha2Ugc3VyZSB3ZSBjYW4gY2FsbFxyXG4gICAgLy8gZHJhZ2dhYmxlKCkgZXZlbiB3aGVuIGVsZW1lbnQgaXMgbm90IGluIHRoZSBkb20gY3VycmVudGx5XHJcbiAgICB0aGlzLnBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXMuZWwucGFyZW50KFNWRy5OZXN0ZWQpIHx8IHRoaXMuZWwucGFyZW50KFNWRy5Eb2MpXHJcbiAgICB0aGlzLnAgPSB0aGlzLnBhcmVudC5ub2RlLmNyZWF0ZVNWR1BvaW50KClcclxuXHJcbiAgICAvLyBzYXZlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICB0aGlzLm0gPSB0aGlzLmVsLm5vZGUuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpXHJcblxyXG4gICAgdmFyIGJveCA9IHRoaXMuZ2V0QkJveCgpXHJcbiAgICBcclxuICAgIHZhciBhbmNob3JPZmZzZXQ7XHJcbiAgICBcclxuICAgIC8vIGZpeCB0ZXh0LWFuY2hvciBpbiB0ZXh0LWVsZW1lbnQgKCMzNylcclxuICAgIGlmKHRoaXMuZWwgaW5zdGFuY2VvZiBTVkcuVGV4dCl7XHJcbiAgICAgIGFuY2hvck9mZnNldCA9IHRoaXMuZWwubm9kZS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTtcclxuICAgICAgICBcclxuICAgICAgc3dpdGNoKHRoaXMuZWwuYXR0cigndGV4dC1hbmNob3InKSl7XHJcbiAgICAgICAgY2FzZSAnbWlkZGxlJzpcclxuICAgICAgICAgIGFuY2hvck9mZnNldCAvPSAyO1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICdzdGFydCc6XHJcbiAgICAgICAgICBhbmNob3JPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5zdGFydFBvaW50cyA9IHtcclxuICAgICAgLy8gV2UgdGFrZSBhYnNvbHV0ZSBjb29yZGluYXRlcyBzaW5jZSB3ZSBhcmUganVzdCB1c2luZyBhIGRlbHRhIGhlcmVcclxuICAgICAgcG9pbnQ6IHRoaXMudHJhbnNmb3JtUG9pbnQoZSwgYW5jaG9yT2Zmc2V0KSxcclxuICAgICAgYm94OiAgIGJveCxcclxuICAgICAgdHJhbnNmb3JtOiB0aGlzLmVsLnRyYW5zZm9ybSgpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIGFkZCBkcmFnIGFuZCBlbmQgZXZlbnRzIHRvIHdpbmRvd1xyXG4gICAgU1ZHLm9uKHdpbmRvdywgJ21vdXNlbW92ZS5kcmFnJywgZnVuY3Rpb24oZSl7IF90aGlzLmRyYWcoZSkgfSlcclxuICAgIFNWRy5vbih3aW5kb3csICd0b3VjaG1vdmUuZHJhZycsIGZ1bmN0aW9uKGUpeyBfdGhpcy5kcmFnKGUpIH0pXHJcbiAgICBTVkcub24od2luZG93LCAnbW91c2V1cC5kcmFnJywgZnVuY3Rpb24oZSl7IF90aGlzLmVuZChlKSB9KVxyXG4gICAgU1ZHLm9uKHdpbmRvdywgJ3RvdWNoZW5kLmRyYWcnLCBmdW5jdGlvbihlKXsgX3RoaXMuZW5kKGUpIH0pXHJcblxyXG4gICAgLy8gZmlyZSBkcmFnc3RhcnQgZXZlbnRcclxuICAgIHRoaXMuZWwuZmlyZSgnZHJhZ3N0YXJ0Jywge2V2ZW50OiBlLCBwOiB0aGlzLnN0YXJ0UG9pbnRzLnBvaW50LCBtOiB0aGlzLm0sIGhhbmRsZXI6IHRoaXN9KVxyXG5cclxuICAgIC8vIHByZXZlbnQgYnJvd3NlciBkcmFnIGJlaGF2aW9yXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAvLyBwcmV2ZW50IHByb3BhZ2F0aW9uIHRvIGEgcGFyZW50IHRoYXQgbWlnaHQgYWxzbyBoYXZlIGRyYWdnaW5nIGVuYWJsZWRcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvLyB3aGlsZSBkcmFnZ2luZ1xyXG4gIERyYWdIYW5kbGVyLnByb3RvdHlwZS5kcmFnID0gZnVuY3Rpb24oZSl7XHJcblxyXG4gICAgdmFyIGJveCA9IHRoaXMuZ2V0QkJveCgpXHJcbiAgICAgICwgcCAgID0gdGhpcy50cmFuc2Zvcm1Qb2ludChlKVxyXG4gICAgICAsIHggICA9IHRoaXMuc3RhcnRQb2ludHMuYm94LnggKyBwLnggLSB0aGlzLnN0YXJ0UG9pbnRzLnBvaW50LnhcclxuICAgICAgLCB5ICAgPSB0aGlzLnN0YXJ0UG9pbnRzLmJveC55ICsgcC55IC0gdGhpcy5zdGFydFBvaW50cy5wb2ludC55XHJcbiAgICAgICwgYyAgID0gdGhpcy5jb25zdHJhaW50XHJcbiAgICAgICwgZ3ggID0gcC54IC0gdGhpcy5zdGFydFBvaW50cy5wb2ludC54XHJcbiAgICAgICwgZ3kgID0gcC55IC0gdGhpcy5zdGFydFBvaW50cy5wb2ludC55XHJcbiAgICAgIFxyXG4gICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdkcmFnbW92ZScsIHtcclxuICAgICAgICBkZXRhaWw6IHtcclxuICAgICAgICAgICAgZXZlbnQ6IGVcclxuICAgICAgICAgICwgcDogcFxyXG4gICAgICAgICAgLCBtOiB0aGlzLm1cclxuICAgICAgICAgICwgaGFuZGxlcjogdGhpc1xyXG4gICAgICAgIH1cclxuICAgICAgLCBjYW5jZWxhYmxlOiB0cnVlXHJcbiAgICB9KVxyXG4gICAgICBcclxuICAgIHRoaXMuZWwuZmlyZShldmVudClcclxuICAgIFxyXG4gICAgaWYoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuIHBcclxuXHJcbiAgICAvLyBtb3ZlIHRoZSBlbGVtZW50IHRvIGl0cyBuZXcgcG9zaXRpb24sIGlmIHBvc3NpYmxlIGJ5IGNvbnN0cmFpbnRcclxuICAgIGlmICh0eXBlb2YgYyA9PSAnZnVuY3Rpb24nKSB7XHJcblxyXG4gICAgICB2YXIgY29vcmQgPSBjLmNhbGwodGhpcy5lbCwgeCwgeSwgdGhpcy5tKVxyXG5cclxuICAgICAgLy8gYm9vbCwganVzdCBzaG93IHVzIGlmIG1vdmVtZW50IGlzIGFsbG93ZWQgb3Igbm90XHJcbiAgICAgIGlmICh0eXBlb2YgY29vcmQgPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgY29vcmQgPSB7XHJcbiAgICAgICAgICB4OiBjb29yZCxcclxuICAgICAgICAgIHk6IGNvb3JkXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpZiB0cnVlLCB3ZSBqdXN0IG1vdmUuIElmICFmYWxzZSBpdHMgYSBudW1iZXIgYW5kIHdlIG1vdmUgaXQgdGhlcmVcclxuICAgICAgaWYgKGNvb3JkLnggPT09IHRydWUpIHtcclxuICAgICAgICB0aGlzLmVsLngoeClcclxuICAgICAgfSBlbHNlIGlmIChjb29yZC54ICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuZWwueChjb29yZC54KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY29vcmQueSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuZWwueSh5KVxyXG4gICAgICB9IGVsc2UgaWYgKGNvb3JkLnkgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5lbC55KGNvb3JkLnkpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjID09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAvLyBrZWVwIGVsZW1lbnQgd2l0aGluIGNvbnN0cmFpbmVkIGJveFxyXG4gICAgICBpZiAoYy5taW5YICE9IG51bGwgJiYgeCA8IGMubWluWClcclxuICAgICAgICB4ID0gYy5taW5YXHJcbiAgICAgIGVsc2UgaWYgKGMubWF4WCAhPSBudWxsICYmIHggPiBjLm1heFggLSBib3gud2lkdGgpe1xyXG4gICAgICAgIHggPSBjLm1heFggLSBib3gud2lkdGhcclxuICAgICAgfWlmIChjLm1pblkgIT0gbnVsbCAmJiB5IDwgYy5taW5ZKVxyXG4gICAgICAgIHkgPSBjLm1pbllcclxuICAgICAgZWxzZSBpZiAoYy5tYXhZICE9IG51bGwgJiYgeSA+IGMubWF4WSAtIGJveC5oZWlnaHQpXHJcbiAgICAgICAgeSA9IGMubWF4WSAtIGJveC5oZWlnaHRcclxuICAgICAgICBcclxuICAgICAgaWYodGhpcy5lbCBpbnN0YW5jZW9mIFNWRy5HKVxyXG4gICAgICAgIHRoaXMuZWwubWF0cml4KHRoaXMuc3RhcnRQb2ludHMudHJhbnNmb3JtKS50cmFuc2Zvcm0oe3g6Z3gsIHk6IGd5fSwgdHJ1ZSlcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuZWwubW92ZSh4LCB5KVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBzbyB3ZSBjYW4gdXNlIGl0IGluIHRoZSBlbmQtbWV0aG9kLCB0b29cclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG5cclxuICBEcmFnSGFuZGxlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZSl7XHJcblxyXG4gICAgLy8gZmluYWwgZHJhZ1xyXG4gICAgdmFyIHAgPSB0aGlzLmRyYWcoZSk7XHJcblxyXG4gICAgLy8gZmlyZSBkcmFnZW5kIGV2ZW50XHJcbiAgICB0aGlzLmVsLmZpcmUoJ2RyYWdlbmQnLCB7IGV2ZW50OiBlLCBwOiBwLCBtOiB0aGlzLm0sIGhhbmRsZXI6IHRoaXMgfSlcclxuXHJcbiAgICAvLyB1bmJpbmQgZXZlbnRzXHJcbiAgICBTVkcub2ZmKHdpbmRvdywgJ21vdXNlbW92ZS5kcmFnJylcclxuICAgIFNWRy5vZmYod2luZG93LCAndG91Y2htb3ZlLmRyYWcnKVxyXG4gICAgU1ZHLm9mZih3aW5kb3csICdtb3VzZXVwLmRyYWcnKVxyXG4gICAgU1ZHLm9mZih3aW5kb3csICd0b3VjaGVuZC5kcmFnJylcclxuXHJcbiAgfVxyXG5cclxuICBTVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgICAvLyBNYWtlIGVsZW1lbnQgZHJhZ2dhYmxlXHJcbiAgICAvLyBDb25zdHJhaW50IG1pZ2h0IGJlIGFuIG9iamVjdCAoYXMgZGVzY3JpYmVkIGluIHJlYWRtZS5tZCkgb3IgYSBmdW5jdGlvbiBpbiB0aGUgZm9ybSBcImZ1bmN0aW9uICh4LCB5KVwiIHRoYXQgZ2V0cyBjYWxsZWQgYmVmb3JlIGV2ZXJ5IG1vdmUuXHJcbiAgICAvLyBUaGUgZnVuY3Rpb24gY2FuIHJldHVybiBhIGJvb2xlYW4gb3IgYW4gb2JqZWN0IG9mIHRoZSBmb3JtIHt4LCB5fSwgdG8gd2hpY2ggdGhlIGVsZW1lbnQgd2lsbCBiZSBtb3ZlZC4gXCJGYWxzZVwiIHNraXBzIG1vdmluZywgdHJ1ZSBtb3ZlcyB0byByYXcgeCwgeS5cclxuICAgIGRyYWdnYWJsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnQpIHtcclxuXHJcbiAgICAgIC8vIENoZWNrIHRoZSBwYXJhbWV0ZXJzIGFuZCByZWFzc2lnbiBpZiBuZWVkZWRcclxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0cmFpbnQgPSB2YWx1ZVxyXG4gICAgICAgIHZhbHVlID0gdHJ1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZHJhZ0hhbmRsZXIgPSB0aGlzLnJlbWVtYmVyKCdfZHJhZ2dhYmxlJykgfHwgbmV3IERyYWdIYW5kbGVyKHRoaXMpXHJcblxyXG4gICAgICAvLyBXaGVuIG5vIHBhcmFtZXRlciBpcyBnaXZlbiwgdmFsdWUgaXMgdHJ1ZVxyXG4gICAgICB2YWx1ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogdmFsdWVcclxuXHJcbiAgICAgIGlmKHZhbHVlKSBkcmFnSGFuZGxlci5pbml0KGNvbnN0cmFpbnQgfHwge30sIHZhbHVlKVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLm9mZignbW91c2Vkb3duLmRyYWcnKVxyXG4gICAgICAgIHRoaXMub2ZmKCd0b3VjaHN0YXJ0LmRyYWcnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICB9KVxyXG5cclxufSkuY2FsbCh0aGlzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmcuZHJhZ2dhYmxlLmpzL2Rpc3Qvc3ZnLmRyYWdnYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9