const { expect } = require('chai')
const CleverbotResolver = require('../../lib/CleverbotResolver')

describe('Cleverbot Resolver', () => {
    describe('createInstance', () => {
        let resolver

        beforeEach(() => {
            resolver = new CleverbotResolver()
        })

        it('should throw when no options are provided', () =>
            expect(() => resolver.createInstance()).to.throw('No options provided')
        )
        it('should throw when no instance name is provided', () =>
            expect(() => resolver.createInstance({ logContext: false })).to.throw('Must provide instanceName property')
        )
        it('should throw when an instance with identical name already exists', () => {
            const instance1 = resolver.createInstance({
                instanceName: 'testInstance1'
            })

            expect(() => {
                const instance2 = resolver.createInstance({
                    instanceName: 'testInstance1'
                })
            }).to.throw('An instance with the name \'testInstance1\' already exists')
        })
        it('should create an instance with correct options', () => {
            const instance1 = resolver.createInstance({
                instanceName: 'testInstance1',
                logContext: true,
                maxContext: 35
            })

            expect(instance1.instanceName).to.equal('testInstance1')
            expect(instance1.logContext).to.equal(true)
            expect(instance1.maxContext).to.equal(35)
            expect(instance1.instance).to.not.be.undefined
        })
        it('should create an instance with minimal options', () => {
            const instance1 = resolver.createInstance({
                instanceName: 'testInstance1'
            })

            expect(instance1).to.not.be.undefined
            expect(instance1.logContext).to.equal(false)
            expect(instance1.maxContext).to.be.null
            expect(instance1.instance).to.not.be.undefined
        })
        it('should create two unique instances', () => {
            const instance1 = resolver.createInstance({
                instanceName: 'testInstance1'
            })

            const instance2 = resolver.createInstance({
                instanceName: 'testInstance2'
            })

            expect(instance1).to.not.be.undefined
            expect(instance2).to.not.be.undefined
            expect(instance1.instanceName).to.not.be.undefined
            expect(instance2.instanceName).to.not.be.undefined
            expect(instance1.instanceName).to.not.equal(instance2.instanceName)
        })
    })

    describe('resolveInstance', () => {
        let resolver

        beforeEach(() => {
            resolver = new CleverbotResolver()
        })

        it('should throw when no instance name is provided', () =>
            expect(() => resolver.resolveInstance()).to.throw('No instance name provided')
        )
        it('should throw when no instance exists', () =>
            expect(() => resolver.resolveInstance('fakeInstance')).to.throw('Can not find instance \'fakeInstance\'')
        )
        it('should return a valid matching instance', () => {
            const instance1 = resolver.createInstance({
                instanceName: 'testInstance1'
            })

            const resolvedInstance1 = resolver.resolveInstance('testInstance1')

            expect(instance1).to.not.be.undefined
            expect(resolvedInstance1).to.not.be.undefined
            expect(resolvedInstance1.instanceName).to.equal(instance1.instanceName)
        })
    })
    
    describe('destroyInstance', () => {
        let resolver

        beforeEach(() => {
            resolver = new CleverbotResolver()
        })

        it('should throw when no instance name is provided', () =>
            expect(() => resolver.destroyInstance()).to.throw('No instance name provided')
        )
        it('should throw when no instance exists', () =>
            expect(() => resolver.destroyInstance('fakeInstance')).to.throw('Can not find instance \'fakeInstance\'')
        )
        it('should destroy the existing instance', () => {
            const instance1 = resolver.createInstance({
                instanceName: 'testInstance1'
            })

            expect(instance1).to.not.be.undefined
            expect(instance1.logContext).to.equal(false)
            expect(instance1.maxContext).to.be.null
            expect(instance1.instance).to.not.be.undefined

            const resolvedInstance1 = resolver.resolveInstance('testInstance1')

            expect(instance1).to.not.be.undefined
            expect(resolvedInstance1).to.not.be.undefined
            expect(resolvedInstance1.instanceName).to.equal(instance1.instanceName)

            resolver.destroyInstance('testInstance1')

            expect(() => resolver.resolveInstance('testInstance1')).to.throw('Can not find instance \'testInstance1\'')
        })
    })
})