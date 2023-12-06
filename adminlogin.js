const express = require('express');
const path = require('path');
const app = express();
const mongo = require('./mongo');
const { ObjectId } = require('mongodb');

const admin = {
  uname: 'niyas',
  upass: 'admin123'
};

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Middleware to handle database connection
const connectToMongo = async (collectionName) => {
  const data = await mongo(collectionName);
  return data;
};

// Middleware to handle errors
const handleError = (res, message) => {
  res.status(500).send(message);
};

app.get('/', (req, res) => {
  res.render('admin', { err: null });
});

app.post('/adminlogin', (req, res) => {
  const { name, pass } = req.body;
  try {
    if (name === admin.uname && pass === admin.upass) {
      res.render('adminHome', { users: null, x: null });
    } else {
      res.render('admin', { err });
    }
  } catch (error) {
    handleError(res, 'Server not reachable');
  }
});

app.get('/userList', async (req, res) => {
  try {
    const data = await connectToMongo('userDetails');
    const users = await data.find().toArray();
    res.render('adminHome', { users, x: null });
  } catch (error) {
    handleError(res, 'Error fetching users');
  }
});

app.post('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const data = await connectToMongo('userDetails');
    const deluser = await data.findOne({ _id: new ObjectId(userId) });
    await data.deleteOne({ _id: new ObjectId(userId) });
    res.redirect('/userList');
  } catch (error) {
    handleError(res, 'Error deleting user');
  }
});

app.post('/edit/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
    const data = await connectToMongo('userDetails');
    await data.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { username, email } }
    );
    res.redirect('/userList');
  } catch (error) {
    handleError(res, 'Error editing user');
  }
});

app.get('/search', async (req, res) => {
  const { username } = req.query;
  try {
    const data = await connectToMongo('userDetails');
    const x = await data.findOne({ username });
    const users = await data.find().toArray();
    res.render('adminHome', { users, x });
  } catch (error) {
    handleError(res, 'Internal server error');
  }
});

app.listen(4000);
