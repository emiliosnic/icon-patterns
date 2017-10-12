var IconPatterns = require("../src/icon-patterns");
var test = require("tape");
var Helpers = IconPatterns.Helpers;

test("Helpers.getRandomRotation() returns a value between 0 - 360", function(t) {
  t.plan(1);
  var rotation = Helpers.getRandomRotation();
  t.equals((rotation >= 0 && rotation <= 360), true);
});

test("Helpers.getRandomNumber() returns a number between min - max range", function(t) {
  t.plan(1);
  var number = Helpers.getRandomNumber(1,10);
  t.equals((number >= 1 && number <= 10), true);
});

test("Helpers.getRandomItemFrom() returns an item from an array", function(t) {
  t.plan(1);
  var item = Helpers.getRandomItemFrom(['foo', 'bar']);
  t.equals(['foo', 'bar'].indexOf(item) >= 0, true);
});
