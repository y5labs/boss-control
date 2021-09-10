import inject from 'seacreature/lib/inject'
import ReconnectingWebSocket from 'reconnecting-websocket'

inject('ctx', ({ hub }) => {
  inject('websocket', server => {
    try {
      const socket = new ReconnectingWebSocket(server.serverAddress)
      socket.addEventListener('close', e => {
        hub.emit('socket disconnected', { socket: api, e })
      })
      let message = null
      socket.addEventListener('error', e => {
        message = 'error'
        console.log(message)
        hub.emit('socket error', { socket: api, e })
      })
      socket.addEventListener('open', e => {
        message = null
        hub.emit('socket connected', { socket: api, e })
      })
      socket.addEventListener('message', e => {
        const { e: event, p: payload } = JSON.parse(e.data)
        hub.emit(event, { ...payload, server })
      })

      const api = {
        close: (...args) => socket.close(...args),
        state: () => ({
          state: socket.readyState == ReconnectingWebSocket.CONNECTING
            ? 'connecting'
            : socket.readyState == ReconnectingWebSocket.OPEN
            ? 'open'
            : socket.readyState == ReconnectingWebSocket.CLOSING
            ? 'closing'
            : socket.readyState == ReconnectingWebSocket.CLOSED
            ? 'closed'
            : 'unknown',
          message
        }),
        send: (e, p) => {
          if (socket.readyState !== ReconnectingWebSocket.OPEN)
            throw 'socket not open'
          socket.send(JSON.stringify({ e, p }))
        }
      }
      return api
    }
    catch (e) {
      console.error('Socket create error', e)
      return {
        close: () => {},
        state: () => ({
          state: 'closed',
          message: e.toString()
        }),
        send: () => {}
      }
    }
  })
})