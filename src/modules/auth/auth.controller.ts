import { Request, Response } from "express";
import { signupUser, signinUser } from "./auth.service";
import { signinSchema, signupSchema } from "./auth.validation.js";

export async function signup(req: Request, res: Response) {
  try {
    const parsed = signupSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const user = await signupUser(parsed.data)
    return res.status(201).json(user)
  } catch (err: any) {
    if (err.message === 'EMAIL_IN_USE') {
      return res.status(409).json({ error: 'email already in use' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const parsed = signinSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const result = await signinUser(parsed.data)
    return res.status(200).json(result)
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'invalid email or password' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}
