require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./utils/firebaseServiceAccount.json");
const router = express.Router();

// firebase initialize
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "gs://mern-blog-2b7fa.appspot.com"
 });

// routes import
const auth = require("./routes/auth")
const blog = require("./routes/blog")
const category = require("./routes/category")

// DB CONNECTION
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB CONNECTED")
})


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api", auth)
app.use("/api", category)
app.use("/api", blog)

const port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log(`app is running at port ${port}`)
});