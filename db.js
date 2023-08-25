const mongoose = require('mongoose');

//const MONGODB_URI = 'mongodb://localhost:27017/myapp';
const MONGODB_URI = 'mongodb+srv://cn_grp3:cn_grp3@cluster0.bf5bawq.mongodb.net/?retryWrites=true&w=majority';


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
