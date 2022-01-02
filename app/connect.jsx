import inject from 'seacreature/lib/inject'
import page from 'page'
import { useContext, useEffect, useState } from 'react'
import {
  Icon,
  FormGroup,
  InputGroup,
  AnchorButton,
  Button,
  Intent
} from '@blueprintjs/core'

inject('pod', ({ HubContext, StateContext }) => {
  inject('route', ['/connect', p => () => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)

    const query = new URLSearchParams(p.querystring)
    console.log(p.querystring, query.get('server_address'), query.get('api_key'), query.get('api_secret'))
    const [server, setServer] = useState({
      serverAddress: query.get('server_address') || '',
      apiKey: query.get('api_key') || '',
      apiSecret: query.get('api_secret') || ''
    })

    const showClose = state.servers.length > 0
    const submit = async e => {
      await hub.emit('connect to server', server)
      page('/')
    }

    return <div className="bp4-dialog-container">
      <div className="bp4-dialog">
        <div className="bp4-dialog-header">
          <h4 className="bp4-heading">Connect to a Boss Server</h4>
          {showClose && <AnchorButton icon="cross" minimal={true} onClick={e => page('/')} />}
        </div>
        <div className="bp4-dialog-body">
          <FormGroup label="Server address" labelFor="server-address">
            <InputGroup
              id="server-address"
              type="url"
              onChange={e => setServer(s => ({ ...s, serverAddress: e.target.value }))}
              placeholder="wss://secure-boss-server.example.com"
              defaultValue={server.serverAddress} />
          </FormGroup>
          <div className="divide">
            <FormGroup label="API Key" labelFor="api-key">
              <InputGroup
                id="api-key"
                onChange={e => setServer(s => ({ ...s, apiKey: e.target.value }))}
                placeholder="abc123"
                fill={true}
                defaultValue={server.apiKey} />
            </FormGroup>
            <FormGroup label="API Secret" labelFor="api-secret">
              <InputGroup
                id="api-secret"
                onChange={e => setServer(s => ({ ...s, apiSecret: e.target.value }))}
                placeholder="123456"
                fill={true}
                defaultValue={server.apiSecret} />
            </FormGroup>
          </div>
        </div>
        <div className="bp4-dialog-footer">
          <div className="bp4-dialog-footer-actions">
            <Button intent={Intent.SUCCESS} onClick={submit}>Connect</Button>
          </div>
        </div>
      </div>
    </div>
  }])
})
