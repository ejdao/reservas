import * as fs from 'fs';
import * as NodeRSA from 'node-rsa';
import * as dotenv from 'dotenv';
dotenv.config();

const convertStringToBoolean = (txt: string) => (txt === 'true' ? true : false);

export const ENVIRONMENTS = {
  port: process.env.PORT || 3000,
  host: 'http://localhost',
  public: `http://localhost:${process.env.PORT || 3000}/public`,
  production: convertStringToBoolean(process.env.PRODUCTION),
  showDocs: convertStringToBoolean(process.env.SHOWDOCS),
  httpsIsActive: convertStringToBoolean(process.env.HTTPS),
  secretKey: process.env.JWT_SECRET_KEY,
  rsa: {
    ids: {
      publicKey: new NodeRSA(fs.readFileSync('rsa/ids/public.pem', 'utf8')),
      privateKey: new NodeRSA(fs.readFileSync('rsa/ids/private.pem', 'utf8')),
    },
    https: {
      cert: fs.readFileSync('rsa/https/certificate.pem', 'utf8'),
      key: fs.readFileSync('rsa/https/certificate.key', 'utf8'),
    },
  },
  whiteList: [`http://localhost:${process.env.PORT || 3000}`, 'http://localhost:9135'],
};
