import {
    Box,
    Typography,
} from "@mui/material";

const Home = () => {
    return (
        <Box sx={{textAlign: 'center', paddingTop: 12}}>
            <img src="../../public/ramsay_bot.png" style={{height: 500}}/>
            <Typography variant={'h3'}>
                Welcome to the Gordon Ramsay AI cooking assistant!
            </Typography>
            <br></br>
            <Typography variant={'h6'}>
                Also known as the angry cooking bot
            </Typography>
        </Box>
    );
}

export default Home;