import { S3Client } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION
const bucket = process.env.S3_BUCKET

if (!region || !bucket) {
  throw new Error('AWS S3 env variables are not set')
}

export const s3 = new S3Client({
  region,
})

export const S3_BUCKET = bucket