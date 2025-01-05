import { useParams } from 'react-router'
import { usePages } from '../context/pages'
import React from 'react'

export default function Page () {
  const { getPage } = usePages()
  const { id } = useParams()
  const [page, setPage] = React.useState(null)

  React.useEffect(() => {
    if (!id) return
    const fetchPage = async () => {
      const fetchedPage = await getPage(id)
      setPage(fetchedPage)
    }

    fetchPage()
  }, [id, getPage])

  if (!page) return <div>Loading...</div>

  return <div className='p-4'>Page {page.label}</div>
}
