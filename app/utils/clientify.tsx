import React from 'react'

export default function clientify <T>(Component: T): T {
  return function Clientified (props) {
    const [client, setClient] = React.useState(false)
    React.useEffect(() => setClient(true) && void 0, [])
    return client && <Component {...props} />
  }
}
