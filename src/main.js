
/**
 * @namespace IconPatterns
 */
(function(IconPatterns) {

  IconPatterns.Helpers = {
    /**
     * Generates a random degree count for a rotation (0deg - 360deg)
     *
     * @method Helpers.getRandomRotation
     * @memberof IconPatterns
     * @return {Number} degrees
     *
     */
    getRandomRotation: function() {
      return Math.round(Math.random() * 360) + 1;
    }
  };

  /**
   * @memberof IconPatterns
   */
  IconPatterns.DEFAULTS = {
    /**
    ......
    ......
    ......
    ......
     */
  }

  IconPatterns.create = function($container, config) {
    return new PatternInstance($container, config);
  };

  /**
     * Generates a PatternInstance instance
     * @param {$Object} $selector
     * @param {Object} config
     * @return {Object} PatternInstance
     */
  function PatternInstance($container, config) {
    config = config || {};
    if (!$container) {
      throw new Error('Invalid jQuery object passed');
    }
    if (!config.size) {
      throw new Error('Invalid size passed');
    }
    if (!config.icons || !Object.keys(config.icons).length) {
      throw new Error('Invalid icons passed');
    }
    this.color = config.color || DEFAULTS.color;
    this.container = $container;
    this.size = config.size;
    this.icons = config.icons;
    this.initialAnimationTypes = config.initialAnimationTypes || ['default'];
  }

  /**
     * Returns random initial animation
     */
  PatternInstance.prototype.getRandomInitialAnimation = function() {
    return this.initialAnimationTypes[Math.floor(Math.random() * (this.initialAnimationTypes.length - 0) + 0)];
  };
  /**
     * Generates an icon
     * @param {String} name
     * @param {Number} size
     * @param {Object} pos
     * @param {Number} rotation
     * @return {String} html
     */
  PatternInstance.prototype.generateIcon = function(color, className, size, pos, rotation, initialAnimation, rotationAnimation, entranceAnimation) {
    var iconStyle = [
      'font-size: ' + size + 'px',
      'color: ' + color
    ];
    var wrapperStyle = [
      'left: ' + pos.x + 'px',
      'top:' + pos.y + 'px',
      '-webkit-transform: rotate(' + rotation + 'deg)',
      '-MS-transform: rotate(' + rotation + 'deg)',
      'transform: rotate(' + rotation + 'deg)'
    ];

    return '<span class="initial-animation-wrapper ' + initialAnimation + '" style="' + wrapperStyle.join(';') + '"><span class="entrance-animation-wrapper ' + entranceAnimation + '"> <i class="' + [className, rotationAnimation].join(' ') + '" style="' + iconStyle.join(';') + '"></i></span></span>';
  };
  /**
   * Rerenders a canvas scene with icons
   */
  PatternInstance.prototype.redraw = function() {
    this.root.remove();
    this.draw();
  };
  /**
     * Renders a canvas scene with icons
     */
  PatternInstance.prototype.draw = function() {
    this.root = $('<div class="icon-pattern-animation"></div>');
    this.rootWidth = this.container.outerWidth();
    this.rootHeight = this.container.outerHeight();
    this.root.width(this.container.outerWidth());
    this.root.height(this.container.outerHeight());
    this.container.prepend(this.root);
    var that = this;
    for (var name in this.icons) {
      var icon = this.icons[name];
      var rotation = IconPatterns.Helpers.getRandomRotation();
      var rotation2 = IconPatterns.Helpers.getRandomRotation();
      var clusters = icon.clusters;
      for (var idx = 0; idx < clusters.length; idx++) {
        var cluster = clusters[idx];
        var pos = {
          x: parseInt(cluster.x * that.rootWidth),
          y: parseInt(cluster.y * that.rootHeight)
        };

        // Determine sizeWeight for each icon
        var sizeWeight = cluster.sizeWeight || icon.sizeWeight;
        var size = this.size * sizeWeight;

        // Determine initial animation for all icons
        var initialAnimation = ('initialAnimation' in cluster)
          ? cluster.initialAnimation
          : this.getRandomInitialAnimation();

        // Determine random animations
        var rotationAnimation = cluster.rotationAnimation || '';
        var entranceAnimation = cluster.entranceAnimation || '';

        var $icon = $(that.generateIcon(this.color, name, size, pos, rotation, initialAnimation, rotationAnimation, entranceAnimation));
        that.root.append($icon);
      }
    }
  };

}(window.IconPatterns = window.IconPatterns || {}));
