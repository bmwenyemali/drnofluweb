import { SupabaseClient } from "@supabase/supabase-js";

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW";

export type ActivityEntity =
  | "actualites"
  | "documents"
  | "personnel"
  | "services"
  | "bon_a_savoir"
  | "contact_messages"
  | "chiffres_cles"
  | "cartographie"
  | "territoires"
  | "projets"
  | "zones_minieres"
  | "points_recettes"
  | "user"
  | "settings";

interface LogActivityParams {
  supabase: SupabaseClient;
  userId?: string;
  userEmail?: string;
  userNom?: string;
  action: ActivityAction;
  entite?: ActivityEntity | string;
  entiteId?: string;
  details?: Record<string, unknown>;
}

/**
 * Log an activity to the journal_activites table
 * This function is designed to be called from client-side code
 */
export async function logActivity({
  supabase,
  userId,
  userEmail,
  userNom,
  action,
  entite,
  entiteId,
  details = {},
}: LogActivityParams): Promise<boolean> {
  try {
    // Get current user if not provided
    if (!userId || !userEmail) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = userId || user.id;
        userEmail = userEmail || user.email;
        // Try to get the profile for the name
        if (!userNom) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("nom_complet")
            .eq("id", user.id)
            .single();
          if (profile) {
            userNom = profile.nom_complet;
          }
        }
      }
    }

    const { error } = await supabase.from("journal_activites").insert({
      user_id: userId || null,
      user_email: userEmail || null,
      user_nom: userNom || null,
      action,
      entite: entite || null,
      entite_id: entiteId || null,
      details,
      ip_address: null, // Cannot get IP from client side reliably
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    if (error) {
      console.error("Error logging activity:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
}

/**
 * Helper to create activity log after a CRUD operation
 */
export function createActivityLogger(supabase: SupabaseClient) {
  return {
    logLogin: (userEmail: string, userNom?: string) =>
      logActivity({
        supabase,
        userEmail,
        userNom,
        action: "LOGIN",
        entite: "user",
        details: { timestamp: new Date().toISOString() },
      }),

    logLogout: () =>
      logActivity({
        supabase,
        action: "LOGOUT",
        entite: "user",
        details: { timestamp: new Date().toISOString() },
      }),

    logCreate: (
      entite: ActivityEntity | string,
      entiteId: string,
      details?: Record<string, unknown>,
    ) =>
      logActivity({
        supabase,
        action: "CREATE",
        entite,
        entiteId,
        details: { ...details, timestamp: new Date().toISOString() },
      }),

    logUpdate: (
      entite: ActivityEntity | string,
      entiteId: string,
      details?: Record<string, unknown>,
    ) =>
      logActivity({
        supabase,
        action: "UPDATE",
        entite,
        entiteId,
        details: { ...details, timestamp: new Date().toISOString() },
      }),

    logDelete: (
      entite: ActivityEntity | string,
      entiteId: string,
      details?: Record<string, unknown>,
    ) =>
      logActivity({
        supabase,
        action: "DELETE",
        entite,
        entiteId,
        details: { ...details, timestamp: new Date().toISOString() },
      }),

    logView: (
      entite: ActivityEntity | string,
      entiteId?: string,
      details?: Record<string, unknown>,
    ) =>
      logActivity({
        supabase,
        action: "VIEW",
        entite,
        entiteId,
        details: { ...details, timestamp: new Date().toISOString() },
      }),
  };
}
