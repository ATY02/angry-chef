import {useState} from 'react';
import './App.css';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${email}&password=${password}`,
            });
            const data = await response.json();
            setToken(data.access_token);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        setMessages([...messages, {text: inputText, isUser: true}]);
        setInputText('');

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({message: inputText}),
            });
            const data = await response.json();
            setMessages([...messages, {text: data.message, isUser: false}]);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleFetchUserData}>Fetch User Data</button>

                <div className="Chat-container">
                    <div className="Chat-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`Message ${message.isUser ? 'User-message' : 'Bot-message'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="Chat-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputText}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
