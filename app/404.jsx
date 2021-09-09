import inject from 'seacreature/lib/inject'

inject('pod', () => {
  inject('404', () => {
    return <div className="full">
      <h1>404 - Page Not Found</h1>
    </div>
  })
})
