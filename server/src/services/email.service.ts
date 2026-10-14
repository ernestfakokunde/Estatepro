import { env } from '../config/env';

export async function sendEmail(to: string, subject: string, text: string) {
  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV !== 'production') {
      console.info(`Email not sent (RESEND_API_KEY is unset): ${subject} -> ${to}\n${text}`);
      return;
    }
    throw new Error('Email delivery is not configured. Set RESEND_API_KEY in server/.env.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, text }),
  });
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Resend email request failed (${response.status}): ${responseText}`);
  }
}
