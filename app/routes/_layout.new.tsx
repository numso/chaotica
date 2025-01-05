import { Form, useNavigate } from 'react-router'
import { usePages } from '../context/pages'

export default function New () {
  const { addPage } = usePages()
  const navigate = useNavigate()

  return (
    <div className='h-full text-white flex flex-col items-center justify-center'>
      <div className='w-96 bg-gray-800 p-6 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold mb-4 text-center'>
          Create a New Page
        </h1>
        <Form
          method='post'
          className='space-y-4'
          onSubmit={async event => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const label = formData.get('title')
            const id = formData.get('id')
            addPage({ id, label })
            navigate(`../${id}`)
          }}
        >
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-400 mb-1'
            >
              Title
            </label>
            <input
              id='title'
              name='title'
              type='text'
              placeholder='Enter a title'
              className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <input
              id='id'
              name='id'
              type='hidden'
              value={Math.random().toString(36).substring(7)}
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md text-white font-medium transition-all'
          >
            Create Page
          </button>
        </Form>
      </div>
    </div>
  )
}
