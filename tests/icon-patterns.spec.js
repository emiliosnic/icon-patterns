const IconPatterns = require("../src/icon-patterns");
const test = require("tape");

test("Helpers.getRandomRotation() returns a value between 0 - 360", function(t) {
  t.plan(1);
  const rotation = IconPatterns.Helpers.getRandomRotation();
  t.equals((rotation >= 0 && rotation <= 360), true);
});
