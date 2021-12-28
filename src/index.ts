import express from 'express';
/* FOR DEV PURPOSES */
import http from 'http';
/* END DEV */
import https from 'https';
import twig from 'twig';
import * as fs from 'fs';
import morgan from 'morgan';
import * as path from 'path';
import { Application } from './routes/Application';
import { Authenticate } from './routes';

const app = express();
const router = express.Router();
const PORT = 3000;

process.title = 'congenial-lamp';

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(router);

const privateKey = undefined; //fs.readFileSync('/etc/letsencrypt/live/share.alesia-julianitow.ovh/privkey.pem');
const certificate = undefined; //fs.readFileSync('/etc/letsencrypt/live/share.alesia-julianitow.ovh/fullchain.pem');

const options = {
  key: privateKey,
  cert: certificate
};

let application: Application;
let authenticate: Authenticate;

app.set("twig options", {
  allow_async: true, // Allow asynchronous compiling
  strict_variables: false
});

router.get('/', (req, res) => {
  if(!req.query.token) {
    res.redirect('/login');
    return;
  }
  application = new Application();
  application.homeRoute(req, res);
});

router.get('/download', (req, res) => {
  if(application === undefined) {
    res.status(500).send('Internal server error');
    return;
  }
  application.downloadRoute(req, res);
});

router.get('/play', (req, res) => {
  if(!req.query.file) {
    res.status(400).send('Bad request');
    return;
  }
  application.streamRoute(req, res);
});

router.get('/login', (req, res) => {
  authenticate = new Authenticate(req, res);
  if(!req.query.name || !req.query.password) {
    authenticate.loginView();
  } else {
    authenticate.login();
  }
});

const server = https.createServer(options, app);
const devServer = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Express https server listening on port ${PORT}`);
});

devServer.listen(PORT+2, () => {
  console.log('dev server running on port', PORT+2);
});