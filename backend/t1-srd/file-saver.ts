import {
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  Controller,
  Delete,
  Module,
  Query,
  Post,
  Body,
  UploadedFile,
} from '@nestjs/common';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FILE_PATHS_ARR } from '@common/application/constants';
import { CommonGuards } from '@common/presentation/decorators';
import { MULTER_SERVICES } from '@common/presentation/helpers';

@ApiTags('V1 | FileSaver')
@CommonGuards()
@Controller('v1/shared/file-saver')
export class FileSaverController {
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['folder', 'file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: `temp`, filename: MULTER_SERVICES.nonEditFileName }),
    })
  )
  @Post('single')
  public async addFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folder: string }
  ): Promise<string> {
    try {
      let url = '';

      if (file) {
        const key = body.folder.replaceAll('-', '/');
        let path = FILE_PATHS_ARR.filter(e => e === key)[0];
        url = `public/${path}/${file.originalname}`;
        fs.rename(`temp/${file.originalname}`, `${url}`, _err => {});
      }

      return url;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['folder', 'files'],
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        folder: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files' }], {
      storage: diskStorage({ destination: `temp`, filename: MULTER_SERVICES.nonEditFileName }),
    })
  )
  @Post('multi')
  public async addFiles(
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Body() body: { folder: string }
  ): Promise<string[]> {
    try {
      const urls: string[] = [];

      if (files && files.files.length) {
        files.files.forEach((file: Express.Multer.File) => {
          const key = body.folder.replaceAll('-', '/');
          let path = FILE_PATHS_ARR.filter(e => e === key)[0];
          const url = `public/${path}/${file.originalname}`;
          urls.push(url);
          fs.rename(`temp/${file.originalname}`, `${url}`, _err => {});
        });
      }

      return urls;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  public async removeFiles(
    @Query('paths') paths: string[],
    @Query('deleteForever') deleteForever: boolean
  ): Promise<boolean> {
    try {
      if (paths && paths.length) {
        paths.forEach(path => {
          if (deleteForever) MULTER_SERVICES.deleteFile(`${path}`);
          else fs.rename(`${path}`, `removed/${path.slice(7)}`, _err => {});
        });
      }
      return true;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}

@Module({ controllers: [FileSaverController] })
export class FileSaverModule {}
