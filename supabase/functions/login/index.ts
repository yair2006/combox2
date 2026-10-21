import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Usa POST" }, { status: 405 });
  }

  try {
    const { email, password } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 401 });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }
});
