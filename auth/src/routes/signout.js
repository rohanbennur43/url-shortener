let express = require("express")

let router = express.Router()

router.post("/api/users/signout",(req,res)=>{
    console.log("Received request to logout the user")
    req.session = null;
    res.status(200).send({status:"Success"})
})

module.exports  = router 