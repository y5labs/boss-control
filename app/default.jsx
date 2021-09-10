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
  Position,
  Tooltip
} from '@blueprintjs/core'
import numeral from 'numeral'

inject('pod', ({ HubContext, StateContext, BossContext }) => {
  inject('route', ['/', p => () => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)
    const bossState = useContext(BossContext)

    if (state.servers.length == 0) {
      page('/connect')
      return <div></div>
    }

    const common = {
      round: true,
      large: true,
      interactive: true
    }

    return <div className="page">
      <HTMLTable className="queues" condensed={true}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th className="d" colSpan="3">Processing</th>
            <th className="d" colSpan="4">Issues</th>
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
        {state.servers.map((s, i) => {
          const boss = bossState.get(s.serverAddress)
          const { queues, totals, socketState, message } = (() => {
            if (!boss || !boss.state || !boss.state.special) return {
              queues: [],
              totals: {},
              socketState: 'connecting',
              message: null
            }
            const { state: socketState, message } = boss.socket.state()
            return {
              queues: boss.state.queues,
              totals: boss.state.special.find(([name]) => name == 'total')[1],
              socketState,
              message
            }
          })()
          const disconnect = async e => {
            await hub.emit('disconnect from server', s)
          }
          return <tbody key={`server_${i}`}>
            <tr>
              <td>
                <Popover
                  content={
                    <Menu>
                      <MenuItem
                        icon="cross"
                        intent={Intent.DANGER}
                        text="Disconnect from server"
                        onClick={disconnect} />
                    </Menu>}
                  position={Position.BOTTOM_LEFT}>
                  { socketState != 'open'
                    ? <>
                      <Tooltip
                        content={message || socketState}
                        intent={Intent.DANGER}
                        position={Position.BOTTOM_LEFT}>
                        <Button icon="error" intent={Intent.DANGER} minimal={true} />
                      </Tooltip>
                      {' '}
                    </>
                    : <Button icon="cross" minimal={true} />
                  }
                </Popover>
              </td>
              <td>
                <Tag
                  {...common}
                  minimal={true}
                  className="invisible">{s.serverAddress.split('//')[1]}</Tag>
              </td>
              <td className="d">
              { totals.created
                ? <Tag
                  {...common}
                  minimal={true}
                  className="invisible">
                  { numeral(totals.created).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.active
                ? <Tag
                  {...common}
                  icon="pulse"
                  intent={Intent.SUCCESS}>
                  { numeral(totals.active).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.completed
                ? <Tag
                  {...common}
                  minimal={true}
                  className="invisible">
                  { numeral(totals.completed).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.retry
                ? <Tag
                  {...common}
                  icon="refresh"
                  intent={Intent.WARNING}>
                  { numeral(totals.retry).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.cancelled
                ? <Tag
                  {...common}
                  icon="cross"
                  minimal={true}
                  intent={Intent.WARNING}>
                  { numeral(totals.cancelled).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.expired
                ? <Tag
                  {...common}
                  icon="time"
                  intent={Intent.DANGER}>
                  { numeral(totals.expired).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.failed > 0
                ? <Tag
                  {...common}
                  icon="warning-sign"
                  intent={Intent.DANGER}>
                  { numeral(totals.failed).format('0,0') }
                </Tag>
                : ''
              }
              </td>
              <td className="d">
              { totals.archived
                ? <Tag
                  {...common}
                  minimal={true}
                  className="invisible">
                  { numeral(totals.archived).format('0,0') }
                </Tag>
                : ''
              }
              </td>
            </tr>
            {queues.map(([name, states]) => {
              return <tr key={`queue_${name}`}>
                <td>
                </td>
                <td className="indent1">
                  <Tag
                    {...common}
                    minimal={true}
                    className="invisible">{name}</Tag>
                </td>
                <td className="d">
                { states.created
                  ? <Tag
                    {...common}
                    minimal={true}
                    className="invisible">
                    { numeral(states.created).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.active
                  ? <Tag
                    {...common}
                    icon="pulse"
                    intent={Intent.SUCCESS}>
                    { numeral(states.active).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.completed
                  ? <Tag
                    {...common}
                    minimal={true}
                    className="invisible">
                    { numeral(states.completed).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.retry
                  ? <Tag
                    {...common}
                    icon="refresh"
                    intent={Intent.WARNING}>
                    { numeral(states.retry).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.cancelled
                  ? <Tag
                    {...common}
                    icon="cross"
                    minimal={true}
                    intent={Intent.WARNING}>
                    { numeral(states.cancelled).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.expired
                  ? <Tag
                    {...common}
                    icon="time"
                    intent={Intent.DANGER}>
                    { numeral(states.expired).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.failed > 0
                  ? <Tag
                    {...common}
                    icon="warning-sign"
                    intent={Intent.DANGER}>
                    { numeral(states.failed).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
                <td className="d">
                { states.archived
                  ? <Tag
                    {...common}
                    minimal={true}
                    className="invisible">
                    { numeral(states.archived).format('0,0') }
                  </Tag>
                  : ''
                }
                </td>
              </tr>
            })}
          </tbody>
        })}
      </HTMLTable>
      <AnchorButton text="Connect to a Boss Server" href="/connect" />
    </div>
  }])
})
