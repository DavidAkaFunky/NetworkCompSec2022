import { User } from "@prisma/client";
import prisma from "../prisma/client"

class UserDatabase {

	public static createUser = async (name: string, email: string, pwd: string, twoFASecret: string): Promise<boolean> => {
		try {
			await prisma.user.create({
				data: {
					name: name,
					email: email,
					password: pwd,
					twoFASecret: twoFASecret,
				}
			});
			return true;

		} catch (err) {
			return false;
		}
	}

	public static addUserTwoFASecret = async (email: string, twoFASecret: string): Promise<boolean> => {
		try {
			await prisma.user.update({
				where: {
					email: email
				},
				data: {
					twoFASecret: twoFASecret
				}
			});
			return true;

		} catch (err) {
			return false;
		}
	}

	public static getUser = async (email: string): Promise<User | null> => {
		try {
			const user = await prisma.user.findUnique({
				where: {
					email: email
				}
			});
			return user;

		} catch (err) {
			return null;
		}
	}

	public static getUserWithPassword = async (email: string, password: string): Promise<User | null> => {
		try {
			const user = await prisma.user.findFirst({
				where: {
					email: email,
					password: password
				}
			});
			return user;

		} catch (err) {
			return null;
		}
	}

	public static getAllUsers = async (): Promise<User[]> => {
		try {
			const users = await prisma.user.findMany();
			return users;
		} catch (err) {
			return [];
		}
	}

	public static changeUserPassword = async (email: string, oldPassword: string, newPassword: string): Promise<boolean> => {
		try {
			await prisma.user.updateMany({//should only allow changing the password if the old one match.
				where: {
					email: email,
					password: oldPassword,
				},
				data: {
					password: newPassword
				}
			});
			return true;

		} catch (err) {
			return false;
		}
	}
}


export default UserDatabase;
