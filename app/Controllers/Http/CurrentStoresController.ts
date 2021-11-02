import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CurrentStore from '../../Models/CurrentStore';
import { current_store } from '../../Helpers/index';

export default class CurrentStoresController {
  public async index ({auth}: HttpContextContract) {
    const store = current_store(auth)

    return store
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, auth}: HttpContextContract) {

    const id = request.body().store
    return await CurrentStore.create({
      userId: auth.user!.id,
      storeId: id
    })
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}

