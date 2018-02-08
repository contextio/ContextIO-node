const clientV2 = require('./2.0')
const clientLite = require('./lite')

// Context.IO Client constructor. ContextIO({key, secret, version})
const ClientConstructor = (settings) => {
  // Check settings
  if (!settings) {
    throw new Error('Missing ContextIO settings')
  }

  if (!settings.version) {
    settings.version = 'lite'
  }

  if (settings.version !== '2.0' && settings.version !== 'lite') {
    throw new Error('Not a supported ContextIO API version')
  }

  if (!(settings.key && settings.secret)) {
    throw new Error("Context.IO consumer attribues 'secret' and 'key' are both required")
  }

  return (settings.version === '2.0') ? clientV2(settings) : clientLite(settings)
}

module.exports = ClientConstructor
