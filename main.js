// A discord rich presence for the dyno server's members. Repurpose if you would like.

// Declare main variables (to be used later on)

console.log('Starting....')

const Discord = require('discord-rpc')

const readline = require('readline')

const fs = require('fs')

let conf = false

let timestamp = false

let largeImageKey = 'dyno'

let smallImageKey = 'dynoglitch'

let largeText = null

let smallText = null

let clientId = '513462902053797903'

let quotes = [ 'Annoying the staff', 'Minimodding', 'Travelling the dyno world', 'Interfering in support', 'Arguing with the staff', 'Reviving chat', 'Arguing with council', 'Talking about Dyno' ]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,

  prompt: 'Would you like to refresh the presence (refresh), or exit (exit)? '
})

console.log('Checking for config...')

if (fs.existsSync('./config.json')) {
  const config = require('./config.json')
  console.log('Config found! Checking config')
  if (config.largeImageKey) { // If there is a largeImageKey
    largeImageKey = config.largeImageKey.toLowerCase() // Rewrite the largeImageKey
    if (config.largeImageText) {
      largeText = config.largeImageText
    }
    if (config.smallImageKey) { // If config has a small key
      smallImageKey = config.smallImageKey.toLowerCase() // Overwrite the default smallImageKey
      if (config.smallImageText) {
        smallText = config.smallImageText
      }
    }
  }
  if (!config.quotes) { // If no quotes in the config
    //
  } else if (config.quotes && config.quotes instanceof Array) { // If quotes are in the config and they are a array
    if (config.defaultQuotes && config.defaultQuotes === 'false') { // If defaultQuotes is in the config, and it equals 'false'. 'false' is basically saying 'disable the default quotes'
      quotes = config.quotes // Rewrite the quotes with the quotes in the config
    } else { // Everyone knows what else does, ye?
      quotes = quotes.concat(config.quotes) // Add quotes and the quotes in the config together
    }
  } else { // Everyone knows what else does, ye?
    console.log('I need your quotes to be in a array, otherwise i will not use them.') // Inform the user that quotes need to be a array
  }
  if (config.clientId) {
    clientId = config.clientId
  }
  conf = true
  if (config.timestamp && (config.timestamp === true || config.timestamp === 'true')) {
    timestamp = true
  } else if (!config.startTimestamp) {
    timestamp = 'Not found'
  }
  console.log('Checked config.')
} else {
  console.log('Config not found. Do not worry, the app has been pre-setup. You can create the config and do \'refresh\' to gain access to the configuaration.')
}

let reloaded = false

const startTimestamp = new Date()

// The rpc function, so it can easily update the rpc

function update () {
  let rand = Math.round(Math.random() * (quotes.length - 1)) // Generates a random number, so it can be randomized.
  let random = quotes[rand] // Get a random quote
  if (conf === true) { // If the configuration exists
    if (timestamp === false) { // If the timestamp is false
      if (largeText) { // If large text exists
        if (smallText) { // If small text exists
          rpc.setActivity({ // Set the users activiity
            details: random,
            largeImageKey: largeImageKey,
            smallImageKey: smallImageKey,
            largeImageText: largeText,
            smallImageText: smallText
          })
          return null // Stop
        }
        rpc.setActivity({ // Set the users activiity
          details: random,
          largeImageKey: largeImageKey,
          smallImageKey: smallImageKey,
          largeImageText: largeText
        })
      } else { // If large text does not exist
        if (smallText) { // If small text exists
          rpc.setActivity({ // Set the users activiity
            details: random,
            largeImageKey: largeImageKey,
            smallImageKey: smallImageKey,
            smallImageText: smallText
          })
          return null // Stop
        }
        // If small text does not exist
        rpc.setActivity({ // Set the users activiity
          details: random,
          largeImageKey: largeImageKey,
          smallImageKey: smallImageKey
        })
      }
    } else {
      if (largeText) { // If large text exists
        if (smallText) { // If small text exists
          rpc.setActivity({ // Set the users activiity
            details: random,
            largeImageKey: largeImageKey,
            smallImageKey: smallImageKey,
            largeImageText: largeText,
            smallImageText: smallText,
            startTimestamp
          })
          return null // Stop
        }
        // If small text does not exist
        rpc.setActivity({ // Set the users activiity
          details: random,
          largeImageKey: largeImageKey,
          smallImageKey: smallImageKey,
          largeImageText: largeText,
          startTimestamp
        })
      } else { // If large text does not exist
        if (smallText) { // If small text
          rpc.setActivity({ // Set the users activiity
            details: random,
            largeImageKey: largeImageKey,
            smallImageKey: smallImageKey,
            smallImageText: smallText,
            startTimestamp
          })
          return null // Stop
        }
        rpc.setActivity({ // Set the users activiity
          details: random,
          largeImageKey: largeImageKey,
          smallImageKey: smallImageKey,
          startTimestamp
        })
      }
    }
  }
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function reload () { // Reload the config
  if (reloaded === true) { // If reloaded is set to true (its a cooldown)
    console.log('Try again later.') // Log that the user can try again later
    rl.prompt() // Show the prompt
    return null // Stop the function
  }
  if (fs.existsSync('./config.json') === false) { // If there is no file called 'config.json'
    console.log('No file called config.json found. Nothing changed.') // Log that there is no file called 'config.json'
    conf = false // Tell the app there is no config
    rl.prompt() // Show the prompt
    return null // Stop the function
  }
  console.log('Reloading config') // Tell the user the config is reloading
  quotes = [ 'Annoying the staff', 'Minimodding', 'Travelling the dyno world', 'Interfering in support', 'Arguing with the staff', 'Reviving chat', 'Arguing with council', 'Talking about Dyno' ] // Redifine quotes
  delete require.cache[require.resolve('./config.json')] // Remove the require cache for config.json
  const config = require('./config.json') // Require the config
  if (config.largeImageKey) { // If there is a largeImageKey
    if (largeImageKey !== config.largeImageKey.toLowerCase()) { // If the currentt does not equal the configs
      largeImageKey = config.largeImageKey.toLowerCase() // Rewrite the largeImageKey
      console.log('Updated the large image') // Log that the largeImageKey was updated
    }
    if (config.largeImageText) {
      if (config.largeImageText !== largeText) {
        largeText = config.largeImageText
        console.log('Updated the large image text!')
      }
    } else {
      largeText = null
      console.log('Large text: off')
    }
    if (config.smallImageKey) { // If config has a small key
      if (smallImageKey !== config.smallImageKey.toLowerCase()) { // if smallImagekey does not equal the configs smallImageKey
        smallImageKey = config.smallImageKey.toLowerCase() // Overwrite the default smallImageKey
        console.log('Updated the small image') // Tell the user the small image was updated
      }
      if (config.smallImageText) {
        if (config.smallImageText !== smallText) {
          smallText = config.smallImageText
          console.log('Updated the small image text!') // Log that the small text was updated
        }
      } else {
        smallText = null
        console.log('Small text: off')
      }
    }
  }
  if (!config.quotes) { // If no quotes
    //
  } else if (config.quotes && config.quotes instanceof Array) { // If quotes, and quotes are a array
    if (config.defaultQuotes && config.defaultQuotes === 'false') { // If defaultQuotes is in the config, and it equals 'false'. 'false' is basically saying 'disable the default quotes'
      quotes = config.quotes // Rewrite the quotes with the quotes in the config
      console.log(`Quotes loaded: ${quotes.length}`) // Log that quotes were loaded.
    } else { // Everyone knows what else does, ye?
      quotes = quotes.concat(config.quotes) // Add quotes and the quotes in the config together
      console.log(`Quotes added: ${config.quotes.length}`) // Signale that quotes were added
      console.log(`Total Quotes: ${quotes.length}`) // Log how many quotes there are in total
    }
  } else { // If none of the condidtions above
    console.log('I need your quotes to be in a array, otherwise i will not use them.') // Tell the user it needs quotes in a array
  }
  if (config.timestamp && (config.timestamp === true || config.timestamp === 'true')) { // If config timestamp is enmabled
    if (timestamp === false) { // If timestamp is false
      timestamp = true // Enable the timestamp
      console.log('Timestamp: true') // Tell the user the timestamp is enabled
    }
  } else if (config.timestamp && (conf.timestamp === false || config.timestamp === 'false')) { // If config timestamp is false
    timestamp = false // Tell the app the timestamp is false
    console.log('Timestamp: false') // Tell the user the timestamp is false
  } else if (!config.timestamp) { // If no timestamp
    timestamp = 'Not found' // Timestamp is 'Not found'
  }
  conf = true // Tell the application that there is a configuration file
  update() // Call the update function
  console.log('Reloaded the config!') // Log that the config has been reloaded
  rl.prompt() // Send the prompt
}

rl.on('line', async (line) => { // When the council gets a new line
  if (line.toLowerCase() === 'refresh') { // If line equals 'refresh'
    reload() // Reload the config
    reloaded = true // Set reloaded to true (cooldown)
    await sleep(15000) // Wait for 15 seconds
    reloaded = false // Set reloaded to false (cooldown off)
  } else if (line.toLowerCase() === 'exit') { // If line equals exit
    process.exit() // Exit the process
  } else { // If none above
    rl.prompt() // Return the prompt
  }
})

const rpc = new Discord.Client({ transport: 'ipc' })

// When the rpc starts

rpc.on('ready', () => {
  console.log(`Started!\nUser: ${rpc.user.username}`)
  update()
  rl.prompt()
  setInterval(() => {
    update()
    console.log('\nUpdated status!')
    rl.prompt()
  }, 300000)
})

// Log in to the rich presence

rpc.login({ clientId }).catch(console.error)

console.log(`${quotes.length} quotes Loaded.`)
