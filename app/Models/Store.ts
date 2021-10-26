import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Phone from './Phone'
import Link from './Link'
import Customer from './Customer'
import List from './List'
import Deliverer from './Deliverer'
import Invoice from './Invoice'
import Item from './Item'
import Supplier from './Supplier'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public address: string

  @column()
  public phoneId: number

  @belongsTo(() => Phone)
  public phone: BelongsTo<typeof Phone>

  @column()
  public logo: string

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

  @hasMany(() => Phone)
  public phones: HasMany<typeof Phone>

  @hasMany(() => Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(() => List)
  public lists: HasMany<typeof List>

  @hasMany(() => Deliverer)
  public deliverers: HasMany<typeof Deliverer>

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>

  @hasMany(() => Item)
  public items: HasMany<typeof Item>

  @hasMany(() => Supplier)
  public suppliers: HasMany<typeof Supplier>
}
