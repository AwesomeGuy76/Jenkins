const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const mysql = require('./node_modules/mysql');
const db = mysql.createConnection(
    { host: 'reca1team-db-instance-1.c1eiqtt31v98.ap-northeast-2.rds.amazonaws.com', user: 'admin', password: 'Reca1team', database: 'reca' }
);

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to database');
});

app.post('/login', (req, res) => {
    const { id, pw } = req.body;

    const selectQuery = 'SELECT * FROM users WHERE id = ? AND pw = ?';

    db.query(selectQuery, [id, pw], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res
                .status(500)
                .json({ message: 'An error occurred' });
            return;
        }

        console.log(result[0]);
        if (result.length === 1) {
            res
                .status(200)
                .json( result[0] );
        } else {
            res
                .status(400)
                .json({ message: 'Login failed' });
        }
    });
});

app.post('/register', (req, res) => {
    const { name, id, pw, genre } = req.body;

    const insertQuery = 'INSERT INTO users (name, id, pw, genre) VALUES (?, ?, ?, ?)';

    db.query(insertQuery, [name, id, pw, genre], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res
                .status(500)
                .json({ error: 'An error occurred' });
            return;
        }
        res
            .status(201)
            .json({ message: 'Registration successful' });
    });
});

app.post('/checkid', (req, res) => {
    const { id } = req.body;

    const selectQuery = 'SELECT count(*) FROM users WHERE id = ?';

    db.query(selectQuery, [id], (err, result) => {
        if (err) {
            console.error('Error selecting data:', err);
            res
                .status(500)
                .json({ message: 'An error occurred' });
            return;
        }

        console.log(result);
        res
            .status(200)
            .json( result[0] );
    });
});

app.post('/insertbook', (req, res) => {
    const { id, book } = req.body;

    const insertQuery = 'INSERT INTO bookmark (id, book) VALUES (?, ?)';

    db.query(insertQuery, [id, book], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res
                .status(500)
                .json({ error: 'An error occurred' });
            return;
        }
        res
            .status(201)
            .json({ message: 'Registration successful' });
    });
});

app.post('/deletebook', (req, res) => {
    const { id, book } = req.body;

    const deleteQuery = 'DELETE FROM bookmark WHERE id = ? AND book = ?';

    db.query(deleteQuery, [id, book], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res
                .status(500)
                .json({ error: 'An error occurred' });
            return;
        }
        res
            .status(201)
            .json({ message: 'delete successful' });
    });
});

app.post('/selectbook', (req, res) => {
    const { id } = req.body;

    const selectQuery = 'SELECT book FROM bookmark WHERE id = ?';

    db.query(selectQuery, [id], (err, result) => {
        if (err) {
            console.error('Error selecting data:', err);
            res
                .status(500)
                .json({ message: 'An error occurred' });
            return;
        }

        console.log(result);
        res
            .status(200)
            .json( result );
    });
});

app.post('/getpw', (req, res) => {
    const { id } = req.body;

    const selectQuery = 'SELECT pw FROM users WHERE id = ?';

    db.query(selectQuery, [id], (err, result) => {
        if (err) {
            console.error('Error selecting data:', err);
            res
                .status(500)
                .json({ message: 'An error occurred' });
            return;
        }

        console.log(result);
        res
            .status(200)
            .json( result[0] );
    });
});


app.post('/modify', (req, res) => {
    const { name, pw, genre, id } = req.body;
    let updateQuery;
    let updateElement;
    if (pw === '') {
        updateQuery = 'UPDATE users SET name = ?, genre = ? WHERE id = ?';
        updateElement = [name, genre, id];
    } else {
        updateQuery = 'UPDATE users SET name = ?, pw = ?, genre = ? WHERE id = ?';
        updateElement = [name, pw, genre, id];
    }

    db.query(updateQuery, updateElement, (err, result) => {
        if (err) {
            console.error('Error selecting data:', err);
            res
                .status(500)
                .json({ message: 'An error occurred' });
            return;
        }

        console.log(result);
        res
            .status(200)
            .json( result );
    });
});



app.listen(8888, () => {
    console.log('Server is running on port 8888');
});
