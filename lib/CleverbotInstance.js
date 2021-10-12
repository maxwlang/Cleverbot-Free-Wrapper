const cleverbot = require('cleverbot-free')
const isNil = require('ramda.isnil')

module.exports = class CleverbotInstance {
    _context = []
    _opts = {} 

    constructor(opts) {
        if (isNil(opts)) throw new Error('No options provided')
        this._opts = opts
    }

    async sendMessage(message) {
        if (isNil(message)) throw new Error('No message provided')

        const messageReturned = await cleverbot(
            message,
            this._opts.logContext
                ? this._context
                : undefined
        )
        
        this._cleanContext()

        this._context.push(message)

        // When talking to itself this should be disabled or context will
        // contain duplicate entries. Best way to make two bots talk
        // is to instead create two instances and feed their messages
        // into eachother.
        this._context.push(messageReturned)

        return messageReturned
    }

    _cleanContext() {
        if (!this._opts.logContext) return
        if (this._context <= this._opts.maxContext) return

        this._context = this._context.slice(
            this._context.length - this._opts.maxContext,
            this._context.length
        )
    }
}
