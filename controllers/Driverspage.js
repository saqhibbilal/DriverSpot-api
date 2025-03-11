import { MongoClient,ObjectId } from 'mongodb';

const uri = "mongodb+srv://sunanthsamala7:MmQXJz6cCKld1vsY@users.lzhtx.mongodb.net/?retryWrites=true&w=majority&appName=users";
const client = new MongoClient(uri);

export const getDriverDetailsAdmin = async (req, res) => {
    try {
        await client.connect();
        const database = client.db("users");
        const collection = database.collection("drivers");

        const { mobile, accountStatus } = req.body; 

        let query = {};
        if (mobile) query.mobile = mobile;
        if (accountStatus) query.accountStatus = accountStatus;

        const drivers = await collection.find(query, { projection: { password: 0 } }).toArray();
        if (drivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No drivers found matching the criteria.",
            });
        }

        res.status(200).json({
            success: true,
            data: drivers,
        });
    } catch (error) {
        console.error("Error fetching driver details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        await client.close();
    }
};

export const editDriverDetails = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("users");
        const driversCollection = db.collection("drivers");

        const { driverId, ...updateFields } = req.body;

        const result = await driversCollection.updateOne(
            { _id: new ObjectId(driverId) },
            { $set: updateFields }
        );

        await client.close();

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Driver not found or no changes made." });
        }

        res.json({ message: "Driver details updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateDriverChecklist = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("users");
        const driversCollection = db.collection("drivers");

        const { driverId, mobile, checklist } = req.body;  

        if (!driverId && !mobile) {
            await client.close();
            return res.status(400).json({ error: "Driver ID or Mobile number is required." });
        }

        if (!Array.isArray(checklist)) {
            await client.close();
            return res.status(400).json({ error: "Checklist must be an array." });
        }

        const query = driverId ? { _id: new ObjectId(driverId) } : { mobile };

         
        const checklistObject = checklist.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

         
        const allowedFields = ["AadharNumber", "PancardNumber", "Agreement", "Terms", "DateOfBirth", "Experience", "Languages"];
        allowedFields.forEach(field => {
            if (!checklist.includes(field)) {
                checklistObject[field] = false;
            }
        });

         
        const updateFields = { checklist: checklistObject };

        const result = await driversCollection.updateOne(
            query,
            { $set: updateFields }
        );

        await client.close();

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Driver not found." });
        }

        res.json({ message: "Driver checklist updated successfully!" });

    } catch (error) {
        console.error("Error updating driver checklist:", error);
        await client.close();
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//to be tested with partial updates as well