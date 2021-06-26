import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'

export default class CustomersController {
  public async index ({}: HttpContextContract) {
    return Customer.all()
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, auth }: HttpContextContract) {
    const name = request.input('name')
    const phone = request.input('phone')
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

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
