import jsonwebtoken from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config();


export function isAuth(req, res, next) {
    // Get token from cookies
    const token = req.cookies.jwt_token;

    // Verif token
    jsonwebtoken.verify(token, process.env.JWTSECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({"Error": "Please Register and then try to log in"});
        }
        const userid = decoded.userid;
        req.userid = userid;
        next();
    })
}