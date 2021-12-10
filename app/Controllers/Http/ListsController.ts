import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import List from 'App/Models/List';
import Phone from 'App/Models/Phone';
import Customer from 'App/Models/Customer';
import Link from 'App/Models/Link';
import Deliverer from 'App/Models/Deliverer';
import Invoice from '../../Models/Invoice';
import Option from 'App/Models/Option';
import moment from 'moment';
import { current_store, fs_creatOrEditElement } from 'App/Helpers';
export default class ListsController {

  public async createOrderList({}: HttpContextContract) {
    // const data = await request.validate({
    //   schema: schema.create({
    //     item: schema.string({}, [
    //       rules.minLength(1),
    //       rules.required()
    //     ]),
    //     quantity: schema.number.optional(),
    //     purchaseprice: schema.number.optional(),
    //     minselling: schema.number.optional(),
    //     maxselling: schema.number.optional()
    //   })
    // })

    // if (request.body().length > 0) {
    //   let order = await Order.query().where('charged', false).first()
    //   if (!order) {
    //     order = await Order.create({
    //       userId: auth.user?.id
    //     })
    //   }
    //   request.body().map(async (field) => {
    //     const itemId = await Item.find(field.item)
    //     if (itemId) {
    //       List.create({
    //         itemId: itemId?.id,
    //         quantity: field.quantity,
    //         purchaseprice: field.purchaseprice,
    //         minselling: field.minselling,
    //         maxselling: field.maxselling,
    //         orderId: order?.id,
    //         order: true,
    //         userId: auth.user?.id,
    //       })
    //       if (!order?.charged) {
    //         order.charged = true
    //         order.save()
    //       }
    //     }
    //   })
    //   return order
    // }
    // return
  }

  public async createInvoiceList({request, auth}: HttpContextContract) {
    const headinvoice = request.body().globalinvoice
    const bodyinvoice = request.body().rows
    //const storeid = request.body().store
    const store = await current_store(auth)
    const dateString = (headinvoice.date ? `${headinvoice.date} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` : `${moment().format('yyyy-MM-DD HH:mm:ss')}`)
    const userId = auth.user?.id

    let phone
    let customer
    let delivererPhone
    let deliverer
    let account

    if (
      typeof headinvoice.customer_name === 'object'
      ||
      typeof headinvoice.deliverer_name === 'object'
      ) {
      // Recupération des informations (persone & numéro) autocompletées

      /**
       * CUSTOMER GLOBAL HANDLER
       */
      if (typeof headinvoice.customer_name === 'object') {
        if (headinvoice.customer_name?.name) {
          customer = headinvoice.customer_name;
          phone = headinvoice.customer_name?.phones
        } else if (headinvoice.customer_name?.number) {
          phone = headinvoice.customer_name
          if (headinvoice.customer_name?.customers?.length > 0) {
            customer = headinvoice.customer_name.customers[0]
          }
          if (headinvoice.customer_name?.deliverers?.length > 0) {
            customer = headinvoice.customer_name.deliverers[0]
          }
          if (headinvoice.customer_name?.suppliers?.length > 0) {
            customer = headinvoice.customer_name.suppliers[0]
          }
        }

        let customerFound

        if (customer) {
          customerFound = await Customer.query()
          .where('id', customer?.id)
          .where('name', customer?.name)
          .where('address', customer?.address)
          .where('phone_id', customer?.phone_id)
          .where('store_id', String(store))
          .whereNull('deletedAt').preload('phones').first()
        }
        if (!customerFound && phone) {
          try {
            customer = await Customer.firstOrCreate({
              name: customer?.name ?? null,
              address: customer?.address ?? null,
              phoneId: customer?.phone_id === phone?.id ? phone?.id : null,
              storeId: store,
              userId: userId
            })
          } catch (e) {
            return e
          }
        }

        // Modification
        if (
          fs_creatOrEditElement(customer?.address, headinvoice.customer_adress, customer?.name) ||
          fs_creatOrEditElement(customer?.address, headinvoice.customer_adress, phone?.number)
        ) {
          customer = await Customer.query()
          .where('id', customer ? customer?.id : null)
          .where('store_id', String(store)).preload('phones').first()
          if (customer) {
            customer.address = headinvoice.customer_adress
            await customer.save()
          }
        }

        if (fs_creatOrEditElement('', headinvoice.customer_phone, phone.number)) {
          if (headinvoice?.customer_phone) {
            let newPhone = await Phone.query().where('number', headinvoice?.customer_phone).first()
            if (!newPhone) {
              newPhone = await Phone.firstOrCreate({
                number: headinvoice?.customer_phone,
                storeId: store,
                userId: userId
              })
            }
            customer = await Customer.query()
            .where('id', customer ? customer?.id : null)
            .where('store_id', String(store)).whereNull('deletedAt').preload('phones').first()
            if (customer && newPhone) {
              customer.phoneId = newPhone?.id
              await customer.save()
            }
          }
        }
      }

      /**
       * DELIVERER GLOBAL HANDLER
       */
      if (typeof headinvoice.deliverer_name === 'object') {
        if (headinvoice.deliverer_name?.name) {
          deliverer = headinvoice.deliverer_name
          delivererPhone = headinvoice.deliverer_name?.phones
        } else if (headinvoice.deliverer_name?.number) {
          delivererPhone = headinvoice.deliverer_name
          if (headinvoice.deliverer_name?.customers?.length > 0) {
            deliverer = headinvoice.deliverer_name?.customers[0]
          }
          if (headinvoice.deliverer_name?.deliverers?.length > 0) {
            deliverer = headinvoice.deliverer_name?.deliverers[0]
          }
          if (headinvoice.deliverer_name?.suppliers?.length > 0) {
            deliverer = headinvoice.deliverer_name?.suppliers[0]
          }
        }

        let delivererFound
        if (deliverer) {
          delivererFound = await Deliverer.query()
          .where('id', deliverer?.id)
          .where('name', deliverer?.name)
          .where('phone_id', deliverer?.phone_id)
          .where('store_id', String(store))
          .whereNull('deletedAt').preload('phones').first()
        }
        if (!delivererFound && delivererPhone) {
          try {
            deliverer = await Deliverer.firstOrCreate({
              name: deliverer.name ?? null,
              phoneId: deliverer.phone_id === delivererPhone?.id ? delivererPhone?.id : null,
              storeId: store,
              userId: userId
            })
          } catch (e) {
            return e
          }
        }

        // MODIFICATION
        if (fs_creatOrEditElement('', headinvoice.deliverer_phone, delivererPhone.number)) {
          if (headinvoice.deliverer_phone) {
            let newPhone = await Phone.query().where('number', headinvoice.deliverer_phone).first()
            if (!newPhone) {
              newPhone = await Phone.firstOrCreate({
                number: headinvoice.deliverer_phone,
                storeId: store,
                userId: userId
              })
            }
            deliverer = await Deliverer.query()
            .where('id', deliverer ? deliverer?.id : null)
            .where('store_id', String(store)).whereNull('deletedAt').preload('phones').first()

            if (deliverer) {
              deliverer.phoneId = newPhone?.id
              await deliverer.save()
            }
          }
        }
      }


    }
    if (
      typeof headinvoice.customer_name === 'string'
      ||
      typeof headinvoice.deliverer_name === 'string'
      ) {

      /**
       * CUSTOMER GLOBAL HANDLER
       */

      if (typeof headinvoice.customer_name === 'string') {
        if (headinvoice.customer_phone) {
          phone = await Phone.query().where('number', headinvoice.customer_phone).first()
        }

        if (headinvoice.customer_phone && !phone) {
          phone = await Phone.firstOrCreate({
            number: headinvoice.customer_phone,
            storeId: store,
            userId: userId
          })
        }
        if (phone) {
          if (headinvoice.customer_name) {
            customer = await Customer.query()
            .where('phone_id', phone.id)
            .where('store_id', String(store))
            .whereNull('deletedAt').first();

            if (customer) {
              customer.name = headinvoice.customer_name;
              customer.address = headinvoice.customer_adress;
              customer.phoneId = phone?.id
              await customer.save();
            }
          }

          if (headinvoice.customer_name && !customer && phone) {
            customer = await Customer.firstOrCreate({
              name: headinvoice.customer_name ?? null,
              address: headinvoice.customer_adress,
              phoneId: phone ? phone.id : null,
              storeId: store,
              userId: userId
            })
          }
          const links = await Link.query()
          .where('customer_id', customer ? customer?.id : null)
          .where('phone_id', phone ? phone?.id : null)
          .where('store_id', String(store))
          .whereNull('deletedAt').first()

          if (!links && phone && customer) {
            Link.firstOrCreate({
              customerId: customer?.id ?? null,
              phoneId: phone?.id  ?? null,
              storeId: store,
              userId: userId
            })
          }
        }
      }

      /**
       * DELIVERER GLOBAL HANDLER
       */

      if (typeof headinvoice.deliverer_name === 'string') {
        if (headinvoice.deliverer_phone) {
          delivererPhone = await Phone.query().where('number', headinvoice.deliverer_phone).first()
        }

        if (headinvoice.deliverer_phone && !delivererPhone) {
          delivererPhone = await Phone.firstOrCreate({
            number: headinvoice.deliverer_phone,
            storeId: store,
            userId: userId
          })
        }

        if (delivererPhone) {

          if (headinvoice.deliverer_name) {
            deliverer = await Deliverer.query()
            .where('phone_id', delivererPhone.id)
            .where('store_id', String(store))
            .whereNull('deletedAt').first()

            if (deliverer && delivererPhone) {
              deliverer.name = headinvoice?.deliverer_name
              deliverer.phoneId = delivererPhone?.id
              await deliverer.save()
            }
          }

          if (headinvoice.deliverer_name && !deliverer && delivererPhone) {
            deliverer = await Deliverer.firstOrCreate({
              name: headinvoice.deliverer_name,
              phoneId: delivererPhone.id,
              storeId: store,
              userId: userId
            })
          }

          const linksdeliver = await Link.query()
          .where('deliverer_id', deliverer ? deliverer?.id : null)
          .where('phone_id', delivererPhone ? delivererPhone?.id : null)
          .where('store_id', String(store))
          .whereNull('deletedAt').first()

          if (!linksdeliver && delivererPhone && deliverer) {
            Link.firstOrCreate({
              delivererId: deliverer?.id,
              phoneId: delivererPhone?.id,
              storeId: store,
              userId: userId
            })
          }
        }
      }
    }

    if (headinvoice.number_paiement_to_global) {
      account = await Phone.query().where('number', headinvoice.number_paiement_to_global).first()
    }

    if (headinvoice.number_paiement_to_global && !account) {
      account = await Phone.firstOrCreate({
        number: headinvoice.number_paiement_to_global,
        account: true,
        storeId: store,
        userId: userId
      })
    }

    const invoice = await Invoice.create({
      customerId: customer ? customer?.id : null,
      delivererId: deliverer ? deliverer?.id : null,
      paiementModeToGlobalCustomerId: headinvoice.customer_payment_mode_global ? headinvoice.customer_payment_mode_global : null,
      accountPaiementToGlobalCustomerId: account?.id ?? null,
      cost: headinvoice?.cost ? headinvoice.cost : 0,
      userId: userId,
      storeId: store,
      schedule: dateString
    })

    let totalInv = 0

    const pcs = await Option.query().select('id').where('unity', true).where('name', 'PCS').first()

    bodyinvoice.map(async (r) => {
      if (r.item.value && r.item.label) {
        let numberPaimentTo
        let customerPhone
        let customerName
        let delivererPhoneRow
        let delivererNameRow

        if (
          typeof r.customer_row_name === 'object'
          ||
          typeof r.deliverer_row_name === 'object'
        ) {
          /**
           * CUSTOMER ROW HANDLER OBJECT
           */
          if (typeof r.customer_row_name === 'object') {
            if (r.customer_row_name?.name) {
              customerName = r.customer_row_name
              customerPhone = r.custocustomer_row_name?.phones
            } else if (r.customer_row_name?.number) {
              customerPhone = r.customer_row_name
              if (r.customer_row_name?.customers?.length > 0) {
                customerName = r.customer_row_name.customers[0]
              }
              if (r.customer_row_name?.deliverers?.length > 0) {
                customerName = r.customer_row_name?.deliverers[0]
              }
              if (r.customer_row_name?.suppliers?.length > 0) {
                customerName = r.customer_row_name?.suppliers[0]
              }
            }

            let customerFound
            if (customerName) {
              customerFound = await Customer.query()
              .where('id', customerName.id)
              .where('name', customerName.name)
              .where('address', customerName.address)
              .where('phone_id', customerName.phone_id)
              .where('store_id', String(store))
              .whereNull('deletedAt').preload('phones').first()
            }
            if (!customerFound && customerPhone) {
              try {
                customerName = await Customer.firstOrCreate({
                  name: customerName ? customerName?.name : null,
                  address: customerName ? customerName?.address : null,
                  phoneId: customerName?.phone_id === customerPhone?.id ? customerPhone?.id : null,
                  storeId: store,
                  userId: userId
                })
              } catch (e) {
                return e
              }
            }

            // Modification
            if (
              fs_creatOrEditElement(customerName?.address, r.customer_row_adress, customerName?.name)
              ||
              fs_creatOrEditElement(customerName?.address, r.customer_row_adress, customerPhone?.number)
            ) {
              customerName = await Customer.query()
              .where('id', customerName ? customerName?.id : null)
              .where('store_id', String(store)).preload('phones').first()
              if (customerName) {
                customerName.address = r.customer_row_adress
                await customerName.save()
              }
            }

            if (fs_creatOrEditElement('', r.customer_row_phone, customerPhone?.number)) {
              if (r.customer_row_phone) {
                let newPhone = await Phone.query().where('number', r.customer_row_phone).first()
                if (!newPhone) {
                  newPhone = await Phone.firstOrCreate({
                    number: r.customer_row_phone,
                    storeId: store,
                    userId: userId
                  })
                }
                customerName = await Customer.query()
                .where('id', customerName ? customerName?.id : null)
                .where('store_id', String(store))
                .whereNull('deletedAt').preload('phones').first()
                if (customerName) {
                  customerName.phoneId = newPhone?.id
                  await customerName.save()
                }
              }
            }
          }

          /**
           * DELIVERER GLOBAL HANDLER OBJECT
           */

          if (typeof r.deliverer_row_name === 'object') {
            if (r.deliverer_row_name?.name) {
              delivererNameRow = r.deliverer_row_name
              delivererPhoneRow = r.deliverer_row_name?.phones
            } else if (r.deliverer_row_name?.number) {
              delivererPhoneRow = r.deliverer_row_name
              if (r.deliverer_row_name?.customers.length > 0) {
                delivererNameRow = r.deliverer_row_name?.customers[0]
              }
              if (r.deliverer_row_name?.deliverers.length > 0) {
                delivererNameRow = r.deliverer_row_name?.deliverers[0]
              }
              if (r.deliverer_row_name?.suppliers.length > 0) {
                delivererNameRow = r.deliverer_row_name?.suppliers[0]
              }
            }
            let delivererFound
            if (delivererNameRow) {
              delivererFound = await Deliverer.query()
              .where('id', delivererNameRow?.id)
              .where('name', delivererNameRow?.name)
              .where('phone_id', delivererNameRow?.phone_id)
              .where('store_id', String(store))
              .whereNull('deletedAt').preload('phones').first()
            }

            if (!delivererFound && delivererPhoneRow) {
              try {
                delivererNameRow = await Deliverer.firstOrCreate({
                  name: delivererNameRow ? delivererNameRow?.name : null,
                  phoneId: delivererNameRow.phone_id === delivererPhoneRow?.id ? delivererPhoneRow?.id : null,
                  storeId: store,
                  userId: userId
                })
              } catch (e) {
                return e
              }
            }

            // MODIFICATION
            if (fs_creatOrEditElement('', r.deliverer_row_phone, delivererPhoneRow.number)) {
              if (r.deliverer_row_phone) {
                let newPhone = await Phone.query().where('number', r.deliverer_row_phone).first()
                if (!newPhone) {
                  newPhone = await Phone.firstOrCreate({
                    number: r.deliverer_row_phone,
                    storeId: store,
                    userId: userId
                  })
                }
                delivererNameRow = await Deliverer.query()
                .where('id', delivererNameRow ? delivererNameRow?.id : null)
                .where('store_id', String(store))
                .whereNull('deletedAt')
                .preload('phones').first()
                if (delivererNameRow && newPhone) {
                  delivererNameRow.phoneId = newPhone?.id
                  await delivererNameRow.save()
                }
              }
            }
          }

        }
        if (
          typeof r.customer_row_name === 'string'
          ||
          typeof r.deliverer_row_name === 'string'
          ) {
          /**
           * CUSTOMER ROW HANDLER
           */
          if (typeof r.customer_row_name === 'string') {
            if (r.customer_row_phone) {
              customerPhone = await Phone.query().where('number', r.customer_row_phone).first()
            }

            if (r.customer_row_phone && !customerPhone) {
              customerPhone = await Phone.firstOrCreate({
                number: r.customer_row_phone,
                storeId: store,
                userId: userId
              })
            }

            if (customerPhone) {
              if (r.customer_row_name) {
                customerName = await Customer.query()
                .where('phone_id', customerPhone?.id)
                .where('store_id', String(store))
                .whereNull('deletedAt').first()

                if (customerName) {
                  customerName.name = r.customer_row_name
                  customerName.address = r.customer_row_adress
                  customerName.phoneId = customerPhone?.id
                  await customerName.save()
                }
              }

              if (r?.customer_row_name && !customerName && customerPhone && r?.customer_row_name !== '') {
                customerName = await Customer.firstOrCreate({
                  name: r?.customer_row_name,
                  address: r?.customer_row_adress,
                  phoneId: customerPhone ? customerPhone?.id : null,
                  storeId: store,
                  userId: userId
                })
              }

              const linksRow = await Link.query()
              .where('customer_id', customerName ? customerName?.id : null)
              .where('phone_id', customerPhone ? customerPhone?.id : null)
              .where('store_id', String(store))
              .whereNull('deletedAt').first();

              if (!linksRow && customerPhone && customerName) {
                Link.firstOrCreate({
                  customerId: customerName?.id,
                  phoneId: customerPhone?.id,
                  storeId: store,
                  userId: userId
                })
              }
            }
          }

          /**
           * DELIVERER ROW HANDLER
           */

          if (typeof r.deliverer_row_name === 'string') {
            if (r.deliverer_row_phone) {
              delivererPhoneRow = await Phone.query().where('number', r.deliverer_row_phone).first()
            }

            if (r.deliverer_row_phone && !delivererPhoneRow) {
              delivererPhoneRow = await Phone.firstOrCreate({
                number: r.deliverer_row_phone,
                storeId: store,
                userId: userId
              })
            }
            if (delivererPhoneRow) {
              if (r.deliverer_row_name) {
                delivererNameRow = await Deliverer.query()
                .where('phone_id', delivererPhoneRow?.id)
                .where('store_id', String(store))
                .whereNull('deletedAt').first()

                if (delivererNameRow) {
                  delivererNameRow.name = r.deliverer_row_name
                  delivererNameRow.phoneId = delivererPhoneRow?.id
                  await delivererNameRow.save()
                }

                if (r.deliverer_row_name && !delivererNameRow) {
                  delivererNameRow = await Deliverer.firstOrCreate({
                    name: r.deliverer_row_name,
                    phoneId: delivererPhoneRow ? delivererPhoneRow.id : null,
                    storeId: store,
                    userId: userId
                  })
                }
                const linksdeliver = await Link.query()
                .where('deliverer_id', delivererNameRow ? delivererNameRow.id : null)
                .where('phone_id', delivererPhoneRow ? delivererPhoneRow.id : null)
                .where('store_id', String(store))
                .whereNull('deletedAt').first()

                if (!linksdeliver && delivererPhoneRow && delivererNameRow) {
                  Link.firstOrCreate({
                    delivererId: delivererNameRow?.id,
                    phoneId: delivererPhoneRow?.id,
                    storeId: store,
                    userId: userId
                  })
                }
              }
            }
          }
        }

        if (r.number_row_paiement_to) {
          numberPaimentTo = await Phone.query().where('number', r.number_row_paiement_to).first()
        }

        if (r.number_row_paiement_to && !numberPaimentTo) {
          numberPaimentTo = await Phone.firstOrCreate({
            number: r.number_row_paiement_to,
            account: true,
            storeId: store,
            userId: userId
          })
        }

        if (invoice) {
          totalInv += (r.quantity * r.sellingprice)

          List.create({
            itemId: r.item.value,
            quantity: r.quantity ? r.quantity : 0,
            unityId: (r.unity === 'PCS' || !r.unity) ? pcs?.id : r.unity,
            minselling: r.sellingprice ? r.sellingprice : 0,
            customerPaymentModeId: r.customer_row_payment_mode ? r.customer_row_payment_mode : null,
            accountId: numberPaimentTo?.id ? numberPaimentTo?.id : null,
            delivererPaymentModeId: r.deliverer_row_payment_mode ? r.deliverer_row_payment_mode : null,
            cost: r.deliverer_row_cost ? r.deliverer_row_cost : 0,
            paye: r.customer_pay ? r.customer_pay : 0,
            invoiceId: invoice?.id,
            userId: userId,
            customerId: customerName ? customerName.id : null,
            delivererId: delivererNameRow ? delivererNameRow.id : null,
            invoice: true,
            storeId: store,
            schedule: dateString
          })
        }
      }
      invoice.total = totalInv;
      await invoice.save();
    })

    return invoice
  }
}
