import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Item from 'App/Models/Item';

export default class OrdersController {
  public async index({ }: HttpContextContract) {
    return Order.all()
  }

  public async create({ }: HttpContextContract) {

  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        item: schema.string({}, [
          rules.minLength(2),
          rules.required,
        ]),
        quantity: schema.string.optional(),
        purchaseprice: schema.string.optional(),
        minselling: schema.string.optional(),
        maxselling: schema.string.optional(),
        user: schema.string({}, [
          rules.minLength(1)
        ])
      })
    })
    const itemId = Item.findOrFail(data.item);
    return itemId
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
