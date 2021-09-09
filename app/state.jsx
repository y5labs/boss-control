import inject from 'seacreature/lib/inject'
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

inject('ctx', ({ HubContext }) => {
  const StateContext = createContext()

  const StateProvider = ({ children }) => {
    const [state, setState] = useState({
    })

    const hub = useContext(HubContext)

    useEffect(hub.effect(hub => {
      hub.on('change state', changes => setState(state => ({
        ...state,
        ...changes
      })))
    }), [])

    return <StateContext.Provider
      value={state} children={children} />
  }

  inject('provider', StateProvider)

  return { StateContext, StateProvider }
})