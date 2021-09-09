import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ RouterContext, AuthContext }) => {
  inject('app', () => {
    const Route = useContext(RouterContext)
    const NotFound = inject.one('404')

    return <>
      {(Route) ? <Route /> : <NotFound />}
    </>
  })
})