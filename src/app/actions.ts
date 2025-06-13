
"use server";

import { z } from "zod";

// Define specific state types for the handleAddPhoto action
interface AddPhotoSuccessState {
  success: true;
  message: string;
  addedImageUrl: string;
  addedImageAlias?: string;
  errors?: undefined; // Ensure errors is undefined on success
}

interface AddPhotoErrorState {
  success: false;
  message: string;
  errors?: { [key: string]: string[] | undefined };
  addedImageUrl?: undefined; // Ensure these are undefined on error
  addedImageAlias?: undefined;
}

export type HandleAddPhotoState = AddPhotoSuccessState | AddPhotoErrorState | null;

// handleAddPlaylist server action is removed as playlist saving is now handled via API route and client-side form.

const PhotoFileSchema = z.object({
  imageFile: z.custom<File>((val) => val instanceof File, "Por favor, selecione um arquivo de imagem.")
    .refine((file) => file.size > 0, "O arquivo de imagem não pode estar vazio.")
    .refine((file) => file.type.startsWith("image/"), "O arquivo deve ser uma imagem."),
  imageAlias: z.string().optional(),
});


export async function handleAddPhoto(
  prevState: HandleAddPhotoState, // Use the defined type for prevState
  formData: FormData
): Promise<HandleAddPhotoState> { // Explicit return type
  const imageFile = formData.get('imageFile') as File | null;
  const rawImageAlias = formData.get('imageAlias') as string;

  if (!imageFile || imageFile.size === 0) { // Also check for empty file
    return {
      success: false,
      message: "Nenhum arquivo de imagem selecionado ou o arquivo está vazio.",
      errors: { imageFile: ["Por favor, selecione um arquivo de imagem válido."] }
    };
  }

  const validatedFields = PhotoFileSchema.safeParse({
    imageFile: imageFile,
    imageAlias: rawImageAlias
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação ao adicionar foto. Verifique os campos.",
    };
  }
  
  const { imageAlias } = validatedFields.data;

  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Ensure imageFile.type is a valid MIME type
    const mimeType = imageFile.type && imageFile.type.startsWith("image/") ? imageFile.type : 'application/octet-stream';
    const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

    if (dataUri.length > 1024 * 1024 * 4) { // ~4MB limit for Data URI before localStorage really struggles
        return {
            success: false,
            message: "A imagem é muito grande. Por favor, escolha uma imagem menor (idealmente < 2MB)."
        }
    }

    console.log("Photo file processed:", { fileName: imageFile.name, alias: imageAlias });
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    return { 
      success: true,
      message: `Foto "${imageAlias || imageFile.name}" carregada com sucesso!`,
      addedImageUrl: dataUri,
      addedImageAlias: imageAlias || imageFile.name
    };

  } catch (error) {
    console.error("Error processing image file:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return {
      success: false,
      message: `Ocorreu um erro ao processar o arquivo da imagem: ${errorMessage}`,
    };
  }
}
