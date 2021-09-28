const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL

// mongoose buffers model Options 
// Note : - that buffering is also responsible for waiting until Mongoose creates collections if you use the autoCreate option. 
// If you disable buffering, you should also disable the autoCreate option and use createCollection() to create capped collections 
//or collections with collations.

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 10000, 
    bufferMaxEntries : 0,
    bufferCommands: true,
    reconnectTries: 30,
    reconnectInterval: 500,
    poolSize: 1,
    socketTimeoutMS: 0,
    keepAlive: true
};

// connection to database 
// Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection to MongoDB.
// That's because mongoose buffers model function calls internally. This buffering is convenient, but also a common source of confusion.
// Mongoose will not throw any errors by default if you use a model without connecting.

exports.connect = () => {
  mongoose
    .connect(DB_URL, options)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};