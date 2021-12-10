import Route from '@ioc:Adonis/Core/Route'
import Customer from 'App/Models/Customer'
import Release from 'App/Models/Release'
// import { CustomerFactory, ItemFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database';
import Option from 'App/Models/Option';
import Store from 'App/Models/Store';
import Phone from 'App/Models/Phone';
import { current_store, get_store_user_in, isNumeric } from 'App/Helpers';
import Deliverer from 'App/Models/Deliverer';
import Supplier from 'App/Models/Supplier';

Route.get('/', async () => {
  return { api: "web", route: '/', group: 'fiicode © ' + (new Date().getFullYear()) }
})

/**
 * FAKER & INSERTION, DROP FIX DB
 */
Route.get('/faker', async () => {
  // await ItemFactory.createMany(100);
  // await CustomerFactory.createMany(270);
  // const customerTablePhone = await Database.from('customers').select('id', 'phone', 'user_id', 'phone_id').limit(4);
  // const customerTablePhone = await Customer.query().select('id', 'phone', 'user_id', 'phone_id');
  // customerTablePhone.map(async (p) => {
  //   const phone = await Phone.firstOrCreate({
  //     number: p.phone,
  //     userId: p.userId
  //   })
  //   p.phoneId = phone.id
  //   await p.save();
  // })

  // return 'terminé'
  // return fs_creatOrEditElement('', '6666666666', '6666666676')
})


/**
 * ROUTE FOR AUTHENTICATION
 */
Route.group(() => {
  Route.post('/login', 'Auth/AuthController.login')
  Route.post('/register', 'Auth/AuthController.register')
  Route.group(() => {
    Route.get('/me', async ({ auth }) => {
      return auth
    })
    Route.post('/logout', async ({ auth }) => {
      await auth.use('web').logout()
      return auth
    })
  }).middleware('auth')
}).prefix('/access')

/**
 * ROUTE FOR fstore APP
 */

Route.group(() => {
  Route.group(() => {
    Route.resource('items', 'ItemsController').apiOnly()
    Route.resource('releases', 'ReleasesController').apiOnly()
    Route.resource('customers', 'CustomersController').apiOnly()
    Route.resource('orders', 'OrdersController').apiOnly()
    Route.resource('suppliers', 'SuppliersController').apiOnly()
    Route.resource('invoices', 'InvoicesController').apiOnly()
    Route.resource('stores', 'StoresController').apiOnly()
    Route.resource('currentStores', 'CurrentStoresController').apiOnly()
    /**
     * Orders ø Invoices => lists intersect
     */
    Route.group(() => {
      Route.post('/create/order/list', 'ListsController.createOrderList')
      Route.post('/create/invoice/list', 'ListsController.createInvoiceList')
    })

    Route.post('/link/create/:optionid/:to/:service', 'LinksController.store')
    Route.delete('/link/delete/:link/:service', 'LinksController.destroy')
    Route.get('/total/customers', async () => {
      return (await Customer.query().select('id')).length;
    })
    // Route.get('/store/link', async ({auth}) => {
    //   return await Link.query().whereNull('deletedAt').where('user_from_to_id', auth.user!.id).preload('user').preload('store')
    // })
    Route.get('/list/paimentmode', async () => {
      return await Option.query().where('payment_mode', true)
    })
    Route.post('/list/paimentmode', async({request}) => {
      const body = request.body();

      return await Option.query().where('id', body.id).first()
    })
    Route.get('/list/unity', async () => {
      return await Option.query().where('unity', true)
    })
    Route.get('store/:id', async ({params, auth}) => {

      let store = await Store.query().where('id',params.id).where('user_id', auth!.user!.id).whereNull('deletedAt').first()
      return store ? store : get_store_user_in(auth, params.id)
    })
    Route.get('/search/items/:name', async ({params, auth}) => {
      const store = await current_store(auth)
      return await Database.from('items')
        .select('id as value', 'name as label', 'title', 'description', 'price')
        .where('store_id', String(store))
        .where('name', 'like', `%${params.name}%`)
        .orWhere('title', 'like', `%${params.name}%`)
        .orWhere('description', 'like', `%${params.name}%`)
    })
    Route.post('/autocomplete/name/phone', async({request, auth}) => {
      const store = await current_store(auth)
      const body = request.body();
      let customer
      let deliverer
      let supplier
      if (body?.terme) {
        if (isNumeric(body.terme)) {
          return await Phone.query().where('store_id', String(store)).whereNull('deletedAt').where('number', 'like', `%${body.terme}%`).preload('customers', (customer) => {
            return customer.whereNull('deletedAt');
          }).preload('deliverers', (deliverer) => {
            return deliverer.whereNull('deletedAt');
          }).preload('suppliers', (supplier) => {
            return supplier.whereNull('deletedAt');
          })
        } else {
          customer = await Customer.query().whereNull('deletedAt').where('store_id', String(store)).where('name', 'like', `%${body.terme}%`).orWhere('address', 'like', `%${body.terme}%`).preload('phones')
          deliverer = await Deliverer.query().whereNull('deletedAt').where('store_id', String(store)).where('name', 'like', `%${body.terme}%`).preload('phones')
          supplier = await Supplier.query().whereNull('deletedAt').where('store_id', String(store)).where('name', 'like', `%${body.terme}%`).orWhere('address', 'like', `%${body.terme}%`).preload('phones')
        }
      }
      return [...customer, ...deliverer, ...supplier]
    })
  }).middleware('auth')

  Route.get('release/macos', async () => {
    const macos = await Release.query().where('terminal', 'macos').orderBy('id', 'desc').first()
    return macos?.url
  })
  Route.get('release/windows', async () => {
    const windows = await Release.query().where('terminal', 'windows').orderBy('id', 'desc').first()
    return windows?.url
  })
  Route.get('/search/custom/phone/:phone', async ({ params }) => {
    return await Phone.query().where('number', 'like', `%${params.phone}%`).preload('customers').preload('links')
  })
}).prefix('fstore')
