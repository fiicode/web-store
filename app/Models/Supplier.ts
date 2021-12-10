import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Store from './Store';
import Phone from './Phone';
import Link from './Link';

export default class Supplier extends BaseModel {
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
  public email: string

  @column()
  public avatar: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public storeId: number

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false })
  public deletedAt: DateTime

  @hasMany(() => Link)
  public links: HasMany<typeof Link>

}
