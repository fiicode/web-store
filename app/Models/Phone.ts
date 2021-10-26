import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Store from './Store';
import Customer from './Customer';
import Deliverer from './Deliverer';
import Link from './Link';
import Supplier from './Supplier';

export default class Phone extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public number: string

  @column()
  public account: boolean

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

  // @hasMany(() => User)
  // public users: HasMany<typeof User>

  // @hasMany(() => Store)
  // public store: HasMany<typeof Store>
  @hasMany(() => Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(() => Link)
  public links: HasMany<typeof Link>

  @hasMany(() => Deliverer)
  public deliverers: HasMany<typeof Deliverer>

  @hasMany(() => Supplier)
  public suppliers: HasMany<typeof Supplier>
}
