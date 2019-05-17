try {
  module.exports = require('peer-id')
} catch (err) {
  module.exports = require('./PeerId')
}
