/* global PeerId */
module.exports = typeof PeerId === 'undefined' ? require('./PeerId') : PeerId
