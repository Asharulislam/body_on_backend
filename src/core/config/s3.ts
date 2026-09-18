import { S3Client } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('AWS S3 env variables are not set')
}

export const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
})

export const S3_BUCKET = process.env.S3_BUCKET!