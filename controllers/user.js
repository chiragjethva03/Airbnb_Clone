const User = require("../models/user");

module.exports.signupRender = (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.postInfo = async (req, res) => {
    try {
        let { username, password, email } = req.body;
        let newUser = new User({ email, username });
        let finalUser = await User.register(newUser, password);
        req.login(finalUser, (err) => {
            if(err){
                next(err);
            }   
            req.flash("success", "You Register successfully");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
 
module.exports.loginRender = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.postLogin = async(req, res) => {
    req.flash("success", "You Login successfully");
    res.redirect("/listings");
}

module.exports.logout = (req,res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You Logout successfully");
        res.redirect("/listings");
    });
}