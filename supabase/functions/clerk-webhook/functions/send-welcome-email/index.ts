// supabase/functions/send-welcome-email/index.ts
// Called directly from Redirect.tsx as a backup / for non-webhook path
// Deploy: supabase functions deploy send-welcome-email
// Secrets: supabase secrets set RESEND_API_KEY=re_AuJ8TQEq_FYLowEirepJXGMKYZxwdAGKP

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { email, name, role } = await req.json()

  if (!email || role !== 'agent') {
    return new Response(JSON.stringify({ skipped: true }), { status: 200 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    'Savanah Dwelling <onboarding@savanah-dwelling.co.ke>',
      to:      [email],
      subject: '🏠 Welcome Agent — Savanah Dwelling',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h1 style="color:#16a34a;font-size:24px">Welcome, ${name}! 🎉</h1>
          <p style="font-size:16px;color:#374151;line-height:1.6">
            Your <strong>Agent account</strong> on <strong>Savanah Dwelling</strong> is ready.
            Start listing properties and growing your portfolio today.
          </p>
          <a href="https://kenya-prime-dwellings-sigma.vercel.app/agent"
             style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
            Open Agent Dashboard →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:32px">
            Savanah Dwelling · 
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: await res.text() }), { status: 500 })
  }

  return new Response(JSON.stringify({ sent: true }), { status: 200 })
})
