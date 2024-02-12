import {useState} from 'react'
import './App.css'
import {Box, Container, TextField, Typography} from "@mui/material";

function App() {
    return (
        <Container sx={{
            position: 'fixed',
            bottom: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box sx={{
                width: 500,
                maxWidth: '100%',
            }}>
                <Typography variant={'h6'}>RamsayAI</Typography>
                <TextField id={'chat'} fullWidth/>
            </Box>
        </Container>
    )
}

export default App
