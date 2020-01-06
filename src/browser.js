const { getRandomInt } = require('./utils.js');
const rimraf = require('rimraf');

class HeadlessBrowser {

  constructor(options) {
    this.cleanProperties();
    do {
      this.debuggerPort = getRandomInt(9001, 19997);
    } while (this.debuggerPort === 9222);
    this.sessionDir = `/tmp/${this.appName.toLowerCase()}-headless-${getRandomInt(10, 99999)}`;
    this.stats = options.stats;
    this.options = options;
    this.caller = this.options.caller;
    this.stats.browserNewRequestStart(this.appName, this.caller);
    this.executionFinished = false;
  }

  cleanProperties() {
    if (this.forceKillTimeout && this.forceKillTimeout !== null) {
      clearTimeout(this.forceKillTimeout);
    }
    this.forceKillTimeout = null;
    this.isLinkedIn = false;
    this.isTicketmaster = false;
    this.isLambda = false;
    this.debuggerPort = null;
    this.sessionDir = null;
    this.options = null;
    this.response = null;
    this.body = null;
    this.pid = null;
    this.startResolve = null;
    this.responseReceivedResolve = null;
    this.bodyReceivedResolve = null;
    this.browserInstance = null;
    this.browser = null;
    this.caller = null;
  }

  generateErrorAtStart(errorMessage, errorBody = '') {
    if (errorBody !== '') {
      this.body = errorBody;
    } else {
      this.body = errorMessage;
    }
    this.log(errorMessage);
    this.stats.browserResponseReady(this.appName);
    this.stats.browserBodyReady(this.appName);
    this.response = { status: 999 };
    this.finishExecution();
  }

  forceKillTimeoutFunction() {
    if (this.executionFinished) { return; }
    this.log(`Force kill ${this.appName} after ${(this.killTimeout / 1000)}s timeout`);
    if (this.response === null) {
      this.stats.browserResponseReady(this.appName);
    }
    if (this.body === null || this.body === '') {
      this.stats.browserBodyReady(this.appName);
    }
    this.body = 'Timeout';
    this.response = { status: 999 };
    this.finishExecution();
  }

  finishExecution() {
    // Make sure we only finish execution once
    if (this.executionFinished) { return; }
    this.executionFinished = true;
    this.startResolve({ response: this.response, body: this.body });
    if (this.bodyReceivedResolve !== null) { this.bodyReceivedResolve(); }
    if (this.responseReceivedResolve !== null) { this.responseReceivedResolve(); }
    if (this.additionalBodyResolve && this.additionalBodyResolve !== null) { this.additionalBodyResolve(); }
    this.closeBrowser();
    this.stats.browserRemoveActiveInstance(this.appName);
    let index = this.stats.activeIds.indexOf(this.pid);
    if (index > -1) {
      this.stats.activeIds.splice(index, 1);
    }
    rimraf(this.sessionDir, () => {});
    this.cleanProperties();
  }

}

module.exports = HeadlessBrowser;