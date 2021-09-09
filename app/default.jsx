import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ HubContext, StateContext }) => {
  inject('route', ['/', p => () => {
    const hub = useContext(HubContext)
    const state = useContext(StateContext)

    return <div>
      Hello
      <table className="bp4-html-table bp4-interactive bp4-html-table-condensed">
        <thead>
          <tr>
            <th>Project</th>
            <th>Description</th>
            <th>Technologies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Blueprint</td>
            <td>CSS framework and UI toolkit</td>
            <td>Sass, TypeScript, React</td>
          </tr>
          <tr>
            <td>TSLint</td>
            <td>Static analysis linter for TypeScript</td>
            <td>TypeScript</td>
          </tr>
          <tr>
            <td>Plottable</td>
            <td>Composable charting library built on top of D3</td>
            <td>SVG, TypeScript, D3</td>
          </tr>
        </tbody>
      </table>
    </div>
  }])
})
