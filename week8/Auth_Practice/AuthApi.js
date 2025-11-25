const express = require("express");
const path = require("path");

// These are imported from your Auth Service but they need to be implemented!
// Check out services/Auth.js
const { signUpUser, signInUser, signOutUser } = require("./services/Auth");

const app = express();
const port = 3000;

// Parse JSON request bodies
app.use(express.json());

/* ===========================
      AUTH ROUTES (TO BE IMPLEMENTED)
   =========================== */

// Signup
app.post("/api/auth/signup", async (req, res) => {
  // TODO: Call your authentication service - signUpUser()
  try{
    const{ username, password} = req.body;

    if(!username || !password){
      return res.status(400).json({ errorMessage: 'Bad request: missing username or password'})
    }

    const { data, error } = await supabase.auth.signUp({
      username,
      password
    });

    if (error) {
      return res.status(400).json({ errorMessage: `Bad request: ${error.message}`})
    }

  }
});

// Login
app.post("/api/auth/signin", async (req, res) => {
  // TODO: Call your authentication service - signInUser()
});

// Logout
app.post("/api/auth/signout", async (req, res) => {
  // TODO: Call your authentication service - signOutUser()
});

/* ===========================
      FRONTEND ROUTES
   =========================== */

// serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// serve home page
// Currently, this is not a protected route but in an actual application
// you would need to use an authentication middleware to prevent unauthenticated
// users from accessing this route.

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// serve registration page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
