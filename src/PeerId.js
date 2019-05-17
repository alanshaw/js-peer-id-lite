'use strict'

const mh = require('multihashes')
const assert = require('assert')
const withIs = require('class-is')

class _PeerId {
  constructor (id, privKey, pubKey) {
    assert(Buffer.isBuffer(id), 'invalid id provided')
    assert(arguments.length === 1, 'private/public key arguments unsupported in lite')
    this._id = id
    this._idB58String = mh.toB58String(this.id)
  }

  get id () {
    return this._id
  }

  set id (_) {
    throw new Error('Id is immutable')
  }

  set privKey (_) {
    throw new Error('set private key unsupported in lite')
  }

  set pubKey (_) {
    throw new Error('set public key unsupported in lite')
  }

  marshalPubKey () {}
  marshalPrivKey () {}

  toPrint () {
    let pid = this.toB58String()
    // All sha256 nodes start with Qm
    // We can skip the Qm to make the peer.ID more useful
    if (pid.startsWith('Qm')) {
      pid = pid.slice(2)
    }
    let maxRunes = 6
    if (pid.length < maxRunes) {
      maxRunes = pid.length
    }

    return '<peer.ID ' + pid.substr(0, maxRunes) + '>'
  }

  // return the jsonified version of the key, matching the formatting
  // of go-ipfs for its config file
  toJSON () {
    return { id: this.toB58String() }
  }

  // encode/decode functions
  toHexString () {
    return mh.toHexString(this.id)
  }

  toBytes () {
    return this.id
  }

  toB58String () {
    return this._idB58String
  }

  isEqual (id) {
    if (Buffer.isBuffer(id)) {
      return this.id.equals(id)
    } else if (id.id) {
      return this.id.equals(id.id)
    } else {
      throw new Error('not valid Id')
    }
  }

  isValid (callback) {
    callback(new Error('Keys not match'))
  }

  static create (options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    callback(new Error('not supported in lite'))
  }

  static createFromHexString (str) {
    return new PeerId(mh.fromHexString(str))
  }

  static createFromBytes (buf) {
    return new PeerId(buf)
  }

  static createFromB58String (str) {
    return new PeerId(mh.fromB58String(str))
  }

  static createFromPubKey (_, callback) {
    callback(new Error('not supported in lite'))
  }

  static createFromPrivKey (_, callback) {
    callback(new Error('not supported in lite'))
  }

  static createFromJSON (obj, callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is required')
    }

    let id

    try {
      id = mh.fromB58String(obj.id)

      if (obj.privKey) {
        throw new Error('create from JSON with private key not supported in lite')
      }

      if (obj.pubKey) {
        throw new Error('create from JSON with public key not supported in lite')
      }
    } catch (err) {
      return callback(err)
    }

    callback(null, new PeerId(id))
  }
}

const PeerId = withIs(_PeerId, { className: 'PeerId', symbolName: '@libp2p/js-peer-id/PeerId' })

// FIXME: this overwrites withIs
// https://github.com/libp2p/js-peer-id/issues/88
PeerId.isPeerId = function (peerId) {
  return Boolean(typeof peerId === 'object' &&
    peerId._id &&
    peerId._idB58String)
}

module.exports = PeerId
