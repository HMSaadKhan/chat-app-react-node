import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

// eslint-disable-next-line react/prop-types
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toISOString(),
      };

      // eslint-disable-next-line react/prop-types
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    socket.on("receive_message", (data) => {
      console.log({ data });

      // Check if the received message is not sent by the current user
      if (data.author !== username) {
        setMessageList((list) => [...list, data]);
        console.log({ messageList });
      }
    });
    // eslint-disable-next-line react/prop-types
    socket.on("disconnect", () => {
      // eslint-disable-next-line react/prop-types
      console.log(socket.connected); // false
    });
  }, []);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <div
                key={messageContent.time}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
