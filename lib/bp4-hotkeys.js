import inject from 'seacreature/lib/inject'
import { HotkeysProvider } from '@blueprintjs/core'

inject('ctx', () => {
  inject('provider', HotkeysProvider)

  return { HotkeysProvider }
})