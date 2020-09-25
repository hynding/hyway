'use strict';

const { setWorldConstructor } = require('cucumber');
const { Builder, until } = require('selenium-webdriver');

class World {
  constructor() {
    // workers
    this.driver = null;
    this.networker = null;
    // data objects
    this.user = null;
    this.response = null;
  }

  getDriver() {
    if (!this.driver) {
      this.driver = new Builder().forBrowser('chrome').build();
    }

    return this.driver;
  }

  getNetworker() {
    if (!this.networker) {

    }
  }

  setUser(user) {
    this.user = user;
  }
}

setWorldConstructor(World);