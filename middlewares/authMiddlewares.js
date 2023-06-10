const jwt = require("jsonwebtoken");

const authentication = (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        try {
            const deocodedToken = jwt.verify(token.split(" ")[1],"masaischool");
            if(deocodedToken){
                req.body.adminId = deocodedToken.adminId;
                req.body.admin = deocodedToken.admin;
                next();
            }else{
                res.status(200).send({"message":"Please Login"})
            }
        } catch (error) {
            res.status(400).send({"message":error.message})
        }
    }else{
        res.status(200).send({"message":"Please Login"})
    }
}

module.exports={
    authentication,
}