const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if session and authorization token exist
  if (
    !req.session ||
    !req.session.authorization ||
    !req.session.authorization.token
  ) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization["token"];

  // Verify JWT token using secret key "access"
  jwt.verify(token, "access", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    // Handle IBM Coursera lab variation (payload is often nested inside user.data)
    req.user = user.data || user.username || req.session.authorization.username;

    // Pass control to the next route handler
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
