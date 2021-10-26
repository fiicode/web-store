import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Link from 'App/Models/Link';
import Phone from 'App/Models/Phone';
import Supplier from 'App/Models/Supplier';
import Item from '../../Models/Item';

export default class SuppliersController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, auth}: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        supplier_name: schema.string({}, [
          rules.minLength(2),
          rules.required(),
        ]),
        supplier_adress: schema.string({}, [
          rules.minLength(2),
          rules.required()
        ]),
        store: schema.string({}, [
          rules.required()
        ]),
        supplier_phone: schema.string({}, [
          rules.minLength(9),
          rules.required()
        ]),
        item_name: schema.string({}, [
          rules.minLength(2),
          rules.required()
        ]),
        item_price: schema.number()
      }),
      messages: {
        'supplier_name.minLength': 'Veuillez saisir un nom correct.',
        'supplier_name.required': 'Le nom de fournisseur est obligatoire.',
        'supplier_adress.required': 'L\'adresse de fournisseur est obligatoire.',
        'supplier_adress.minLength': 'Veuillez saisir une adresse correct',
        'supplier_phone.minLength': 'Numéro incorrect.',
        'store.required': 'Veuillez selectionez un boutique.'
      }
    })

    // const supplier_id = (await supplier!).id
    let phone
    if (data.supplier_phone) {
      phone = await Phone.query().where('number', data.supplier_phone).first()
    }

    if (data.supplier_phone && !phone) {
      phone = await Phone.firstOrCreate({
        number: data.supplier_phone,
        storeId: parseInt(data.store),
        userId: auth.user!.id
      })
    }
    const supplier = await Supplier.firstOrCreate({
      name: data.supplier_name ?? null,
      address: data.supplier_adress ?? null,
      phoneId: phone ? phone.id : null,
      storeId: parseInt(data.store),
      userId: auth.user!.id
    })
    if (data.item_name) {
      Item.firstOrCreate({
        name: data.item_name,
        storeId: parseInt(data.store),
        price: data.item_price,
        userId: auth.user!.id
      })
    }

    Link.firstOrCreate({
      customerId: supplier!.id ?? null,
      phoneId: phone!.id  ?? null,
      storeId: parseInt(data.store),
      userId: auth.user!.id
    })

    return supplier
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
