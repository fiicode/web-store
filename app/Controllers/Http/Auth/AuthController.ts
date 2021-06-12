import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';
import Hash from '@ioc:Adonis/Core/Hash';

export default class AuthController {

  public async login({ request, auth, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        email: schema.string({}, [
          rules.email()
        ]),
        password: schema.string({}, [
          rules.minLength(2)
        ])
      })
    })

    const email = data.email
    const password = data.password

    const user = await User
    .query()
    .where('email', email)
    .firstOrFail()

    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }
    // await auth.attempt(email, password)
    await auth.use('web').login(user)
    return auth.user
  }

  public async register ({ request, auth }: HttpContextContract) {

    const data = await request.validate({
      schema: schema.create({
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email'})
        ]),
        password: schema.string({}, [
          rules.confirmed()
        ])
      }),
    })

    const user = await User.create(data)

    // Send email or number verification
    await auth.use('web').login(user)
    return auth.user
  }
}
