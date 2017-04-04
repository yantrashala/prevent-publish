#!/usr/bin/env node


'use strict';

let argv = require('minimist')(process.argv.slice(2));

let exec = require('child_process').exec;

let blacklist = ["registry.npmjs.org"],
  whitelist = [],
  newBlacklist = void 0;

argv.scope = argv.scope ? `${argv.scope}:` : ``;
argv.any && blacklist.splice(0, 2);

if (argv.blacklist) {
  blacklist = blacklist.concat(argv.blacklist.split(","));
}
if (argv.whitelist) {
  whitelist = whitelist.concat(argv.whitelist.split(","));
}

let child = exec(`npm get ${argv.scope}registry`, function (err, name) {

  let regName = name.trim();

  if (regName == "undefined") {
    console.error("Registry is not set");
    console.warn("Please set registry for scoped Modules");
    process.exit(1);
  }

  if (whitelist.length) {
    let result = whitelist.reduce(function (bool, list) {
      return bool && !!regName.match(list);
    }, true);
    if (result) {
      console.info(`Your module will be published to ${regName}`);
      process.exit(0);
    } else {
      console.error(`You are not allowed to publish to ${regName}`);
      process.exit(1);
    }
  }
  if (blacklist.length) {
    let _result = blacklist.reduce(function (bool, list) {
      return bool || !!regName.match(list);
    }, false);
    if (_result) {
      console.error(`You are not allowed to publish to ${regName}`);
      process.exit(1);
    } else {
      console.info(`Your module will be published to ${regName}`);
      process.exit(0);
    }
  }
});