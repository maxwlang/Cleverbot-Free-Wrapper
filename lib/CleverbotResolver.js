const isNil = require('ramda.isnil')
const CleverbotInstance = require('./CleverbotInstance')

module.exports = class CleverbotResolver {
    _instances = []
    
    createInstance(opts) {
        if (isNil(opts)) throw new Error('No options provided')
        if (isNil(opts.instanceName)) throw new Error('Must provide instanceName property')

        const instance = this._instances.find(instance => instance.instanceName === opts.instanceName)
        if (instance !== undefined)
            throw new Error(`An instance with the name '${opts.instanceName}' already exists`)
        
        const instanceObj = {
            instanceName: opts.instanceName,
            logContext: opts.logContext ?? false,
            maxContext: opts.maxContext ?? null,
            instance: new CleverbotInstance({
                logContext: opts.logContext ?? false,
                maxContext: opts.maxContext ?? null
            })
        }

        this._instances.push(instanceObj)

        return instanceObj
    }

    resolveInstance(instanceName) {
        if (isNil(instanceName)) throw new Error('No instance name provided')

        const instanceObj = this._instances.find(instance => instance.instanceName === instanceName)
        if (isNil(instanceObj)) throw new Error(`Can not find instance '${instanceName}'`)

        return instanceObj
    }

    destroyInstance(instanceName) {
        if (isNil(instanceName)) throw new Error('No instance name provided')

        const instanceIndex = this._instances.findIndex(instance => instance.instanceName === instanceName)
        if (instanceIndex === -1)
            throw new Error(`Can not find instance '${instanceName}'`)

        this._instances = this._instances.filter((v, i) => i !== instanceIndex)
    }
}
