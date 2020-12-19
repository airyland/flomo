#!/usr/bin/env node

const inquirer = require('inquirer')
const request = require('axios')
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
      if (process.argv.includes('add')) {
        try {
          const rs = await request.post(answers.API, {
            content: process.argv[process.argv.length - 1]
          })
          console.log(rs.data)
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log('Done.')
      }
    })
    .catch(error => {
      console.log(error)
    })
} else {
  const {
    program
  } = require('commander')
  program.version('0.0.4')

  program
    .command('add <content>')
    .description('add a new memo')
    .action(async (content) => {
      try {
        const rs = await request.post(API, {
          content
        })
        console.log(rs.data)
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