const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes:
//user routes
const userRoutes=require('./routes/userRoutes')
app.use('/user',userRoutes)
//admin routes
const adminRoutes=require('./routes/adminRoutes')
app.use('/admin',adminRoutes)
// recipe routes
const recipeRoutes=require('./routes/recipeRoutes')
app.use('/recipe',recipeRoutes)
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
