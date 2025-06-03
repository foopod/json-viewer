import { useState } from "react";

function ImportDialog({ isOpen, onUpload, onClose }: { isOpen: boolean, onUpload: (t: string) => void, onClose: () => void }) {
    const [text, setText] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    if (!isOpen) {
        return
    }

    const loadJSON = () => {
        if (validateJSON(text)){
            onUpload(text)
            setText('')
        }
    }

    const validateJSON = (jsonString: string) => {
        try {
            JSON.parse(jsonString)
        } catch (error) {
            if (error instanceof SyntaxError) {
                setErrorMessage(error.message)
                return false
            }
        }
        return true
    }

    return <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
        <div className="bg-stone-800 p-5 rounded-sm w-xl">
            <h2 className="text-xl font-semibold mb-4">Paste JSON</h2>
            <textarea id="message" rows={4}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Paste your JSON here.." value={text} onChange={(e) => { setText(e.target.value); setErrorMessage("")}}>
            </textarea>
            {errorMessage &&
                <div className="mb-5 text-red-300">{errorMessage}</div>
            }
            <div className="flex justify-end gap-2">
                <button onClick={onClose} className="py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer">Cancel</button>
                <button onClick={loadJSON} className="py-2 px-4 bg-stone-900 rounded-sm hover:bg-blue-700 transition-colors duration-300 cursor-pointer">Load</button>
            </div>
        </div>
    </div>
}

export default ImportDialog;