import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { current_store } from 'App/Helpers';
import Item from '../../Models/Item';

export default class ItemsController {
  public async index ({auth}: HttpContextContract) {
    const store = await current_store(auth)
    return Item.query().where('store_id', String(store)).orderBy('id', 'desc')
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request}: HttpContextContract) {
    const name = request.input('name')
    const item = Item.firstOrCreate({name: name})

    return item
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({request, params, response}: HttpContextContract) {
    const item = await Item.findOrFail(params.id)
    item.name = request.input('name')
    item.save()
    return response.created(response)
  }

  public async destroy ({}: HttpContextContract) {
  }
}
