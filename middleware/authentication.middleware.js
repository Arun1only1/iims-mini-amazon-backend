import jwt from 'jsonwebtoken';
import UserTable from '../user/user.model.js';

const isUser = async (req, res, next) => {
  // extract token from req.headers.authorization
  const authorization = req?.headers?.authorization;
  const splittedToken = authorization?.split(' ');

  const token = splittedToken?.length === 2 ? splittedToken[1] : null;

  //   if not token, throw error
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  let payload = null;
  try {
    const secretKey = 'ahjdfahdajkfdhdjfashj';

    // decrypt token
    payload = jwt.verify(token, secretKey);
  } catch (error) {
    // if decryption fails, throw error
    // reason:
    //  secretKey is different
    // token is not from our system/altered token
    // token is from system, but token has been expired

    return res.status(401).send({ message: 'Unauthorized.' });
  }

  //  find user using email from payload
  const user = await UserTable.findOne({ email: payload.email });
  //   if user does not exist in our system, throw error
  if (!user) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  //   we call next function
  next();
};

export default isUser;
