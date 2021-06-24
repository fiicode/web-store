import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Release from 'App/Models/Release'

export default class GlobalsController {
  public async win ({}: HttpContextContract) {
    const windows = await Release.query().where('terminal', 'windows').orderBy('id', 'desc').first()
    return windows?.url
  }
  public async mac ({}: HttpContextContract) {
    const mac = await Release.query().where('terminal', 'macos').orderBy('id', 'desc').first()
    return mac?.url
  }
}
