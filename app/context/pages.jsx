import React, { createContext, useContext, useEffect, useState } from 'react'

import db from '../../db.js'

const PagesContext = createContext()

export function PagesProvider ({ children }) {
  const [pages, setPages] = useState([])

  useEffect(() => {
    const loadPages = async () => {
      const existingPages = await db.pages.toArray()
      if (existingPages.length === 0) {
        await db.pages.bulkAdd([
          { id: 'one', label: '1' },
          { id: 'two', label: '2' },
          { id: 'three', label: '3' }
        ])
      }
      const loadedPages = await db.pages.toArray()
      setPages(loadedPages)
    }

    loadPages()
  }, [])

  const addPage = async page => {
    await db.pages.add(page)
    const updatedPages = await db.pages.toArray()
    setPages(updatedPages)
  }

  const updatePage = async page => {
    await db.pages.update(page.id, page)
    const updatedPages = await db.pages.toArray()
    setPages(updatedPages)
  }

  const removePage = async id => {
    await db.pages.delete(id)
    const updatedPages = await db.pages.toArray()
    setPages(updatedPages)
  }

  const getPage = async id => {
    const page = await db.pages.get(id)
    if (!page.blocks) page.blocks = []
    return page
  }

  return (
    <PagesContext.Provider value={{ pages, addPage, updatePage, removePage, getPage }}>
      {children}
    </PagesContext.Provider>
  )
}

export function usePages () {
  const context = useContext(PagesContext)
  if (!context) {
    throw new Error('usePages must be used within a PagesProvider')
  }
  return context
}
