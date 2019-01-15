/*!
* Contentstack Sync Manager
* This module saves filtered/failed items
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { getConfig } from '../'
import { existsSync, mkdirpSync, readFile, stat, writeFile } from './fs'
import { logger } from './logger'

const counter = {
  failed: 0,
  filtered: 0,
}

/**
 * Decision pending
 * This method logs all failed items.
 * Failed items should be 'retried' when app is started Or after a specific interval
 * @param {Object} obj - Contains 'error' and 'data' key
 * @returns {Promise} Returns a promisified object
 */
export const saveFailedItems = (obj) => {
  return new Promise((resolve) => {
    // const path = getConfig().paths.failedItems

    return resolve(obj)
  })
}

interface IFailedItems {
  items: any[]
  name: string
  token: string
  timestamp: string
}

/**
 * @description Saves items filtered from SYNC API response
 * @param {Object} items - Filtered items
 * @param {String} name - Page name where items were filtered
 * @param {String} token - Page token value
 * @returns {Promise} Returns a promise
 */
export const saveFilteredItems = (items, name, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = getConfig()
      if (!config['sync-manager'].saveFilteredItems) {
        return resolve()
      }
      const objDetails = {
        items,
        name,
        timestamp: new Date().toISOString(),
        token,
      }
      let filename
      if (counter.filtered === 0) {
        filename = `${config.paths.filtered}.json`
      } else {
        filename = `${config.paths.filtered}-${counter.filtered}.json`
      }
      const file: string = await (getFile(filename, 'filtered') as any)

      if (existsSync(file)) {
        return readFile(file).then((data) => {
          const loggedItems: IFailedItems[] = JSON.parse((data as any))
          loggedItems.push(objDetails)

          return writeFile(file, JSON.stringify(loggedItems)).then(resolve).catch((error) => {
            // failed to log failed items
            logger.error(`Failed to write ${JSON.stringify(loggedItems)} at ${error}`)
            logger.error(error)

            return resolve()
          })
        }).catch((error) => {
          logger.error(`Failed to read file from path ${fail}`)
          logger.error(error)

          return resolve()
        })
      }

      return writeFile(file, JSON.stringify([objDetails])).then(resolve).catch((error) => {
        logger.error(`Failed while writing ${JSON.stringify(objDetails)} at ${file}`)
        logger.error(error)

        return resolve()
      })
    } catch (error) {
      return reject(error)
    }
  })
}

const getFile = (file, type) => {
  return new Promise((resolve, reject) => {
    const config = getConfig()
    if (existsSync(file)) {
      return stat(file, (statError, stats) => {
        if (statError) {
          return reject(statError)
        } else if (stats.isFile()) {
          if (stats.size > config['sync-manager'].maxsize) {
            counter[type]++
            const filename = `${config.paths[type]}-${counter[type]}.json`

            return resolve(filename)
          }

          return resolve(file)
        } else {
          return reject(new Error(`${file} is not of type file`))
        }
      })
    } else {
      mkdirpSync(config.paths.unprocessibleDir)

      return resolve(file)
    }
  })
}