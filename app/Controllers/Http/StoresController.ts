import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Link from 'App/Models/Link';
import Phone from 'App/Models/Phone';
import Store from 'App/Models/Store';

export default class StoresController {
  public async index ({auth}: HttpContextContract) {
    const store = await Store.query().whereNull('deletedAt').where('user_id', auth.user!.id).preload('user').preload('phone')
    const link = await Link.query().whereNull('deletedAt').where('user_from_to_id', auth.user!.id).preload('user').preload('store', (store) => {
      return store.preload('user').preload('phone')
    })
    
    return [...store, ...link]
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, auth}: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.minLength(2),
          rules.unique({ table: 'stores', column: 'name'})
        ]),
        address: schema.string.optional({}, [
          rules.minLength(2)
        ]),
        phone: schema.string.optional({}, [
          rules.minLength(9),
          rules.unique({table: 'phones', column: 'number'})
        ])
      }),
      messages: {
        'name.minLength': 'Nom incorrect',
        'name.unique': 'Ce nom existe déjà',
        'name.required': 'Le nom est obligatoire',
        'phone.minLength': 'Numéro incorrect',
        'phone.string': 'Erreur de type',
        'address.minLength': 'Adresse incorrect',
        'phone.unique': 'Ce numéro existe déjà'
      }
    })
    // return (data.name.toLowerCase().replace(/\s+/g, '-'))
    let phone
    if (data.phone) {
      phone = await Phone.query().where('number', data.phone).first()
    }
    if (data.phone && !phone) {
      phone = await Phone.firstOrCreate({
        number: data.phone,
        userId: auth.user!.id
      })
    }
    const store = await Store.firstOrCreate({
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      address: data.address,
      phoneId: phone ? phone.id : null,
      userId: auth.user!.id
    })
    Link.firstOrCreate({
      phoneId: phone ? phone.id : null,
      storeId: store!.id,
      userId: auth.user!.id
    })
    if (phone && store) {
      phone.storeId = store.id
      phone.save()
    }

    return store
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
