import { useEffect, useState } from 'react'
import './App.css'
import RenderedObject from './components/RenderedObject'
import ImportDialog from './components/ImportDialog'
import { config, swagger, weatherData } from './data/examples'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { searchJsonPathsSimple, type JsonObject, type JsonValue } from './utilities/utilities'
import { BiArrowBack, BiSolidToTop } from 'react-icons/bi'

function App() {
  const [data, setData] = useState({})
  const [visibleData, setVisibleData] = useState<JsonValue>({})
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [visibleLayers, setVisibleLayers] = useState(4)

  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<string[][]>([])
  const [searchResultIndex, setSearchResultsIndex] = useState(0)

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

  useEffect(() => {
    if (search.length > 1) {
      onSearch(search)
    } else {
      setSearchResults([])
    }
  }, [search])

  useEffect(() => {
    if (searchResults.length > 0) {
      setCurrentPath(searchResults[searchResultIndex])
    }
  }, [searchResults, searchResultIndex])

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

  const loadExample = (data: "config" | 'weather' | 'swagger') => {
    if(data === 'config'){
      setData(JSON.parse(config))
    } else if (data === 'weather'){
      setData(JSON.parse(weatherData))
    } else if (data === 'swagger'){
      setData(JSON.parse(swagger))
    }
  }

  const popPath = () => {
    if (currentPath) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  const delveDeeper = (path: string[], step: boolean = true) => {
    if (step) {
      const next = path[0]
      setCurrentPath([...currentPath, next])
    } else {
      setCurrentPath([...currentPath, ...path])
    }
  }

  const jumpToPath = (index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)
  }



  const onSearch = (text: string) => {
    const results = searchJsonPathsSimple(data, text, false)
    setSearchResults(results)
  }

  return (
    <>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mx-1'>
          <h1 className='my-5'><a className='text-white transition-colors duration-300 cursor-pointer hover:text-blue-500' href='/'>JSONless</a></h1>
          <div className='flex gap-1 text-sm'>
            <button title='Decrease visible layers' onClick={() => { setVisibleLayers(p => Math.max(p - 1, 0)) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
              -
            </button>
            <div title='Number of visible layers' className='py-2 px-4 bg-stone-900 rounded-sm'>{visibleLayers} layers</div>
            <button title='Increase visible layers' onClick={() => { setVisibleLayers(p => p + 1) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
              +
            </button>
            <div className='w-4'></div>
            <button title='Open json text' onClick={() => { setDialogOpen(true) }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
              Import
            </button>
          </div>


        </div>
        <ImportDialog isOpen={isDialogOpen} onUpload={onJSONLoad} onClose={() => { setDialogOpen(false) }} />
        <div className='text-xs'>
          <div className='flex justify-between m-1 my-2'>
            <div className='flex'>
              {currentPath.length > 0 &&
                <>
                  <div className='flex gap-1'>
                    <button title='Go to top' onClick={() => { jumpToPath(-1) }} className='py-1 px-2 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
                      <BiSolidToTop size={"1.5em"} />
                    </button>
                    <button title='Go up a level' onClick={popPath} className='py-1 px-2 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
                      <BiArrowBack size={"1.5em"} />
                    </button>
                  </div>
                  <div className='flex items-center text-base mx-2'>
                    {
                      currentPath.map((item, index) => {
                        return (
                          <>
                            <span className='mx-1'>/</span><span onClick={() => { jumpToPath(index) }} className='px-2 py-1 bg-stone-700/50 rounded-sm hover:text-blue-400 hover:underline transition-colors duration-300 cursor-pointer'>{item}</span>
                          </>
                        )
                      })
                    }
                  </div>
                </>
              }
            </div>
            <div className="relative">
              <input
                type='text'
                className='py-2 px-4 pr-10 bg-stone-700 rounded-sm w-full'
                placeholder='Search'
                value={search}
                onChange={(e) => { setSearch(e.target.value) }}
                title='Search within the JSON structure'
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  type="button"
                  title='Clear search'
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          {searchResults.length === 0 ?
            <div>
              <RenderedObject item={visibleData} layersLeft={visibleLayers} path={[]} delve={delveDeeper} searchTerm={''} />
            </div>
            :
            <div>
              <div className='flex mx-1 gap-5 my-2'>
                <h2 className='text-2xl'>Search Results</h2>
                <div className='flex gap-1'>
                  <button
                    disabled={searchResultIndex === 0}
                    onClick={() => { setSearchResultsIndex(prev => Math.max(prev - 1)) }}
                    className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 disabled:bg-stone-900 disabled:opacity-50 disabled:cursor-default transition-colors duration-300 cursor-pointer'>
                    <FaChevronLeft size={"1.5em"} />
                  </button>
                  <div className='py-2 px-4 bg-stone-900 rounded-sm'>{searchResultIndex + 1} / {searchResults.length}</div>
                  <button
                    disabled={searchResultIndex === (searchResults.length - 1)}
                    onClick={() => { setSearchResultsIndex(prev => Math.min(prev + 1, searchResults.length - 1)) }}
                    className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 disabled:bg-stone-900 disabled:opacity-50 disabled:cursor-default transition-colors duration-300 cursor-pointer'>
                    <FaChevronRight size={"1.5em"} />
                  </button>
                </div>
              </div>
              <RenderedObject item={visibleData} layersLeft={visibleLayers} path={[]} delve={delveDeeper} searchTerm={search} />
            </div>
          }
        </div>
        <div className='min-h-50'>
          <h2 className='text-xl my-2'>More Examples</h2>
          <div className='flex gap-2'>
            <button onClick={() => { loadExample('swagger') }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Swagger</button>
            <button onClick={() => { loadExample('config') }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Servlet Config</button>
            <button onClick={() => { loadExample('weather') }} className='py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>Weather</button>
          
          </div>
        </div>
      </div >
    </>
  )
}

export default App