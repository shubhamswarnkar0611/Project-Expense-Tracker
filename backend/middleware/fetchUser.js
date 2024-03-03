const jwt = require("jsonwebtoken");
const JWT_SECRETE = "$ecreteHai";

const fetchUser = (req, res, next) => {
  const token = req.header("authToken");
  if (!token) {
    res.status(401).send( "please authentiacate using availd token" );
  }
  
  try {
    const data = jwt.verify(token, JWT_SECRETE);
  
    req.user = data.userId;
    next();
  } catch (err) {
    res.status(401).send( "error in verifying the token" );
  }
};

module.exports = fetchUser;
