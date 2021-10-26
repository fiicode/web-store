import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'
import Customer from './Customer'
import Link from './Link'
import List from './List'
import Option from './Option'
import Phone from './Phone';
import Invoice from './Invoice'
import Store from './Store'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public active: boolean

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({autoCreate: false })
  public deletedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Item)
  public items: HasMany<typeof Item>

  @hasMany(() => Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(() => Link)
  public links: HasMany<typeof Link>

  // @hasMany(() => Link)
  // public linksFromTo: HasMany<typeof Link>

  @hasMany(() => List)
  public lists: HasMany<typeof List>

  @hasMany(() => Option)
  public options: HasMany<typeof Option>

  @hasMany(() => Phone)
  public phones: HasMany<typeof Phone>

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>

  @hasMany(() => Store)
  public stores: HasMany<typeof Store>

}
