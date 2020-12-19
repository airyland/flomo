const Config = require('node-cli-config');
const inquirer = require('inquirer');

const config = Config({
  dir: '.weapp-config',
  file: 'flomo'
})

module.exports = config