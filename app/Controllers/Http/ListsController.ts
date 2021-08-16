import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Item from 'App/Models/Item';
import List from 'App/Models/List';
import Order from 'App/Models/Order';

export default class ListsController {

  public async createOrderList({ request, auth }: HttpContextContract) {
    // const data = await request.validate({
    //   schema: schema.create({
    //     item: schema.string({}, [
    //       rules.minLength(1),
    //     rules.required()
    //     ]),
    //     quantity: schema.number.optional(),
    //     purchaseprice: schema.number.optional(),
    //     minselling: schema.number.optional(),
    //     maxselling: schema.number.optional()
    //   })
    // })

    if (request.body().length > 0) {
      let order = await Order.query().where('charged', false).first()
      if (!order) {
        order = await Order.create({
          userId: auth.user!.id
        })
      }
      request.body().map(async (field) => {
        const itemId = await Item.find(field.item)
        if (itemId) {
          List.create({
            itemId: itemId!.id,
            quantity: field.quantity,
            purchaseprice: field.purchaseprice,
            minselling: field.minselling,
            maxselling: field.maxselling,
            orderId: order!.id,
            order: true,
            userId: auth.user!.id,
          })
          if (!order!.charged) {
            order!.charged = true
            order!.save()
          }
        }
      })
      return order
    }
    return
  }
}
