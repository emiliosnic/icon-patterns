module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "no-undef": 0,
    "linebreak-style": [
      "error", "unix"
    ],
    "quotes": [
      "error", "double"
    ],
    "semi": ["error", "always"]
  }
};
