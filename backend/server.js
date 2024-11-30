const app = require('./src/app');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const corsOptions = {
    origin: ['https://bingebuddys.netlify.app', 'http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});