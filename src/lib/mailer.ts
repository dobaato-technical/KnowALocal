import nodemailer from "nodemailer";

/* ------------------------------------------------------------------ */
/*  Env helpers                                                       */
/* ------------------------------------------------------------------ */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/* ------------------------------------------------------------------ */
/*  Config type & builder                                             */
/* ------------------------------------------------------------------ */

export type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export function getMailerConfig(): MailerConfig {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const secure =
    String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const from = requireEnv("SMTP_FROM");

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT must be a number");
  }

  return { host, port, secure, user, pass, from };
}

/* ------------------------------------------------------------------ */
/*  Transport factory                                                 */
/* ------------------------------------------------------------------ */

export function createTransport() {
  const cfg = getMailerConfig();

  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  High-level send helper                                            */
/* ------------------------------------------------------------------ */

export async function sendMail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    encoding?: string;
    path?: string;
    cid?: string;
  }>;
}) {
  const cfg = getMailerConfig();
  const transport = createTransport();

  await transport.sendMail({
    from: cfg.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
    attachments: params.attachments,
  });
}
