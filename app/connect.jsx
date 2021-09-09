import inject from 'seacreature/lib/inject'
import page from 'page'
import { useContext } from 'react'
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

    // TODO: check to see if any servers are specified, if none remove close button.
    return <div className="bp4-dialog-container">
      <div className="bp4-dialog">
        <div className="bp4-dialog-header">
          <h4 className="bp4-heading">Connect to a Boss Server</h4>
          <AnchorButton icon="cross" minimal={true} onClick={e => page('/')} />
        </div>
        <div className="bp4-dialog-body">
          <FormGroup
            label="Server address"
            labelFor="server-address">
            <InputGroup
              id="server-address"
              placeholder="wss://secure-boss-server.example.com" />
          </FormGroup>
          <div className="divide">
            <FormGroup
              label="API Key"
              labelFor="api-key">
              <InputGroup
                id="api-key"
                placeholder="abc123"
                fill={true} />
            </FormGroup>
            <FormGroup
              label="One time code"
              labelFor="otp-token">
              <InputGroup
                id="otp-token"
                placeholder="123456"
                fill={true} />
            </FormGroup>
          </div>
        </div>
        <div className="bp4-dialog-footer">
          <div className="bp4-dialog-footer-actions">
            <Button intent={Intent.SUCCESS}>Connect</Button>
          </div>
        </div>
      </div>
    </div>
  }])
})
