import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

//Importing routes
import authRoute from './routes/auth.js'
import branchRoute from './routes/branch.js'
import roomRoute from './routes/room.js'
import customerRoute from './routes/customer.js'

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory's path
const __dirname = path.dirname(__filename);

// App configuration
dotenv.config();

// App configuration
const port = process.env.PORT || 8020;

const app = express();


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
      ];
      // Allow requests with no origin (like mobile apps or CURL)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    credentials: true,
};

app.options(/^.*$/, cors(corsOptions));

// Middleware for using CORS
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json({limit:"50mb"}));

// Middleware to read cookies data
app.use(cookieParser());
app.use(express.urlencoded({limit:"50mb", extended: true }));


const connectDb = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to MongoDB successfully");
    } catch (err) {
      throw err;
    }
  };
  
  app.get("/", (req, res) => {
    res.send("Bahut maza aa raha hai 🥳");
  });
  
  
  // Notify MongoDB connection status
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });
  
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  
//Middleware
app.use('/api/auth',authRoute)
app.use('/api/branch',branchRoute)
app.use('/api/room',roomRoute)
app.use('/api/customer',customerRoute)

 // Middleware to catch errors
 app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMsg = err.message || "Something went wrong!";
  
    return res.status(errStatus).json({
      success: "false",
      status: errStatus,
      message: errMsg,
      stack: err.stack,
    });
  });
  
  app.listen(port, () => {
    connectDb();
    console.log(`App is listening on port: ${port}`);
 });