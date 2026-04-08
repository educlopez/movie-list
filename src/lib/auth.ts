import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "@/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // set to true once domain verified in Resend
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Movielist <onboarding@resend.dev>",
        to: user.email,
        subject: "Verifica tu email - Movielist",
        html: `
          <h2>Bienvenido a Movielist</h2>
          <p>Hola ${user.name},</p>
          <p>Haz clic en el siguiente enlace para verificar tu email:</p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#10b981;color:white;text-decoration:none;border-radius:8px;">Verificar email</a>
          <p>Si no creaste esta cuenta, ignora este mensaje.</p>
        `,
      });
    },
  },
});
