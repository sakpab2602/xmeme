var express = require("express");
var router = express.Router();
const Users = require("../model/users");

router.post("/login", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            res.statusCode = 404;
            return res.json({ message: "User not Found", data: null });
        }
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );
        if (validPassword) {
            token = jwt.sign({ _id: user._id, email }, "secretKey", {
                expiresIn: 3600,
            });
            res.status(200);
            return res.json({ message: "success", data: user, token });
        } else {
            res.statusCode = 400;
            return res.json({ message: "Email and password not match", data: null });
        }
    } catch (err) {
        return res.json({ message: err.message, data: null });
    }
});

router.post("/register", async (req, res, next) => {
    try {
        let { email, name, password } = req.body;
        const user = await Users.findOne({ email });

        if (user) {
            res.statusCode = 409;
            return res.json({ message: "User already exists", data: null });
        } else {
            const newUser = new Users({ name, email, password });
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);
            const data = await newUser.save();
            res.statusCode = 200;
            return res.json({ message: "Success! User added!", data });
        }
    } catch (err) {
        return res.json({ message: err.message, data: null });
    }
});
module.exports = router;