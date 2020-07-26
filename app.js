const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const authRoutes = require("./routers/auth");
const homeRoutes = require("./routers/home");
const profileRoutes = require("./routers/profile");
const projectRoutes = require("./routers/project");
const browseRoutes = require("./routers/browse");
const myprofileRoutes = require("./routers/myprofile");
const portfolioRoutes = require("./routers/portfolio");
const swaggerDocument = require("./swaggerDoc");

const app = express();

app.use(express.static(__dirname + "./assets/"));

/* AMAN CHHABRA MULTER CODE */

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

/* KAUSHAL MULTER CODE */

var fileStorage = multer.diskStorage({
  destination: "./assets/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
var upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image"); // file is name ="filename" in field

app.use(bodyParser.json()); //This parse JSON data to the server

// app.use("/images", express.static(path.join(__dirname, "images")));
//Function help to set headers of the requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/profile", profileRoutes);
app.use("/project", projectRoutes);
app.use("/browse", browseRoutes);
app.use("/myprofile", myprofileRoutes);
app.use("/portfolio", portfolioRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>hello</h1>");
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
  next();
});
swaggerDocument(app);

try {
  const server = app.listen(process.env.PORT || 8080);
  const io = require("./socket").init(server);
  io.on("connection", () => {
    console.log("Client connected");
  });
} catch (err) {
  console.log(err);
}
