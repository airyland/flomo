#!/usr/bin/env node

const inquirer = require('inquirer')
const request = require('request-promise')
const config = require('./config')

const API = config.get('api')

if (!process.argv.includes('set') && !API) {
  inquirer.prompt([{
    type: 'API',
    name: 'API',
    message: '',
    validate: function(val) {
      if (!val || !/^https:/.test(val)) {
        return 'Please fill in a valid Flomo API.'
      }
      return true
    }}])
    .then(async answers => {
      config.set('api', answers.API)
        try {
          const rs = await request({
            url: answers.API,
            method: 'POST',
            json: {
              content: process.argv[process.argv.length - 1]
            }
          })
          console.log(rs)
        } catch (e) {
          console.log(e)
        }
      })
    .catch(error => {
      console.log(error)
    })
} else {
  const {
    program
  } = require('commander')
  program.version('0.0.1')

  program
    .command('add <content>')
    .description('add a new memo')
    .action(async (content) => {
      try {
        const rs = await request({
          url: API,
          method: 'POST',
          json: {
            content
          }
        })
        console.log(rs)
      } catch (e) {
        console.log(e)
      }
    })

  program
    .command('set <key> <value>')
    .description('set api YOUR_PRIVATE_API')
    .action((key, value) => {
      config.set(key, value)
      console.log('Done.');
    })

  program.parse(process.argv)
}