import { cloneDeep, merge } from 'lodash'
import { config as internalConfig } from '../../src/defaults'
import { buildConfigPaths } from '../../src/util/build-paths'
import { setLogger } from '../../src/util/logger'

import {
  validateAssetConnector,
  validateConfig,
  validateContentConnector,
  validateInstances,
  validateListener,
} from '../../src/util/validations'
import { config } from '../dummy/config'
import { assetConnector, contentConnector, listener } from '../dummy/connector-listener-instances'

describe('validations', () => {
  beforeAll(() => {
    setLogger()
  })
  describe('validate config for errors', () => {
    test('contentstack config key is undefined', () => {
      const configs: any = cloneDeep(merge({}, internalConfig, config))
      configs.paths = buildConfigPaths()
      delete configs.contentstack
      expect(() => {
        validateConfig(configs)
      }).toThrowError(/^Config 'contentstack' key cannot be undefined$/)
    })

    test('config contentstack does not have required - apiKey', () => {
      const configs: any = cloneDeep(merge({}, internalConfig, config))
      configs.paths = buildConfigPaths()
      configs.contentstack = {}
      expect(() => {
        validateConfig(configs)
      }).toThrowError(/^Config 'contentstack' should be of type object and have 'apiKey' and 'token'$/)
    })

    test('config contentstack does not have required - token', () => {
      const configs: any = cloneDeep(merge({}, internalConfig, config))
      configs.paths = buildConfigPaths()
      delete configs.contentstack.deliveryToken
      expect(() => {
        validateConfig(configs)
      }).toThrowError(/^Config 'contentstack' should be of type object and have 'apiKey' and 'token'$/)
    })
  })

  describe('validate instances', () => {
    test('asset connector is not defined', () => {
      expect(() => {
        validateInstances(undefined, contentConnector, listener)
        // Question: Why 'regex' does not work here?
      }).toThrowError("Call 'setAssetStore()' before calling sync-manager start!")
    })

    test('content connector is not defined', () => {
      expect(() => {
        validateInstances(assetConnector, undefined, listener)
      }).toThrowError("Call 'setContentStore()' before calling sync-manager start!")
    })

    test('listener is not defined', () => {
      expect(() => {
        validateInstances(assetConnector, contentConnector, undefined)
      }).toThrowError("Call 'setListener()' before calling sync-manager start!")
    })

    test('asset connector does not have start()', () => {
      const assetConnectorClone = cloneDeep(assetConnector)
      delete assetConnectorClone.start
      expect(() => {
        validateInstances(assetConnectorClone, contentConnector, listener)
      }).toThrowError("Connector and listener instances should have 'start()' method")
    })

    test('content connector does not have start()', () => {
      const contentConnectorClone = cloneDeep(contentConnector)
      delete contentConnectorClone.start
      expect(() => {
        validateInstances(assetConnector, contentConnectorClone, listener)
      }).toThrowError("Connector and listener instances should have 'start()' method")
    })

    test('listener does not have start()', () => {
      const listenerClone = cloneDeep(listener)
      delete listenerClone.start
      expect(() => {
        validateInstances(assetConnector, contentConnector, listenerClone)
      }).toThrowError("Connector and listener instances should have 'start()' method")
    })
  })

  describe('validate instance methods', () => {
    test('asset connector does not have download()', () => {
      const assetConnectorClone = cloneDeep(assetConnector)
      delete assetConnectorClone.download
      expect(() => {
        validateAssetConnector(assetConnectorClone)
      }).toThrowError(`${assetConnectorClone} asset store does not support 'download()'`)
    })

    test('content connector does not have publish()', () => {
      const contentConnectorClone = cloneDeep(contentConnector)
      delete contentConnectorClone.publish
      expect(() => {
        validateContentConnector(contentConnectorClone)
      }).toThrowError(`${contentConnectorClone} content store does not support 'publish()'`)
    })

    test('listener does not have register()', () => {
      const listenerClone = cloneDeep(listener)
      delete listenerClone.register
      expect(() => {
        validateListener(listenerClone)
      }).toThrowError(`${listenerClone} listener does not support 'register()'`)
    })
  })
})
