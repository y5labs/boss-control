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
  Tooltip,
  Spinner,
  InputGroup
} from '@blueprintjs/core'
import numeral from 'numeral'
import pagepro from 'pagepro'
import { DateTime } from 'luxon'

const stringify_nice = obj => JSON.stringify(obj)
  .replaceAll('"', '')
  .replaceAll('{', '{ ')
  .replaceAll('}', ' }')
  .replaceAll(':', ': ')
  .replaceAll(',', ', ')
  .slice(2, -2)

const units = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
]

const timeAgo = date => {
  let dateTime = DateTime.fromISO(date)
  const diff = dateTime.diffNow().shiftTo(...units)
  const unit = units.find((unit) => diff.get(unit) !== 0) || 'second'

  const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
}

inject('pod', ({ HubContext, StateContext, BossContext }) => {
  inject('route', ['/server/:serverAddress/queue/:queueName/status/:status/page/:page/', p => () => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)
    const bossState = useContext(BossContext)
    const [jobState, setJobState] = useState({
      currentpage: 1,
      itemsperpage: 25,
      totalitems: 0,
      jobs: null
    })

    if (state.servers.length == 0) {
      page('/connect')
      return <div></div>
    }

    const { serverAddress, queueName, status } = p.params
    const currentpage = parseInt(p.params.page)
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
      let waiting = true
      let last_hurrah = null
      hub.emit('load jobs', { server: s, queue: name, statuses, currentpage })
      hub.on('filter jobs', params => {
        if (waiting == true) {
          last_hurrah = params
          return // debounce
        }
        hub.emit('load jobs', params)
      })
      hub.on('loaded jobs', res => {
        waiting = false
        setJobState(res)
        if (last_hurrah != null) {
          const params = last_hurrah
          last_hurrah = null
          hub.emit('filter jobs', params)
        }
      })
    }), [])

    const select = status => e => {
      const new_status = (() => {
        if (!statuses.includes(status)) return [...statuses, status]
        const result = [...statuses]
        result.splice(statuses.indexOf(status), 1)
        if (result.length == 0)
          return ['null']
        return result
      })()
      page(`/server/${slugify(s.serverAddress)}/queue/${slugify(name)}/status/${new_status.join(',')}/page/1/`)
    }

    const back = e => {
      page(`/server/${slugify(s.serverAddress)}/queue/${slugify(name)}/status/${status}/page/${currentpage - 1}/`)
    }

    const forward = e => {
      page(`/server/${slugify(s.serverAddress)}/queue/${slugify(name)}/status/${status}/page/${currentpage + 1}/`)
    }

    const pagination = pagepro(jobState)

    const common = {
      round: true,
      large: true
    }

    return <div className="page">
      <div className="split">
        <h2>{s.serverAddress.split('//')[1]}</h2>
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
            <th></th>
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
      {jobState.jobs
        ? <>
        <div className="split">
          <div>
            <InputGroup
              style={{ width: '400px' }}
              type="search"
              leftIcon="filter"
              placeholder="Type to filter data..."
              onChange={e => {
                hub.emit('filter jobs', {
                  server: s, queue: name, statuses, currentpage: 1, search_term: e.target.value
                })
              }}
              />
          </div>
          <div>
            <AnchorButton minimal={true} className={`${pagination.hasprevpage ? '' : 'invisible'}`} onClick={back}>Back</AnchorButton>
            {' '}
            Page { pagination.currentpage } / { pagination.totalpages }
            {' '}
            <AnchorButton minimal={true} className={`${pagination.hasnextpage ? '' : 'invisible'}`} onClick={forward}>Forward</AnchorButton>
          </div>
        </div>
        <HTMLTable className="jobs selectable" condensed={true}>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Activity</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
          {jobState.jobs.map(j => {
            const id_small = `${j.id.slice(0, 6)}...${j.id.slice(-6)}`
            return <tr key={j.id}>
              <td>
                <Icon icon="full-circle" className="boring" title={j.state} intent={
                  j.state == 'active'
                  ? Intent.SUCCESS
                  : ['retry', 'cancelled'].includes(j.state)
                  ? Intent.WARNING
                  : ['expired', 'failed'].includes(j.state)
                  ? Intent.DANGER
                  : null
                } />
              </td>
              <td
                title={j.id}
                onClick={e => navigator.clipboard.writeText(j.id)}>{id_small}</td>
              <td
                title={j.activity_at}
                onClick={e => navigator.clipboard.writeText(j.activity_at)}>{timeAgo(j.activity_at)}</td>
              <td
                title={JSON.stringify(j.data, null, 2)}
                onClick={e => navigator.clipboard.writeText(JSON.stringify(j.data, null, 2))}
                className="data">{stringify_nice(j.data)}</td>
            </tr>
          })}
          </tbody>
        </HTMLTable>
        </>
        : <Spinner size={Spinner.SIZE_LARGE} /> }
    </div>
  }])
})
