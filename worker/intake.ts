interface Env {
  RESEND_API_KEY: string;
  INTAKE_TO_EMAIL?: string;
  INTAKE_FROM_EMAIL?: string;
  ALLOWED_ORIGIN?: string;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 100 * 1024 * 1024;
const DEFAULT_TO_EMAIL = "fhindi@iinvestinsaudi.com";
const DEFAULT_FROM_EMAIL = "Burooj Intake <requests@buroojconsulting.com>";
const DEFAULT_ORIGIN = "https://buroojconsulting.com";

const textFields = [
  "sourceSite",
  "opportunityId",
  "servicePath",
  "applicantType",
  "fullName",
  "email",
  "phone",
  "company",
  "country",
  "preferredLanguage",
  "preferredContact",
  "requestTitle",
  "message",
  "sector",
  "investmentSize",
  "timeline",
  "projectType",
  "currentStudyStatus",
  "misaStatus",
  "legalMatterType",
  "counterparty",
  "privacyAccepted",
  "partnerConsent",
] as const;

type IntakeField = (typeof textFields)[number];
type IntakePayload = Record<IntakeField, string>;

const json = (body: unknown, status = 200, origin = DEFAULT_ORIGIN) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });

const preflight = (origin = DEFAULT_ORIGIN) =>
  new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
};

const fileToBase64 = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const createReference = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `BRJ-${date}-${random}`;
};

const buildPlainText = (reference: string, payload: IntakePayload, files: File[]) =>
  [
    `Burooj advisory request ${reference}`,
    "",
    `Source site: ${payload.sourceSite || "Direct"}`,
    `Opportunity ID: ${payload.opportunityId || "-"}`,
    `Service path: ${payload.servicePath || "-"}`,
    `Applicant type: ${payload.applicantType || "-"}`,
    "",
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "-"}`,
    `Company: ${payload.company || "-"}`,
    `Country: ${payload.country || "-"}`,
    `Preferred language: ${payload.preferredLanguage || "-"}`,
    `Preferred contact: ${payload.preferredContact || "-"}`,
    "",
    `Request title: ${payload.requestTitle || "-"}`,
    `Sector: ${payload.sector || "-"}`,
    `Investment size: ${payload.investmentSize || "-"}`,
    `Timeline: ${payload.timeline || "-"}`,
    `Project type: ${payload.projectType || "-"}`,
    `Current study status: ${payload.currentStudyStatus || "-"}`,
    `MISA / setup status: ${payload.misaStatus || "-"}`,
    `Legal matter type: ${payload.legalMatterType || "-"}`,
    `Counterparty: ${payload.counterparty || "-"}`,
    "",
    "Message:",
    payload.message,
    "",
    "Attachments:",
    files.length > 0 ? files.map((file) => `- ${file.name} (${formatFileSize(file.size)})`).join("\n") : "- None",
  ].join("\n");

const buildHtml = (reference: string, payload: IntakePayload, files: File[]) => {
  const rows = [
    ["Reference", reference],
    ["Service path", payload.servicePath],
    ["Source site", payload.sourceSite || "Direct"],
    ["Opportunity ID", payload.opportunityId || "-"],
    ["Applicant type", payload.applicantType || "-"],
    ["Name", payload.fullName],
    ["Email", payload.email],
    ["Phone", payload.phone || "-"],
    ["Company", payload.company || "-"],
    ["Country", payload.country || "-"],
    ["Preferred language", payload.preferredLanguage || "-"],
    ["Preferred contact", payload.preferredContact || "-"],
    ["Request title", payload.requestTitle || "-"],
    ["Sector", payload.sector || "-"],
    ["Investment size", payload.investmentSize || "-"],
    ["Timeline", payload.timeline || "-"],
    ["Project type", payload.projectType || "-"],
    ["Current study status", payload.currentStudyStatus || "-"],
    ["MISA / setup status", payload.misaStatus || "-"],
    ["Legal matter type", payload.legalMatterType || "-"],
    ["Counterparty", payload.counterparty || "-"],
  ];

  const attachmentItems =
    files.length > 0
      ? files.map((file) => `<li>${escapeHtml(file.name)} (${formatFileSize(file.size)})</li>`).join("")
      : "<li>None</li>";

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
      <h1 style="font-size:20px;margin:0 0 8px">New Burooj advisory request</h1>
      <p style="margin:0 0 18px"><strong>${escapeHtml(reference)}</strong></p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #dfe5ec;background:#f7f8f5;font-weight:700;width:210px">${escapeHtml(label)}</td>
                <td style="border:1px solid #dfe5ec">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h2 style="font-size:16px;margin:22px 0 8px">Message</h2>
      <p style="white-space:pre-wrap;border:1px solid #dfe5ec;padding:12px;margin:0;max-width:760px">${escapeHtml(payload.message)}</p>
      <h2 style="font-size:16px;margin:22px 0 8px">Attachments</h2>
      <ul>${attachmentItems}</ul>
    </div>
  `;
};

const parseIntake = async (request: Request) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(textFields.map((field) => [field, String(formData.get(field) ?? "")])) as IntakePayload;
  const files = formData.getAll("attachments").filter((item): item is File => item instanceof File && item.size > 0);
  return { payload, files };
};

const validateIntake = (payload: IntakePayload, files: File[]) => {
  if (!payload.fullName.trim()) return "Full name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) return "A valid email is required.";
  if (!payload.message.trim()) return "Request description is required.";
  if (payload.privacyAccepted !== "true") return "Privacy confirmation is required.";
  if (files.length > MAX_FILES) return `Upload no more than ${MAX_FILES} files.`;

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (files.some((file) => file.size > MAX_FILE_SIZE)) return "Each file must be 25 MB or smaller.";
  if (totalSize > MAX_TOTAL_FILE_SIZE) return "Total attachment size must be 100 MB or smaller.";
  return "";
};

export default {
  async fetch(request: Request, env: Env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;

    if (request.method === "OPTIONS") {
      return preflight(allowedOrigin);
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, allowedOrigin);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: "Email service is not configured" }, 500, allowedOrigin);
    }

    try {
      const { payload, files } = await parseIntake(request);
      const validationError = validateIntake(payload, files);
      if (validationError) return json({ error: validationError }, 400, allowedOrigin);

      const reference = createReference();
      const attachments = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          content: await fileToBase64(file),
        })),
      );

      const subject = `Burooj request ${reference} - ${payload.servicePath || "Advisory"} - ${payload.fullName}`;
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: env.INTAKE_FROM_EMAIL || DEFAULT_FROM_EMAIL,
          to: [env.INTAKE_TO_EMAIL || DEFAULT_TO_EMAIL],
          reply_to: payload.email,
          subject,
          text: buildPlainText(reference, payload, files),
          html: buildHtml(reference, payload, files),
          attachments,
        }),
      });

      if (!resendResponse.ok) {
        const details = await resendResponse.text();
        console.error("Resend delivery failed", details);
        return json({ error: "Email delivery failed" }, 502, allowedOrigin);
      }

      return json({ ok: true, reference }, 200, allowedOrigin);
    } catch (error) {
      console.error("Intake request failed", error);
      return json({ error: "Request could not be processed" }, 500, allowedOrigin);
    }
  },
};
