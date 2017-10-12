/**
 * @namespace IconPatterns
 */
(function(factory) {
  if (typeof define === "function" && define.amd) {
    // AMD import
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // Node/CommonJS import
    if (global.window) {
      module.exports = factory(require("jQuery")(global.window));
    } else {
      const JSDOM = require("jsdom").JSDOM;
      module.exports = factory(require("jQuery")(new JSDOM("<!DOCTYPE html>").window));
    }
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
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
      color: "#FFFFFF",
    },
    ANIMATIONS: {
      INITIALIZE: ["initialize", "initialize--fast", "initialize--slow"],
      ROTATE: ["rotate", "rotate--fast", "rotate--slow", "rotate-reverse", "rotate-reverse--fast", "rotate-reverse--slow"],
      EXPAND: ["expand", "expand--fast", "expand--slow", "expand-reverse", "expand-reverse--fast", "expand-reverse--slow"],
    }
  };

  /**
   * Internal helper functions
   *
   * @namespace IconPatterns.Helpers
   * @memberof IconPatterns
   * @return {Object}
   */
  const Helpers = {
    /**
     * Generates a random degree count for a rotation (0deg - 360deg)
     *
     * @method Helpers.getRandomRotation
     * @memberof IconPatterns
     * @return {number} degrees
     */
    getRandomRotation: () => Math.round(Math.random() * 360) + 1,

    /**
     * Returns random number within a range
     *
     * @method Helpers.getRandomNumber
     * @memberof IconPatterns
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    getRandomNumber: (min, max) => Math.floor(Math.random() * (max - min) + min),

    /**
     * Returns random item from an array
     *
     * @method Helpers.getRandomItemFrom
     * @memberof IconPatterns
     * @param {array}
     * @return {any} item
     */
    getRandomItemFrom: (arr) => arr[Helpers.getRandomNumber(0, arr.length)],

    /**
     * Returns random position within a width, height of a container
     *
     * @method Helpers.getRandomPosition
     * @memberof IconPatterns
     * @param {number} width
     * @param {number} height
     * @return {object} pos
     * @return {number} pos.x
     * @return {number} pos.y
     */
    getRandomPosition: (width, height) => ({
      x: parseInt(Math.random() * width),
      y: parseInt(Math.random() * height)
    }),

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
  function PatternInstance($container, config = {}) {
    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error("Missing `icons` configuration from config file");
    }
    this.color = config.color;
    this.icons = config.icons;
    this.width = $container.outerWidth();
    this.height = $container.outerHeight();
    this.$overlay = this.generateOverlay(this.width, this.height);
    this.$container = $container;
    this.$container.css("position", "relative");
    this.$container.prepend(this.$overlay);
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
   * @param {object} animations
   * @param {string} animations.initial
   * @param {string} animations.expand
   * @param {string} animations.rotate
   * @return {jquery} icon
   */
  PatternInstance.prototype.generateIcon = function(color, className, size, pos, rotation, animations) {
    const iconStyle = [
      `font-size: ${size}px`,
      `color: ${color}`
    ];
    const spanStyle = [
      `left: ${pos.x}px`,
      `top: ${pos.y}px`,
      `-webkit-transform: rotate(${rotation}deg)`,
      `-MS-transform: rotate(${rotation}deg)`,
      `transform: rotate(${rotation}deg)`
    ];
    return $("<span class='icon-patterns__animations__initial " + animations.initial + "' style='" + spanStyle.join(";") + "'><span class='icon-patterns__animations__entrance " + animations.expand + "'> <i class='" + [className, animations.rotate].join(" ") + "' style='" + iconStyle.join(";") + "'></i></span></span>");
  };

  /**
   * Generates overlay <div>
   *
   * @method generateOverlay
   * @memberof IconPatterns.PatternInstance
   * @return {number} width
   * @return {number} height
   * @return {jquery} overlay
   */
  PatternInstance.prototype.generateOverlay = function(width, height) {
    const $overlay = $("<div class='icon-patterns__overlay'></div>");
    $overlay.width(width);
    $overlay.height(height);
    $overlay.css({
      "position": "absolute",
      "z-index": 1,
      "top": 0,
      "left": 0
    });
    return $overlay;
  };

  /**
   * Renders a canvas scene with icons
   *
   * @method draw
   * @memberof IconPatterns.PatternInstance
   * @return {IconPatterns.PatternInstance}
   */
  PatternInstance.prototype.draw = function() {
    const ANIMATIONS = $.iconPatterns.ANIMATIONS;
    Object.entries(this.icons).forEach(([iconName, iconProperties]) => {
      const {
        sizeVariation,
        count,
      } = iconProperties;
      // Attach icons
      Array.from(Array(count)).forEach(() => {
        // Generate a random position for each icon
        const rotation = Helpers.getRandomRotation();
        const pos = Helpers.getRandomPosition(this.width, this.height);
        // Determine sizeWeight for each icon
        const size = Helpers.getRandomNumber(sizeVariation[0], sizeVariation[1]);
        // Determine animation styles
        const animations = {
          initial: Helpers.getRandomItemFrom(ANIMATIONS.INITIALIZE),
          rotate: Helpers.getRandomItemFrom(ANIMATIONS.ROTATE),
          expand: Helpers.getRandomItemFrom(ANIMATIONS.EXPAND),
        };
        // Generate and append icon
        this.$overlay.append(this.generateIcon(this.color, iconName, size, pos, rotation, animations));
      });
    });
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
    IconPatterns: function(config) {
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

}));
