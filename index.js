const express = require('express');
const fileUpload = require('express-fileupload');
const { PORT, connectDB } = require('./config/database');
const userRouter = require('./routers/userRouter');

connectDB();

const app = express();
const bodyParser = require('body-parser')

const cors = require('cors');

app.set('view engine', 'pug');
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload());
app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
