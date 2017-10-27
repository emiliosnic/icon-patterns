"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @namespace IconPatterns
 */
(function (factory) {
  /* istanbul ignore next */
  if (typeof define === "function" && define.amd) {
    // AMD import
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    // Node/CommonJS import
    module.exports = function () {
      return factory();
    };
  } else {
    // Browser globals
    window.IconPatterns = window.IconPatterns || factory().PatternInstance;
  }
})(function () {
  "use strict";

  /**
   * @memberof IconPatterns
   * @property {object} DEFAULTS           - The default values
   * @property {string} DEFAULTS.color     - The default icon color
   */

  var DEFAULTS = {
    color: "#FFFFFF"
  };

  /**
   * @memberof IconPatterns
   * @property {object} ANIMATIONS           - The default animations
   * @property {string} DEFAULTS.INITIALIZE  - Default initialization animations
   * @property {string} DEFAULTS.ROTATE      - Default rotate animations
   * @property {string} DEFAULTS.EXPAND      - Default expand animations
   */
  var ANIMATIONS = {
    INITIALIZE: ["initialize", "initialize--fast", "initialize--slow"],
    ROTATE: ["none", "rotate", "rotate--fast", "rotate--slow", "rotate--reverse", "rotate--reverse--fast", "rotate--reverse--slow"],
    EXPAND: ["none", "expand", "expand--fast", "expand--slow", "expand--reverse", "expand--reverse--fast", "expand--reverse--slow"]
  };

  /**
   * Internal helper functions
   *
   * @namespace IconPatterns.Helpers
   * @memberof IconPatterns
   * @returns {object}
   */
  var Helpers = {

    DOM: {

      /**
       * Appends classes to an HTMLElement node
       *
       * @method Helpers.DOM.appendClasses
       * @memberof IconPatterns
       * @param {HTMLElement} htmlElement - The DOM node to update
       * @param {array} classes           - The classes to append
       */
      appendClasses: function appendClasses(htmlElement, classes) {
        htmlElement.className += String([""].concat(classes).join(" "));
      },

      /**
       * Appends style attributes to an HTMLElement
       *
       * @method Helpers.DOM.appendStyle
       * @memberof IconPatterns
       * @param {HTMLElement} htmlElement - The DOM node to update
       * @param {object} style            - The style attributes to append
       */
      appendStyle: function appendStyle(htmlElement, style) {
        if (!(style instanceof Object) || !(htmlElement instanceof HTMLElement)) {
          return;
        }
        Object.entries(style).forEach(function (_ref, idx) {
          var _ref2 = _slicedToArray(_ref, 2),
              attribute = _ref2[0],
              value = _ref2[1];

          htmlElement.style[attribute] = value;
        });
      },

      /**
       * Generates an HTMLElement node with class and style attributes
       *
       * @method Helpers.DOM.generateElement
       * @param {String} tag    - The tag to use
       * @param {array} classes - The classes to append
       * @param {object} style  - The style attributes to append
       * @memberof IconPatterns
       * @returns {HTMLElement}
       */
      generateElement: function generateElement(tag, classes, style) {
        var element = document.createElement(tag);
        Helpers.DOM.appendClasses(element, classes);
        Helpers.DOM.appendStyle(element, style);
        return element;
      }
    },

    Random: {

      /**
       * Generates a random degree count for a rotation (0deg - 360deg)
       *
       * @method Helpers.Random.rotation
       * @memberof IconPatterns
       * @returns {number} degrees
       */
      rotation: function rotation() {
        return Math.round(Math.random() * 360) + 1;
      },

      /**
       * Returns random number within a range
       *
       * @method Helpers.Random.number
       * @memberof IconPatterns
       * @param {number} min  - Min value allowed
       * @param {number} max  - Max value allowed
       * @returns {number}
       */
      number: function number(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },

      /**
       * Returns random item from an array
       *
       * @method Helpers.Random.itemFrom
       * @memberof IconPatterns
       * @param {array}  - The base array from which the item will be extracted
       * @returns {*} item
       */
      itemFrom: function itemFrom(arr) {
        return arr[Helpers.Random.number(0, arr.length)];
      },

      /**
       * Returns random position within a region
       *
       * @method Helpers.Random.offset
       * @memberof IconPatterns
       * @param {number} width     - X axis size
       * @param {number} height    - Y axis size
       * @returns {object} pos     - Random position
       * @returns {number} pos.x   - Random position X offset
       * @returns {number} pos.y   - Random position Y offset
       */
      offset: function offset(width, height) {
        return {
          x: parseInt(Math.random() * width),
          y: parseInt(Math.random() * height)
        };
      },

      /**
       * Returns an array of uniformly distributed position within a region
       *
       * @method Helpers.Random.positions
       * @memberof IconPatterns
       * @param {number} count         - The number of positions to generate
       * @param {number} width         - X axis size
       * @param {number} height        - Y axis size
       * @param {number} offsetRation  - The ratio (0-1) relative to grid cell width & height, which detemrine how far fro the center icons can be
       * @returns {array} positions    - Random position
       */
      positions: function positions(count) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var offsetRatio = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;

        if (!count || count <= 0) {
          throw new Error("Argument `count` should be greater than zero");
        }
        // Apply a square matrix and then expand it on the horizontal axis
        var cellCount = Math.floor(Math.sqrt(count)) + 1;
        var grid = {
          rows: cellCount,
          columns: cellCount,
          width: Math.floor(width / cellCount),
          height: Math.floor(height / cellCount)
        };
        return Array.from(Array(count)).map(function (t, index) {
          var column = Math.floor(index / grid.columns);
          var row = index % grid.rows;
          // Determine base position and offset on axes
          var xPos = grid.width * row + grid.width / 2;
          var yPos = grid.height * column + grid.height / 2;
          var offset = Helpers.Random.offset(offsetRatio * (width / 2), offsetRatio * (height / 2));
          return {
            x: Helpers.Random.itemFrom([xPos + offset.x, xPos - offset.x]),
            y: Helpers.Random.itemFrom([yPos + offset.y, yPos - offset.y])
          };
        });
      }
    }
  };

  /**
   * @class PatternInstance
   *
   * @constructor
   * @memberof IconPatterns
   * @param {HTMLElement} target   - The DOM element where the overlay will be applied
   * @param {object} config        - Configuration properties
   * @param {array} config.icons   - The icon properties to use
   * @param {string} config.color  - The icon color to use
   * @returns {PatternInstance}
   */
  function PatternInstance(target) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!target || !(target instanceof HTMLElement)) {
      throw new Error("Missing `target` HTMLElement");
    }
    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error("Missing `icons` configuration from config file");
    }
    config = Object.assign({}, config, DEFAULTS);
    this.color = config.color;
    this.icons = config.icons;
    this.width = target.offsetWidth;
    this.height = target.offsetHeight;
    this.DOM_overlay = this.generateOverlay(this.width, this.height);
    this.DOM_container = this.generateContainer(target);
    this.DOM_container.appendChild(this.DOM_overlay);
  }

  /**
   * Gerneates container object where icons will be placed
   *
   * @method generateContainer
   * @memberof IconPatterns.PatternInstance
   * @param {HTMLElement} DOM_root       - The DOM item to use
   * @returns {HTMLElement} container
   */
  PatternInstance.prototype.generateContainer = function (DOM_root) {
    Helpers.DOM.appendStyle(DOM_root, { position: "relative" });
    // For all children of the target ensure that z-index is greater than 0
    Object.entries(DOM_root.childNodes).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          idx = _ref4[0],
          element = _ref4[1];

      if (element instanceof HTMLElement && element.style["z-index"] === "auto") {
        Helpers.DOM.appendStyle(element, { "z-index": "1" });
      }
    });
    return DOM_root;
  };

  /**
   * Generates an icon
   *
   * @method generateIcon
   * @memberof IconPatterns.PatternInstance
   * @param {string} name                - Icon name tag
   * @param {string} size                - Icon size (in px)
   * @param {string} pos                 - Icon position
   * @param {number} pos.x               - X axis offset
   * @param {number} pos.y               - Y axis offset
   * @param {number} rotation            - Icon rotation (in degrees 0 - 360)
   * @param {object} animations          - The available set of animations to use
   * @param {string} animations.initial  - Animation set for initial behaviour
   * @param {string} animations.expand   - Animation set for expansion behaviour
   * @param {string} animations.rotate   - Animation set for rotation behaviour
   * @returns {HTMLElement} icon
   */
  PatternInstance.prototype.generateIcon = function (color, className, size, pos, rotation, animations) {
    var iconStyle = {
      "font-size": size + "px",
      "color": color
    };
    var spanStyle = {
      "position": "absolute",
      "left": pos.x + "px",
      "top": pos.y + "px",
      "-webkit-transform": "rotate(" + rotation + "deg)",
      "-MS-transform": "rotate(" + rotation + "deg)",
      "transform": "rotate(" + rotation + "deg)"
    };
    var DOM_icon = Helpers.DOM.generateElement("i", [className].concat(animations.rotate), iconStyle);
    var DOM_span = Helpers.DOM.generateElement("span", ["icon-patterns__animations__expand"].concat(animations.expand));
    var DOM_wrapper = Helpers.DOM.generateElement("span", ["icon-patterns__animations__initial"].concat(animations.initial), spanStyle);
    DOM_span.appendChild(DOM_icon);
    DOM_wrapper.appendChild(DOM_span);
    return DOM_wrapper;
  };

  /**
   * Generates overlay <div>
   *
   * @method generateOverlay
   * @memberof IconPatterns.PatternInstance
   * @returns {number} width    - The parent container width
   * @returns {number} height   - The parent container height
   * @returns {HTMLElement} overlay
   */
  PatternInstance.prototype.generateOverlay = function (width, height) {
    var overlayStyle = {
      "width": width + "px",
      "height": height + "px",
      "position": "absolute",
      "top": 0,
      "left": 0,
      "z-index": 0
    };
    return Helpers.DOM.generateElement("div", ["icon-patterns__overlay"], overlayStyle);
  };

  /**
   * Renders a canvas scene with icons
   *
   * @method draw
   * @memberof IconPatterns.PatternInstance
   * @returns {IconPatterns.PatternInstance}
   */
  PatternInstance.prototype.draw = function () {
    var _this = this;

    var iconsArray = Object.entries(this.icons);
    // Determine grid positions for all icons
    var totalCount = iconsArray.reduce(function (acc, icon) {
      return acc + icon[1].count;
    }, 0);
    var positions = Helpers.Random.positions(totalCount, this.width, this.height);
    // Generate and append icons
    iconsArray.forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          name = _ref6[0],
          properties = _ref6[1];

      var sizeVariation = properties.sizeVariation,
          count = properties.count;

      Array.from(Array(count)).forEach(function () {
        // Generate a random position for each icon
        var rotation = Helpers.Random.rotation();
        var positionOffset = Helpers.Random.number(0, positions.length - 1);
        var pos = positions.splice(positionOffset, 1)[0];
        // Determine sizeWeight for each icon
        var size = Helpers.Random.number(sizeVariation[0], sizeVariation[1]);
        // Determine animation styles
        var animations = {
          initial: Helpers.Random.itemFrom(ANIMATIONS.INITIALIZE),
          rotate: Helpers.Random.itemFrom(ANIMATIONS.ROTATE),
          expand: Helpers.Random.itemFrom(ANIMATIONS.EXPAND)
        };
        var DOM_icon = _this.generateIcon(_this.color, name, size, pos, rotation, animations);
        _this.DOM_overlay.appendChild(DOM_icon);
      });
    });
    return this;
  };

  /**
   * Public functions
   */
  return { Helpers: Helpers, PatternInstance: PatternInstance };
});