import { serve } from "std/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const webhookSecret = req.headers.get("X-Webhook-Secret");
  if (webhookSecret !== "MA_CLE_SUPER_SECRETE") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { record } = await req.json(); // Le nouveau membre qui vient de s'inscrire
    
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    // Envoi de l'email de bienvenue
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Timalove <onboarding@resend.dev>",
        to: [record.email],
        subject: "Bienvenue sur TimaLove 🎉",
        html: `
          <div style="font-family:sans-serif; padding:20px; color:#5F5751;">
            <h2 style="color:#D48B8B;">Bienvenue ${record.first_name} !</h2>
            <p>Votre inscription est confirmée. Vous faites maintenant partie de la communauté TimaLove.</p>
            <p>Vous pouvez dès à présent consulter la galerie et découvrir les profils (photos floutées par défaut).</p>
            <br>
            <a href="https://timalove.com/galerie" style="background:#D48B8B; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Découvrir la galerie</a>
          </div>
        `
      }),
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});