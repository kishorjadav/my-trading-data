// +server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Best practice: store the Apps Script URL in an env var.
// Create .env (or set in your hosting env): GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AK.../exec"

const SCRIPT_URL = env.GOOGLE_ORDER_SCRIPT || 'https://script.google.com/macros/s/AKfycbxa71iblMySm8jFK36C1Xx8jzL1s6FtjZpvdoHFVBzFFFO2mRVp683NSLIFI7g1p5_E/exec';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json(); // { name, email, phone, message }

    // Forward to Google Apps Script (server -> server call avoids CORS)
    const upstream = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const upstreamText = await upstream.text();
    let upstreamJson = null;
    try {
      upstreamJson = JSON.parse(upstreamText);
    } catch (e) {
      upstreamJson = { text: upstreamText };
    }

    if (!upstream.ok) {
      return json({ ok: false, upstream: upstreamJson }, { status: 500 });
    }

    return json({ ok: true, upstream: upstreamJson });
  } catch (err) {
    return json({ ok: false, error: err.message }, { status: 500 });
  }
};
