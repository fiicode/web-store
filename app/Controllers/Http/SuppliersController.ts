import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { current_store } from 'App/Helpers';
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
        supplier_phone: schema.number([
          rules.unsigned(),
          rules.required()
        ]),
        item_name: schema.string({}, [
          rules.minLength(2),
          rules.required()
        ]),
        item_price: schema.number.optional(),
        title: schema.string.optional({}, [
          rules.minLength(2)
        ]),
        description: schema.string.optional({}, [
          rules.minLength(2)
        ])
      }),
      messages: {
        'supplier_name.minLength': 'Le nom de fournisseur est très court.',
        'supplier_name.required': 'Le nom de fournisseur est obligatoire.',
        'supplier_adress.required': 'L\'adresse de fournisseur est obligatoire.',
        'supplier_adress.minLength': 'L\'adresse très court.',
        'supplier_phone.required': 'Le numéro est obligatoire.',
        'supplier_phone.unsigned': 'Numéro incorrect.',
        'store.required': 'Veuillez selectionez un boutique.',
        'item_name.minLength': 'Le nom du produit est très court.',
        'supplier_phone.number': 'Ce type de de numéro est non pris en charge.',
        'item_price.number': 'Ce type de prix est non pris en charge.',
        'title.minLength': 'Le titre est très court',
        'description.minLength': 'La description est très court'
      }
    })

    // const supplier_id = (await supplier!).id
    // storeId: parseInt(data.store),
    const store = await current_store(auth)
    let phone
    let supplier

    if (data.supplier_phone) {
      phone = await Phone.query().where('number', data.supplier_phone).first()
    }

    if (data.supplier_phone && !phone) {
      phone = await Phone.firstOrCreate({
        number: data.supplier_phone,
        storeId: store,
        userId: auth.user!.id
      })
    }
    if (data.supplier_name) {
      supplier = await Supplier.query()
      .where('name', data.supplier_name)
      .where('address', data.supplier_adress)
      .where('phone_id', phone.id)
      .where('storeId', String(store))
      .whereNull('deletedAt').first();
    }
    if (data.supplier_name && !supplier) {
      supplier = await Supplier.firstOrCreate({
        name: data.supplier_name ?? null,
        address: data.supplier_adress ?? null,
        phoneId: phone ? phone.id : null,
        storeId: store,
        userId: auth.user!.id
      })
    }

    const checkItem = await Item.query()
    .where('name', data.item_name)
    .where('storeId', String(store))
    .whereNull('deletedAt').first();

    if (data.item_name && !checkItem) {
      Item.firstOrCreate({
        name: data.item_name,
        slug: data.item_name.toLowerCase().replace(/\s+/g, '-'),
        title: data.title ?? null,
        description: data.description ?? null,
        storeId: store,
        price: data.item_price ?? 0,
        userId: auth.user!.id
      })
    }

    if (checkItem) {
      if (checkItem.name != data.item_name) {
        checkItem.name = data.item_name
      }
      checkItem.title = data.title ?? null
      checkItem.description = data.description ?? null
      await checkItem.save()
    }

    const linksSup = await Link.query()
    .where('supplierId', supplier?.id)
    .where('phoneId', String(store))
    .whereNull('deletedAt').first();

    if (!linksSup && supplier && phone) {
      Link.firstOrCreate({
        supplierId: supplier!.id ?? null,
        phoneId: phone!.id  ?? null,
        storeId: store,
        userId: auth.user!.id
      })
    }


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
