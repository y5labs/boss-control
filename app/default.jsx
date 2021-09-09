import inject from 'seacreature/lib/inject'
import sleep from 'seacreature/lib/sleep'
import page from 'page'
import { useContext } from 'react'
import {
  Tag,
  Intent,
  HTMLTable,
  AnchorButton,
  Divider,
  Menu,
  MenuItem,
  MenuDivider,
  Button,
  Popover,
  Icon,
  Position
} from '@blueprintjs/core'

inject('pod', ({ HubContext, StateContext }) => {
  inject('route', ['/', p => () => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)

    // // TODO: if no servers specified, pop up dialog
    // ;(async () => {
    //   await sleep(200)
    //   page('/connect')
    // })()
    // return <div></div>

    const common = {
      round: true,
      large: true,
      interactive: true
    }

    return <div className="page">
      <HTMLTable className="queues">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th colSpan="3">Processing</th>
            <th colSpan="4">Issues</th>
            <th></th>
          </tr>
          <tr>
            <th></th>
            <th>Queue</th>
            <th className="d">Created</th>
            <th className="d">Active</th>
            <th className="d">Completed</th>
            <th className="d">Retry</th>
            <th className="d">Cancelled</th>
            <th className="d">Expired</th>
            <th className="d">Failed</th>
            <th className="d">Archived</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Popover
                content={
                  <Menu>
                    <MenuItem icon="cross" intent={Intent.DANGER} text="Disconnect" />
                  </Menu>}
                position={Position.RIGHT_TOP}>
                <Button icon="edit" minimal={true} />
              </Popover>
            </td>
            <td>
              <Tag
                {...common}
                minimal={true}
                className="invisible">secure-boss-server.example.com</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                minimal={true}
                className="invisible">2</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="pulse"
                intent={Intent.SUCCESS}>2,345</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                minimal={true}
                className="invisible">1,416</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="refresh"
                intent={Intent.WARNING}>23</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="cross"
                minimal={true}
                intent={Intent.WARNING}>23</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="time"
                intent={Intent.DANGER}>23</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="warning-sign"
                intent={Intent.DANGER}>3</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                minimal={true}
                className="invisible">23,802</Tag>
            </td>
          </tr>
          <tr>
            <td>
            </td>
            <td>
              <Tag
                {...common}
                minimal={true}
                className="invisible">secure-boss-server.example.com</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                minimal={true}
                className="invisible">2</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="pulse"
                intent={Intent.SUCCESS}>2,345</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                minimal={true}
                className="invisible">1,416</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="refresh"
                intent={Intent.WARNING}>23</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="cross"
                minimal={true}
                intent={Intent.WARNING}>23</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="time"
                intent={Intent.DANGER}>23</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                icon="warning-sign"
                intent={Intent.DANGER}>3</Tag>
            </td>
            <td className="d">
              <Tag
                {...common}
                minimal={true}
                className="invisible">23,802</Tag>
            </td>
          </tr>
        </tbody>
      </HTMLTable>
      <AnchorButton text="Connect to a Boss Server" href="/connect" />
    </div>
  }])
})
