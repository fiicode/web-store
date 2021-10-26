import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Customer from './Customer'
import Deliverer from './Deliverer'
import Option from './Option'
import Phone from './Phone'
import List from './List'
import Store from './Store'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public storeId: number

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

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
  public paiementModeToGlobalCustomerId: number

  @belongsTo(() => Option)
  public paiementModeToGlobalCustomer: BelongsTo<typeof Option>

  @column()
  public accountPaiementToGlobalCustomerId: number

  @belongsTo(() => Phone)
  public accountPaiementToGlobalCustomer: BelongsTo<typeof Phone>

  @column()
  public cost: number

  @column()
  public total: number

  @column()
  public paye: number

  @column()
  public interest: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public schedule: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({autoCreate: false })
  public deletedAt: DateTime | null

  @hasMany(() => List)
  public lists: HasMany<typeof List>
}
