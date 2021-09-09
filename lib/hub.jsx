import inject from 'seacreature/lib/inject'
import Hub from 'seacreature/lib/hub'
import { createContext } from 'react'

inject('ctx', () => {
  const hub = Hub()
  const HubContext = createContext()

  const HubProvider = props =>
    <HubContext.Provider
      value={props.hub ? props.hub : hub}
      children={props.children} />

  inject('provider', HubProvider)

  return { hub, HubContext, HubProvider }
})
