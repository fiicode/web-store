import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Release extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public version: string

  @column()
  public url: string

  @column()
  public terminal: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
