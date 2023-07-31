import express, { Router } from "express";
import Cors from 'cors';
import bodyParser from "body-parser";
import Connect from "./connection.js";
import router from './Router/routes.js';

const app = express();
const PORT = process.env.PORT || 9001;

app.use(express.json());
app.use(express.urlencoded());
app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter = Router(); // Create a new instance of Router

app.get('/', () => {
    console.log('server is connected !');
});

 
apiRouter.get('/example', (req, res) => {
    res.send('This is an example route.');
});

app.use('/api', apiRouter); // Attach the router to the app

Connect().then(() => {
    app.listen(PORT, async () => {
        console.log("server is connected at " + PORT);
    });
}).catch((e) => {
    console.log("failed to connect server " + e);
});

app.use('/api', router);
