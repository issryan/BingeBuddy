const app = require('./src/app');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});