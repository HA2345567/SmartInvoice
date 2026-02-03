import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using 'gemini-2.0-flash' to resolve regional availability issues with 1.5-flash
export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
});

export const geminiModelVision = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
});

export async function enhanceText(text: string, mode: 'formal' | 'friendly' | 'detailed'): Promise<string> {
    const prompt = `Enhance the following text to be more ${mode} for an invoice description or notes. 
  Original text: "${text}"
  Return only the enhanced text, nothing else.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
}

export async function scanReceipt(base64Image: string, mimeType: string) {
    // If it's a PDF, we might need different handling depending on the library, 
    // but Gemini 1.5 handles PDF bytes directly in the same way as images.
    const prompt = `Extract information from this receipt/document. 
  Focus on: merchant/vendor name, total amount, date, and category (e.g., Office, Travel, Software, Food, etc.).
  Return the data in EXACTLY this JSON format:
  {
    "merchant": "Name",
    "amount": 123.45,
    "date": "YYYY-MM-DD",
    "category": "Category",
    "confidence": 95
  }`;

    const result = await geminiModelVision.generateContent([
        {
            inlineData: {
                data: base64Image,
                mimeType: mimeType
            }
        },
        { text: prompt }
    ]);

    const response = await result.response;
    const text = response.text();
    console.log("RAW AI RESPONSE:", text);

    // Clean potential markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    try {
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse AI JSON:", cleanJson);
        throw new Error("AI returned invalid data format. Please try again.");
    }
}
