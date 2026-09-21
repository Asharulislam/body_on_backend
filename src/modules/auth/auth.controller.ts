import { Request, Response } from "express";
import { signupUser, signinUser, forgotPasswordUser, resetPasswordUser } from "./auth.service";
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema } from "./auth.validation.js";

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


export async function forgotPassword(req: Request, res: Response) {
  try {
    
    const parsed = forgotPasswordSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const result = await forgotPasswordUser(parsed.data.email);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "validation failed",
        details: parsed.error.issues.map((i) => i.message),
      });
    }

    const result = await resetPasswordUser(parsed.data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof Error) {
      if (error.message === "INVALID_OTP") {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }

      if (error.message === "OTP_EXPIRED") {
        return res.status(400).json({
          message: "OTP has expired",
        });
      }

      if (error.message === "INVALID_RESET_REQUEST") {
        return res.status(400).json({
          message: "Invalid password reset request",
        });
      }
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}