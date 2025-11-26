import { GoogleGenAI } from "@google/genai";
import { Language, Task } from "../types";

const getClient = () => {
    if(!process.env.API_KEY) {
        console.warn("API_KEY not set. Mocking responses.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateExecutiveSummary = async (language: Language, tasks: Task[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "API Key missing. Simulation mode: Madame Birouk confirms the schedule is tight but manageable. Focus on critical path activities in Area 2.";

    const criticalTasks = tasks.filter(t => t.riskLevel === 'Critical').length;
    const delayedTasks = tasks.filter(t => t.status === 'Delayed').length;

    const prompt = `
    You are Madame Salima BIROUK, a strict, professional, and world-renowned Construction Planning Authority in Africa.
    
    Write a 5-line Weekly Executive Summary for the "3WLA Jorf Lasfar Project".
    Language: ${language}
    
    Data Context:
    - Total Tasks: ${tasks.length}
    - Critical Risks: ${criticalTasks}
    - Delayed Activities: ${delayedTasks}
    
    Tone: Authoritative, decisive, focused on HSE and Progress. Mention "AWP compliance" and "Safety First".
    End with "Signed: Salima BIROUK".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating summary. Connection to AI HQ failed.";
    }
};

export const analyzeRisks = async (tasks: Task[]): Promise<any> => {
    const ai = getClient();
    if (!ai) return { highRisks: [], mitigation: "Simulation: Ensure PTW compliance for all lifting operations." };

    const taskDescriptions = tasks.slice(0, 10).map(t => t.description).join(", ");
    
    const prompt = `
    Analyze these construction tasks for hidden HSE risks and SIMOPS (Simultaneous Operations):
    ${taskDescriptions}
    
    Return a JSON object (no markdown) with:
    {
      "topRisks": ["string"],
      "simopsDetected": boolean,
      "mitigationAdvice": "string"
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text);
    } catch (error) {
        return { topRisks: ["General Site Safety"], simopsDetected: false, mitigationAdvice: "Standard procedures apply." };
    }
};
