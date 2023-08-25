const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDB = require('./db');
const client = require('./redis');
const { User, Post } = require('./models');


// process.env.MONGODB_URI = 'mongodb://localhost:27017/myapp';
process.env.MONGODB_URI = 'mongodb+srv://cn_grp3:cn_grp3@cluster0.bf5bawq.mongodb.net/?retryWrites=true&w=majority';
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

// Routes for users

app.get('/', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/users', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Missing fields' });
  }

  // Check if the email is already used by any user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ message: 'Email already used by another user' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, mobile, password: hashedPassword });
  await user.save();

  res.send({ message: 'User created successfully' });
});


app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" })
    }
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
})




app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Missing fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, mobile, password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send({ message: 'Invalid user ID' });
    }

    res.status(500).send({ message: 'Internal server error' });
  }
});



// Routes for posts

app.get('/posts', authenticateToken, async (req, res) => {
  const userId = req.user._id; // get the user ID from the authenticated token
  const posts = await Post.find({ createdBy: userId }).populate('createdBy', 'name email');
  res.send(posts);
});


app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ _id: user._id }, '12345');
  res.send({ token });
});



app.post('/posts', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const createdBy = req.user._id;

  const post = new Post({ message, createdBy });
  await post.save();

  res.send({ message: 'Post created successfully' });
});


app.delete('/posts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
   
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'You are not authorized to delete this post' });
    }

    await Post.deleteOne({_id: id});

    res.send({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(404).send({ message: 'Invalid post id' });
    }
    res.status(500).send({ message: 'An error occurred while deleting the post' });
  }
});




app.put('/posts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: 'Invalid post id' });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).send({ message: 'Post not found' });
  }

  if (post.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send({ message: 'You are not authorized to update this post' });
  }

  post.message = message;
  post.updatedAt = Date.now();
  await post.save();

  res.send(post);
});




// Authentication middleware

function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token) {
return res.status(401).send({ message: 'Missing token' });
}
jwt.verify(token, '12345', (err, user) => {
    if (err) {
    return res.status(403).send({ message: 'Invalid token' });
    }
req.user = user;
next();
});
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

