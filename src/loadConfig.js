// Copyright © 2020 Hoani Bryson
// License: MIT (https://mit-license.org/)
//
// Load Config
//
// Loads a configuration file, file validity can be checked
//

const fs = require('fs');
const toml = require('toml');
const yaml = require('js-yaml');
const leap = require('leap-protocol');

exports.LoadConfig = class LoadConfig {
  constructor(filepath) {
    this._config = "";
    let data = "";
    try {
      data = fs.readFileSync(filepath);
      this.is_valid = true;
    }
    catch {
      this.is_valid = false;
      console.log("invlaid file");
    }

    if (this.is_valid) {
      this._attempt_parse(data);
    }

    if (this.is_valid) {
      if (leap.verify(this._config) == false) {
        this.is_valid = false;
      }
    }
  }

  valid() {
    return this.is_valid;
  }

  config() {
    return this._config;
  }

  _attempt_parse(data) {
    try {
      this._config = JSON.parse(data);
    }
    catch {
      try {
        this._config = toml.parse(data);
      }
      catch {
        try {
          this._config = yaml.load(data);
        }
        catch {
          this.is_valid = false;
        }
      }
    }
  }
}

