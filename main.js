// A discord rich presence for the dyno server's members. Repurpose if you would like.

console.log('Starting....') // Log that the app is starting

// Require libraries

const Discord = require('discord-rpc')

const readline = require('readline')

const fs = require('fs')

const color = require('colors-cli')

// Declare main variables (to be used later on)

let conf = false

let timestamp = false

let startTimestamp = new Date()

let largeImageKey = 'dyno'

let smallImageKey = 'dynoglitch'

let largeText

let smallText

let state

let clientId = '513462902053797903'

let quotes = [ 'Annoying the staff', 'Minimodding', 'Travelling the dyno world', 'Interfering in support', 'Arguing with the staff', 'Reviving chat', 'Arguing with council', 'Talking about Dyno' ]

const notice = color.cyan_bt

const warn = color.yellow_bt

const error = color.red_bt

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,

  prompt: 'Would you like to refresh the presence (refresh), refresh your client aka log in as another app (refreshclient), or exit (exit)? '
})

let confi

let rpc = new Discord.Client({ transport: 'ipc' })

console.log(notice('Checking for config...'))

if (fs.existsSync('./config.json')) {
  const config = require('./config.json')
  console.log(notice('Config found! Checking config'))
  if (config.largeImageKey) { // If there is a largeImageKey
    if (Array.isArray(config.largeImageKey)) {
      let arra = []
      for (let thing of config.largeImageKey) {
        arra.push(thing.toLowerCase())
      }
      largeImageKey = arra
      console.log(notice(`largeImageKey noted! Count: ${arra.length}`))
    } else if (typeof config.largeImageKey === 'string' && largeImageKey !== config.largeImageKey) {
      if (config.largeImageKey.toLowerCase() === 'disable') {
        largeImageKey = null
        console.log('largeImageKey has been disabled!')
      } else {
        largeImageKey = config.largeImageKey.toLowerCase() // Overwrite the default smallImageKey
        console.log(notice('largeImageKey noted!'))
      }
    } else {
      console.log('Your large image key must either be a array or string!')
    }
    // Checks for config.largeImageText
    if (config.largeImageText && typeof config.largeImageText === 'string') {
      largeText = config.largeImageText
    } else if (config.largeImageText && typeof config.largeImageText !== 'string') {
      console.log(warn('Your configs largeImageText must be a string or not exist!'))
      largeText = null
    } else if (!config.largeImageText) largeText = null

    if (config.smallImageKey) { // If config has a small key
      if (Array.isArray(config.smallImageKey)) {
        let arra = []
        for (let thing of config.smallImageKey) {
          arra.push(thing.toLowerCase())
        }
        smallImageKey = arra
        console.log(notice(`smallImageKey noted! Count: ${arra.length}`))
      } else if (typeof config.smallImageKey === 'string' && smallImageKey !== config.smallImageKey) {
        if (config.smallImageKey.toLowerCase() === 'disable') {
          smallImageKey = null
          console.log('smallImageKey disabled')
        } else {
          smallImageKey = config.smallImageKey.toLowerCase() // Overwrite the default smallImageKey
          console.log(notice('smallImageKey noted!'))
        }
      } else {
        console.log('Your small image key must either be a array or string!')
      }
      if (config.smallImageText && typeof config.smallImageText === 'string') {
        smallText = config.smallImageText
      } else if (config.smallImageText && typeof config.smallImageText !== 'string') {
        console.log(warn('Your configs smallImageText must be a string or not exist!'))
        smallText = null
      } else if (!config.smallImageText) smallText = null
    }
  }
  if (!config.quotes && config.defaultQuotes && config.defaultQuotes === 'false') { // If no quotes in the config, config.defaultQuotes exists, and it does equal false
    // Do nothing
  } else if (!config.quotes && config.defaultQuotes && config.defaultQuotes !== false) {
    quotes = null
  } else if (config.quotes && Array.isArray(config.quotes)) { // If quotes are in the config and they are a array
    if (config.defaultQuotes && config.defaultQuotes === 'false') { // If defaultQuotes is in the config, and it equals 'false'. 'false' is basically saying 'disable the default quotes'
      quotes = config.quotes // Rewrite the quotes with the quotes in the config
    } else { // Everyone knows what else does, ye?
      quotes = quotes.concat(config.quotes) // Add quotes and the quotes in the config together
    }
  } else { // Everyone knows what else does, ye?
    if (config.staticQuote && config.quotes && config.staticQuote === 'true') {
      if (typeof config.quotes === 'string') {
        quotes = config.quotes
      } else {
        console.log(warn('So, you want to have a static quote.. but its not a string.. hmm, confusing.'))
      }
    } else {
      console.log(warn('I am confused... Quotes can only be string (you need config.staticQuote to be true for this to work) and array.. So why is it neither or why do you not have staticQuotes set to true?'))
    }
  }
  if (config.state && (typeof config.state !== 'string') === true) {
    console.log(warn('The state needs to be a string!'))
  } else if (config.state && (typeof config.state === 'string') === true) {
    state = config.state
  }
  if (config.clientId) {
    clientId = config.clientId
  }
  // Timestamp checker
  if (config.timestamp && (config.timestamp === true || config.timestamp === 'true')) { // If config.timestamp and config.timestamp is 'true'
    timestamp = true // Turn on the timestamp
  } else if (!config.startTimestamp) {
    timestamp = 'Not found'
  }
  conf = true
  confi = config
  console.log('Checked config.')
} else {
  console.log(warn('Config not found. Do not worry, the app has been pre-setup. You can create the config and do \'refresh\' to gain access to the configuaration.'))
}

let reloaded = false

// The rpc function, so it can easily update the rpc

function update () {
  let largeImageK = largeImageKey // Define largeImageK
  if (largeImageKey && Array.isArray(largeImageKey)) { // If largeImagekey and it is a array
    // Generate a random number
    let rando = Math.round(Math.random() * (largeImageKey.length) - 1)
    // If the random number is below 0, make it 0
    if (rando < 0) rando = 0
    else if (rando > largeImageKey.length) rando = largeImageKey.length// If the random number is more then the largeImageKey's array length, make it the length of the aray
    largeImageK = largeImageKey[rando]
  }
  let smallImageK = smallImageKey
  if (smallImageKey && Array.isArray(smallImageKey)) { // If smallImageKey and it is a array
    // Generate a random number
    let rando = Math.round(Math.random() * (smallImageKey.length) - 1)
    // If the random number is below 0, make it 0
    if (rando < 0) rando = 0
    else if (rando > smallImageKey.length) rando = smallImageKey.length // If the random number is more then the smallImageKey's array length, make it the length of the aray
    smallImageK = smallImageKey[rando]
  }
  let random = quotes // Define random as quotes
  if (quotes && Array.isArray(quotes)) { // If quotes, and they are a array
    // Generate a random number
    let rand = Math.round(Math.random() * (quotes.length - 1))
    // If the random number is below zero, set it to zero
    if (rand < 0) rand = 0
    else if (rand > quotes.length) rand = quotes.length // If the random number is more then the quotes array length, make the number the length of the array
    random = quotes[rand] // Get a random quote
  }
  // Most efficient way i can think of to set the presence.
  let stuff = {}
  // Simple checks, eh?
  if (largeImageK) stuff.largeImageKey = largeImageK
  if (smallImageK) stuff.smallImageKey = smallImageK
  if (!conf) {
    stuff.startTimestamp = startTimestamp
  } else {
    if (timestamp !== false) stuff.startTimestamp = startTimestamp
  }
  if (smallText) stuff.smallImageText = smallText
  if (largeText) stuff.largeImageText = largeText
  if (state) stuff.state = state
  if (random) stuff.details = random
  rpc.setActivity(stuff) // Set the activity as the object. Less checks, better reliability, more options, // less time
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * The function that makes it so you can login to another rich presence application while running
*/

async function refreshclient () {
  if (reloaded === true) return console.log(warn('Try again later.'))
  let config = confi // reload the config
  await sleep(1000)
  await rpc.destroy()
  rpc = new Discord.Client({ transport: 'ipc' })
  await sleep(1000) // Pause for a second
  if (!config) throw Error('Error while refreshing the client! There was no config found!') // if no config, error
  else if (!config.clientId) throw Error('Error while refreshing the client! I need a clientId to refresh to!') // if no clientId in the config, error
  else if (config.clientId === clientId) console.log(warn('Cannot refresh! The clientId in the config was the same as the one already in use.')) // if the clientId in the config and the clientId (main.js) are the same, warn
  else if (config.clientId && config.clientId !== clientId) {
    clientId = config.clientId
    await rpc.connect(clientId)
    await sleep(1000) // Pause for a second
    console.log(notice('Client has been refreshed!'))
    await update()
    rl.prompt()
  }
}

/**
 * reload the configuration (except the clientId)
 * @param {Boolean} update Whether or not to update the config
 * @param {Boolean} prompt Whether or not to set the prompt
 */

async function reload (set, prompt) { // Reload the config
  if (reloaded === true) { // If reloaded is set to true (its a cooldown)
    console.log(warn('Try again later.')) // Log that the user can try again later
    rl.prompt() // Show the prompt
    return null // Stop the function
  }
  if (fs.existsSync('./config.json') === false) { // If there is no file called 'config.json'
    console.log(warn('No file called config.json found. Nothing changed.')) // Log that there is no file called 'config.json'
    conf = false // Tell the app there is no config
    rl.prompt() // Show the prompt
    return null // Stop the function
  }
  console.log(notice('Reloading config')) // Tell the user the config is reloading
  quotes = [ 'Annoying the staff', 'Minimodding', 'Travelling the dyno world', 'Interfering in support', 'Arguing with the staff', 'Reviving chat', 'Arguing with council', 'Talking about Dyno' ] // Redifine quotes
  delete require.cache[require.resolve('./config.json')] // Remove the require cache for config.json
  const config = require('./config.json') // Require the config
  let configuration = config
  // Key checker!
  if (config.largeImageKey) { // If there is a largeImageKey
    if (Array.isArray(config.largeImageKey)) {
      let arra = []
      for (let thing of config.largeImageKey) {
        arra.push(thing.toLowerCase())
      }
      largeImageKey = arra
      console.log(notice(`largeImageKey refreshed! Count: ${arra.length}`))
    } else if (typeof config.largeImageKey === 'string' && largeImageKey !== config.largeImageKey) {
      if (config.largeImageKey.toLowerCase() === 'disable') {
        largeImageKey = null
        console.log('largeImageKey disabled')
      } else {
        largeImageKey = config.largeImageKey.toLowerCase() // Overwrite the default smallImageKey
        console.log(notice('largeImageKey refreshed!'))
      }
    } else {
      if (typeof config.largeImageKey !== 'string' || Array.isArray(config.largeImageKey)) console.log('Your large image key must either be a array or string!')
    }
    // Checks the configs largeImageText
    if (config.largeImageText && typeof config.largeImageText === 'string' && config.largeImageText !== largeText) {
      largeText = config.largeImageText
    } else if (config.largeImageText && typeof config.largeImageText !== 'string') {
      console.log(warn('Your configs largeImageText must be a string or not exist!'))
      largeText = null
    } else if (!config.largeImageText) largeText = null
    // For the small image key
    if (config.smallImageKey) { // If config has a small key
      if (Array.isArray(config.smallImageKey)) {
        let arra = []
        for (let thing of config.smallImageKey) {
          arra.push(thing.toLowerCase())
        }
        smallImageKey = arra
        console.log(`smallImageKey refreshed! Count: ${arra.length}`)
      } else if (typeof config.smallImageKey === 'string' && smallImageKey !== config.smallImageKey) {
        if (config.smallImageKey.toLowerCase() === 'disable') {
          smallImageKey = null
          console.log('smallImageKey disabled')
        } else {
          smallImageKey = config.smallImageKey.toLowerCase() // Overwrite the default smallImageKey
          console.log(notice('smallImageKey refreshed!'))
        }
      } else {
        if (typeof config.smallImageKey !== 'string' || Array.isArray(config.smallImageKey)) console.log('Your small image key must either be a array or string!')
      }
      if (config.smallImageText && typeof config.smallImageText === 'string' && config.smallImageText !== smallText) {
        smallText = config.smallImageText
      } else if (config.smallImageText && typeof config.smallImageText !== 'string') {
        console.log(warn('Your configs smallImageText must be a string or not exist!'))
        smallText = null
      } else if (!config.smallImageText) smallText = null
    }
  }
  // Quote checker
  if (!config.quotes && config.defaultQuotes && config.defaultQuotes === 'true') { // If no quotes in the config, config.defaultQuotes exists, and it does equal false
    // Do nothing
  } else if (!config.quotes && config.defaultQuotes && config.defaultQuotes !== 'true') { // If no quotes, defaultQuotes exists in the config, and it does not equal false
    quotes = null // Make quotes = null
  } else if (!config.quotes && !config.defaultQuotes) { // If not quotes, and no default quotes
    // Do nothing
  } else if (config.quotes && Array.isArray(config.quotes)) { // If quotes, and quotes are a array
    if (config.defaultQuotes && config.defaultQuotes === 'false') { // If defaultQuotes is in the config, and it equals 'false'. 'false' is basically saying 'disable the default quotes'
      quotes = config.quotes // Rewrite the quotes with the quotes in the config
      await console.log(notice(`Quotes loaded: ${quotes.length}`)) // Log that quotes were loaded.
    } else { // Everyone knows what else does, ye?
      quotes = quotes.concat(config.quotes) // Add quotes and the quotes in the config together
      await console.log(notice(`Quotes added: ${config.quotes.length}`)) // Signale that quotes were added
      await console.log(notice(`Total Quotes: ${quotes.length}`)) // Log how many quotes there are in total
    }
  } else if (config.staticQuote && config.quotes && config.staticQuote === 'true') {
    if (typeof config.quotes === 'string') {
      quotes = config.quotes
    } else {
      await console.log(warn('So, you want to have a static quote.. but its not a string.. hmm, confusing.'))
    }
  } else {
    await console.log(warn('I am confused... Quotes can only be string (you need config.staticQuote to be true for this to work) and array.. So why is it neither or why do you not have staticQuotes set to true?'))
  }
  // State checker
  if (!config.state && !state) {
    //
  } else if (!config.state && state) {
    state = null
    await console.log(notice('Updated your state to \'none\'!'))
  } else if (config.state && (typeof config.state === 'string')) {
    if (state !== config.state) {
      state = config.state
      await console.log(notice(`Updated your state to: '${state}'`))
    }
  } else if (config.state && !(typeof config.state === 'string')) {
    await console.log(warn('The state needs to be a string.'))
  }
  if (config.timestamp && (config.timestamp === true || config.timestamp === 'true') && timestamp !== true) { // If config timestamp is enmabled
    timestamp = true // Enable the timestamp
    await console.log(notice('Timestamp: true')) // Tell the user the timestamp is enabled
  } else if (config.timestamp && config.timestamp === 'false' && timestamp !== false) { // If config timestamp is false
    timestamp = false // Tell the app the timestamp is false
    await console.log(notice('Timestamp: false')) // Tell the user the timestamp is false
  } else if (config.timestamp && config.timestamp === 'now') {
    timestamp = true // Turn on the timestamp
    startTimestamp = new Date() // Redefine startTimestamp
    let existed = false
    if (fs.existsSync('./oldConfig.json')) existed = true
    await fs.writeFile('./oldConfig.json', JSON.stringify(config, null, 2), (err) => {
      if (err) throw err
      else {
        if (!existed) console.log('Created a backup JSON file called "oldConfig.json"!')
        else console.log('Updated the backup JSON file called "oldConfig.json"!')
      }
    })
    await sleep(500) // Pause for .5 seconds
    configuration = config // define configuration as config
    configuration.timestamp = 'true' // redefine the timestamp as 'true'
    await fs.writeFile('./config.json', JSON.stringify(configuration, null, 2), (err) => {
      if (err) throw err
      else console.log('Updated timestamp!')
    }) // Write the file (save)
    await sleep(500) // Pause for .5 seconds
  } else if (!config.timestamp) { // If no timestamp
    timestamp = 'Not found' // Timestamp is 'Not found'
  }
  confi = configuration
  conf = true // Tell the application that there is a configuration file
  if (set === true) await update()
  await console.log(notice('Reloaded the config!')) // Log that the config has been reloaded
  await sleep(500) // Pause for .5 seconds
  if (prompt === true) rl.prompt() // Send the prompt
}

rl.on('line', async (line) => { // When the council gets a new line
  if (line.toLowerCase() === 'refresh') { // If line equals 'refresh'
    reload(true, true) // Reload the config
    reloaded = true // Set reloaded to true (cooldown)
    await sleep(15000) // Wait for 15 seconds
    reloaded = false // Set reloaded to false (cooldown off)
  } else if (line.toLowerCase() === 'exit') { // If line equals exit
    process.exit() // Exit the process
  } else if (line.toLowerCase() === 'refreshclient') {
    refreshclient()
    reloaded = true // Set reloaded to true (cooldown)
    await sleep(15000) // Wait for 15 seconds
    reloaded = false // Set reloaded to false (cooldown off)
  } else { // If none above
    rl.prompt() // Return the prompt
  }
})

// When the rpc starts

let packge = require('./package.json')

rpc.on('ready', async () => {
  console.log(`Started! ${packge.name} (${packge.version}) by: ${packge.author}\nRepo: ${packge.repository.url}\nUser: ${rpc.user.username}`)
  await update()
  rl.prompt()
  setInterval(() => { // Every 5 minutes...
    update() // Update the status, then...
    console.log(notice('\nUpdated status!')) // Log that the status was update, finally...
    rl.prompt() // Show the prompt again to the user
  }, 300000)
})

// If there is a error with the presence

rpc.on('error', (err) => {
  console.log(error(err))
})

// Log in to the rich presence

rpc.login({ clientId }).catch(console.error) // Log in and catch any errors

if (quotes && Array.isArray(quotes)) console.log(notice(`Quotes loaded: ${quotes.length}`)) // If quotes exists, and quotes are a array, log how many quotes there are
