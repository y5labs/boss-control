import route from 'odo-route'
import page from 'page'
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import inject from 'seacreature/lib/inject'

inject('ctx', ({ HubContext }) => {
  const RouterContext = createContext()

  const RouterProvider = props => {
    const [state, setState] = useState()

    const { children } = props

    const hub = useContext(HubContext)

    const hostname = window.location.hostname
    const hostnameparts = hostname.split('.')
    const subdomain =
      hostnameparts.length == 3
      ? hostnameparts[0]
      : null

    useEffect(() => {
      page('*', (e, next) => {
        next()
        window.scrollTo(0, 0)
        hub.emit('navigated')
      })

      inject.many('route').forEach(r => route(...r))

      route.routes().forEach(route => {
        page(route.pattern, (e, next) => {
          const context = {
            hostname,
            subdomain,
            url: e.pathname,
            params: e.params,
            querystring: e.querystring
          }
          let callednext = false
          const result = route.cb(context, () => {
            callednext = true
            next()
          })
          if (callednext) return
          setState(() => result)
          hub.emit('navigate', context, result)
        })
      })

      page.start()
    }, [])

    return <RouterContext.Provider
      value={state} children={children} />
  }

  inject('provider', RouterProvider)

  return { RouterContext, RouterProvider }
})