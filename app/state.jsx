import inject from 'seacreature/lib/inject'
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
const set = (key, obj) => localStorage.setItem(key, JSON.stringify(obj))
const get = key => {
  try { return JSON.parse(localStorage.getItem(key)) }
  catch (e) { return null }
}

inject('ctx', ({ HubContext }) => {
  const StateContext = createContext()

  const StateProvider = ({ children }) => {
    const [state, setState] = useState({
      servers: get('boss-connect-servers') ?? []
    })

    const hub = useContext(HubContext)

    useEffect(hub.effect(hub => {
      hub.on('connect to server', server => setState(state => {
        if (state.servers.some(s => s.serverAddress == server.serverAddress))
          return state
        const servers = [...state.servers, server]
        set('boss-connect-servers', servers)
        return { ...state, servers }
      }))
      hub.on('disconnect from server', server => setState(state => {
        const servers = [...state.servers]
        const index = servers.indexOf(server)
        if (index > -1) servers.splice(index, 1)
        set('boss-connect-servers', servers)
        return { ...state, servers }
      }))
    }), [])

    return <StateContext.Provider
      value={state} children={children} />
  }

  inject('provider', StateProvider)

  return { StateContext, StateProvider }
})