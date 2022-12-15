import { authenticator } from 'otplib'; // v11.x

authenticator.options = { digits: 6 };

export default authenticator;