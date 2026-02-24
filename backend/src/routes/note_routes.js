import express from "express"
import { getNote, getNotes, createNote, modifieNote, deleteNote, isLoggedIn } from "../controllers/notes_controller.js";


const notesRouter = express.Router()

notesRouter.get("/", getNotes);
notesRouter.get("/logged_in", isLoggedIn);
notesRouter.get("/:id", getNote);
notesRouter.post("/create", createNote);
notesRouter.put("/modify/:id", modifieNote);
notesRouter.delete("/delete/:id", deleteNote);

export default notesRouter;