if (process.env.NODE_ENV !== "product") {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); //boilerplate.ejs
const errorApp = require('./helper/errorApp');
const campRouter = require('./router/campgounds');
const reviewRouter = require('./router/reviews');
const userRouter = require('./router/users')
const User = require('./models/user')
const MongoDBStore = require('connect-mongo');
//security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const passport = require('passport');
const LocalStratery = require('passport-local');

const dataUrl = process.env.MDB_DATA_CONNECT ?? "mongodb://localhost:27017/yelp-camp"

mongoose.connect(dataUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DATABASE CONNECTION')
});

//security
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/nikini888/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate)

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs') // so you can render('.ejs')
app.set('views', path.join(__dirname, 'views'))

const secret = process.env.SECRET || "thisisasecretkey"
const store = MongoDBStore.create({
    mongoUrl: dataUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})

const sessionOption = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expiers: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionOption))
app.use(flash())

//thêm 2 midleware này vì express y/c
app.use(passport.initialize())
app.use(passport.session());

//sử dụng phương pháp xác định tĩnh của model
passport.use(new LocalStratery(User.authenticate()))
//chuyển đổi sang tĩnh và mã hóa
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.userLogin = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.get('/', (req, res) => {
    res.render("home")
})
app.use('/', userRouter)
app.use('/campgrounds', campRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    next(new errorApp("Page not found", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Something went wrong!"
    res.status(status).render('error', { err });
})

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log(`LISTEN ON ${port} PORT`)
})