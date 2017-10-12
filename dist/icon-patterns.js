"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @namespace IconPatterns
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD import
    define(["jquery"], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    // Node/CommonJS import
    if (global.window) {
      module.exports = factory(require("jQuery")(global.window));
    } else {
      var JSDOM = require("jsdom").JSDOM;
      module.exports = factory(require("jQuery")(new JSDOM("<!DOCTYPE html>").window));
    }
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
      ROTATE: ["rotate", "rotate--fast", "rotate--slow", "rotate-reverse", "rotate-reverse--fast", "rotate-reverse--slow"],
      EXPAND: ["expand", "expand--fast", "expand--slow", "expand-reverse", "expand-reverse--fast", "expand-reverse--slow"]
    }
  };

  /**
   * Internal helper functions
   *
   * @namespace IconPatterns.Helpers
   * @memberof IconPatterns
   * @return {Object}
   */
  var Helpers = {
    /**
     * Generates a random degree count for a rotation (0deg - 360deg)
     *
     * @method Helpers.getRandomRotation
     * @memberof IconPatterns
     * @return {number} degrees
     */
    getRandomRotation: function getRandomRotation() {
      return Math.round(Math.random() * 360) + 1;
    },

    /**
     * Returns random number within a range
     *
     * @method Helpers.getRandomNumber
     * @memberof IconPatterns
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    getRandomNumber: function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    /**
     * Returns random item from an array
     *
     * @method Helpers.getRandomItemFrom
     * @memberof IconPatterns
     * @param {array}
     * @return {any} item
     */
    getRandomItemFrom: function getRandomItemFrom(arr) {
      return arr[Helpers.getRandomNumber(0, arr.length)];
    }

  };

  /**
   * @class PatternInstance
   *
   * @constructor
   * @memberof IconPatterns
   * @param {jQuery} $container
   * @param {object} config
   * @return {PatternInstance}
   */
  function PatternInstance($container) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error("Missing `icons` configuration from config file");
    }
    this.color = config.color;
    this.icons = config.icons;
    this.$container = $container;
    this.$container.css("position", "relative");
  }

  /**
   * Generates an icon
   *
   * @method generateIcon
   * @memberof IconPatterns.PatternInstance
   * @param {string} name
   * @param {number} size
   * @param {object} pos
   * @param {number} rotation
   * @return {jquery} icon
   */
  PatternInstance.prototype.generateIcon = function (color, className, size, pos, rotation, initialAnimation, rotationAnimation, expandAnimation) {
    var iconStyle = ["font-size: " + size + "px", "color: " + color];
    var spanStyle = ["left: " + pos.x + "px", "top:" + pos.y + "px", "-webkit-transform: rotate(" + rotation + "deg)", "-MS-transform: rotate(" + rotation + "deg)", "transform: rotate(" + rotation + "deg)"];
    return $("<span class='icon-patterns__animations__initial " + initialAnimation + "' style='" + spanStyle.join(";") + "'><span class='icon-patterns__animations__entrance " + expandAnimation + "'> <i class='" + [className, rotationAnimation].join(" ") + "' style='" + iconStyle.join(";") + "'></i></span></span>");
  };

  /**
   * Generates overlay <div>
   *
   * @method generateOverlay
   * @memberof IconPatterns.PatternInstance
   * @return {jquery} overlay
   */
  PatternInstance.prototype.generateOverlay = function () {
    var $element = $("<div class='icon-patterns__overlay'></div>");
    $element.css({
      "position": "absolute",
      "z-index": 1,
      "top": 0,
      "left": 0
    });
    return $element;
  };

  /**
   * Redreaw a canvas scene
   *
   * @method redraw
   * @memberof IconPatterns.PatternInstance
   * @return {IconPatterns.PatternInstance}
   */
  PatternInstance.prototype.redraw = function () {
    this.$overlay.remove();
    this.draw();
    return this;
  };

  /**
   * Renders a canvas scene with icons
   *
   * @method draw
   * @memberof IconPatterns.PatternInstance
   * @return {IconPatterns.PatternInstance}
   */
  PatternInstance.prototype.draw = function () {
    var ANIMATIONS = $.iconPatterns.ANIMATIONS;
    var containerWidth = this.$container.outerWidth();
    var containerHeight = this.$container.outerHeight();
    this.$overlay = this.generateOverlay();
    this.$overlay.width(containerWidth);
    this.$overlay.height(containerHeight);
    this.$container.prepend(this.$overlay);
    for (var name in this.icons) {
      var icon = this.icons[name];
      var rotation = Helpers.getRandomRotation();
      for (var idx = 0; idx < icon.count; idx++) {
        var pos = {
          x: parseInt(Math.random() * containerWidth),
          y: parseInt(Math.random() * containerHeight)
        };
        // Determine sizeWeight for each icon
        var size = Helpers.getRandomNumber(icon.sizeVariation[0], icon.sizeVariation[1]);
        // Determine initial animation for all icons
        var initialAnimation = Helpers.getRandomItemFrom(ANIMATIONS.INITIALIZE);
        // Determine animations
        var rotationAnimation = Helpers.getRandomItemFrom(ANIMATIONS.ROTATE);
        var expandAnimation = Helpers.getRandomItemFrom(ANIMATIONS.EXPAND);
        // Generate and append icon
        var $icon = this.generateIcon(this.color, name, size, pos, rotation, initialAnimation, rotationAnimation, expandAnimation);
        this.$overlay.append($icon);
      }
    }
    return this;
  };

  /**
   * Attaches IconPatern to jQuery namespace
   * @ignore
   */
  $.extend($.fn, {
    /**
     * Retunns a new PatternInstance for a given configuration
     *
     * @method IconPatterns
     * @param {object} config
     * @return {PatternInstance}
     */
    IconPatterns: function IconPatterns(config) {
      return new PatternInstance($(this), Object.assign({}, config, $.iconPatterns.DEFAULTS));
    }
  });

  /**
   * Public functions
   */
  return {
    Helpers: Helpers,
    PatternInstance: PatternInstance
  };
});