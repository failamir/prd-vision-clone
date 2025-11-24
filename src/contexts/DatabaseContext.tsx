import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { supabase as primaryClient } from '@/integrations/supabase/client';

type DatabaseType = 'primary' | 'secondary';

interface DatabaseContextType {
  supabase: SupabaseClient<Database>;
  currentDatabase: DatabaseType;
  switchDatabase: (type: DatabaseType) => void;
  duplicateToSecondary: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const SECONDARY_CONFIG = {
  url: 'https://flbieqiieplhuebceewp.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYmllcWlpZXBsaHVlYmNlZXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjczNzYsImV4cCI6MjA2OTIwMzM3Nn0.oYkic-WUKgHXrOj_t-hFETwfOZRcNPSuLmw_JE5wc8g',
};

const secondaryClient = createClient<Database>(SECONDARY_CONFIG.url, SECONDARY_CONFIG.key, {
  auth: {
    storage: localStorage,
    storageKey: 'sb-secondary-auth-token',
    persistSession: true,
    autoRefreshToken: true,
  }
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [currentDatabase, setCurrentDatabase] = useState<DatabaseType>(() => {
    const saved = localStorage.getItem('selected-database');
    return (saved as DatabaseType) || 'primary';
  });

  const [supabase, setSupabase] = useState<SupabaseClient<Database>>(
    currentDatabase === 'primary' ? primaryClient : secondaryClient
  );

  const switchDatabase = (type: DatabaseType) => {
    setCurrentDatabase(type);
    localStorage.setItem('selected-database', type);
    setSupabase(type === 'primary' ? primaryClient : secondaryClient);
  };

  const duplicateToSecondary = async () => {
    // Tables to duplicate
    const tables = [
      'candidate_profiles',
      'candidate_cvs',
      'candidate_certificates',
      'candidate_documents',
      'candidate_education',
      'candidate_emergency_contacts',
      'candidate_experience',
      'candidate_medical_tests',
      'candidate_next_of_kin',
      'candidate_references',
      'candidate_skills',
      'candidate_travel_documents',
      'job_categories',
      'jobs',
      'job_applications',
      'saved_jobs',
      'skills',
      'testimonials',
      'user_roles',
      'messages'
    ];

    for (const table of tables) {
      try {
        // Fetch all data from primary
        const { data: primaryData, error: fetchError } = await primaryClient
          .from(table as any)
          .select('*');

        if (fetchError) {
          console.error(`Error fetching ${table}:`, fetchError);
          continue;
        }

        if (primaryData && primaryData.length > 0) {
          // Insert into secondary
          const { error: insertError } = await secondaryClient
            .from(table as any)
            .upsert(primaryData);

          if (insertError) {
            console.error(`Error inserting into ${table}:`, insertError);
          } else {
            console.log(`Successfully duplicated ${table}: ${primaryData.length} records`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${table}:`, error);
      }
    }
  };

  return (
    <DatabaseContext.Provider value={{ supabase, currentDatabase, switchDatabase, duplicateToSecondary }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}
