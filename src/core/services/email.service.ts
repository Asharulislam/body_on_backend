import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({
  region: process.env.AWS_REGION,
})

export async function sendPasswordResetOtp(
  email: string,
  otp: string,
) {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL!,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: 'Password Reset OTP',
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
          Charset: 'UTF-8',
        },
      },
    },
  })

  await ses.send(command)
}