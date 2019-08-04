'use strict'

const Event = use('Event');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tickets
 */
class BaseController  {
  constructor(model, modelName = '') {
    this.model = model;
    this.modelName = modelName;
  }
  /**
   * Show a list of all tickets.
   * GET tickets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({request, response, auth}) {
    let query = request.get();
    const userData = await auth.getUser()
    
    if (query.filter) { 
      query.filter.id_company = userData.id_company.toString()
    } else {
      query.filter = { id_company: userData.id_company.toString()}
    }

    console.log(query)
      return response.json(await this.model.getFromQuery(query));
  }

  /**
   * Render a form to be used for creating a new ticket.
   * GET tickets/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new ticket.
   * POST tickets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const formData = request.all();
    const userData = await auth.getUser()
    formData.id_company = userData.id_company;

    let resource;
    try {
        resource = await this.model.create(formData) 
        resource = await this.model.find(resource.id) 

    } catch (e) {
        return response.status(400).json({
            status: {
                message: e.sqlMessage
            }
        });
    }

    if (this.modelName) {
      Event.fire(`new::${this.modelName}`, resource)
    }
    return response.json(resource);
  }

  /**
   * Display a single ticket.
   * GET tickets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const query = request.get();
    
    if (Object.keys(query).length) {
      let modelQuery = this.getModelQuery(query);
      return response.json(await modelQuery.where({id: params.id}).fetch());
    }
    response.json(await this.model.find(params.id))
  }


  /**
   * Update ticket details.
   * PUT or PATCH tickets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const resource = await this.model.find(params.id)
    if (!resource) {
      return response.status(400).json({
        status: {
          message: "resource not found"
        }
      });

    }

    resource.merge(request.all());

    try{
     await resource.save();
      if (this.modelName) {
        Event.fire(`updated::${this.modelName}`, resource)
      }
    } catch(e) {
      return response.status(400).json({
        status: {
          message: e
        }
      });
    }

    return response.json(resource)
  }

  /**
   * Delete a ticket with id.
   * DELETE tickets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const resource = await this.model.find(params.id)
    if (!resource) {
      response.status(400).json({
        status: {
          message: "User nor found"
        }
      });

    }
    
    try{
     await resource.delete()
    } catch(e) {
      return response.status(400).json({
        status: {
          message: e.sqlMessage
        }
      });
    }

    return response.json(resource)
  }
}

module.exports = BaseController
