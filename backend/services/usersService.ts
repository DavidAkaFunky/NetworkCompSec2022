import { RegisteredUser } from '../models/registeredUserModel';
import { RegisterUser } from '../models/registerUserModel';
import { createUser } from '../database/usersDatabase';


export const registerUser = async (input: RegisterUser): Promise<boolean> => {
    const email = input.email?.trim();
    const username = input.username?.trim();
    const password = input.password?.trim();
  
    if (!email) {
      //throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }
  
    if (!username) {
      //throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }
  
    if (!password) {
      //throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }
  
    //await checkUserUniqueness(email, username);
  
    //const hashedPassword = await bcrypt.hash(password, 10);
  
    return createUser(username, email, /* hashed */password)

    /* return {
      ...user,
      token: generateToken(user),
    }; */
};