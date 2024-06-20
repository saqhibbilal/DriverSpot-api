import express from "express";
import { Adduseraddress, Deleteuseraddress, Edituseraddress, Getuseraddress } from "../controllers/Adduseraddress.js";
import { Addcar, Deletecar, Editcar, Getcar } from "../controllers/Addusercar.js";
import { register, login, logout,driverregister, driverregister2, driverlogin, phonelogin } from "../controllers/auth.js";
import { driverbookings, Driverdata, Driverstatus, Editdriverdates, Notavilabledriverdates } from "../controllers/Driverdates.js";
import { Getbookingstatus } from "../controllers/Getbookingstatus.js";
import { getdrivers, getdriverslocation, searchDrivers } from "../controllers/getdrivers.js";
import { Editresponce, Getrequests, Getrequestsdriver, Requestdriver } from "../controllers/Requestdriver.js";
import { AcceptRide, Getimages, UploadRideImages } from "../controllers/Ride.js";

const router = express.Router();
router.post("/register", register);
router.post("/driverregister", driverregister);
router.post("/driverregister2", driverregister2);
router.post("/login", login);
router.post("/driverlogin", driverlogin);
router.post("/logout", logout);
router.post("/getdrivers", getdrivers);
router.post("/searchdrivers", searchDrivers);
router.post("/addusercar", Addcar);
router.post("/getusercar", Getcar);
router.post("/editusercar", Editcar);
router.post("/deletecar", Deletecar);
router.post("/adduseraddress", Adduseraddress);
router.post("/getuseraddress", Getuseraddress);
router.post("/edituseraddress", Edituseraddress);
router.post("/deleteuseraddress", Deleteuseraddress);
router.post("/requestdriver", Requestdriver);
router.post("/getrequests", Getrequests);
router.post("/getrequestsdriver", Getrequestsdriver);
router.post("/editrequestresponce", Editresponce);
router.post("/editdriverdates", Editdriverdates);
router.post("/getdriverslocation", getdriverslocation);
router.post("/getbookingstatus", Getbookingstatus);
router.post("/getdriverbookings", driverbookings);
router.post("/acceptrides", Driverstatus);
router.post("/driverdata", Driverdata);
router.post("/notavilabledriverdates", Notavilabledriverdates);
router.post("/acceptride", AcceptRide);
router.post("/uploadcarimages", UploadRideImages);
router.post("/getimages", Getimages);
router.post("/phonelogin", phonelogin);



export default router;
