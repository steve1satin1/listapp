import { notesdb, usersdb } from "../config/config.js";

export async function getNotes (req, res) {
    try {
        const userid = req.userid;
        const notes = await notesdb.find({userid: userid}).sort({createdAt: -1})
        return res.status(200).json(notes)
    } catch (error) {
        console.log("Error at getNotes controller")
        return res.status(500).json({"Error": `${error}`})
    }
}

export async function getNote(req, res) {
    try {
        const id = req.params.id;
        const userid = req.userid
        const note = await notesdb.find({userid: userid, _id: id})
        
        if(!note) {
            console.log("Error at getNote controller the id is not in the database")
            return res.status(400).json({"Error": `The id provided: ${id} is not in the database`})
        }
        
        return res.status(200).json(note)
    } catch (error) {
        console.log("Error at getNote controller")
        return res.status(500).json({"Error": `${error}`})
    }
}

export async function createNote(req, res) {
    const {title, description, until} = req.body;
    let expiration = null

    if (until) {
        expiration = new Date(`${until}`)
    }

    try {
        const userid = req.userid
        await notesdb.create({
            title: title.trim(),
            description: description.trim(),
            until: expiration,
            userid: userid
        })
        return res.status(200).send("Note created");
    } catch (error) {
        console.log("Error at createNote controller")
        return res.status(500).json({"Error": `${error}`})
    }
}

export async function modifieNote(req, res) {
    const {title, description, until} = req.body;
    const id = req.params.id
    const userid = req.userid;

    let expiration = null;
    if (until) {
        expiration = new Date(`${until}`)
    } 

    try {
        const result = await notesdb.updateOne({_id: id, userid: userid}, {
            title: title,
            description: description,
            until: expiration
        })
        
        if(!result.modifiedCount) {
            console.log("Error at modifieNote controller the id is not in the database")
            return res.status(400).json({"Error": `The id provided: ${id} is not in the database`})
        }
        return res.status(200).send("Note updated")
    } catch (error) {
        console.log("Error at modifieNote controller")
        return res.status(500).json({"Error": `${error}`})
    }

}

export async function deleteNote(req, res) {
    const id = req.params.id;
    const userid = req.userid;

    try {
        const result = await notesdb.deleteOne({_id: id, userid: userid});
        
        if (!result.deletedCount) {
            console.log("Error at deleteNote controller the id is not in the database")
            return res.status(400).json({"Error": `The id provided: ${id} is not in the database`})
        }
        return res.status(200).send(`Deleted note with id: ${id}`);
    } catch (error) {
        console.log("Error at deleteNote controller")
        return res.status(500).json({"Error": `${error}`})
    }
}

export async function isLoggedIn(req, res) {
    console.log("Inside isLoggedIn")
    return res.status(200).send({"success": "User Logged in"})
}