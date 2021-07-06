import Route from '@ioc:Adonis/Core/Route'
import Customer from 'App/Models/Customer'
import Release from 'App/Models/Release'
import { CustomerFactory } from 'Database/factories'

Route.get('/', async () => {
  return { api: "web", route: '/', group: 'fiicode © ' + (new Date().getFullYear())}
})

Route.get('/faker', async () => {
  await CustomerFactory.createMany(270);
})

/**
 * ROUTE FOR AUTHENTICATION
 */
Route.group(() => {
  Route.post('/login', 'Auth/AuthController.login')
  Route.post('/register', 'Auth/AuthController.register')
  Route.group(() => {
    Route.get('/me', async ({auth}) => {
      return auth
    })
    Route.post('/logout', async ({auth}) => {
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
    Route.post('/link/create/:optionid/:to/:service', 'LinksController.store')
    Route.delete('/link/delete/:link/:service', 'LinksController.destroy')
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
    return await Customer.query().where('phone', 'like', `%${params.phone}%`).preload('links', (link) => {
      return link.where('deletedAt', null).preload('option');
    });
  })
}).prefix('fstore')
