var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var stylus = require("stylus");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var boardRouter = require("./routes/board");
var articleRouter = require("./routes/article");
var responseRouter = require("./routes/response");
var session = require("express-session");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 3
    }
  })
);
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1/user", usersRouter);

/*Middleware to check user login*/
app.use(function(req, res, next) {
  if (req.session.authenticated === true) {
    return next();
  }
  return next(createError(403));
});

app.use("/api/v1/board", boardRouter);
app.use("/api/v1/article", articleRouter);
app.use("/api/v1/response", responseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
