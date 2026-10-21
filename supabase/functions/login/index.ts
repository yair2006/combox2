
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Usa POST" }, 405);
  }

  try {
    const body = await req.json();
    const email =
      typeof body?.email === "string" ? body.email.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return jsonResponse(
        { error: "Debes enviar email y password" },
        400,
      );
    }

    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_ANON_KEY");

    if (!url || !key) {
      return jsonResponse(
        { error: "Falta configurar Supabase" },
        500,
      );
    }

    const supabase = createClient(url, key);
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return jsonResponse(
        { error: "Correo o contraseña incorrectos" },
        401,
      );
    }

    return jsonResponse({
      user: data.user,
      session: data.session,
    });
  } catch {
    return jsonResponse(
      { error: "Solicitud inválida" },
      400,
    );
  }
});
