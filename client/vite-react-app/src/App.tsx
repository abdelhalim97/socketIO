import { useState, useEffect, FormEventHandler } from 'react'
import io from 'socket.io-client'
const socket = io('http://localhost:3001')

function App() {
  const [messageReceived, setMessageReceived] = useState('')
  const [message, setMessage] = useState('')
  const writingMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }
  const sendMsg = () => {
    socket.emit('send_message', { message })
  }
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(data.message)
    })
  }, [socket])
  return (
    <div className="App">
      <input placeholder='msg' onChange={writingMessage} value={message} />
      <button onClick={sendMsg} >msg</button>
      {messageReceived && <p>{messageReceived}</p>}
    </div>
  )
}

export default App
