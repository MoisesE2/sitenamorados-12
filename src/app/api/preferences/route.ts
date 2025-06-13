
import { promises as fs } from 'fs';
import path from 'path';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { ServerPreferences } from '@/app/dashboard/page'; // Assuming this type is correctly defined or adjust path

const dataFilePath = path.join(process.cwd(), 'data', 'preferences.json');

const defaultPreferences: ServerPreferences = {
  anniversaryDate: null,
  playlistUrl: null,
  definingPhrase: "",
  coupleNames: ["Você", "Seu Amor"],
  nameDisplayPreference: "both",
  theme: "light",
};

async function ensurePreferencesFile(): Promise<ServerPreferences> {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // File doesn't exist, try to create it with default preferences
    try {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
      await fs.writeFile(dataFilePath, JSON.stringify(defaultPreferences, null, 2), 'utf8');
      return defaultPreferences;
    } catch (writeError) {
      console.error('Error creating preferences file:', writeError);
      // Return defaults in-memory if creation fails
      return defaultPreferences;
    }
  }

  // File exists, try to read and parse it
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents) as ServerPreferences;
  } catch (error) {
    console.error('Error reading or parsing preferences file:', error);
    // If reading or parsing fails, return defaults (consider if overwriting with defaults is desired here)
    return defaultPreferences;
  }
}

export async function GET(_req: NextRequest) {
  try {
    const preferences = await ensurePreferencesFile();
    return NextResponse.json(preferences, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Failed to get preferences:', error);
    // Fallback to default if ensurePreferencesFile itself throws an unexpected error
    return NextResponse.json(defaultPreferences, { 
      status: 200, // Still return 200 with defaults
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }); 
  }
}

export async function POST(req: NextRequest) {
  try {
    const newPreferences = await req.json() as Partial<ServerPreferences>; // Allow partial updates
    if (!newPreferences || Object.keys(newPreferences).length === 0) {
      return NextResponse.json({ message: "Nenhuma preferência fornecida para salvar." }, { status: 400 });
    }

    // Fetch current preferences to merge with new ones
    const currentPreferences = await ensurePreferencesFile();
    
    // Merge, ensuring newPreferences takes precedence
    const updatedPreferences: ServerPreferences = {
      ...currentPreferences,
      ...newPreferences
    };
    
    // Re-apply defaults/validation logic for specific fields if they are being updated
    // or if they are missing from the merged object somehow (though spread should cover it)
    if (newPreferences.coupleNames !== undefined) {
        if (!Array.isArray(newPreferences.coupleNames) || newPreferences.coupleNames.length !== 2 || !newPreferences.coupleNames[0] || !newPreferences.coupleNames[1]) {
            updatedPreferences.coupleNames = defaultPreferences.coupleNames; // Fallback if invalid structure
        } else {
            updatedPreferences.coupleNames = newPreferences.coupleNames;
        }
    }
    if (newPreferences.theme !== undefined && !['light', 'dark'].includes(newPreferences.theme)) {
        updatedPreferences.theme = defaultPreferences.theme;
    }
    if (newPreferences.nameDisplayPreference !== undefined && !['both', 'user1', 'user2'].includes(newPreferences.nameDisplayPreference)) {
        updatedPreferences.nameDisplayPreference = defaultPreferences.nameDisplayPreference;
    }
    // For string fields like definingPhrase and playlistUrl, null is acceptable for "not set"
    // anniversaryDate can also be null


    await fs.writeFile(dataFilePath, JSON.stringify(updatedPreferences, null, 2), 'utf8');
    return NextResponse.json({ message: "Preferências salvas com sucesso!", success: true, preferences: updatedPreferences }, { status: 200 });
  } catch (error) {
    console.error('Failed to save preferences:', error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar preferências.";
    return NextResponse.json({ message: `Erro ao salvar preferências no servidor: ${errorMessage}`, success: false }, { status: 500 });
  }
}
