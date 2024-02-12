import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import {
    Box,
    Container,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ReactMarkdown from 'react-markdown';

function App() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChatHistory = () => {
        axios.get('http://localhost:8000/chat/history')
            .then((response) => {
                setChatHistory(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setLoading(true);

        setMessages([...messages, {text: inputText, isUser: true}]);
        setInputText('');

        axios.post('http://localhost:8000/chat', null, {
            params: {
                message: inputText
            }
        })
            .then((response) => {
                setMessages([...messages, {text: response.data.message, isUser: false}]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        fetchChatHistory();
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handledKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <Container maxWidth={'md'}>
            <Paper>
                <Stack direction={'column'} spacing={1}>
                    {chatHistory.map((message, index) => (
                        <div key={index}>
                            <Box textAlign={'left'} m={1} p={1} bgcolor={'#f8f8f8'} borderRadius={1}>
                                <Typography variant={'h6'}>You</Typography>
                                <Typography variant={'body1'}>
                                    {message.message}
                                </Typography>
                            </Box>
                            <Box textAlign={'left'} m={1} p={1}>
                                <Typography variant={'h6'}>Ramsay</Typography>
                                <ReactMarkdown
                                    skipHtml={false}
                                    components={{
                                        p: ({children, ...props}) => (
                                            <Typography variant={'body1'} {...props}>{children}</Typography>
                                        )
                                    }}
                                >{message.response}</ReactMarkdown>
                            </Box>
                        </div>
                    ))}
                </Stack>
                <>
                    {loading && <LinearProgress color={'secondary'} sx={{borderRadius: 2}} />}
                    <Stack direction={'row'} spacing={1} sx={{p: 1}}>
                        <TextField
                            fullWidth
                            variant={'outlined'}
                            size={'small'}
                            placeholder={"Type your message..."}
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handledKeyPress}
                            color={'secondary'}
                        />
                        <Tooltip title={'Send'}>
                            <IconButton onClick={handleSendMessage} size={'medium≠'} disabled={loading}>
                                <ArrowCircleUpRoundedIcon fontSize={'inherit'}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </>
            </Paper>
        </Container>
    );
}

export default App;
