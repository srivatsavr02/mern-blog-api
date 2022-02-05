const jwt = require("jsonwebtoken");

const verify = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if (!authHeader) 
        return res.status(401).json("Access Denied");
        
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch {
        res.status(400).send("Invalid Token");   
    }  
};

module.exports = verify;