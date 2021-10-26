import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Link from './Link'
import Phone from './Phone'
import Invoice from './Invoice'
import Store from './Store'
export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public phoneId: number

  @belongsTo(() => Phone)
  public phones: BelongsTo<typeof Phone>

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public avatar: string

  @column()
  public description: string

  @column()
  public storeId: number

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false })
  public deletedAt: DateTime

  @hasMany(() => Link)
  public links: HasMany<typeof Link>

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>
}
