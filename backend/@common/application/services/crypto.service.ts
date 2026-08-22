import * as bcrypt from 'bcrypt';

export const decryptValueFromFront = (value: any) => {
  return value;
};

const compare = async (passByUser: string, passEncrypted: string) => {
  const result = await bcrypt.compare(passByUser, passEncrypted);
  return result;
};

const encrypt = async (password: string) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

export const CYPTO_SERVICES = {
  decryptValueFromFront,
  compare,
  encrypt,
};
