// const {JSDOM} = require("jsdom");
// const window = new JSDOM("<!DOCTYPE html></html>").window;
require("jsdom-global")();

const IconPatterns = require("../src/icon-patterns")();

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

test("Helpers.Random.rotation() returns a value between 0 - 360", function(t) {
  t.plan(1);
  const rotation = Helpers.Random.rotation();
  t.equals(within(rotation, 0, 360), true);
});

test("Helpers.Random.number(min, max) returns a number between min - max range", function(t) {
  t.plan(1);
  const number = Helpers.Random.number(1, 10);
  t.equals(within(number, 1, 10), true);
});

test("Helpers.Random.itemFrom(array) returns an item from an array", function(t) {
  t.plan(1);
  const item = Helpers.Random.itemFrom(["foo", "bar"]);
  t.equals(["foo", "bar"].indexOf(item) >= 0, true);
});

test("Helpers.Random.offset(width, height) returns a random position within a region", function(t) {
  t.plan(2);
  const pos = Helpers.Random.offset(50, 100);
  t.equals(within(pos.x, 0, 50), true);
  t.equals(within(pos.y, 0, 100), true);
});

test("Helpers.Random.Positions(count, width, height) returns an array of uniformly distributed position within a region", function(t) {
  t.plan(11);
  const positions = Helpers.Random.positions(5, 100, 200, 0);
  t.equals(positions.length, 5);
  t.equals(positions[0].x, 16.5);
  t.equals(positions[0].y, 33);
  t.equals(positions[1].x, 49.5);
  t.equals(positions[1].y, 33);
  t.equals(positions[2].x, 82.5);
  t.equals(positions[2].y, 33);
  t.equals(positions[3].x, 16.5);
  t.equals(positions[3].y, 99);
  t.equals(positions[4].x, 49.5);
  t.equals(positions[4].y, 99);
});

test("Helpers.Random.Positions(count, width, height) throws error if `count` is negative", function(t) {
  t.plan(1);
  try {
    Helpers.Random.positions(0, 50, 100);
  } catch (err) {
    t.equals(err.message, "Argument `count` should be greater than zero");
  }
});

test("Helpers.DOM.appendClasses(htmlElement, classes) appends classes to htmlElement", function(t) {
  t.plan(1);
  const element = document.createElement("div");
  element.className = "foo bar";
  Helpers.DOM.appendClasses(element, ["baz"]);
  t.equals(element.className, "foo bar baz");
});

test("Helpers.DOM.appendClasses(htmlElement, classes) appends classes to htmlElement", function(t) {
  t.plan(1);
  const element = document.createElement("div");
  element.className = "foo bar";
  Helpers.DOM.appendClasses(element, ["baz"]);
  t.equals(element.className, "foo bar baz");
});

test("Helpers.DOM.appendStyle(htmlElement, style) appends style to htmlElement", function(t) {
  t.plan(2);
  const element = document.createElement("div");
  Helpers.DOM.appendStyle(element, {
    "background": "red",
    "width": "10px"
  });
  t.equals(element.style.background, "red");
  t.equals(element.style.width, "10px");
});

test("Helpers.DOM.appendStyle(htmlElement, style) safely ignores invalid arguments", function(t) {
  t.plan(1);
  const element = document.createElement("div");
  Helpers.DOM.appendStyle(element, null);
  Helpers.DOM.appendStyle(null, {});
  t.ok("No exception was thrown");
});

test("Helpers.DOM.generateElement(tag, classes, style) create an HTMLElement with the defined class names and style", function(t) {
  t.plan(3);
  const element = Helpers.DOM.generateElement("p", [
    "foo", "bar"
  ], {"width": "10px"});
  t.equals(element.className, " foo bar");
  t.equals(element.style.width, "10px");
  t.equals(element.tagName, "P");
});

test("IconPatterns() throws error messages for invalid instantiations", function(t) {
  t.plan(2);
  try {
    new IconPatterns.PatternInstance();
  } catch (err) {
    t.equals(err.message, "Missing `target` HTMLElement");
  }
  try {
    const element = document.createElement("div");
    element.id = "container";
    new IconPatterns.PatternInstance(element);
  } catch (err) {
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
    return Object.entries(icons).filter(([idx, icon]) => {
      return icon.getElementsByTagName("I")[0].className.indexOf(className) >= 0;
    });
  };
  t.plan(6);
  // Setup DOM layout
  const container = document.createElement("div");
  container.id = "container";
  const child1 = document.createElement("div");
  child1.id = "container__child__1";
  child1.style["z-index"] = "auto";
  const child2 = document.createElement("div");
  child2.id = "container__child__2";
  child2.style["z-index"] = "2";
  container.appendChild(child1);
  container.appendChild(child2);
  // Initialize instance
  new IconPatterns.PatternInstance(container, {
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
  }).draw();
  const icons = container.getElementsByClassName("icon-patterns__overlay")[0].childNodes;
  // Extract Icons
  const iconsFoo = filterIconsWithClass(icons, "ion-foo");
  const iconsBar = filterIconsWithClass(icons, "ion-bar");
  // Assert icon counts
  t.equals(icons.length, 25);
  t.equals(iconsFoo.length, 10);
  t.equals(iconsBar.length, 15);
  // Assert the the icon layer lays on top of the child elements
  t.equals(container.getElementsByClassName("icon-patterns__overlay")[0].style["z-index"], "0");
  t.equals(child1.style["z-index"], "1");    // `auto` is transformed to 1
  t.equals(child2.style["z-index"], "2");    // `2` remains `2`
});
