import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Customer from './Customer'
import Option from './Option'
import Deliverer from './Deliverer';
import Phone from 'App/Models/Phone';
import Store from './Store'
export default class Link extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public customerId: number

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @column()
  public supplierId: number

  @belongsTo(() => Customer)
  public supplier: BelongsTo<typeof Customer>

  @column()
  public optionId: number

  @belongsTo(() => Option)
  public option: BelongsTo<typeof Option>

  @column()
  public delivererId: number

  @belongsTo(() => Deliverer)
  public deliverer: BelongsTo<typeof Deliverer>

  @column()
  public phoneId: number

  @belongsTo(() => Phone)
  public phone: BelongsTo<typeof Phone>

  @column()
  public userFromToId: number

  @belongsTo(() => User)
  public userFromTo: BelongsTo<typeof User>

  @column()
  public storeId: number

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({autoCreate: false })
  public deletedAt: DateTime | null
}
