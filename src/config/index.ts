import { Account, Client } from 'appwrite';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Configuration du SDK Appwrite

const client: Client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1' as string)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID as string);

export const account: Account = new Account(client); 

// Configuration du SDK Supabase
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)