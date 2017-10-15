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
    define(["jquery"], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    // Node/CommonJS import
    module.exports = function () {
      var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : global.window;
      return factory(require("jQuery")(window));
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  "use strict";

  /**
   * @memberof IconPatterns
   * @property {object} DEFAULTS           - The default setupf or iconPatterns
   * @property {array} DEFAULTS.animations - The available animation types
   * @property {number} DEFAULTS.size      - The default icon size
   * @property {string} DEFAULTS.color     - The default icon color
   * @property {object} ANIMATIONS         - The available animation styles
   */

  $.iconPatterns = {
    DEFAULTS: {
      color: "#FFFFFF"
    },
    ANIMATIONS: {
      INITIALIZE: ["initialize", "initialize--fast", "initialize--slow"],
      ROTATE: ["rotate", "rotate--fast", "rotate--slow", "rotate--reverse", "rotate--reverse--fast", "rotate--reverse--slow"],
      EXPAND: ["expand", "expand--fast", "expand--slow", "expand--reverse", "expand--reverse--fast", "expand--reverse--slow"]
    }
  };

  /**
   * Internal helper functions
   *
   * @namespace IconPatterns.Helpers
   * @memberof IconPatterns
   * @returns {object}
   */
  var Helpers = {

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
   * @param {jQuery} $target    - The jQuery object where the overlay will be applied
   * @param {object} config        - Configuration properties
   * @param {array} config.icons   - The icon properties to use
   * @param {string} config.color  - The icon color to use
   * @returns {PatternInstance}
   */
  function PatternInstance($target) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!$target || !$target.length) {
      throw new Error("Missing `target` jQuery instance");
    }
    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error("Missing `icons` configuration from config file");
    }
    this.color = config.color;
    this.icons = config.icons;
    this.width = $target.outerWidth();
    this.height = $target.outerHeight();
    this.$overlay = this.generateOverlay(this.width, this.height);
    this.$target = $target;
    this.$target.css("position", "relative");
    this.$target.prepend(this.$overlay);
  }

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
   * @returns {jquery} icon
   */
  PatternInstance.prototype.generateIcon = function (color, className, size, pos, rotation, animations) {
    var iconStyle = ["font-size: " + size + "px", "color: " + color];
    var spanStyle = ["left: " + pos.x + "px", "top: " + pos.y + "px", "-webkit-transform: rotate(" + rotation + "deg)", "-MS-transform: rotate(" + rotation + "deg)", "transform: rotate(" + rotation + "deg)"];
    return $("<span class='icon-patterns__animations__initial " + animations.initial + "' style='" + spanStyle.join(";") + "'><span class='icon-patterns__animations__expand " + animations.expand + "'> <i class='" + [className, animations.rotate].join(" ") + "' style='" + iconStyle.join(";") + "'></i></span></span>");
  };

  /**
   * Generates overlay <div>
   *
   * @method generateOverlay
   * @memberof IconPatterns.PatternInstance
   * @returns {number} width    - The parent container width
   * @returns {number} height   - The parent container height
   * @returns {jquery} overlay
   */
  PatternInstance.prototype.generateOverlay = function (width, height) {
    var $overlay = $("<div class='icon-patterns__overlay'></div>");
    $overlay.width(width);
    $overlay.height(height);
    $overlay.css({ "position": "absolute", "z-index": 1, "top": 0, "left": 0 });
    return $overlay;
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

    var ANIMATIONS = $.iconPatterns.ANIMATIONS;
    var iconsArray = Object.entries(this.icons);
    // Determine grid positions for all icons
    var totalCount = iconsArray.reduce(function (acc, icon) {
      return acc + icon[1].count;
    }, 0);
    var positions = Helpers.Random.positions(totalCount, this.width, this.height);
    // Generate and append icons
    iconsArray.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          properties = _ref2[1];

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
        var $icon = _this.generateIcon(_this.color, name, size, pos, rotation, animations);
        _this.$overlay.append($icon);
      });
    });
    return this;
  };

  /**
   * Attaches IconPatern to jQuery namespace
   * @private
   */
  $.extend($.fn, {
    /**
     * Retunns a new PatternInstance for a given configuration
     *
     * @method IconPatterns
     * @param {object} config        - Configuration properties
     * @param {array} config.icons   - The icon properties to use
     * @param {string} config.color  - The icon color to use
     * @returns {PatternInstance}
     */
    IconPatterns: /* istanbul ignore next */function IconPatterns(config) {
      return new PatternInstance($(this), Object.assign({}, config, $.iconPatterns.DEFAULTS));
    }
  });

  /**
   * Public functions
   */
  return { Helpers: Helpers, PatternInstance: PatternInstance };
});