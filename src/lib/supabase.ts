/**
 * Configuration et service Supabase pour TimaLove Match
 * 
 * Ce fichier gère toutes les interactions avec Supabase :
 * - Initialisation du client
 * - CRUD des inscriptions
 * - Gestion des erreurs
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types pour la base de données
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  profession?: string;
  presentation: string;
  lookingFor: string;
}

export interface RegistrationRecord extends RegistrationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SupabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Vérification des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes !');
  console.error('Créez un fichier .env avec :');
  console.error('VITE_SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=votre_cle_publique');
}

// Initialisation du client Supabase
export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/**
 * Créer une nouvelle inscription dans Supabase
 */
export const createRegistration = async (
  data: RegistrationData
): Promise<SupabaseResponse<RegistrationRecord>> => {
  try {
    console.log('📤 Envoi de l\'inscription à Supabase...');

    // Mapper les noms de champs (camelCase -> snake_case pour Supabase)
    const dbData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      age: data.age,
      city: data.city,
      profession: data.profession || null,
      presentation: data.presentation,
      looking_for: data.lookingFor,
      status: 'pending' as const,
    };

    const { data: registration, error } = await supabase
      .from('registrations')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      
      // Gestion des erreurs spécifiques
      if (error.code === '23505') {
        // Contrainte d'unicité violée (email déjà existant)
        return {
          success: false,
          error: 'Cette adresse email est déjà enregistrée.',
        };
      }

      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription',
      };
    }

    console.log('✅ Inscription créée avec succès:', registration.id);

    return {
      success: true,
      data: {
        id: registration.id,
        firstName: registration.first_name,
        lastName: registration.last_name,
        email: registration.email,
        phone: registration.phone,
        age: registration.age,
        city: registration.city,
        profession: registration.profession,
        presentation: registration.presentation,
        lookingFor: registration.looking_for,
        status: registration.status,
        createdAt: registration.created_at,
        updatedAt: registration.updated_at,
      },
    };
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Récupérer toutes les inscriptions (pour dashboard admin)
 */
export const getAllRegistrations = async (
  filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    limit?: number;
    offset?: number;
  }
): Promise<SupabaseResponse<RegistrationRecord[]>> => {
  try {
    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    // Appliquer les filtres
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Mapper les données
    const registrations: RegistrationRecord[] = data.map((r) => ({
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      email: r.email,
      phone: r.phone,
      age: r.age,
      city: r.city,
      profession: r.profession,
      presentation: r.presentation,
      lookingFor: r.looking_for,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return {
      success: true,
      data: registrations,
    };
  } catch (error) {
    console.error('❌ Erreur:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Récupérer une inscription par ID
 */
export const getRegistrationById = async (
  id: string
): Promise<SupabaseResponse<RegistrationRecord>> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        city: data.city,
        profession: data.profession,
        presentation: data.presentation,
        lookingFor: data.looking_for,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Mettre à jour le statut d'une inscription
 */
export const updateRegistrationStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<SupabaseResponse<RegistrationRecord>> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`✅ Statut mis à jour: ${id} → ${status}`);

    return {
      success: true,
      data: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        city: data.city,
        profession: data.profession,
        presentation: data.presentation,
        lookingFor: data.looking_for,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Supprimer une inscription
 */
export const deleteRegistration = async (
  id: string
): Promise<SupabaseResponse> => {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`🗑️ Inscription supprimée: ${id}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Obtenir les statistiques des inscriptions
 */
export const getRegistrationStats = async (): Promise<
  SupabaseResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>
> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('status');

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const stats = {
      total: data.length,
      pending: data.filter((r) => r.status === 'pending').length,
      approved: data.filter((r) => r.status === 'approved').length,
      rejected: data.filter((r) => r.status === 'rejected').length,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Vérifier la connexion à Supabase
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('registrations').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connexion Supabase échouée:', error.message);
      return false;
    }

    console.log('✅ Connexion Supabase réussie !');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Supabase:', error);
    return false;
  }
};

// Export du client pour usage avancé
export default supabase;
