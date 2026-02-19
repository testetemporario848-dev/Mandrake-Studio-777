import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key is injected via the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends an image and a prompt to Gemini to perform the edit.
 * Uses gemini-2.5-flash-image which is optimized for image manipulation tasks.
 */
export const generateEditedImage = async (
  base64Image: string,
  promptText: string
): Promise<string> => {
  try {
    // Clean base64 string if it contains metadata header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            {
                // Updated instruction to be more neutral and allow drastic changes if prompted
                text: "Instruction: You are an advanced AI photo editor. Edit the input image based on the user's request. You are capable of both realistic photo retouching and complete artistic transformations. Follow the user's prompt precisely, whether they ask for subtle adjustments or drastic changes."
            },
            {
                text: `User Request: ${promptText}`
            },
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64
                }
            }
        ]
      },
      // We don't use a schema here as we expect an image back, not JSON.
    });

    // Iterate through parts to find the image output
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};