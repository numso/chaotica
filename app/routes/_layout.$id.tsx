import { Editor } from '@monaco-editor/react'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import React from 'react'
import { useParams } from 'react-router'

import { ChartBlock } from '../components/ChartBlock'
import { FlashcardBlock } from '../components/FlashcardBlock'
import { usePages } from '../context/pages'

export default function Page () {
  const { getPage, updatePage } = usePages()
  const { id } = useParams()
  const [page, setPage] = React.useState(null)
  const [adding, setAdding] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState('')
  const [editorContent, setEditorContent] = React.useState('')

  React.useEffect(() => {
    if (!id) return
    const fetchPage = async () => setPage(await getPage(id))
    fetchPage()
  }, [id, getPage])

  if (!page) return <div>Loading...</div>

  return (
    <div className='p-4'>
      <h1 className='text-center text-xl font-medium'>{page.label}</h1>
      <div className='flex flex-wrap gap-4'>
        {page.blocks.map(block => (
          <div key={block.id} className='min-w-72 max-w-sm flex-1'>
            {block.type === 'text' ? (
              <p className='rounded-lg bg-blue-700 p-3 text-sm'>{block.contents}</p>
            ) : block.type === 'image' ? (
              <img
                src={block.contents}
                className='max-w-xs rounded-lg bg-blue-700 p-3'
                alt='Image Block'
              />
            ) : block.type === 'flashcards' ? (
              <FlashcardBlock
                cards={block.contents}
                onUpdate={cards => {
                  const updatedBlocks = page.blocks.map(b =>
                    b.id === block.id ? { ...b, contents: cards } : b
                  )
                  updatePage({ ...page, blocks: updatedBlocks })
                }}
              />
            ) : block.type === 'chart' ? (
              <ChartBlock
                data={block.contents}
                onUpdate={contents => {
                  const updatedBlocks = page.blocks.map(b =>
                    b.id === block.id ? { ...b, contents } : b
                  )
                  updatePage({ ...page, blocks: updatedBlocks })
                }}
              />
            ) : (
              <div className='rounded-lg bg-blue-700 p-3'>
                <div className='h-32 w-full overflow-auto rounded-lg bg-neutral-900'>
                  <CodeBlock block={block} />
                </div>
              </div>
            )}
          </div>
        ))}
        <motion.div
          initial={{ width: 40, height: 40 }}
          animate={{ width: adding ? 500 : 40, height: adding ? 400 : 40 }} // Increased dimensions
          className='overflow-hidden'
        >
          {adding ? (
            <div className='h-full w-full rounded-lg bg-blue-900 p-4'>
              <form
                className='flex h-full flex-col gap-4'
                onSubmit={e => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  const type = formData.get('type')
                  const contents = type === 'code' ? editorContent : formData.get('contents')
                  const block = {
                    id: nanoid(),
                    type,
                    contents:
                      type === 'flashcards'
                        ? []
                        : type === 'chart'
                          ? {
                              type: 'bar',
                              data: [
                                [1, 2],
                                [2, 1],
                                [3, 3],
                                [4, 4]
                              ]
                            }
                          : contents
                  }
                  updatePage({ ...page, blocks: [...page.blocks, block] })
                  setAdding(false)
                }}
              >
                <fieldset className='flex flex-col text-sm'>
                  <legend className='font-medium'>Type</legend>
                  <label className='ml-2'>
                    <input
                      type='radio'
                      name='type'
                      value='text'
                      onChange={e => setSelectedType(e.target.value)}
                    />{' '}
                    Text
                  </label>
                  <label className='ml-2'>
                    <input
                      type='radio'
                      name='type'
                      value='image'
                      onChange={e => setSelectedType(e.target.value)}
                    />{' '}
                    Image
                  </label>
                  <label className='ml-2'>
                    <input
                      type='radio'
                      name='type'
                      value='code'
                      onChange={e => setSelectedType(e.target.value)}
                    />{' '}
                    Code
                  </label>
                  <label className='ml-2'>
                    <input
                      type='radio'
                      name='type'
                      value='flashcards'
                      onChange={e => setSelectedType(e.target.value)}
                    />{' '}
                    Flashcards
                  </label>
                  <label className='ml-2'>
                    <input
                      type='radio'
                      name='type'
                      value='chart'
                      onChange={e => setSelectedType(e.target.value)}
                    />{' '}
                    Chart
                  </label>
                </fieldset>
                {selectedType === 'code' ? (
                  <div className='flex flex-1 flex-col gap-2'>
                    <label className='text-sm font-medium'>Code</label>
                    <div className='h-48 overflow-hidden rounded-lg bg-neutral-900'>
                      <Editor
                        height='100%'
                        width='100%'
                        defaultLanguage='javascript'
                        theme='vs-dark'
                        onChange={value => setEditorContent(value || '')}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          lineNumbers: 'on',
                          wordWrap: 'off',
                          padding: { top: 8, bottom: 8 }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <label className='flex flex-1 flex-col gap-2 text-sm'>
                    <span>{getContentLabel(selectedType)}</span>
                    <textarea
                      className='block h-24 w-full resize-none rounded p-2'
                      name='contents'
                      rows={5}
                    />
                  </label>
                )}
                <div className='flex justify-end gap-2'>
                  <button
                    className='rounded bg-zinc-300 px-3 py-2 text-sm text-black hover:bg-zinc-400 active:bg-zinc-500'
                    type='button'
                    onClick={() => setAdding(false)}
                  >
                    Cancel
                  </button>
                  <button className='rounded bg-zinc-300 px-3 py-2 text-sm text-black hover:bg-zinc-400 active:bg-zinc-500'>
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              className='flex h-full w-full items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900'
              onClick={() => setAdding(true)}
            >
              +
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function getContentLabel (type: string = '') {
  switch (type) {
    case 'text':
      return 'Text'
    case 'image':
      return 'Image URL'
    case 'code':
      return 'Code'
    case 'flashcards':
      return 'Card Collection Title'
    default:
      return 'Content'
  }
}

function CodeBlock ({ block }) {
  React.useEffect(() => {
    const executeCode = () => {
      try {
        const executeFunction = new Function(block.contents)
        executeFunction()
      } catch (error) {
        console.error('Error executing code:', error)
      }
    }
    if (block.contents) {
      executeCode()
    }
  }, [block.contents])

  return (
    <Editor
      height='100%'
      width='100%'
      defaultLanguage='javascript'
      theme='vs-dark'
      value={block.contents}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14
      }}
      className='overflow-hidden rounded'
    />
  )
}
