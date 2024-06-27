import bcrypt from 'bcrypt';

interface IPayload {
  inputPassword: string;
  userPassword: string;
}

const comparePasswords = async (payload: IPayload) => {
  const { inputPassword, userPassword } = payload;
  const isMatch = await bcrypt.compare(inputPassword, userPassword);

  return isMatch;
};

export default comparePasswords;
