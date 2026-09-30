// Vercel serverless function: receives quote/contact form submissions,
// stores them in Supabase and posts them to the Telegram group.
//
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   SUPABASE_URL               e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  Supabase → Project Settings → API Keys (secret / service_role)
//   TELEGRAM_BOT_TOKEN         from @BotFather
//   TELEGRAM_CHAT_ID           the group's chat id (starts with -100…)

type LeadType = 'quote' | 'contact';

interface Lead {
  type: LeadType;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  details: Record<string, string>;
}

// Allowed fields per form, with display labels (order = order in Telegram message)
const FIELDS: Record<LeadType, Record<string, string>> = {
  quote: {
    contactName: 'Contact',
    companyName: 'Company',
    email: 'Email',
    phone: 'Phone',
    pickupLocation: 'Pickup',
    deliveryLocation: 'Delivery',
    cargoType: 'Cargo',
    weight: 'Weight',
    dimensions: 'Dimensions',
    pickupDate: 'Pickup date',
    deliveryDate: 'Delivery date',
    serviceType: 'Service',
    specialRequirements: 'Requirements',
  },
  contact: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    inquiryType: 'Inquiry type',
    language: 'Language',
    message: 'Message',
  },
};

const REQUIRED: Record<LeadType, string[]> = {
  quote: ['contactName', 'companyName', 'email', 'phone', 'pickupLocation', 'deliveryLocation', 'cargoType'],
  contact: ['name', 'email', 'message'],
};

const MAX_LENGTH = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function parseLead(body: unknown): Lead | string {
  if (!body || typeof body !== 'object') return 'Invalid request';
  const input = body as Record<string, unknown>;
  const type = input.type;
  if (type !== 'quote' && type !== 'contact') return 'Invalid form type';

  const details: Record<string, string> = {};
  for (const key of Object.keys(FIELDS[type])) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) {
      details[key] = value.trim().slice(0, MAX_LENGTH);
    }
  }
  for (const key of REQUIRED[type]) {
    if (!details[key]) return `Missing field: ${FIELDS[type][key]}`;
  }
  if (!EMAIL_RE.test(details.email)) return 'Invalid email address';

  return {
    type,
    name: type === 'quote' ? details.contactName : details.name,
    email: details.email.toLowerCase(),
    phone: details.phone ?? null,
    company: type === 'quote' ? details.companyName : null,
    details,
  };
}

export function formatTelegramMessage(lead: Lead): string {
  const title = lead.type === 'quote' ? '🚚 <b>New Quote Request</b>' : '✉️ <b>New Contact Message</b>';
  const lines = Object.entries(FIELDS[lead.type])
    .filter(([key]) => lead.details[key])
    .map(([key, label]) => `<b>${label}:</b> ${escapeHtml(lead.details[key])}`);
  return [title, '', ...lines].join('\n');
}

async function saveToSupabase(lead: Lead): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');

  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
}

async function sendToTelegram(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('Telegram is not configured');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(lead),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid request' });
  }

  // Honeypot: real visitors never fill this hidden field; bots usually do
  if (body && typeof body === 'object' && (body as Record<string, unknown>).website) {
    return json(200, { ok: true });
  }

  const lead = parseLead(body);
  if (typeof lead === 'string') return json(400, { ok: false, error: lead });

  const [db, telegram] = await Promise.allSettled([saveToSupabase(lead), sendToTelegram(lead)]);
  if (db.status === 'rejected') console.error('Lead not saved:', db.reason);
  if (telegram.status === 'rejected') console.error('Lead not sent to Telegram:', telegram.reason);

  // Succeed if the lead reached at least one place, so the visitor isn't asked to resend
  if (db.status === 'fulfilled' || telegram.status === 'fulfilled') {
    return json(200, { ok: true });
  }
  return json(502, { ok: false, error: 'Could not deliver your request' });
}
