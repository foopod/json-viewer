import { useEffect, useState } from 'react'
import './App.css'
import RenderedObject from './components/RenderedObject'
import ImportDialog from './components/ImportDialog'

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

  return (
    <>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center'>
          <h1>JSON Viewer</h1>
          <button onClick={() => { setDialogOpen(true) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
            Import
          </button>

        </div>
        <ImportDialog isOpen={isDialogOpen} onUpload={onJSONLoad} onClose={() => {setDialogOpen(false)}}/>
        <RenderedObject item={data} />
      </div>
    </>
  )
}

export default App
