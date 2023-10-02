const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
//const io = socketIo(server);
require("dotenv").config();

const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(4000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let reservationSchema, workstationSchema;
let Reservation, Workstation;

try {
  // Connect to MongoDB
  mongoose.connect(
    process.env.MONGODB_LOCAL_URI || process.env.MONGODB_ATLAS_URI || "mongodb://localhost:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // Define MongoDB schemas
  reservationSchema = new mongoose.Schema(
    {
      timestamp: Date,
      reservationStart: Date,
      reservationEnd: Date,
      workstationId: mongoose.Schema.Types.ObjectId,
      userId: Number,
    },
    {
      timeseries: {
        timeField: "timestamp",
        granularity: "days",
      },
      expireAfterSeconds: 432000,    // expires after 5 days (max book-ahead period)
    }
  );

  workstationSchema = new mongoose.Schema({
    name: String,
    xPos: Number,
    yPos: Number,
  });

  // Define MongoDB models
  Reservation = mongoose.model("Reservation", reservationSchema);
  Workstation = mongoose.model("Workstation", workstationSchema);
} catch (e) {
  console.log("Mongodb Error!", e);
}

// get all workstations
app.get("/api/workstations", async (req, res) => {
  try {
    const workstations = await Workstation.find().sort({ name: 1 }).exec();

    res.json(workstations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error getting workstations", details: `${error}` });
  }
});

// get all reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Workstation.find().sort({ timestamp: 1 }).exec();

    res.json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error getting reservations", details: `${error}` });
  }
});

// get reservations for a workstation
app.get("/api/reservations/:workstationId", async (req, res) => {
  try {
    const workstationId = req.params.workstationId;

    // Query the database to find reservations for the specified workstation
    const reservations = await Reservation.find({ workstationId });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Error getting reservations for workstation",
        details: `${error}`,
      });
  }
});

// add reservations to a workstation
app.post("/api/reservations", async (req, res) => {
  const { userId, reservationStart, reservationEnd, workstationId } = req.body;

  try {
    const reservation = new Reservation({
      timestamp: new Date(),
      reservationStart,
      reservationEnd,
      workstationId,
      userId,
    });

    await reservation.save();
    res.status(201).json({ message: "Reservation added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding reservation", details: `${error}` });
  }
});

// WebSocket connections and events
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle WebSocket events here
  // For example, you can send real-time updates to clients when a reservation is added or removed

  // Example: Send a message to all clients when a reservation is added
  socket.on("reservationAdded", (data) => {
    console.log("A reservation was added");
    io.emit("reservationAdded", data);
  });

  // Example: Send a message to all clients when a reservation is removed
  socket.on("reservationRemoved", (data) => {
    console.log("A reservation was removed");
    io.emit("reservationRemoved", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const port = process.env.API_PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
