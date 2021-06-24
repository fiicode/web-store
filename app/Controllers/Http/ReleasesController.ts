import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Release from 'App/Models/Release'

export default class ReleasesController {
  public async index ({}: HttpContextContract) {
    return Release.all()
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({ request }: HttpContextContract) {
    const version = request.input('version')
    const url = request.input('url')
    const terminal = request.input('terminal')
    const release = Release.firstOrCreate({version: version, url: url, terminal: terminal})

    return release
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
