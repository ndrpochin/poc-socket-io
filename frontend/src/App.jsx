import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = (evt) => {
    evt.preventDefault()

    const newMessage = {
      body: message,
      from: 'Me'
    }

    setMessages([...messages, newMessage])
    socket.emit('message', message)
  }

  useEffect(() => {
    socket.on('broadcast', receiveMessage)

    return () => {
      socket.off('broadcast', receiveMessage)
    }

  }, [])

  const receiveMessage = (message) => {
    setMessages(state => [...state, message])
  }

  return (
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit}>
        <input type="text"
          placeholder='write your message'
          className='border-2 border-zinc-500 p-2 w-full text-black'
          onChange={e => setMessage(e.target.value)} />

        <ul> {
          messages.map((mjs, index) => (
            <li key={index}
              className={`my-2 p-2 table text-sm rounded-md 
              ${mjs.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'}`}>
              <span className='text-xs text-slate-300 block'>{mjs.from}</span>
              <span className='text-md'>{mjs.body}</span>
            </li>
          ))
        }
        </ul>
      </form>
    </div>
  )

}

export default App