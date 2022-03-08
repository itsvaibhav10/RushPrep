// ---------------   Models  ---------------
const User = require('./models/user');

// ---------------   Module Imports  ---------------
const path = require('path');
const express = require('express');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const compression = require('compression');
const helmet = require('helmet');
const csrf = require('csurf');
const multer = require('multer');
const dotenv = require('dotenv');

const errorController = require('./controllers/error');

dotenv.config();

// Multer Orignal File Storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

// Type Filter For Book Cover
function fileFilter(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// App Created
const app = express();

// Connection String
const MONGODB_URI = process.env.mongoUri;

// Session Database Setup
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// Templating Engine Set
app.set('view engine', 'ejs');
app.set('views', 'views');

// Secure Headers
app.use(helmet());
app.use(compression());

// Parsing Content
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: 'uploadDoc', maxCount: 5 },
  ])
);

// Static Files Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'practice from previous year question papers',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// CSRF Protection
app.use(csrf());
app.use(flash());

// Setup logged in User Globally
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    next(new Error(err));
  }
});

// Passing Arguments to all Views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn ? req.user : false;
  res.locals.csrfToken = req.csrfToken();  
  next();
});

// Routes Set
// Routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

app.use('/admin', adminRoutes);
app.use(homeRoutes, authRoutes);

// Error Routes
app.get('/500', errorController.get500);
app.use(errorController.get404);

// Error Controller
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    error: err,
    isAuthenticated: req.session ? req.session.isLoggedIn : false,
  });
});

// Server Running
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((result) => {
    if (!result) {
      console.log('NotConnected!');
    }
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Connected to Port ${PORT} in ${process.env.NODE_ENV} Mode`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
