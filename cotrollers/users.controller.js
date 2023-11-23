const { selectUserById } = require("../models/users.model")

exports.getUsersById = (req,res,next) =>{
    const {username} = req.params
    selectUserById(username).then((users) => {
        res.status(200).send({users})
    }).catch(next)
}