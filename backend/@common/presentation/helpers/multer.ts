import { extname } from 'path';
import * as fs from 'fs';

const editFileName = (req: any, file: any, callback: any): void => {
  const name = req && req.query && req.query.fileName ? req.query.fileName : new Date().getTime();
  const fileName = `${name}${extname(file.originalname)}`;
  callback(null, fileName);
};

const deleteFile = (path: string): void => {
  path = `../${path}`;
  fs.unlink(path, err => {
    if (err) console.log(err);
  });
};

const nonEditFileName = (_req: any, file: any, callback: any): void => {
  callback(null, file.originalname);
};

export const MULTER_SERVICES = {
  editFileName,
  deleteFile,
  nonEditFileName,
};
