require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "http://localhost:5173" } });

app.use(express.json());
app.use(cors());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User created successfully!" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, username: user.username });
});

// Message Schema
const MessageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", MessageSchema);

// WebSocket Logic
io.on("connection", (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  // Load previous messages from MongoDB
  Message.find().then((messages) => {
    socket.emit("loadMessages", messages);
  });

  // Listen for incoming messages
  socket.on("sendMessage", async (msg) => {
    console.log("📩 Received message:", msg); // ✅ Debug log
    const message = new Message({ sender: msg.sender, message: msg.text });

    try {
      await message.save();
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("❌ Message Save Error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
