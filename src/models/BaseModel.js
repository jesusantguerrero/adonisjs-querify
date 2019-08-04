'use strict'


/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseModel extends Model{
  
  static boot () {
    super.boot()
    this.addTrait('Querify')
  }
}

module.exports = BaseModel
