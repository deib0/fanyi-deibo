#!/usr/bin/env node
import { translate } from './main';
import * as commander from 'commander';
const pkg = require('./package.json')

const program = new commander.Command();
program
  .version(pkg.version)
  .name('fy')
  .usage('<word>')
  .arguments('<word>')
  .action(function (word) {
    translate(word)
  });
program.parse();