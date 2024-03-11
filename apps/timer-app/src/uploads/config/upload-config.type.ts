export type UploadConfig = {
  accessKeyId?: string;
  secretAccessKey?: string;
  awsS3Bucket?: string;
  awsS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
};
