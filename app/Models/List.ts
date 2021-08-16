import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'
import User from './User'
import Order from './Order'

export default class List extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public itemId: number

  @belongsTo(() => Item)
  public item: BelongsTo<typeof Item>

  @column()
  public order: boolean

  @column()
  public orderId: number

  @belongsTo(() => Order)
  public orders: BelongsTo<typeof Order>

  @column()
  public quantity: number

  @column()
  public purchaseprice: number

  @column()
  public minselling: number

  @column()
  public maxselling: number

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
}
