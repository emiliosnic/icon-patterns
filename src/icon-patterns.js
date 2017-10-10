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
      var JSDOM = require("jsdom").JSDOM;
      module.exports = factory(require("jQuery")(new JSDOM("<!DOCTYPE html>").window));
    }
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  "use strict";

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
     * @return {Number} degrees
     */
    getRandomRotation: function() {
      return Math.round(Math.random() * 360) + 1;
    }
  };

  /**
   * @memberof IconPatterns
   * @property {object} defaults           - The default setupf or iconPatterns
   * @property {array} defaults.animations - The available animation types
   * @property {number} defaults.size      - The default icon size
   * @property {string} defaults.color     - The default icon color
   * @property {object} ANIMATIONS         - The available animation styles
   */
  $.iconPatterns = {
    defaults: {
      initialAnimations: ["initialize", "initialize--fast", "initialize--slow"],
      size: 30,
      color: "#FFFFFF"
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
  function PatternInstance($container, config) {
    config = config || {};
    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error("Missing `icons` configuration from config file");
    }
    this.color = config.color;
    this.size = config.size;
    this.icons = config.icons;
    this.$container = $container;
    this.initialAnimations = config.initialAnimations;
    this.$container.css("position", "relative")
  }

  /**
   * Returns random initial animation
   *
   * @method getRandomInitialAnimation
   * @memberof IconPatterns.PatternInstance
   * @return {string}
   *
   */
  PatternInstance.prototype.getRandomInitialAnimation = function() {
    return this.initialAnimations[Math.floor(Math.random() * (this.initialAnimations.length - 0) + 0)];
  };

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
  PatternInstance.prototype.generateIcon = function(color, className, size, pos, rotation, initialAnimation, rotationAnimation, entranceAnimation) {
    var iconStyle = [
      "font-size: " + size + "px",
      "color: " + color
    ];
    var spanStyle = [
      "left: " + pos.x + "px",
      "top:" + pos.y + "px",
      "-webkit-transform: rotate(" + rotation + "deg)",
      "-MS-transform: rotate(" + rotation + "deg)",
      "transform: rotate(" + rotation + "deg)"
    ];
    return $("<span class='icon-patterns__animations__initial " + initialAnimation + "' style='" + spanStyle.join(";") + "'><span class='icon-patterns__animations__entrance " + entranceAnimation + "'> <i class='" + [className, rotationAnimation].join(" ") + "' style='" + iconStyle.join(";") + "'></i></span></span>");
  };

  /**
   * Redreaw a canvas scene
   *
   * @method redraw
   * @memberof IconPatterns.PatternInstance
   * @return {IconPatterns.PatternInstance}
   */
  PatternInstance.prototype.redraw = function() {
    this.$root.remove();
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
  PatternInstance.prototype.draw = function() {
    this.$root = $("<div class='icon-patterns__overlay'></div>");
    this.$root.css({"position": "absolute", "z-index": 1, "top": 0, "left":0});
    var containerWidth = this.$container.outerWidth();
    var containerHeight = this.$container.outerHeight();
    this.$root.width(containerWidth);
    this.$root.height(containerHeight);
    this.$container.prepend(this.$root);
    var self = this;
    for (var name in this.icons) {
      var icon = this.icons[name];
      var rotation = Helpers.getRandomRotation();
      var clusters = icon.clusters;
      for (var idx = 0; idx < clusters.length; idx++) {
        var cluster = clusters[idx];
        var pos = {
          x: parseInt(cluster.x * containerWidth),
          y: parseInt(cluster.y * containerHeight)
        };
        // Determine sizeWeight for each icon
        var sizeWeight = cluster.sizeWeight || icon.sizeWeight;
        var size = this.size * sizeWeight;
        // Determine initial animation for all icons
        var initialAnimation = ("initialAnimation" in cluster)
          ? cluster.initialAnimation
          : this.getRandomInitialAnimation();
        // Determine animations
        var rotationAnimation = cluster.rotationAnimation || "";
        var entranceAnimation = cluster.entranceAnimation || "";
        // Generat and append icon
        var $icon = self.generateIcon(this.color, name, size, pos, rotation, initialAnimation, rotationAnimation, entranceAnimation);
        self.$root.append($icon);
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
    IconPatterns: function(config) {
      return new PatternInstance($(this), Object.assign({}, config, $.iconPatterns.defaults));
    }
  });

  /**
   * Public functions
   */
  return {Helpers: Helpers, PatternInstance: PatternInstance};

}));
