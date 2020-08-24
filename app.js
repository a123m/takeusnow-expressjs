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
const swaggerDocument = require('./swaggerDoc');
const validationRoutes = require('./routers/validation');

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

app.get('/', (req, res) => {
  res.status(200).send('<h1>hello</h1>');
});

app.get('/forget', (req, res) => {
  res
    .status(200, { 'Content-Type': 'application/json' })
    .send(
      '<form method= "post" action="/validation/emailval"> <label> Enter new password </label> <input class="form-control" id="email" name="email" placeholder="email" type="text" > <label> Confirm new password </label> <input class="form-control" id="userID" name="userID" placeholder="email" type="text" > <button type="submit" >register</button> </form>'
    );
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
swaggerDocument(app);

try {
  const server = app.listen(process.env.PORT || 8080);
  const io = require('./socket').init(server);
  io.on('connection', () => {
    console.log('Client connected');
  });
} catch (err) {
  console.log(err);
}
