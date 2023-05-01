import jwt from "jsonwebtoken";

export const generateToken = (userId,role) => {
  const token = jwt.sign({ id: userId,role:role }, "Secret");
  return token;
};

export const verifyTokenAdmin = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, "Secret");
    req.user = verified;
    if(verified.role=="admin"){
    next();
    }
    else{
      return res.status(403).send("Access Denied"); 
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyTokenUser = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, "Secret");
    req.user = verified;
    if(verified.role=="user"){
    next();
    }
    else{
      return res.status(403).send("Access Denied"); 
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const verifyTokenDriver = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
      console.log(token)
    }
    const verified = jwt.verify(token, "Secret");
    req.user = verified;
    console.log(verified)
    if(verified.role=="driver"){
    next();
    }
    else{
      return res.status(403).send("Access Denied"); 
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



