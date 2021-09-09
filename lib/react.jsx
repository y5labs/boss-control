import inject from 'seacreature/lib/inject'
import { render } from 'react-dom'

inject('pod', async () => {
  const App = inject.one('app')
  const Root = () =>
    inject.many('provider')
      .reverse()
      .reduce((children, Provider) =>
        <Provider children={children} />,
        <App />)
  render(<Root />, document.getElementById('root'))
})
