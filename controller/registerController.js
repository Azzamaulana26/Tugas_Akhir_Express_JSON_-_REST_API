const config = require('../library/database');
let mysql = require('mysql');
let pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    formRegister(req, res) {
        try {
            res.render("register", {
                url: 'http://localhost:3000/',
            });
        } catch (err) {
            console.error("Error rendering register form:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    saveRegister(req, res) {
        try {
            let username = req.body.username;
            let email = req.body.email;
            let password = req.body.pass;

            if (username && email && password) {
                pool.getConnection(function(err, connection) {
                    if (err) {
                        throw err;
                    }
                    connection.query(
                        `INSERT INTO user (username,email,password) VALUES (?,?,SHA2(?,512));`, [username, email, password],
                        function(error, results) {
                            connection.release();
                            if (error) {
                                throw error;
                            }
                            req.flash('color', 'success');
                            req.flash('status', 'Yes..');
                            req.flash('message', 'Registrasi berhasil');
                            res.redirect('/login');
                        }
                    );
                });
            } else {
                res.redirect('/login');
            }
        } catch (err) {
            console.error("Error during registration:", err);
            res.status(500).send("Internal Server Error");
        }
    }
}