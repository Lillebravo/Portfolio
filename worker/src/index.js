import { EmailMessage } from "cloudflare:email";

const RECIPIENT = "jerry.lundahl@hotmail.com";
const SENDER = "portfolio@jerrylundahl.com";
const PROJECT_TYPES = new Set(["", "website", "app", "saas", "seo", "consulting", "other"]);
const BUDGETS = new Set(["", "under-20000", "20000-50000", "50000-plus", "unsure"]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = getList(env.ALLOWED_ORIGINS);

    if (!allowedOrigins.has(origin)) {
      return jsonResponse({ success: false }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin)
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({ success: false }, 405, origin);
    }

    try {
      const contentType = request.headers.get("Content-Type") || "";
      if (!contentType.startsWith("application/json")) {
        return jsonResponse({ success: false }, 415, origin);
      }

      const body = await request.json();
      if (clean(body.companyWebsite, 200)) {
        return jsonResponse({ success: true }, 200, origin);
      }

      const submission = validateSubmission(body);
      if (!submission) {
        console.warn("Contact form rejected: invalid submission");
        return jsonResponse({ success: false }, 400, origin);
      }

      const turnstileIsValid = await validateTurnstile(
        body["cf-turnstile-response"],
        request.headers.get("CF-Connecting-IP"),
        env
      );
      if (!turnstileIsValid) {
        console.warn("Contact form rejected: Turnstile validation failed");
        return jsonResponse({ success: false }, 400, origin);
      }

      const message = new EmailMessage(SENDER, RECIPIENT, createRawEmail(submission));
      await env.EMAIL.send(message);

      return jsonResponse({ success: true }, 200, origin);
    } catch (error) {
      console.error("Contact form failed", error?.code || error?.message || error);
      return jsonResponse({ success: false }, 500, origin);
    }
  }
};

function validateSubmission(body) {
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 254).toLowerCase();
  const projectType = clean(body.projectType, 40);
  const budget = clean(body.budget, 40);
  const message = clean(body.message, 5000);

  if (!firstName || !lastName || !message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!PROJECT_TYPES.has(projectType) || !BUDGETS.has(budget)) return null;

  return { firstName, lastName, email, projectType, budget, message };
}

async function validateTurnstile(token, remoteIp, env) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  if (!env.TURNSTILE_SECRET_KEY) return false;

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  if (remoteIp) formData.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData
  });
  const result = await response.json();
  const expectedHostnames = getList(env.EXPECTED_HOSTNAMES);

  return result.success === true &&
    result.action === "contact" &&
    expectedHostnames.has(result.hostname);
}

function createTextMessage(submission) {
  return [
    "New inquiry from the portfolio contact form",
    "",
    `Name: ${submission.firstName} ${submission.lastName}`,
    `Email: ${submission.email}`,
    `Project type: ${submission.projectType || "Not specified"}`,
    `Budget: ${submission.budget || "Not specified"}`,
    "",
    "Message:",
    submission.message
  ].join("\n");
}

function createHtmlMessage(submission) {
  return `
    <h2>New portfolio inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.firstName)} ${escapeHtml(submission.lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Project type:</strong> ${escapeHtml(submission.projectType || "Not specified")}</p>
    <p><strong>Budget:</strong> ${escapeHtml(submission.budget || "Not specified")}</p>
    <h3>Message</h3>
    <p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>
  `;
}

function createRawEmail(submission) {
  const boundary = `contact-${crypto.randomUUID()}`;
  const subject = "New portfolio inquiry";

  return [
    `From: Portfolio contact form <${SENDER}>`,
    `To: ${RECIPIENT}`,
    `Reply-To: ${submission.email}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    createTextMessage(submission),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    createHtmlMessage(submission),
    "",
    `--${boundary}--`
  ].join("\r\n");
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  })[character]);
}

function getList(value = "") {
  return new Set(value.split(",").map((item) => item.trim()).filter(Boolean));
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function jsonResponse(body, status, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(origin ? corsHeaders(origin) : {})
    }
  });
}
