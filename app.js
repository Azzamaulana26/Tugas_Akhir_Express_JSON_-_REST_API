var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('req-flash');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kelasRouter = require('./routes/kelas');
var sessionRouter = require('./routes/session')

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
var productsRouter = require('./routes/products');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'iniadalahrahasiamu',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash());

app.use(flash());

//Auth JWT
app.post('/api/login', (req, res) => {
    const user = {
        id: Date.now(),
        userEmail: 'admin@mail.com',
        password: '123'
    }

    //Untuk generate token user
    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({
            token
        })
    })
});

app.get('/api/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.sendStatus(403);
        else {
            res.json({
                message: "Selamat Datang di Tugas Akhir ini",
                userData: authData
            });
        }
    });
});

//Verifikasi Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    //cek jika bearer kosong/tidak ada
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');

        //Get token 
        const bearerToken = bearer[1];

        //set the token
        req.token = bearerToken;

        //next middleware
        next();
    } else {
        //Jika tidak bisa akses mengarahkan ke halaman forbidden
        res.sendStatus(403);
    }
}

// tambahkan ini
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    next();
});

app.set('views', path.join(__dirname, 'src/views'));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/kelas', kelasRouter);
app.use('/session', sessionRouter);

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/products', productsRouter);

var kelas = [
    { id: 1, nama_kelas: "Backend" },
    { id: 2, nama_kelas: "Frontend" },
    { id: 3, nama_kelas: "Fullstack" }
]

app.get('/api/kelas', function(req, res) {
    try {
        res.json({ data: kelas });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

app.get('/api/kelas/:id', function(req, res) {
    try {
        const kls = kelas.find(k => k.id === parseInt(req.params.id));
        if (!kls) throw new Error(`ID Kelas ${req.params.id} tidak ditemukan`);
        res.status(200).json({ data: kls });
    } catch (err) {
        res.status(404).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

app.post('/api/kelas', function(req, res) {
    try {
        if (!req.body.nama_kelas) {
            // Menampilkan pesan error ketika field nama kelas kosong
            res.status(400).send("Nama kelas harus diisi");
            return;
        }

        const kls = {
            id: kelas.length + 1,
            nama_kelas: req.body.nama_kelas
        };
        kelas.push(kls);
        res.status(201).send(kls);
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

app.put('/api/kelas/:id', function(req, res) {
    try {
        const klas = kelas.find(k => k.id === parseInt(req.params.id));
        if (!klas) {
            res.status(404).send("Kelas tidak ditemukan");
            return;
        }

        if (!req.body.nama_kelas) {
            // Menampilkan pesan error ketika field nama kelas kosong
            res.status(400).send("Nama kelas harus diisi");
            return;
        }

        klas.nama_kelas = req.body.nama_kelas;
        res.status(200).json({ pesan: "Data berhasil diupdate.", data: klas });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

app.delete('/api/kelas/:id', function(req, res) {
    try {
        const klas = kelas.find(k => k.id === parseInt(req.params.id));
        if (!klas) {
            res.status(404).send("Kelas tidak ditemukan");
            return;
        }

        const index = kelas.indexOf(klas);
        kelas.splice(index, 1);
        res.status(200).json({ pesan: "Data berhasil dihapus.", data: klas });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

module.exports = app;