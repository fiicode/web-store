import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class CustomersController {
  public async index ({request}: HttpContextContract) {
    // const page = request.input('page')
    // const limit = 10
    console.log(request.input('page'));
    // const customer = await Customer.query().paginate(1);
    return await Customer.query().whereNull('deletedAt').preload('links', (link) => {
      return link.whereNull('deletedAt').preload('option')
    }).limit(10);
  // }).paginate(page, limit);
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, auth }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.minLength(2)
        ]),
        phone: schema.string({}, [
          rules.minLength(9)
        ])
      })
    })
    const name = data.name
    const phone = data.phone
    const userId = auth.user!.id

    const customer = Customer.firstOrCreate({
      name: name,
      phone: phone,
      userId: userId
    })

    return customer
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({ params, request}: HttpContextContract) {
    const customer = await Customer.findOrFail(params.id);
    customer.name = request.input('name');
    customer.phone = request.input('phone');
    customer.save();

    return customer;
  }

  public async destroy ({}: HttpContextContract) {
  }
}
