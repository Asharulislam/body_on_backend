import { getUploadUrl } from "./upload.service"
import { uploadSchema } from "./upload.validation"
import { Request, Response } from 'express'


export async function createUploadUrl(req: Request, res: Response) {
  try {
    const parsed = uploadSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }
    const result = await getUploadUrl(parsed.data)
    return res.status(200).json(result) // { uploadUrl, key }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'could not create upload url' })
  }
}