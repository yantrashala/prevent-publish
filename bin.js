#!/usr/bin/env node


'use strict';

var argv = require('minimist')(process.argv.slice(2));

var exec = require('child_process').exec;

var blacklist = ["registry.npmjs.org"],
  whitelist = [],
  newBlacklist = void 0;

argv.any && blacklist.splice(0, 2);

if (argv.blacklist) {
  blacklist = blacklist.concat(argv.blacklist.split(","));
}
if (argv.whitelist) {
  whitelist = whitelist.concat(argv.whitelist.split(","));
}

var child = exec('npm get registry', function (err, name) {
  var regName = name.trim();
  if (whitelist.length) {
    var result = whitelist.reduce(function (bool, list) {
      return bool && !!regName.match(list);
    }, true);
    if (result) {
      process.exit(0);
    } else {
      console.error("Not allowed");
      process.exit(1);
    }
  }
  if (blacklist.length) {
    var _result = blacklist.reduce(function (bool, list) {
      return bool || !!regName.match(list);
    }, false);
    if (_result) {
      console.error("Not allowed");
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
});

// process.exit(1);