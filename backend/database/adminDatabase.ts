import { Admin, Role } from "@prisma/client";
import prisma from "../prisma/client"

class AdminDatabase {

    public static createAdmin = async (name: string, email: string, pwd: string, twoFASecret: string | null, validationDate: number): Promise<boolean> => {
        try {
            await prisma.admin.create({
                data: {
                    name: name,
                    email: email,
                    password: pwd,
                    role: Role.ADMIN,
                    twoFASecret: twoFASecret,
                    valDate: validationDate,
                }
            });
            return true;

        } catch (err) {
            return false;
        }
    }


    public static getAdmin = async (email: string): Promise<Admin | null> => {
        try {
            const admin = await prisma.admin.findUnique({
                where: {
                    email: email
                }
            });
            return admin;

        } catch (err) {
            return null;
        }
    }

    public static addAdminTwoFASecret = async (email: string, twoFASecret: string): Promise<boolean> => {
        try {
            await prisma.admin.updateMany({//should only allow validation if the old password match.
                where: {
                    email: email,
                },
                data: {
                    twoFASecret: twoFASecret,
                }
            });
            return true;

        } catch (err) {
            return false;
        }
    }

    public static changeAdminPassword = async (email: string, oldPassword: string, newPassword: string): Promise<boolean> => {
        try {
            await prisma.admin.updateMany({//should only allow changing the password if the old one match.
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


export default AdminDatabase;