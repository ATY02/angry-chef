import {
    Box,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";

const Home = () => {
    return <div>
        <img src="../../public/ramsay_bot.png" style={{height: 500}}/>
        <Typography variant="h2">
            Welcome to the Gordon Ramsay AI cooking assistant!
        </Typography>
        <br></br>
        <Typography variant="h4">
            Also known as the angry cooking bot
        </Typography>
        </div>
}

export default Home;