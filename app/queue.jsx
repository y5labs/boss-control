import inject from 'seacreature/lib/inject'
import page from 'page'
import slugify from 'slugify'
import { useContext, useEffect, useState } from 'react'
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
  inject('route', ['/server/:serverAddress/queue/:queueName/status/:status/page/:page/', p => () => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)
    const bossState = useContext(BossContext)
    const [jobState, setJobState] = useState({
      page: 1,
      page_size: 25,
      page_total: 0,
      jobs: []
    })

    if (state.servers.length == 0) {
      page('/connect')
      return <div></div>
    }

    const { serverAddress, queueName, status } = p.params
    const currentPage = parseInt(p.params.page)
    const statuses = status.split(',')

    const s = state.servers.find(s => slugify(s.serverAddress) == serverAddress)
    if (!s) {
      page('/')
      return <div></div>
    }
    const boss = bossState.get(s.serverAddress)
    if (!boss || !boss.state || !boss.state.special) {
      page('/')
      return <div></div>
    }
    const queue = boss.state.queues.find(([name]) => slugify(name) == queueName)
    if (!queue) {
      page('/')
      return <div></div>
    }
    const [name, totals] = queue

    useEffect(hub.effect(hub => {
      hub.emit('load jobs', { server: s, queue: name, statuses, page: currentPage })
      hub.on('loaded jobs', jobState => {
        console.log(jobState)
        setJobState(jobState)
      })
    }), [])

    const select = status => e => {
      const new_status = (() => {
        if (!statuses.includes(status)) return [...statuses, status]
        const result = [...statuses]
        result.splice(statuses.indexOf(status), 1)
        if (result.length == 0)
          return ['active']
        return result
      })()
      page(`/server/${slugify(s.serverAddress)}/queue/${slugify(name)}/status/${new_status.join(',')}/page/1/`)
    }

    const common = {
      round: true,
      large: true
    }

    return <div className="page">
      <div className="split">
        <div></div>
        <AnchorButton
          icon="cross"
          large={true}
          minimal={true}
          href="/" />
      </div>
      <HTMLTable className="queues selectable" condensed={true}>
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
            <th>{s.serverAddress.split('//')[1]}</th>
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
            </td>
            <td onClick={e => page(`/server/${slugify(s.serverAddress)}/queue/${slugify(name)}/status/active/page/1/`)}>
              <Tag
                {...common}
                minimal={true}
                className="invisible">{name}</Tag>
            </td>
            <td className={`d ${statuses.includes('created') ? 'selected' : ''}`} onClick={select('created')}>
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
            <td className={`d ${statuses.includes('active') ? 'selected' : ''}`} onClick={select('active')}>
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
            <td className={`d ${statuses.includes('completed') ? 'selected' : ''}`} onClick={select('completed')}>
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
            <td className={`d ${statuses.includes('retry') ? 'selected' : ''}`} onClick={select('retry')}>
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
            <td className={`d ${statuses.includes('cancelled') ? 'selected' : ''}`} onClick={select('cancelled')}>
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
            <td className={`d ${statuses.includes('expired') ? 'selected' : ''}`} onClick={select('expired')}>
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
            <td className={`d ${statuses.includes('failed') ? 'selected' : ''}`} onClick={select('failed')}>
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
            <td className={`d ${statuses.includes('archived') ? 'selected' : ''}`} onClick={select('archived')}>
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
        </tbody>
      </HTMLTable>
      {jobState.jobs.length}
    </div>
  }])
})
