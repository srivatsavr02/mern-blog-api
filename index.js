const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multerUpload = require("./middleware/multer");
const { createAndUploadFile, auth } = require("./middleware/drive");
const verify = require("./middleware/verify");

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({ origin: true }));

mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));


app.post(
    "/api/upload",
    verify,
    multerUpload().single("file"),
    async (req, res) => {
        await createAndUploadFile(req, auth);
        console.log("File uploaded to drive. File Id >>> " + req.fileId);
        res.status(200).json({ fileId: req.fileId });
    }
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.listen(process.env.PORT || "5000", () => {
    console.log("Backend is running");
});
