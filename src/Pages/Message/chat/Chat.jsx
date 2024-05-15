import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef } from "react";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([
        // {
        //     id: 1,
        //     own: false,
        //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        //     timestamp: "1 min ago",
        //     img: "../message_assets/avatar.png"
        // },
        {
            id: 2,
            own: true,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            timestamp: "1 min ago",
            img: ""
        },
        // {
        //     id: 1,
        //     own: false,
        //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        //     timestamp: "1 min ago",
        //     img: "../message_assets/avatar.png"
        // },
        // {
        //     id: 1,
        //     own: false,
        //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        //     timestamp: "1 min ago",
        //     img: "../message_assets/avatar.png"
        // },

        // Add more initial messages if needed
    ]);

    const bottomRef = useRef(null);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSendMessage = () => {
        if (text.trim() !== "") {
            const newMessage = {
                id: messages.length + 1,
                own: true,
                content: text,
                timestamp: "just now",
                img: ""
            };
            setMessages([...messages, newMessage]);
            setText("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src="../message_assets/avatar.png" alt="User Avatar" />
                    <div className="texts">
                        <span>Carl Asoy</span>
                        {/* <p>service provider</p> */}
                    </div>
                </div>
                <div className="icons">
                    {/* <img src="../message_assets/phone.png" alt="Phone Icon" />
                    <img src="../message_assets/video.png" alt="Video Icon" /> */}
                    <img src="../message_assets/info.png" alt="Info Icon" />
                </div>
            </div>
            <div className="center">
                {messages.map(msg => (
                    <div className={`message ${msg.own ? 'own' : ''}`} key={msg.id}>
                        {!msg.own && <img src={msg.img} alt="Avatar" />}
                        <div className="texts">
                            <p>{msg.content}</p>
                            <span>{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="../message_assets/img.png" alt="Image Icon" />
                    {/* <img src="../message_assets/camera.png" alt="Camera Icon" />
                    <img src="../message_assets/mic.png" alt="Mic Icon" /> */}
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <div className="emoji">
                    <img src="../message_assets/emoji.png" alt="Emoji Icon" onClick={() => setOpen(prev => !prev)} />
                    {open && (
                        <div className="picker">
                            <EmojiPicker onEmojiClick={handleEmoji} style={{ width: '250px', height: '350px' }} />
                        </div>
                    )}
                </div>
                <button className="sendButton" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
