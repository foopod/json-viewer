import { useEffect, useState } from 'react'
import './App.css'
import RenderedObject from './components/RenderedObject'
import ImportDialog from './components/ImportDialog'
import { config, weatherData } from './data/examples'

function App() {
  const [data, setData] = useState({})
  const [isDialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setData({
      glossary: {
        title: "example glossary",
        GlossDiv: {
          title: "S",
          GlossList: {
            GlossEntry: {
              ID: "SGML",
              SortAs: "SGML",
              GlossTerm: "Standard Generalized Markup Language",
              Acronym: "SGML",
              Abbrev: "ISO 8879:1986",
              GlossDef: {
                para: "A meta-markup language, used to create markup languages such as DocBook.",
                GlossSeeAlso: ["GML", "XML"]
              },
              GlossSee: "markup"
            }
          }
        }
      }
    }
    )
  }, [])

  const onJSONLoad = (text: string) => {
    setDialogOpen(false)
    setData(JSON.parse(text))
  }

  const loadExample = (data: "config" | 'weather') => {
    
    setData(JSON.parse(data === 'config' ? config : weatherData))
  }

  return (
    <>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center'>
          <h1 className='my-5'><a href='/'>JSON Viewer</a></h1>
          <button onClick={() => { setDialogOpen(true) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
            Import
          </button>

        </div>
        <ImportDialog isOpen={isDialogOpen} onUpload={onJSONLoad} onClose={() => {setDialogOpen(false)}}/>
          <div className='text-xs'>
        <RenderedObject item={data} />

          </div>
        <div>
          <h2 className='text-xl my-2'>More Examples</h2>
          <div className='flex gap-2'>
            <button onClick={() => {loadExample('config')}} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Config</button> 
            <button onClick={() => {loadExample('weather')}} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Weather</button> 
          </div>
        </div>
      </div>
    </>
  )
}

export default App
