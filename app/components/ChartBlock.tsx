import React, { useState } from 'react'
import { IoIosSettings } from 'react-icons/io'

import ClientChart from '../utils/chart.client'
import clientify from '../utils/clientify'

const ApexChart = clientify(ClientChart)

interface Chart {
  data: any
  type: 'bar' | 'line' | 'area'
}

interface ChartBlockProps {
  data: Chart
  onUpdate: (data: any) => void
}

export function ChartBlock ({ data, onUpdate }: ChartBlockProps) {
  const [configuring, setConfiguring] = useState(false)
  if (configuring)
    return <Settings data={data} onUpdate={onUpdate} onCancel={() => setConfiguring(false)} />
  return <Chart data={data} onConfigure={() => setConfiguring(true)} />
}

interface ChartProps {
  data: Chart
  onConfigure: () => void
}

function Chart ({ data, onConfigure }: ChartProps) {
  return (
    <div className='relative'>
      <div className='flex flex-col gap-2 rounded-lg bg-neutral-900 p-4'>
        <button onClick={onConfigure} className='absolute right-2 top-2 z-10 p-2'>
          <IoIosSettings />
        </button>
        <ApexChart
          type={data.type}
          height={200}
          options={{ chart: { toolbar: { show: false }, zoom: { enabled: false } } }}
          series={[{ name: 'Stuffs', data: data.data }]}
        />
      </div>
    </div>
  )
}

interface SettingsProps {
  data: Chart
  onUpdate: (data: Chart) => void
  onCancel: () => void
}

function Settings ({ data, onUpdate, onCancel }: SettingsProps) {
  const [error, setError] = useState<string | null>(null)
  return (
    <form
      className='flex flex-col gap-2 rounded-lg bg-neutral-900 p-4'
      onSubmit={e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        try {
          const type = formData.get('type') as 'bar' | 'line' | 'area'
          const data = JSON.parse(formData.get('data') as string)
          onUpdate({ type, data })
          onCancel()
        } catch (e) {
          setError('JSON Parse Error')
        }
      }}
    >
      <label>
        <div className='text-sm text-neutral-400'>Type:</div>
        <select name='type' defaultValue={data.type}>
          <option value='bar'>Bar</option>
          <option value='line'>Line</option>
          <option value='area'>Area</option>
        </select>
      </label>
      <label className='text-sm text-neutral-400'>Data:</label>
      <textarea name='data' defaultValue={JSON.stringify(data.data)} />
      {error && <div className='text-red-500'>{error}</div>}
      <button type='submit'>Save</button>
    </form>
  )
}
