import bcrypt from 'bcryptjs';
import HttpException from '../models/httpException';
import UserRegisterData from '../models/userRegisterData';
import AdminRegisterData from '../models/adminRegisterData';
import LoginData from '../models/loginData';
import UserLoggedData from '../models/userLoggedData';
import { UserRoles } from '../models/userRoles';
import { AdminDatabase, UserDatabase, RefreshTokenDatabase } from '../database/index';
import { TokenService, TwoFAService } from './index';
import { User, Admin, Role } from '@prisma/client';
import TwoFAData from '../models/twoFAData';
import RefreshData from '../models/refreshData';

class AuthService {

	private static nameRegex = /^[a-zA-Z]([a-zA-Z ]){3,}$/;
	private static adminEmailRegex = /^([a-zA-Z0-9\.\-_]){4,60}(@ncmb.pt)$/;
	private static emailRegex = /^([a-zA-Z0-9\.\-_]){4,60}@([a-zA-Z\.\-_]){1,30}.([a-zA-Z]){1,4}$/;
	private static passwordRegex = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-_+.]){1,}).{8,32}$/;
	// Minimum of: 1 lowercase, 1 uppercase, 1 number, 1 special character. Total: 8 to 32 chars -> ADD TO FRONTEND!

	private static checkUserUniqueness = async (email: string): Promise<boolean> => {
		return !(await UserDatabase.getUser(email));
	};

	private static checkAdminUniqueness = async (email: string): Promise<boolean> => {
		return !(await AdminDatabase.getAdmin(email));
	};

	//========================================================================================
	//-------------------------------------REGISTER CLIENT------------------------------------
	//========================================================================================

	public static registerUser = async (user: UserRegisterData): Promise<void> => {

		const name = user.name?.trim();
		const email = user.email?.trim();
		const password = user.password?.trim();
		const secret = user.secret?.trim();
		const token = user.token?.trim();

		if (!email || !name || !this.nameRegex.test(name) || !password || !this.passwordRegex.test(password) || !secret || !token || this.adminEmailRegex.test(email) || !this.emailRegex.test(email)) {
			throw new HttpException(400, "Invalid or missing credentials. Please try again.");
		}

		const unique = await this.checkUserUniqueness(email);

		if (!unique) {
			throw new HttpException(422, "This email is already taken. Please remove your 2FA code from the app, then try with a different email.");
		}

		const match = await TwoFAService.verifyTOTPQRCode(token, secret);

		if (!match) {
			throw new HttpException(422, "Wrong 2FA token. Please try again.");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const success = await UserDatabase.createUser(name, email, hashedPassword, secret);

		if (!success) {
			throw new HttpException(500, "The user could not be created. Please try again.");
		}
	};

	//========================================================================================
	//-------------------------------------REGISTER ADMIN-------------------------------------
	//========================================================================================

	public static registerAdmin = async (registerData: AdminRegisterData): Promise<LoginData> => {

		const name = registerData.name?.trim();
		const partialEmail = registerData.partialEmail?.trim();
		const partialEmailRegex = /^([a-zA-Z0-9\.-_]){4,60}$/;

		if (!partialEmail || !name || !this.nameRegex.test(name) || !partialEmailRegex.test(partialEmail)) {
			throw new HttpException(400, "Invalid or missing credentials. Please try again.");
		}

		const email = partialEmail + "@ncmb.pt";

		const unique = await this.checkAdminUniqueness(email);

		if (!unique) {
			throw new HttpException(422, "This email is already taken. Please try with a different email.");
		}

		const password = require('crypto').randomBytes(16).toString('hex');

		const hashedPassword = await bcrypt.hash(password, 10);

		const success = await AdminDatabase.createAdmin(name, email, hashedPassword, null);

		if (!success) {
			throw new HttpException(500, "Failed to create new admin.");
		}

		const result = {
			email: email,
			password: password,
		}

		return result as LoginData;
	}

	//========================================================================================
	//-------------------------------------LOGIN----------------------------------------------
	//========================================================================================

	private static loginVerification = async (loginData: LoginData): Promise<User | Admin> => {
		const email = loginData.email?.trim();
		const password = loginData.password?.trim();

		if (!email || !password) {
			throw new HttpException(400, "Invalid or missing credentials. Please try again.");
		}

		let user: User | Admin | null;

		//Check if is admin or client
		if (this.adminEmailRegex.test(email)) {
			user = await AdminDatabase.getAdmin(email);
		} else {
			user = await UserDatabase.getUser(email);
		}

		if (!user) {
			throw new HttpException(401, "Invalid email or password.");
		}

		const isPasswordMatching = await bcrypt.compare(password, user.password);

		if (!isPasswordMatching) {
			throw new HttpException(401, "Invalid email or password.");
		}

		return user;
	}

	public static firstStageLogin = async (loginData: LoginData): Promise<TwoFAData | null> => {
		
		const user = await this.loginVerification(loginData);

		//Check if is admin or client
		if (this.adminEmailRegex.test(user.email) && !user.twoFASecret){
			return await TwoFAService.generateTOTPQRCode(user.email);
		}

		return null;
	};

	public static secondStageLogin = async (loginData: LoginData, token: string, secret?: string): Promise<UserLoggedData> => {

		const user = await this.loginVerification(loginData);
		const isAdmin: boolean = this.adminEmailRegex.test(user.email);
		const isSuperAdmin: boolean = isAdmin && (user as Admin).role == Role.SUPERADMIN;

		let match: boolean;

		if (isAdmin && !user.twoFASecret) {
			if (!secret) {
				throw new HttpException(400, "Missing 2FA secret. Please try again!");
			}

			match = await TwoFAService.verifyTOTPQRCode(token, secret);

			if (match && !await AdminDatabase.addAdminTwoFASecret(user.email, secret)) {
				throw new HttpException(500, "Failed to add 2FA secret. Please try again!");
			}
		}
		else {
			match = await TwoFAService.verifyTOTPQRCode(token, user.twoFASecret!);
		}

		if (!match) {
			throw new HttpException(401, "The 2FA token is incorrect. Please try again!");
		}
	
		let role
		if (isAdmin) {
			role = isSuperAdmin ? UserRoles.SUPERADMIN : UserRoles.ADMIN;
		} else {
			role = UserRoles.USER;
		}

		const accessToken = TokenService.generateAccessToken(user.email, role);

		const refreshToken = TokenService.generateRefreshToken(user.email);

		const success: boolean = await RefreshTokenDatabase.createRefreshToken(refreshToken, user.email);

		if (!success) {
			throw new HttpException(500, "There was a problem storing the 2FA token. Please try again!");
		}

		const userTokens = {
			name: user.name,
			email: user.email,
			role: role,
			accessToken,
			refreshToken
		}

		return userTokens;
	};

	public static refreshToken = async (cookies: any): Promise<RefreshData> => {

		if (!cookies || !cookies.refreshToken) {
			throw new HttpException(401, "No refresh token was provided!");
		}

		const refreshToken = cookies.refreshToken;

		try {

			const email = await TokenService.verifyRefreshToken(refreshToken);
			
			let role, name;
			
			const user = await UserDatabase.getUser(email);
			if (!user) {
				const admin = await AdminDatabase.getAdmin(email);
				name = admin!.name
				role = admin!.role == Role.SUPERADMIN ? UserRoles.SUPERADMIN : UserRoles.ADMIN;
			} else {
				name = user.name;
				role = UserRoles.USER;
			}
			
			const accessToken = TokenService.generateAccessToken(email, role);

			const refreshData = {
				accessToken: accessToken,
				role: role,
				name: name
			}

			return refreshData;

		} catch (err) {

			const success = await RefreshTokenDatabase.deleteRefreshToken(refreshToken);

			if (!success) {
				// TODO: if the token doesnt exist, it shouldnt throw an error
				//throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
			}

			throw new HttpException(401, "The refresh token has expired.");
		}
	};

	public static changeUserPassword = async (email: string, oldPassword: string, newPassword: string): Promise<void> => {

		const user = await this.loginVerification({ email: email, password: oldPassword } as LoginData);
		
		if (!user) {
			throw new HttpException(401, "There was a problem changing the password. Please check if the old password is correct and try again.");
		}

		const success = await UserDatabase.changeUserPassword(email, newPassword);

		if (!success) {
			throw new HttpException(500, "There was a problem changing the password.");
		}
	};

	public static logoutUser = async (cookies: any): Promise<void> => {

		if (!cookies || !cookies.refreshToken) {
			throw new HttpException(400, "No refresh token was provided!");
		}

		const refreshToken = cookies.refreshToken;

		const success = await RefreshTokenDatabase.deleteRefreshToken(refreshToken);

		if (!success) {
			// TODO: if the token doesnt exist, it shouldnt throw an error
			//throw new HttpException(500, { message: { token: ["fail to delete refresh token"] } });
		}
	};
}

export default AuthService;