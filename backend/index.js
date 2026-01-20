if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const cors = require('cors');


const Client = require('./types/client');
const productsRoutes = require('./router/products');
const reviewsRoutes = require('./router/reviews');
const clientRoutes = require('./router/client');
const contactRoutes = require('./router/contactUs');

const expressError = require('./helper/expressError');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/grooming';

mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({ replaceWith: '_' }));

const secret = process.env.SECRET || 'this_is_a_secret';
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
    collection: 'sessions'
});
store.on('error', e => console.log('Session store error', e));

app.use(session({
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));


app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'", "https: data:"],
            "script-src": ["'self'", "http: data:"]
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.use('/products', productsRoutes);
app.use('/products/:id/reviews', reviewsRoutes);
app.use('/clients', clientRoutes);
app.use('/contactUs', contactRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to petSwap API', signedClient: req.user || null });
});

app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
