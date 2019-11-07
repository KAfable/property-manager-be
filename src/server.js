const express = require("express");

const app = express();

// routers

const namesRouter = require('./routers/nameTestRouter');

// applying endpoint routers

app.use('/api/names', namesRouter);

app.get("/hello", (_req, res) => {
  res.send("Hello, world");
});

module.exports = app;
