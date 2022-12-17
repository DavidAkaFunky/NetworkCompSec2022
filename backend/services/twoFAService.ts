import authenticator from '../otp_authenticator/authenticator';
import qrcode from 'qrcode'
import TwoFAData from '../models/twoFAData';

class twoFAService {
    public static verifyTOTPQRCode = async (token: string, secret: string): Promise<boolean> => {
        return authenticator.verify({ token, secret });
    };

    public static generateTOTPQRCode = async (email: string): Promise<TwoFAData> => {

        const secret = authenticator.generateSecret();
        const otpAuth = authenticator.keyuri(email, "NCMB - Nova Caixa Milenar Bancária", secret);
        const qrCode = await qrcode.toDataURL(otpAuth);
    
        return { secret, qrCode };
      };
}

export default twoFAService;