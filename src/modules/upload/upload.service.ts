import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { s3, S3_BUCKET } from '../../core/config/s3'

// generate a presigned PUT url for uploading
export async function getUploadUrl(input: {
  folder: string        // e.g. 'gyms'
  contentType: string   // e.g. 'image/jpeg'
}) {
  const ext = input.contentType.split('/')[1] ?? 'bin'
  const key = `${input.folder}/${randomUUID()}.${ext}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: input.contentType,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }) // 5 min

  return { uploadUrl, key }
}

// generate a presigned GET url for viewing a private object
export async function getViewUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })
  return getSignedUrl(s3, command, { expiresIn: 7200 }) // 5 min
}