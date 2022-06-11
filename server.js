//required Packages ..............
const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config();

// DB Required ..........................................
require("./DB/config");

// express function use..................................
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Templete engine ......................................
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

// routes ................................................
app.use(require("./router/routes"));

// server ................................................
const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
    console.log(`SERVER PORT = http://localhost:${PORT}`);
});