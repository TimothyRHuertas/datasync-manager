/*!
* Contentstack Sync Manager
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import Debug from 'debug'
import { getConfig } from '..'
import { getFile } from '../util/core-utilities'
import { existsSync, readFile, writeFile } from '../util/fs'

const debug = Debug('token-management')
let counter = 0

/**
 * @interface ledger interface
 */
interface ITokenLedger {
  name: string,
  timestamp: string,
  token: string,
}

/**
 * @interface token interface
 */
interface IToken {
  name: string,
  timestamp: string,
  token: string,
}

/**
 * @description Returns 'token details' based on 'token type'
 * @param {String} type - Token type (checkpoint | current)
 */
export const getToken = () => {

  return new Promise((resolve, reject) => {
    try {
      const config = getConfig()
      const path = config.paths.token
      if (existsSync(path)) {
        return readFile(path).then((data) => {
          return resolve(JSON.parse(data as any))
        })
      }

      return resolve({})
    } catch (error) {
      return reject(error)
    }
  })
}

/**
 * @description Saves token details
 * @param {String} name - Name of the token
 * @param {String} token - Token value
 * @param {String} type - Token type
 */
export const saveToken = (name, token) => {
  debug(`Save token invoked with name: ${name}, token: ${token}`)

  return new Promise((resolve, reject) => {
    const config = getConfig()
    const path = config.paths.token
    const data: IToken = {
      name,
      timestamp: new Date().toISOString(),
      token,
    }

    return writeFile(path, JSON.stringify(data)).then(async () => {
      const obj: ITokenLedger = {
        name,
        timestamp: new Date().toISOString(),
        token,
      }

      let filename
      if (counter === 0) {
        filename = config.paths.ledger
      } else {
        filename = `${config.paths.ledger}.${counter}`
      }
      const file: string = await (getFile(filename, () => {
        counter++

        return `${config.paths.ledger}-${counter}`
      }) as any)
      debug(`ledger file: ${file} exists?(${existsSync(file)})`)
      if (!existsSync(file)) {
        return writeFile(file, JSON.stringify([obj]))
        .then(resolve)
        .catch(reject)
      }

      return readFile(file).then((ledger) => {
        const ledgerDetails: ITokenLedger[] = JSON.parse(ledger as any)
        ledgerDetails.splice(0, 0, obj)

        return writeFile(file, JSON.stringify(ledgerDetails))
          .then(resolve)
          .catch(reject)
      }).catch(reject)
    }).catch((error) => {
      return reject(error)
    })
  })
}
