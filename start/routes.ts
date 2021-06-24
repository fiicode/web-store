import Route from '@ioc:Adonis/Core/Route'
import Release from 'App/Models/Release'

Route.get('/', async () => {
  return { api: "web", route: '/', group: 'fiicode © ' + (new Date().getFullYear())}
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
    Route.resource('releases', 'ReleasesController').apiOnly()
    Route.resource('items', 'ItemsController').apiOnly()
  }).middleware('auth')

  // Route.get()

  Route.get('release/windows', async () => {
    return 'windows'
    // const windows = await Release.query().where('terminal', 'windows').orderBy('id', 'desc').first()
    // return windows?.url
  })
}).prefix('fstore')

Route.get('release/macos', async () => {
  return 'macos'
  // const macos = await Release.query().where('terminal', 'macos').orderBy('id', 'desc').first()
  // return macos?.url
})