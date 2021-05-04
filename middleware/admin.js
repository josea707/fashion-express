const { User} = require('../models/User');
module.exports = async function (req, res, next) {
  try {
    const isAdmin = await User.findById({_id: req.user.id}).select('isAdmin');
    if (req.user && isAdmin) return next();
    return res
      .status(401)
      .send({ msg: "You're not an admin. If so, please sign in." });
  } catch (error) {
    res
      .status(500)
      .send({msg:'Server error, could not determine if you are an admin'});
  }
};
