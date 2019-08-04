'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class Provider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.bind('Freesgen/Adonis/Querify', (model) => {
      // const Config = this.app.use('Adonis/Src/Config')
      return new (require('../src/models/traits/Querify'))(model)
    })
    this.app.alias('Freesgen/Adonis/Querify', 'Freesgen/Querify')
  }

  _bootServices () {
    this.app.bind('Freesgen/Adonis/BaseController', () => require('../src/controllers/BaseController'))
    this.app.alias('Freesgen/Adonis/BaseController', 'Freesgen/BaseController')

    this.app.bind('Freesgen/Adonis/BaseModel', () => require('../src/models/BaseModel'))
    this.app.alias('Freesgen/Adonis/BaseModel', 'Freesgen/BaseModel')
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    this._bootServices()
  }
}

module.exports = Provider
