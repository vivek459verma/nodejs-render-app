const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

dotenv.config();
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => console.error("Could not connect to mongoDB", err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create model for the schema.
const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/signup", (req, res) => {
  res.send(`
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
      }

      form {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      input,
      button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1em;
      }

      button {
        background-color: #007bff;
        color: #ffffff;
        border: none;
      }

      button:hover {
        background-color: #0056b3;
      }
    </style>

    <form action="/signup" method="post">
      <input type="text" id="username" name="username" placeholder="Username" />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
      />
      <button type="submit" id="submit">Sign up</button>
    </form>
    `);
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  if (!username) {
    return res.send('<div id="error-message">Username is required</div>');
  }

  if (!password) {
    return res.send('<div id="error-message">Password is required</div>');
  }

  const user = new User({
    username,
    password,
  });

  try {
    await user.save();
  } catch (error) {
    console.error(error);
    return res.send('<div id="error-message">Something went wrong</div>');
  }

  return res.send(
    '<div id="success-message">User signed up successfully</div>'
  );

  //   if (password == "Viv459ek@") {
  //     return res.send(
  //       '<div id="success-message">User signed up successfully</div>'
  //     );
  //   } else {
  //     return res.send(
  //       '<div id="weak">Password must be between 4 and 12 characters and contain a special character</div>'
  //     );
  //   }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
