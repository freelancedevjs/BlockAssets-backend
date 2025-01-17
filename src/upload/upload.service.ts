import {
  DeleteObjectCommand,
  ListObjectsCommand,
  S3,
} from '@aws-sdk/client-s3';
import { FileUpload } from 'graphql-upload';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client';

@Injectable()
export class UploadService {
  private readonly awsS3: S3;
  public readonly S3_BUCKET_NAME: string;
  public readonly endpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    let config: S3ClientConfig = {
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    };
    const endpoint = this.configService.get('AWS_S3_ENDPOINT');
    const s3ForcePathStyle = this.configService.get('AWS_S3_STYLE');
    if (endpoint) {
      this.endpoint = endpoint;
      config = {
        ...config,
        endpoint,
      };
    } else {
      this.endpoint = `https://${this.configService.get(
        'AWS_S3_BUCKET_NAME',
      )}.s3.amazonaws.com`;
    }
    if (s3ForcePathStyle) {
      config = {
        ...config,
        forcePathStyle: s3ForcePathStyle,
      };
    }
    this.awsS3 = new S3(config);
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  getLinkByKey(key: string) {
    return `${this.endpoint}/${this.S3_BUCKET_NAME}/${key}`;
  }

  async uploadFileToS3({
    folderName,
    file,
  }: {
    folderName: string;
    file: FileUpload;
  }) {
    const finalFile = await file;
    const key = `${folderName}/${new Date().toISOString()}_${path.basename(
      finalFile.filename,
    )}`.replace(/ /g, '');

    const upload = new Upload({
      client: this.awsS3,
      params: {
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
        Body: finalFile.createReadStream(),
        ContentType: finalFile.mimetype,
      },
    });

    try {
      await upload.done();

      return { key };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(key: string): Promise<{ success: true }> {
    const command = new DeleteObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
      Key: key,
    });

    const check = new ListObjectsCommand({
      Bucket: this.S3_BUCKET_NAME,
      Prefix: key,
    });

    const fileList = await this.awsS3.send(check);

    if (!fileList.Contents || fileList.Contents.length === 0) {
      throw new BadRequestException(`File does not exist`);
    }

    try {
      await this.awsS3.send(command);
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  async listS3Object(folder: string) {
    const command = new ListObjectsCommand({
      Bucket: this.S3_BUCKET_NAME,
      Prefix: folder,
    });

    const data = await this.awsS3.send(command);

    const promise = await Promise.all(
      data.Contents.map(async (v) => {
        const url = this.getLinkByKey(v.Key);

        const data = await firstValueFrom(this.httpService.get(url));
        return data;
      }),
    );

    return promise.map((v) => v.data);
  }
}
