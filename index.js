// This order is deathly important
// There is a ctx pass and a pod pass
// ctx can only use things defined above
// This order is also how context providers are added
// So for context (state) you'll want to be imported after any state you rely on. E.g. state relies on hub so hub has to be imported first
import './lib/hub'

import './lib/bp4-hotkeys'

import './components/loading'

import './app/index.styl'
import './app/state'
import './app/404'
import './app/base'

import './app/default'

import './lib/router'
import './lib/react'
// import './lib/websocket'
import './lib/plumbing'
