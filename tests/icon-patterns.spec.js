const {JSDOM} = require("jsdom");
const window = new JSDOM("<!DOCTYPE html></html>").window;
const $ = require("jquery")(window);

const IconPatterns = require("../src/icon-patterns")(window);

const test = require("tape");
const Helpers = IconPatterns.Helpers;

/**
 * Determines if number is within a specific range
 *
 * @function within
 * @ignore
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {boolean}
 */
const within = (value, min, max) => (value >= min && value <= max);

test("Helpers.getRandomRotation() returns a value between 0 - 360", function(t) {
  t.plan(1);
  const rotation = Helpers.getRandomRotation();
  t.equals(within(rotation, 0, 360), true);
});

test("Helpers.getRandomNumber() returns a number between min - max range", function(t) {
  t.plan(1);
  const number = Helpers.getRandomNumber(1, 10);
  t.equals(within(number, 1, 10), true);
});

test("Helpers.getRandomItemFrom() returns an item from an array", function(t) {
  t.plan(1);
  const item = Helpers.getRandomItemFrom(["foo", "bar"]);
  t.equals(["foo", "bar"].indexOf(item) >= 0, true);
});

test("Helpers.getRandomPosition(width, height) returns a random position within range", function(t) {
  t.plan(2);
  const pos = Helpers.getRandomPosition(50, 100);
  t.equals(within(pos.x, 0, 50), true);
  t.equals(within(pos.y, 0, 100), true);
});

test("IconPatterns() throws error messages for invalid instantiations", function(t) {
  t.plan(2);
  try {
    new IconPatterns.PatternInstance();
  } catch(err) {
    t.equals(err.message, "Missing `target` jQuery instance");
  }
  try {
    const $target = $("<div id='container'></div>");
    new IconPatterns.PatternInstance($target);
  } catch(err) {
    t.equals(err.message, "Missing `icons` configuration from config file");
  }
});

test("IconPatterns() appends icons in DOM", function(t) {

  /**
   * Filters icons based on className
   *
   * @function filterIconsWithClass
   * @ignore
   * @param {array} icons
   * @param {string} className
   * @return {array}
   */
  const filterIconsWithClass = (icons, className) => {
    return icons.filter((index) => $(icons[index]).find("i").hasClass(className)).map((index) => icons[index]);
  };

  t.plan(3);
  // console.log(dom.serialize());
  const $target = $("<div id='container'></div>");
  const instance = new IconPatterns.PatternInstance($target, {
    color: "#FFFFFF",
    icons: {
      "ion-foo": {
        count: 10,
        sizeVariation: [10, 30]
      },
      "ion-bar": {
        count: 15,
        sizeVariation: [5, 20]
      }
    }
  });
  instance.draw();
  const $icons = $target.find(".icon-patterns__overlay").children();
  // Extract Icons
  const iconsFoo = filterIconsWithClass($icons, "ion-foo");
  const iconsBar = filterIconsWithClass($icons, "ion-bar");
  // Assert states
  t.equals($icons.length, 25);
  t.equals(iconsFoo.length, 10);
  t.equals(iconsBar.length, 15);
});
