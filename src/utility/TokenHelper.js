const jwt = require("jsonwebtoken");

exports.EncodeToken = (email) => {
  let key = process.env.JWT_KEY;
  let expire = process.env.JWT_Expire_Time;
  let payload = { email };
  return jwt.sign(payload, key, { expiresIn: expire });
};

exports.DecodeToken = (token) => {
  try {
    let key = process.env.JWT_KEY;
    let decoded = jwt.verify(token, key);
    console.log(decoded);

    return decoded;
  } catch (err) {
    return null;
  }
};
