import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Customer from './Customer'
import Option from './Option'

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
  public optionId: number

  @belongsTo(() => Option)
  public option: BelongsTo<typeof Option>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({autoCreate: false })
  public deletedAt: DateTime | null
}
