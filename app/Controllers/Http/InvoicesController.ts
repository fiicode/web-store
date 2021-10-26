import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Invoice from '../../Models/Invoice';

export default class InvoicesController {
  public async index ({request}: HttpContextContract) {
    const page = request.input('page')
    const limit = 10
    return await Invoice.query().whereNull('deletedAt').preload('customer', (customer) => {
      return customer.whereNull('deletedAt').preload('phones')
    }).preload('deliverer', (deliverer) => {
      return deliverer.whereNull('deletedAt').preload('phone')
    }).preload('user').preload('lists', (list) => {
      return list.whereNull('deletedAt').preload('item', (item) => {
        return item.whereNull('deletedAt')
      }).preload('deliverer', (deliverer) => {
        return deliverer.whereNull('deletedAt').preload('phone')
      }).preload('customer', (customer) => {
        return customer.whereNull('deletedAt').preload('phones')
      })
    }).orderBy('id', 'desc').paginate(page, limit)
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
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
