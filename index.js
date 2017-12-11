const { Chrome, chromeStats } = require('src/chrome.js');
const { ChromeLinkedIn } = require('src/chrome-linkedin.js');
const { ChromeLambda } = require('src/chrome-lambda.js');
const { Firefox, firefoxStats } = require('src/firefox.js');
const { FirefoxLinkedIn } = require('src/firefox-linkedin.js');

module.exports = {
  Chrome,
  ChromeLinkedIn,
  ChromeLambda,
  Firefox,
  FirefoxLinkedIn,
  chromeStats,
  firefoxStats
};
