import { useEffect, useState } from "react";
import { FaArrowRightToBracket} from "react-icons/fa6";
import { Highlight } from "./Highlight";

function RenderedObject({ item, layersLeft, path, delve, searchTerm }: { item: any | any[], layersLeft: number, path: string[], delve: (path: string[], step: boolean) => void, searchTerm: string }) {
  const [isExpanded, setIsExpanded] = useState(layersLeft > 0)

  const valueType = typeof item;

  useEffect(() => {
    setIsExpanded(layersLeft > 0)
  }, [layersLeft])

  const expand = () => {
    setIsExpanded(true)
    delve(path, true)
  }

  if (!isExpanded && valueType === 'object') {
    return (
      <div>
        <button onClick={expand} className='m-1 px-2 py-1 rounded-sm h-fit bg-blue-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer'>
          <div className="flex items-center gap-1">Deeper <FaArrowRightToBracket /></div>
        </button>
      </div>
    )
  }

  if (item === null) {
    return <span className="m-1 p-1 rounded-sm text-blue-300"><Highlight text={'null'} searchTerm={searchTerm}/></span>;
  }

  if (['number', 'string'].includes(valueType)) {
    if (item === "") {
      item = '""'
    }
    return <span className={`m-1 p-1 rounded-sm ${valueType === "number" ? "text-green-200" : ''}`} ><Highlight text={item.toString()} searchTerm={searchTerm}/></span>;
  }

  if (valueType === 'boolean') {
    return <span className="m-1 p-1 rounded-sm text-amber-200"><Highlight text={item ? 'true' : 'false'} searchTerm={searchTerm}/></span>;
  }

  if (Array.isArray(item)) {
    return <ul className="m-1 p-1 rounded-sm border-l-3 border-amber-200" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
      {item.map((i, index) => {
        return <li className="h-full" key={index}><RenderedObject item={i} layersLeft={layersLeft - 1} path={[...path, index.toString()]} delve={delve} searchTerm={searchTerm}/></li>
      })}
    </ul>
  }

  if (valueType === 'object' && item !== null) {
    return (
      <>
        <div className="flex m-1 rounded-sm border-1 border-dashed w-full border-blue-500 bg-white/5">
          <div className="h-full w-2 bg-blue-900 transition-all duration-300 hover:w-4 cursor-pointer" onClick={() => { delve(path, false) }}></div>
          <div className="flex flex-col p-1">
            {Object.entries(item).map(([key, value]) => {
              if (key === "") {
                key = '""'
              }
              return (
                <div className="flex" key={key}>
                  <span className="m-1 px-2 py-1 rounded-sm h-fit rounded-sm bg-stone-900" ><Highlight text={key} searchTerm={searchTerm}/></span>
                  <RenderedObject item={value} key={key} layersLeft={layersLeft - 1} path={[...path, key]} delve={delve} searchTerm={searchTerm}/>
                </div>
              )
            })}
          </div>
        </div>
      </>
    );
  }

  return <span>Unsupported Type</span>;
}

export default RenderedObject;