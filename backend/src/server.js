import express from "express"
import notesRouter from "./routes/note_routes.js";
import connectDb from "./config/config.js"
import { limiter } from "./config/config.js";
import cors from 'cors'
import authRouter from "./routes/auth_routes.js";
import cookieParser from "cookie-parser"
import { isAuth } from "./middleware/auth_middleware.js";
import compression from "compression"

const app = express()

app.use(compression())

// app.use(cors({origin: 'http://localhost:5173',
//     credentials: true}));

app.use(express.json());
app.use(cookieParser());
app.use(limiter)

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/notes", isAuth);
app.use("/api/notes", notesRouter);

app.use("/api", authRouter);

app.listen(5000, () => {
    connectDb()
    console.log("Server started on port 5000")
})