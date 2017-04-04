#!/usr/bin/env node


'use strict';

const fs = require("fs");

let argv = require('minimist')(process.argv.slice(2));
let publishArgs = JSON.parse(process.env.npm_config_argv).cooked;

//get current package name
let moduleName = process.env.npm_package_name;
//check if module is scoped
let scopedName = moduleName.match(/^@?.*\//);
let userRegistryIndex, targetedRegistry;

if (!!scopedName) {
  //get the scope name
  scopedName = scopedName[0].substr(1, scopedName[0].length - 2);
  userRegistryIndex = publishArgs.indexOf(`--@${scopedName}:registry`);
  if (userRegistryIndex > -1) {
    //registry passed from command line, like
    //npm publish --registry=yarnpkg.npmjs.com
    targetedRegistry = publishArgs[userRegistryIndex + 1];
  }
}
else {
  //no scope
  scopedName = "";
}

//if not passed from command line
if (!targetedRegistry) {
  //check if scoped module
  if (!!scopedName) {
    targetedRegistry = process.env[`npm_config__${scopedName}_registry`];
  }
  else {
    //else get default registry
    targetedRegistry = process.env.npm_config_registry;
  }
}

//default blacklisted
let blacklist = ["registry.npmjs.org"],
  whitelist = [];

//remove default blacklist registry
argv.any && blacklist.splice(0, 2);

//add to blacklist
if (argv.blacklist) {
  blacklist = blacklist.concat(argv.blacklist.split(","));
}

//add to whitelist
if (argv.whitelist) {
  whitelist = whitelist.concat(argv.whitelist.split(","));
}

//if scope module doesn't have registry
if (typeof targetedRegistry === "undefined") {
  console.error("Registry is not set");
  console.warn("Please set registry for scoped Modules");
  process.exit(1);
}

//check if targetedRegistry is whitelisted
if (whitelist.length) {
  let result = whitelist.reduce(function (bool, list) {
    return bool && !!targetedRegistry.match(list);
  }, true);
  if (result) {
    console.info(`Your module will be published to ${targetedRegistry}`);
    process.exit(0);
  } else {
    console.error(`You are not allowed to publish to ${targetedRegistry}`);
    process.exit(1);
  }
}

//check if targetedRegistry is blacklisted
if (blacklist.length) {
  let _result = blacklist.reduce(function (bool, list) {
    return bool || !!targetedRegistry.match(list);
  }, false);
  if (_result) {
    console.error(`You are not allowed to publish to ${targetedRegistry}`);
    process.exit(1);
  } else {
    console.info(`Your module will be published to ${targetedRegistry}`);
    process.exit(0);
  }
}
