//loading environment variables into process.env
require("dotenv").config();
const cors = require('cors')

//requiring
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const privateRoutes = require("./routes/private");
const errorHandler = require("./middlewares/error")

//express app
const app = express();

//middleware
let whitelist = ['https://code-shareapp.vercel.app']; //white list consumers
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions)); //adding cors middleware to the express with above configurations
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/posts", postRoutes);
app.use("/api/user", authRoutes);
app.use("/api/private",privateRoutes);

app.use(errorHandler)


const port = process.env.PORT || 3001
//connect to database
mongoose
  .connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    //listen for requests only after we have connected to database
    app.listen(port, () => {
      console.log("Connected to database & Running on PORT " + port);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
  
//routes
app.get('/',(req,res)=>{
  res.json({message:"Routes starts at /api/posts/"});
})


