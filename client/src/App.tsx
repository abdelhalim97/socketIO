import { useState, useEffect, FormEventHandler } from "react";
import io from "socket.io-client";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNjQ2NjRlMDI0YmIzYTU2YmM1N2YyMmYwIiwiaWF0IjoxNjg0NDkxMTM0LCJleHAiOjE2OTIyNjcxMzR9.POxZJrJvhWM8g5ol2TEEEqql6v-iik6ouRbawRJY0oMs";

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    },
  },
};

const socket = io("http://localhost:3000", socketOptions);

function App() {
  const [messageReceived, setMessageReceived] = useState({
    message: "",
    owner: {},
  });
  const [message, setMessage] = useState("");
  const writingMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const sendMsg = () => {
    socket.emit("send_message", { message });
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data);
      console.log(data);
    });
  }, [socket]);
  return (
    <div className="App">
      <input placeholder="msg" onChange={writingMessage} value={message} />
      <button onClick={sendMsg}>msg</button>
      {messageReceived && <p>{messageReceived.message}</p>}
    </div>
  );
}

export default App;
