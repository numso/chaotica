import { NavLink, Outlet } from 'react-router'

import { usePages } from '../context/pages'
import type { Route } from './+types/_layout'

export function meta ({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' }
  ]
}

export default function Home () {
  const { pages } = usePages()

  return (
    <main className='flex h-screen'>
      <nav className='border-r border-gray-200 p-4 dark:border-gray-700'>
        <ul className='flex flex-col items-center gap-4'>
          {pages.map(({ id, label }) => (
            <NavLink
              key={id}
              to={id}
              className='relative flex size-10 items-center justify-center rounded-3xl bg-gray-500 transition-all before:absolute before:-left-4 before:h-0 before:w-1 before:rounded-r-full before:bg-white before:transition-all hover:rounded-xl hover:bg-gray-700 before:hover:h-4 [&.active]:rounded-xl [&.active]:bg-gray-700 [&.active]:before:h-8'
            >
              {label.slice(0, 2).toUpperCase()}
            </NavLink>
          ))}
          <NavLink
            to='new'
            className='relative flex size-10 items-center justify-center rounded-3xl bg-gray-500 transition-all before:absolute before:-left-4 before:h-0 before:w-1 before:rounded-r-full before:bg-white before:transition-all hover:rounded-xl hover:bg-gray-700 before:hover:h-4 [&.active]:rounded-xl [&.active]:bg-gray-700 [&.active]:before:h-8'
          >
            +
          </NavLink>
        </ul>
      </nav>
      <div className='flex-1'>
        <Outlet />
      </div>
    </main>
  )
}
