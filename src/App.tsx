import { useEffect, useState } from 'react'
import './App.css'
import RenderedObject from './components/RenderedObject'
import ImportDialog from './components/ImportDialog'
import { config, weatherData } from './data/examples'
import { PiArrowULeftUpFill } from 'react-icons/pi'

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

function App() {
  const [data, setData] = useState({})
  const [visibleData, setVisibleData] = useState<JsonValue>({})
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [visibleLayers, setVisibleLayers] = useState(4)

  useEffect(() => {
    const exampleData = {
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

    setData(exampleData)
  }, [])

  useEffect(() => {
    setVisibleData(data)
    setCurrentPath([])
  }, [data])

  useEffect(() => {
    setVisibleData(getValueAtPath(data, currentPath))
  }, [currentPath])

  const getValueAtPath = (obj: JsonValue, path: string[]): JsonValue => {
    let current = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        current = (current as JsonObject)[key];
      } else if (Array.isArray(current)) {
        current = current[parseInt(key)];
      } else {
        return null;
      }
    }
    return current;
  };

  const onJSONLoad = (text: string) => {
    setDialogOpen(false)
    setData(JSON.parse(text))
  }

  const loadExample = (data: "config" | 'weather') => {
    setData(JSON.parse(data === 'config' ? config : weatherData))
  }

  const popPath = () => {
    if (currentPath){
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  const delveDeeper = (path: string[], step: boolean = true) => {
    if(step){
      const next = path[0]
      setCurrentPath([...currentPath, next])
    } else {
      setCurrentPath([...currentPath, ...path])
    }
  }

  const jumpToPath = (index: number) => {
    const newPath = currentPath.slice(0, index)
    setCurrentPath(newPath)
  }

  return (
    <>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center'>
          <h1 className='my-5'><a className='text-blue-600 transition-colors duration-300 cursor-pointer hover:text-blue-500' href='/'>JSONless</a></h1>
          <div className='flex gap-1'>
            <div className='py-2 px-4'>Context</div>
            <button onClick={() => { setVisibleLayers(p => p + 1) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
              +
            </button>
            <div className='py-2 px-4 bg-stone-900 rounded-sm'>{visibleLayers} layers</div>
            <button onClick={() => { setVisibleLayers(p => Math.max(p - 1, 0)) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
              -
            </button>
            <div className='w-4'></div>
            <button onClick={() => { setDialogOpen(true) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
              Import
            </button>
          </div>


        </div>
        <ImportDialog isOpen={isDialogOpen} onUpload={onJSONLoad} onClose={() => { setDialogOpen(false) }} />
        <div className='text-xs'>
          <div className='flex'>
            {currentPath.length > 0 &&
            <>
              <button onClick={popPath} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
                <PiArrowULeftUpFill size={"1.5em"} />
              </button>
              <div className='text-lg mx-4'>
                {
                  currentPath.map((item, index) => {
                    return (
                      <span key={`${item}-${index}`}>
                        <span> / </span><span onClick={() => {jumpToPath(index)}} className='hover:text-blue-400 hover:underline transition-colors duration-300 cursor-pointer'>{item}</span>
                      </span >
                    )
                  })
                }
              </div>
              </>
            }
          </div>
          <RenderedObject item={visibleData} layersLeft={visibleLayers} path={[]} delve={delveDeeper}/>
        </div>
        <div>
          <h2 className='text-xl my-2'>More Examples</h2>
          <div className='flex gap-2'>
            <button onClick={() => { loadExample('config') }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Config</button>
            <button onClick={() => { loadExample('weather') }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Weather</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
