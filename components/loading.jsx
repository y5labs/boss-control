const inject = require('seacreature/lib/inject')

inject('pod', () => {
  inject('loading', () => {
    return <div className="loading">
      <span>Loading...</span>
    </div>
  })
})