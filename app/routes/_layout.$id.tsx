import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import React from 'react'
import { useParams } from 'react-router'
import { usePages } from '../context/pages'
import { FlashcardBlock } from '../components/FlashcardBlock'

export default function Page () {
  const { getPage, updatePage } = usePages()
  const { id } = useParams()
  const [page, setPage] = React.useState(null)
  const [adding, setAdding] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState('')

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
          <div key={block.id}>
            {block.type === 'text' ? (
              <p className='max-w-96 rounded-lg bg-blue-700 p-4'>
                {block.contents}
              </p>
            ) : block.type === 'image' ? (
              <img
                src={block.contents}
                className='max-w-60 rounded-lg bg-blue-700 p-4'
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
            ) : (
              <div className='rounded-lg bg-blue-700 p-4'>
                <CodeBlock block={block} />
              </div>
            )}
          </div>
        ))}

        <motion.div
          initial={{ width: 40, height: 40 }}
          animate={{ width: adding ? 400 : 40, height: adding ? 300 : 40 }}
          className='overflow-hidden'
        >
          {adding ? (
            <div className='h-full w-full rounded-lg bg-blue-900 p-3'>
              <form
                className='flex flex-col gap-6'
                onSubmit={e => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  const type = formData.get('type')
                  const contents = formData.get('contents')
                  const block = {
                    id: nanoid(),
                    type,
                    contents: type === 'flashcards' ? [] : contents
                  }
                  updatePage({ ...page, blocks: [...page.blocks, block] })
                  setAdding(false)
                }}
              >
                <fieldset className='flex flex-col'>
                  <legend className='text-sm font-medium'>Type</legend>
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
                </fieldset>
                <label className='text-sm font-medium'>
                  {getContentLabel(selectedType)}
                  <textarea
                    className='block w-full resize-none rounded p-2'
                    name='contents'
                  />
                </label>
                <div className='flex justify-end gap-2'>
                  <button
                    className='rounded bg-zinc-300 px-2 py-1 text-black hover:bg-zinc-400 active:bg-zinc-500'
                    type='button'
                    onClick={() => setAdding(false)}
                  >
                    Cancel
                  </button>
                  <button className='rounded bg-zinc-300 px-2 py-1 text-black hover:bg-zinc-400 active:bg-zinc-500'>
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
    const script = document.createElement('script')
    script.innerHTML = `const $$container = document.getElementById('script-${block.id}');${block.contents}`
    document.body.appendChild(script)
  }, [])
  return <div id={`script-${block.id}`} />
}
