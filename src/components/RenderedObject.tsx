
function RenderedObject({ item }: { item: any | any[] }) {
  const valueType = typeof item;

  if (['number', 'string'].includes(valueType)) {
    if (item === ""){
      item = '""'
    }
    return <span className="m-1 p-1 rounded-sm" >{item}</span>;
  }

  if (valueType === 'boolean') {
    return <span className="m-1 p-1 rounded-sm">{item ? 'true' : 'false'}</span>;
  }

  if (Array.isArray(item)) {
    return <ul className="m-1 p-1 rounded-sm border-l" style={{backgroundColor: "rgba(255, 255, 255, 0.05)"}}>
          {item.map((i) => {
                return <li key={i.toString()}><RenderedObject item={i} /></li>
            })}
        </ul>
  }

  if (valueType === 'object' && item !== null) {
    return (
      <>
          <div className="flex flex-col m-1 p-1 rounded-sm border-2 border-black/50 border-dotted"  style={{backgroundColor: "rgba(255, 255, 255, 0.05)"}}>
            {Object.entries(item).map(([key, value]) => {
              if (key === ""){
                key = '""'
              }
              return (
                <div className="flex" key={key}>
                  <span className="m-1 px-2 py-1 rounded-sm h-fit" style={{backgroundColor: "rgba(255, 255, 255, 0.05)"}} >{key}</span>
                  <RenderedObject item={value} key={key}/>
                </div>
              )
          })}
          </div>
      </>
    );
  }

  return <span>Unsupported Type</span>;
}

export default RenderedObject;