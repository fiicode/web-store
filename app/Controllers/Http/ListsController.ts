import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Item from 'App/Models/Item';
import List from 'App/Models/List';
import Order from 'App/Models/Order';
import Phone from 'App/Models/Phone';
import Customer from 'App/Models/Customer';
import Link from 'App/Models/Link';
import Deliverer from 'App/Models/Deliverer';
import Invoice from '../../Models/Invoice';
import Option from 'App/Models/Option';
import moment from 'moment';
export default class ListsController {

  public async createOrderList({ request, auth }: HttpContextContract) {
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

    if (request.body().length > 0) {
      let order = await Order.query().where('charged', false).first()
      if (!order) {
        order = await Order.create({
          userId: auth.user!.id
        })
      }
      request.body().map(async (field) => {
        const itemId = await Item.find(field.item)
        if (itemId) {
          List.create({
            itemId: itemId!.id,
            quantity: field.quantity,
            purchaseprice: field.purchaseprice,
            minselling: field.minselling,
            maxselling: field.maxselling,
            orderId: order!.id,
            order: true,
            userId: auth.user!.id,
          })
          if (!order!.charged) {
            order!.charged = true
            order!.save()
          }
        }
      })
      return order
    }
    return
  }

  public async createInvoiceList({request, auth}: HttpContextContract) {
    const headinvoice = request.body().globalinvoice
    const bodyinvoice = request.body().rows
    const storeid = request.body().store
    const dateString = (headinvoice.date ? `${headinvoice.date} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` : `${moment().format('yyyy-MM-DD HH:mm:ss')}`)
    const userId = auth.user!.id

    let phone
    let customer
    let delivererPhone
    let deliverer
    let account

    if (headinvoice.customer_phone) {
      phone = await Phone.query().where('number', headinvoice.customer_phone).first()
    }

    if (headinvoice.customer_phone && !phone) {
      phone = await Phone.firstOrCreate({
        number: headinvoice.customer_phone,
        storeId: storeid,
        userId: userId
      })
    }
    if (phone) {
      customer = await Customer.firstOrCreate({
        name: headinvoice.customer_name ?? null,
        address: headinvoice.customer_adress,
        phoneId: phone ? phone.id : null,
        storeId: storeid,
        userId: userId
      })

      Link.firstOrCreate({
        customerId: customer!.id ?? null,
        phoneId: phone!.id  ?? null,
        storeId: storeid,
        userId: userId
      })
    }

    if (headinvoice.deliverer_phone) {
      delivererPhone = await Phone.query().where('number', headinvoice.deliverer_phone).first()
    }

    if (headinvoice.deliverer_phone && !delivererPhone) {
      delivererPhone = await Phone.firstOrCreate({
        number: headinvoice.deliverer_phone,
        storeId: storeid,
        userId: userId
      })
    }

    if (delivererPhone) {
      deliverer = await Deliverer.firstOrCreate({
        name: headinvoice.deliverer_name,
        phoneId: delivererPhone ? delivererPhone.id : null,
        storeId: storeid,
        userId: userId
      })

      Link.firstOrCreate({
        delivererId: deliverer.id,
        phoneId: delivererPhone.id,
        storeId: storeid,
        userId: userId
      })
    }

    if (headinvoice.number_paiement_to_global) {
      account = await Phone.query().where('number', headinvoice.number_paiement_to_global).first()
    }

    if (headinvoice.number_paiement_to_global && !account) {
      account = await Phone.firstOrCreate({
        number: headinvoice.number_paiement_to_global,
        account: true,
        storeId: storeid,
        userId: userId
      })
    }

    const invoice = await Invoice.create({
      customerId: customer ? customer!.id : null,
      delivererId: deliverer ? deliverer!.id : null,
      paiementModeToGlobalCustomerId: headinvoice.customer_payment_mode_global ? headinvoice.customer_payment_mode_global : null,
      accountPaiementToGlobalCustomerId: account ? account!.id : null,
      cost: headinvoice.cost ? headinvoice.cost : 0,
      userId: userId,
      storeId: storeid,
      schedule: dateString
    })

    let total = 0

    const pcs = await Option.query().select('id').where('unity', true).where('name', 'PCS').first()

    bodyinvoice.map(async (r) => {
      if (r.item.value && r.item.label) {
        let numberPaimentTo
        let customerPhone
        let customerName
        let delivererPhoneRow
        let delivererNameRow

        if (r.customer_row_phone) {
          customerPhone = await Phone.query().where('number', r.customer_row_phone).first()
        }

        if (r.customer_row_phone && !customerPhone) {
          customerPhone = await Phone.firstOrCreate({
            number: r.customer_row_phone,
            storeId: storeid,
            userId: userId
          })
        }

        if (customerPhone) {
          customerName = await Customer.firstOrCreate({
            name: r.customer_row_name,
            address: r.customer_row_adress,
            phoneId: customerPhone ? customerPhone.id : null,
            storeId: storeid,
            userId: userId
          })

          Link.firstOrCreate({
            customerId: customerName!.id,
            phoneId: customerPhone!.id,
            storeId: storeid,
            userId: userId
          })
        }

        if (r.number_row_paiement_to) {
          numberPaimentTo = await Phone.query().where('number', r.number_row_paiement_to).first()
        }

        if (r.number_row_paiement_to && !numberPaimentTo) {
          numberPaimentTo = await Phone.firstOrCreate({
            number: r.number_row_paiement_to,
            account: true,
            storeId: storeid,
            userId: userId
          })
        }

        if (r.deliverer_row_phone) {
          delivererPhoneRow = await Phone.query().where('number', r.deliverer_row_phone).first()
        }

        if (r.deliverer_row_phone && !delivererPhoneRow) {
          delivererPhoneRow = await Phone.firstOrCreate({
            number: r.deliverer_row_phone,
            storeId: storeid,
            userId: userId
          })
        }
        if (delivererPhoneRow) {
          delivererNameRow = await Deliverer.firstOrCreate({
            name: r.deliverer_row_name,
            phoneId: delivererPhoneRow ? delivererPhoneRow.id : null,
            storeId: storeid,
            userId: userId
          })

          Link.firstOrCreate({
            delivererId: delivererNameRow.id,
            phoneId: delivererPhoneRow.id,
            storeId: storeid,
            userId: userId
          })
        }


        if (invoice) {
          total += r.quantity * r.sellingprice
          List.create({
            itemId: r.item.value,
            quantity: r.quantity,
            unityId: (r.unity === 'PCS' || !r.unity) ? pcs!.id : r.unity,
            minselling: r.sellingprice,
            customerPaymentModeId: r.customer_row_payment_mode ? r.customer_row_payment_mode : null,
            accountId: numberPaimentTo ? numberPaimentTo.id : null,
            delivererPaymentModeId: r.deliverer_row_payment_mode ? r.deliverer_row_payment_mode : null,
            cost: r.deliverer_row_cost ? r.deliverer_row_cost : 0,
            paye: r.customer_pay ? r.customer_pay : 0,
            invoiceId: invoice!.id,
            userId: userId,
            customerId: customerName ? customerName.id : null,
            delivererId: delivererNameRow ? delivererNameRow.id : null,
            invoice: true,
            storeId: storeid,
            schedule: dateString
          })
        }
      }
    })

    invoice.total = total;
    await invoice.save();

    return invoice
  }
}
