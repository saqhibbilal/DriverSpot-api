import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { createServer } from "http";
 // Import createServer from http module
import { Server } from "socket.io"; // Import Server from socket.io
import { Addcar, Deletecar, Editcar, Getcar } from "./controllers/Addusercar.js";
import { driverdashboard, editdriveraccount, getdriverbyaccount, getdriverbymobile, getdrivers, getdriverslocation, searchDrivers } from "./controllers/getdrivers.js";
import { driverlogin, driverregister,  logout, phonelogin,  } from "./controllers/auth.js";
import { Adduseraddress, Deleteuseraddress, Edituseraddress, Getuseraddress } from "./controllers/Adduseraddress.js";
import { createBulkBooking, Editresponce, Getfilterrequests, Getrequests, Getrequestsdriver, Requestdriver } from "./controllers/Requestdriver.js";
import { driverbookings, Driverdata, Driverstatus, getallbookings, getbulkbookings, getDriverDetails, ongoingride, startedride, updateRideStatus } from "./controllers/Driverdates.js";

import { AcceptRide, Getimages, UploadRideImages } from "./controllers/Ride.js";
import { Editprofile, Getprofile, Getusers, getalluserbookings } from "./controllers/Userprofilr.js";
import { Getbookingdetails, Getsharedrides, Shareride, Updateuserlocation } from "./controllers/Sharedrides.js";
import { MongoClient } from 'mongodb';
import { Partnerlogin, Partnerregister } from "./controllers/Partner.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update this to your frontend's origin for production
    methods: ["GET", "POST"],
  },
});
const uri ="mongodb+srv://sunanthsamala7:MmQXJz6cCKld1vsY@users.lzhtx.mongodb.net/?retryWrites=true&w=majority&appName=users"
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/",(req,res)=>{
  res.send("hello welcome")
})
app.post("/getusercar",Getcar);
app.post("/getdriverslocation", getdriverslocation);
app.post("/driverregister", driverregister);
app.post("/login", phonelogin);
app.post("/driverlogin", driverlogin);
app.post("/logout", logout);
app.post("/getdrivers", getdrivers);
app.post("/searchdrivers", searchDrivers);
app.post("/addusercar", Addcar);
app.post("/getusercar", Getcar);
app.post("/editusercar", Editcar);
app.post("/deletecar", Deletecar);
app.post("/adduseraddress", Adduseraddress);
app.post("/getuseraddress", Getuseraddress);
app.post("/edituseraddress", Edituseraddress);
app.post("/deleteuseraddress", Deleteuseraddress);
app.post("/requestdriver", Requestdriver);
app.post("/getrequests", Getrequests);
app.post("/getrequestsdriver", Getrequestsdriver);
app.post("/editrequestresponce", Editresponce);
app.post("/getdriverslocation", getdriverslocation);
app.post("/getdriverbookings", driverbookings);
app.post("/acceptrides", Driverstatus);
app.post("/driverdata", Driverdata);
app.post("/acceptride", AcceptRide);
app.post("/uploadcarimages", UploadRideImages);
app.post("/getimages", Getimages);
app.post("/phonelogin", phonelogin);
app.post("/editprofile", Editprofile);
app.post("/getprofile", Getprofile);
app.post("/getfilterrequests", Getfilterrequests);
app.post("/getusers", Getusers);
app.post("/getsharedrides", Getsharedrides);
app.post("/shareride", Shareride);
app.post("/updateuserlocation", Updateuserlocation);
app.post("/getbookingdetails", Getbookingdetails);
app.post("/getdriverbymobile", getdriverbymobile);
app.post("/getdriverbyaccount", getdriverbyaccount);
app.post("/editdriveraccount", editdriveraccount);
app.post("/startedride", startedride);
app.post("/getallbookings", getallbookings);
app.post("/driverdashboard", driverdashboard);
app.post("/ongoingride", ongoingride);
app.post("/createbulkbooking", createBulkBooking);
app.post("/getbulkbookings", getbulkbookings);
app.post("/partnerlogin", Partnerlogin);
app.post("/partnerregister", Partnerregister);
app.post("/getdriverdetails", getDriverDetails);
app.post("/updateRideStatus", updateRideStatus);
app.post("/getalluserbookings", getalluserbookings);
const client = new MongoClient(uri);
async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();

    console.log("Connected to MongoDB!");
    server.listen(4003, () => {
  console.log("Connected!");
});
    // Perform operations (example: list databases)
    const database = client.db("users");
    const collection = database.collection("user cars");

  
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    // Ensure the client will close when you finish
    await client.close();
  }
}
connectToMongoDB();

// Store active sessions
const userSockets = new Map();
const driverSockets = new Map();
const rideSessions = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Existing connection handlers
  socket.on('userConnected', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  socket.on('driverConnected', (driverId) => {
    driverSockets.set(driverId, socket.id);
    console.log(`Driver ${driverId} connected with socket ID: ${socket.id}`);
  });

  // Existing booking request handler
  socket.on('bookingRequest', (bookingData) => {
    try {
      console.log("Booking request received:", bookingData);

      // First check if bookingData exists
      if (!bookingData) {
        console.error("No booking data received");
        return;
      }

      // Safely parse driver IDs with error handling
      let driverIds = [];
      try {
        driverIds = bookingData.driverids ? JSON.parse(bookingData.driverids) : [];
        console.log("Parsed driver IDs:", driverIds);
      } catch (parseError) {
        console.error("Error parsing driver IDs:", parseError);
        return;
      }

      // Validate driver IDs array
      if (!Array.isArray(driverIds) || driverIds.length === 0) {
        console.error("Invalid or empty driver IDs array");
        return;
      }
      const pickup = JSON.parse(bookingData.pickup)
      const destination=JSON.parse(bookingData.destinationp)
      const newBooking = {
        u_id: bookingData.uid,
        d_id: driverIds,
        booking_status: bookingData.bookingstatus,
        startlocation: pickup,
        destination: destination,
        price: bookingData.price,
        car: bookingData.carname,
        cartype: bookingData.cartype,
        transmission: bookingData.transmission,
        registrationNo: bookingData.registrationNo,
        triptype: bookingData.triptype,
        username: bookingData.mobileno,
        bookingtype: bookingData.bookingtype,
        ride_distance: bookingData.distance,
        Expected_time: bookingData.time,
        booking_time: bookingData.bookingtime,
        booking_date: bookingData.bookingdate,
        requestedat: bookingData.requestedAt,
        booking_id: bookingData.bookingid
      };

      console.log("Processed booking data:", newBooking);

      // Send booking to each driver
      driverIds.forEach(driverId => {
        if (driverSockets.get(driverId)) {
          io.to(driverSockets.get(driverId)).emit('newBooking', newBooking);
          console.log("sent data ",newBooking)
          console.log(`Sent booking to driver ${driverId}`);
        } else {
          console.warn(`Driver ${driverId} not connected`);
        }
      });

    } catch (error) {
      console.error("Error processing booking request:", error.message);
      console.error("Error stack:", error.stack);
    }
  });

  // Existing driver response handler
  socket.on('driverResponse', (response) => {
    try {
      console.log('Received driver response:', response);

      const userSocketId = userSockets.get(response.userId);
      console.log('User socket ID:', userSocketId);
      console.log('All user sockets:', userSockets);

      if (userSocketId) {
        // Emit to specific user
        io.to(userSocketId).emit('driverResponseToUser', {
          status: response.status,
          driverName: response.driverName,
          accepted: response.accepted,
          userId: response.userId,
          booking_id: response.bookingid,
          driverid: response.driverId,
          // Add any other necessary data
        });

        // Verify emission
        const userSocket = io.sockets.sockets.get(userSocketId);
        console.log('Is user socket connected?', userSocket?.connected);
      } else {
        console.warn('User socket not found for ID:', response.userId);
      }
    } catch (error) {
      console.error('Error sending driver response:', error);
    }
  });

  // New ride tracking handlers
  socket.on('joinRideRoom', (data) => {
    try {
      const { bookingId, userId, driverId } = data;
      console.log('Joining ride room:', { bookingId, userId, driverId });

      socket.join(`ride_${bookingId}`);
      rideSessions.set(bookingId, {
        userId,
        driverId,
        socketId: socket.id,
        status: 'WAITING'
      });
    } catch (error) {
      console.error('Error joining ride room:', error);
    }
  });

  socket.on('updateDriverLocation', (data) => {
    try {
      const { bookingId, latitude, longitude } = data;
      io.to(`ride_${bookingId}`).emit('driverLocationUpdate', {
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  });

  socket.on('driverReachedPickup', (data) => {
    try {
      
      const { bookingId } = data;
      io.to(`ride_${bookingId}`).emit('driverReachedPickup', {
        bookingId,
        timestamp: new Date().toISOString()
      });
      console.log("driverReachedPickup",bookingId)
    } catch (error) {
      console.error('Error handling driver arrival:', error);
    }
  });

  socket.on('startRide', async (data) => {
    try {
      const { bookingId } = data;
      const client = new MongoClient(uri);
      await client.connect();
      
      await client.db("users").collection("bookings").updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { booking_status: "ongoing" } }
      );

      io.to(`ride_${bookingId}`).emit('rideStarted', {
        bookingId,
        timestamp: new Date().toISOString()
      });

      await client.close();
    } catch (error) {
      console.error('Error starting ride:', error);
    }
  });

  socket.on('completeRide', async (data) => {
    try {
      const { bookingId } = data;
      const client = new MongoClient(uri);
      await client.connect();
      
      await client.db("users").collection("bookings").updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { booking_status: "completed" } }
      );

      io.to(`ride_${bookingId}`).emit('rideCompleted', {
        bookingId,
        timestamp: new Date().toISOString()
      });

      rideSessions.delete(bookingId);
      await client.close();
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  });

  // Enhanced disconnect handler
  socket.on('disconnect', () => {
    try {
      console.log('Client disconnected:', socket.id);

      // Clean up user sockets
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
        }
      }

      // Clean up driver sockets
      for (const [driverId, socketId] of driverSockets.entries()) {
        if (socketId === socket.id) {
          driverSockets.delete(driverId);
        }
      }

      // Clean up ride sessions
      for (const [bookingId, session] of rideSessions.entries()) {
        if (session.socketId === socket.id) {
          rideSessions.delete(bookingId);
        }
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

export default app;