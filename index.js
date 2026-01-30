import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import { connect } from "./mongo_connection/connection.js";
import { userData } from "./schema/userschema.js";
import e from "express";

dotenv.config();

// connect to DB FIRST
await connect();

const app = express();
const PORT = process.env.PORT || 3000;

// recreate __dirname (ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userData.findOne({ email });
    if (existingUser) {
      return res.sendFile(
  path.join(__dirname, "public", "user-exists.html")
);
    }

    await userData.create({ username, email, password });

    res.sendFile(path.join(__dirname, "public", "success.html"));
  } catch (err) {
    console.error(err);
    res.status(400).send("Signup failed");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userData.findOne({ email, password });

  if (!user) {
    return res.sendFile(
  path.join(__dirname, "public", "invalid-credentials.html")
);

  }
  res.render("welcome", { username: user.username });

});

// start server LAST
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
