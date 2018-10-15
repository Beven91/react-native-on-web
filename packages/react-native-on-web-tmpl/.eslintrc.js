module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    'es6': true,
    'commonjs': true,
  },
  "plugins": [
    "react"
  ],
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "react/prop-types": 0,
    "no-console": 0,
    "react/no-find-dom-node": 0,
    "object-curly-spacing": 0,
    "space-before-function-paren": 0,
    "linebreak-style": 0,
    "require-jsdoc": 0,
    "valid-jsdoc": 0,
    "max-len": 0,
    "no-debugger": 0
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "google"
  ],
  "globals": {
    "__webpack_require__": true,
    "wx": true,
  }
};