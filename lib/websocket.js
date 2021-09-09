import inject from 'seacreature/lib/inject'
import ReconnectingWebSocket from 'reconnecting-websocket'

// TODO: websocket per server
inject('ctx', ({ hub }) => {
  setTimeout(() => {
    const socket = new ReconnectingWebSocket(WCS_MEE_WEBSOCKET_URL)
    socket.addEventListener('close', e => {
      hub.emit('socket disconnected', e)
    })
    socket.addEventListener('error', e => {
      hub.emit('socket error', e)
    })
    socket.addEventListener('open', e => {
      hub.emit('socket connected', e)
    })
    socket.addEventListener('message', e => {
      const { e: event, p: payload } = JSON.parse(e.data)
      hub.emit(event, payload)
    })
    hub.on('socket send', (e, p) => {
      if (socket.readyState !== ReconnectingWebSocket.OPEN)
        throw 'socket not open'
      socket.send(JSON.stringify({ e, p }))
    })
  }, 200)
})