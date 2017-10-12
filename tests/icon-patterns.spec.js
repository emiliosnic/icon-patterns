const IconPatterns = require("../src/icon-patterns");
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
  const number = Helpers.getRandomNumber(1,10);
  t.equals(within(number, 1, 10), true);
});

test("Helpers.getRandomItemFrom() returns an item from an array", function(t) {
  t.plan(1);
  const item = Helpers.getRandomItemFrom(["foo", "bar"]);
  t.equals(["foo", "bar"].indexOf(item) >= 0, true);
});

test("Helpers.getRandomPosition(width, height) returns a random position within range", function(t) {
  t.plan(2);
  const pos = Helpers.getRandomPosition(50,100);
  t.equals(within(pos.x, 0, 50), true);
  t.equals(within(pos.y, 0, 100), true);
});
