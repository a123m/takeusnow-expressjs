const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routers/auth');
const homeRoutes = require('./routers/home');
const profileRoutes = require('./routers/profile');
const projectRoutes = require('./routers/project');
const browseRoutes = require('./routers/browse');
const paymentRoutes = require('./routers/payment');
const reviewRoutes = require('./routers/review');
const validationRoutes = require('./routers/validation');
const worldDataRoutes = require('./routers/worldCountry');
const notificationsRoutes = require('./routers/notifications');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //This parse JSON data to the server

app.use('/public', express.static(path.join(__dirname, 'public')));
//Function help to set headers of the requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/home', homeRoutes);
app.use('/profile', profileRoutes);
app.use('/project', projectRoutes);
app.use('/browse', browseRoutes);
app.use('/payment', paymentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/validation', validationRoutes);
app.use('/worlddata', worldDataRoutes);
app.use('/notifications', notificationsRoutes);

app.get('/', (req, res) => {
  res.status(200).send('<h1>hello</h1>');
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message ? error.message : 'Internal server error!';
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
  next();
});

try {
  const server = app.listen(process.env.PORT || 8080);
  const io = require('./socket').init(server);
  io.on('connection', () => {
    console.log('Client connected');
  });
} catch (err) {
  console.log(err);
}
