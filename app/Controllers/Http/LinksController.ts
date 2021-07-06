import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer';
import Customer from 'App/Models/Customer'
import Link from 'App/Models/Link'
import { DateTime } from 'luxon';

export default class LinksController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({params, auth }: HttpContextContract) {
    if (params.service == "customer") {
      const lk = await Link.query().where('optionId', params.optionid).where('customerId', params.to).first()
      if (lk) {
        lk.deletedAt = null;
        lk.save();
        console.log('restore lien');
        return Customer.query().where('id', params.to).preload('links', (link) => {
          return link.where('deletedAt', null).preload('option');
        }).first();
      } else {
        const links = {userId: auth.user!.id, customerId: null, optionId: params.optionid}
        links.customerId = params.to;
        Link.firstOrCreate(links);
        console.log('create lien');
        return Customer.query().where('id', params.to).preload('links', (link) => {
          return link.where('deletedAt', null).preload('option');
        }).first();
      }
    }
    return;
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({params}: HttpContextContract) {
    const link = await Link.findOrFail(params.link);
    if (params.service === "customer" && link?.deletedAt === null) {
      link.deletedAt = DateTime.now();
      link.save();
      console.log('deleted lient');
      return Customer.query().where('id', link?.customerId).preload('links', (link) => {
        return link.where('deletedAt', null).preload('option');
      }).first();
    }
    return Customer.query().where('id', link?.customerId).preload('links', (link) => {
      return link.where('deletedAt', null).preload('option');
    }).first();
  }
}
