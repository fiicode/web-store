import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Phone from '../../Models/Phone';
import Link from '../../Models/Link';

export default class CustomersController {
  public async index ({request}: HttpContextContract) {
    const page = request.input('page')
    const limit = 50
    return await Customer.query().whereNull('deletedAt').preload('links', (link) => {
      return link.whereNull('deletedAt').preload('user').preload('option', (option) => {
        return option.whereNull('deletedAt').preload('user')
      })
    }).preload('user').preload('phones').orderBy('id', 'desc').paginate(page, limit);
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, auth }: HttpContextContract) {


    const data = await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.minLength(2),
        ]),
        phone: schema.string({}, [
          rules.minLength(9),
          rules.unique({ table: 'phones', column: 'number'})
        ]),
        store: schema.string({}, [
          rules.required()
        ])
      }),
      messages: {
        required: 'Le {{ field }} est obligatoire pour ajouter',
        'phone.unique': 'Ce numéro existe déjà.',
        'phone.minLength': 'Numéro incorrect',
        'store.required': 'Veuillez selectionez une boutique'
      }
    })

    const name = data.name
    const phone = data.phone
    const store = parseInt(data.store)
    const userId = auth.user!.id

    const number = await Phone.firstOrCreate({
      number: phone,
      storeId: store,
      userId: userId,
    })

    const customer = await Customer.firstOrCreate({
      name: name,
      phoneId: number?.id ?? null,
      storeId: store,
      userId: userId
    })

    Link.firstOrCreate({
      customerId: customer?.id ?? null,
      phoneId: number?.id ?? null,
      storeId: store,
      userId: userId
    })

    const id = customer!.id

    return await Customer.query().where('id', id).preload('links', (link) => {
      return link.whereNull('deletedAt').preload('user').preload('option', (option) => {
        return option.whereNull('deletedAt').preload('user')
      })
    }).preload('user').preload('phones')
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
