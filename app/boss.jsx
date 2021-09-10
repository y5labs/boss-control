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

inject('ctx', ({ HubContext, StateContext }) => {
  const BossContext = createContext()
  const servers = new Map()

  const BossProvider = ({ children }) => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)

    const [bossState, setBossState] = useState(servers)

    useEffect(hub.effect(hub => {
      // TODO: diff against currently running servers, work out which ones to disable
      const seen = new Set()
      for (const server of state.servers) {
        seen.add(server.serverAddress)
        if (!servers.has(server.serverAddress)) {
          console.log(`Start ${server.serverAddress}`)
          servers.set(server.serverAddress, {
            state: {},
            server,
            socket: inject.one('websocket')(server)
          })
        }
      }
      for (const [serverAddress, server] of servers.entries()) {
        if (seen.has(serverAddress)) continue
        servers.get(serverAddress).socket.close()
        console.log(`Stop ${serverAddress}`)
        servers.delete(serverAddress)
      }
      hub.on('queue state update', ({ server, ...state }) => {
        if (!servers.has(server.serverAddress)) return
        servers.get(server.serverAddress).state = state
      })
      hub.on('socket connected', ({ socket }) => {
        const server = Array.from(servers.values()).find(s => s.socket == socket)
        if (server) server.socket.send('login', server.server)
      })
      hub.on('load jobs', ({ server, queue, statuses, page }) => {
        const bossServer = Array.from(servers.values()).find(s => s.server == server)
        if (!bossServer) return
        bossServer.socket.send('load jobs', { queue, statuses, page })
      })

      const handle = setInterval(() => {
        setBossState(new Map(Array.from(servers.entries())))
      }, 500)

      return () => {
        clearInterval(handle)
      }
    }), [state.servers])

    return <BossContext.Provider
      value={bossState} children={children} />
  }

  inject('provider', BossProvider)

  return { BossContext, BossProvider }
})