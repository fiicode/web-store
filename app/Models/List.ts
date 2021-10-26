import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'
import User from './User'
import Order from './Order'
import Option from './Option'
import Phone from './Phone'
import Invoice from './Invoice'
import Customer from './Customer'
import Deliverer from './Deliverer'
import Store from './Store'

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
  public unityId: number

  @belongsTo(() => Option)
  public unity: BelongsTo<typeof Option>

  @column()
  public purchaseprice: number

  @column()
  public minselling: number

  @column()
  public maxselling: number

  @column()
  public customerPaymentModeId: number

  @belongsTo(() => Option)
  public customerPaymentMode: BelongsTo<typeof Option>

  @column()
  public accountId: number

  @belongsTo(() => Phone)
  public account: BelongsTo<typeof Phone>

  @column()
  public delivererPaymentModeId: number

  @belongsTo(() => Option)
  public delivererPaymentMode: BelongsTo<typeof Option>

  @column()
  public cost: number

  @column()
  public paye: number

  @column()
  public invoiceId: number

  @belongsTo(() => Invoice)
  public invoiceid: BelongsTo<typeof Invoice>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public customerId: number

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @column()
  public delivererId: number

  @belongsTo(() => Deliverer)
  public deliverer: BelongsTo<typeof Deliverer>

  @column()
  public invoice: boolean

  @column()
  public storeId: number

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public schedule: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false })
  public deletedAt: DateTime
}
