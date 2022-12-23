import authenticator from '../otp_authenticator/authenticator';
import qrcode from 'qrcode'
import TwoFAData from '../models/twoFAData';

class twoFAService {

    public static generateTOTPQRCode = async (email: string): Promise<TwoFAData> => {

        // Generates a base32 encoded hex secret key
        // Equivalent to:
        // s = crypto.randomBytes(length).toString('base64').slice(0, length)
        // secret = base32.encode(s).toString().replate(/=/g, '')
        const secret = authenticator.generateSecret();

        // Generates a string with the format
        // optauth://totp/{service}:{user}?secret={secret}&issuer={service}&algorithm={algorithm}&digits={digits}&period={period}
        const otpAuth = authenticator.keyuri(email, "NCMB - Nova Caixa Milenar Bancária", secret);
        const qrCode = await qrcode.toDataURL(otpAuth);

        return { secret, qrCode };
    };

    public static verifyTOTPQRCode = async (token: string, secret: string): Promise<boolean> => {

        // Tries to match the user provided token with the server generated token
        // How the server token is generated:
        // const counter = Math.floor(Date.now() / 1000 / period);
        // const digest = crypto.createHmac('sha1', secret).update(counter).digest();
        // const offset = digest[digest.length - 1] & 0xf;
        // const code = (digest[offset] & 0x7f) << 24 |
        //              (digest[offset + 1] & 0xff) << 16 |
        //              (digest[offset + 2] & 0xff) << 8 |
        //              (digest[offset + 3] & 0xff);
        // code = code % Math.pow(10, digits);
        // token = leftPad(code, digits);
        // An explanation of the algorithm can be found here: https://www.ietf.org/rfc/rfc4226.txt
        //console.log(authenticator.verify({ token, secret }));
        return authenticator.verify({ token, secret });
    };
}

export default twoFAService;