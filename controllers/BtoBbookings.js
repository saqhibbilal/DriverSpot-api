import { MongoClient, ObjectId} from 'mongodb';

const uri = "mongodb+srv://sunanthsamala7:MmQXJz6cCKld1vsY@users.lzhtx.mongodb.net/?retryWrites=true&w=majority&appName=users";
const client = new MongoClient(uri);
 
//get Requested Bookings List
export const getPendingBookings = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Partners");  
        const bookingsCollection = db.collection("bookings");

        const pendingBookings = await bookingsCollection
            .find({ booking_status: "waiting" })   
            .toArray();

        res.status(200).json({ success: true, data: pendingBookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    } 
    /*finally {
      await client.close();
    }*/
};


//accept Booking & Assign Driver also POC
export const acceptBooking = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Partners");
        const bookingsCollection = db.collection("bookings");

        const { bookingId, drivers, poc } = req.body; 

        const updateResult = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    booking_status: "completed",
                    drivers: Array.isArray(drivers) ? drivers : [drivers], 
                    poc: poc
                }
            }
        );

        res.status(200).json({ success: true, message: "Booking accepted successfully", updateResult });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    } finally {
        await client.close();
    }
};


//reject Booking & Store Rejection Reason
export const rejectBooking = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("Partners");
        const bookingsCollection = db.collection("bookings");

        const { bookingId, reason } = req.body;  

        const updateResult = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    booking_status: "cancelled",
                    rejection_reason: reason
                }
            }
        );

        res.status(200).json({ success: true, message: "Booking rejected successfully", updateResult });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    } finally {
        await client.close();
    }
};

//fetching Available Drivers
export const getAvailableDrivers = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("users");
        const driversCollection = db.collection("drivers");

        const availableDrivers = await driversCollection.find({ ridestatus: "true" }).toArray();

        res.status(200).json({ success: true, data: availableDrivers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    } finally {
        await client.close();
    }
};
