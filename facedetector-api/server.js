const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'Oscar',
        password: '',
        database: 'smart-brain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {

})

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db('login').select('hash').where({ email }).then(hash => {
        bcrypt.compare(password, hash[0], verify => {
            if (verify) {
                return db.select('*').from('users').where({ email })
                    .then(user => {
                        res.json(user[0])
                    }).catch(err => res.status(400).json('User not found'))
            } else {
                res.status(400).json('Invalid email/password combination')
            }
        })
    }).catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, saltRounds).then(hash => {
        db.transaction(trx => { //Generate transaction
            trx.insert({
                email: email,
                hash: hash
            }).into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                            joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0])
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        }) //transaction
            .catch(err => res.status(400).json('Could not register'))
    })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json("not found");
            }
        })
        .catch(err => res.status(400).json("error getting user"))
})


app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users')
        .returning('entries')
        .where({ id })
        .increment('entries', 1)
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('user not found'))
})

app.listen(3000, () => {
    console.log("Started server on port 3000")
})