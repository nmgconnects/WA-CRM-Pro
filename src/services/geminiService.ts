import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  async generateResponse(prompt: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || "No response generated.";
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "I'm sorry, I couldn't generate a response right now.";
    }
  },

  async helpCompose(clientMessage: string, context: string) {
    const prompt = `You are a professional CRM assistant. Help compose a polite and effective reply to the following WhatsApp message from a client.
    
Client Message: "${clientMessage}"
Context: "${context}"

Draft a clear, concise, and helpful response:`;
    
    return this.generateResponse(prompt);
  },

  async refineMessage(message: string) {
    const prompt = `Refine this WhatsApp campaign message to be more professional, engaging, and clear, while staying concise for a mobile screen:

"${message}"

Refined Message:`;
    return this.generateResponse(prompt);
  },

  async scoreLead(contactInfo: string, interactions: string) {
    const prompt = `Act as a senior sales analyst. Analyze the following contact data and recent interactions to determine a lead score from 0-100. 
    Provide a brief 1-sentence justification and the score.
    
    Contact: ${contactInfo}
    Interactions: ${interactions}
    
    Format: SCORE: [number] | REASON: [justification]`;
    return this.generateResponse(prompt);
  },

  async analyzeSentiment(message: string) {
    const prompt = `Analyze the sentiment of this WhatsApp message: "${message}". 
    Categorize it as POSITIVE, NEUTRAL, or NEGATIVE. 
    Also detect if the user is asking for: PRICING, SUPPORT, or DEMO.
    
    Format: SENTIMENT: [category] | INTENT: [intent or none]`;
    return this.generateResponse(prompt);
  },

  async summarizeChat(history: string) {
    const prompt = `Provide a concise 3-bullet summary of this conversation history:
    
    ${history}
    
    Summary:`;
    return this.generateResponse(prompt);
  },

  async suggestFollowUpDate(message: string) {
    const prompt = `Based on this client message, suggest a logical follow-up time (e.g., "Tomorrow morning", "Next Monday", "In 2 hours") and a reason.
    
    Message: "${message}"
    
    Format: TIME: [suggested time] | REASON: [short reason]`;
    return this.generateResponse(prompt);
  },

  async translateMessage(text: string, targetLanguage: string = "English") {
    const prompt = `Translate the following message into ${targetLanguage}:
    
"${text}"

Translation:`;
    
    return this.generateResponse(prompt);
  }
};
