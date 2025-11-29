import { GoogleGenAI, Type } from "@google/genai";
import { BackendService, DOCTORS } from './mockBackend';

if (!process.env.API_KEY) {
  const errorMsg = "API_KEY environment variable not set.";
  alert(errorMsg);
  throw new Error(errorMsg);
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Existing Function kept for compatibility if needed, but we are moving to Agentic
export const getDoctors = () => BackendService.getDoctors();

export const suggestAppointmentSlots = async (reason: string, doctorId: string, date: string) => {
    const doctors = BackendService.getDoctors();
    const selectedDoctor = doctors.find(d => d.id === doctorId);

    if (!selectedDoctor) {
        return [];
    }

    const prompt = `
      Context: A patient wants to book an appointment with ${selectedDoctor.name} (${selectedDoctor.specialization}) on ${date}.
      Reason for visit: "${reason}".
      
      Task: Generate 3 realistic available time slots for this appointment. 
      The slots should be appropriate for a clinic (e.g., between 9 AM and 5 PM).
      
      Return a JSON array of strings, e.g. ["10:00 AM", "02:30 PM", "04:15 PM"].
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                },
            },
        });
        
        const times: string[] = JSON.parse(response.text.trim());

        return times.map(time => ({
            time,
            doctor: selectedDoctor
        }));
    } catch (error) {
        console.error("Slot Generation Error:", error);
        // Fallback slots if AI fails
        return [
            { time: "09:00 AM", doctor: selectedDoctor },
            { time: "01:00 PM", doctor: selectedDoctor },
            { time: "04:00 PM", doctor: selectedDoctor }
        ];
    }
};

export const parseAgenticRequest = async (userRequest: string) => {
    const doctors = BackendService.getDoctors();
    const doctorsList = doctors.map(d => `${d.name} (ID: ${d.id}, Specialization: ${d.specialization})`).join('\n');
    const today = new Date().toDateString();

    const prompt = `
      Current Date: ${today}
      
      You are an intelligent booking agent for a clinic. 
      Available Doctors:
      ${doctorsList}

      User Request: "${userRequest}"

      Task:
      1. Identify the most suitable doctor based on the user's medical need (e.g., heart -> Cardiology).
      2. Extract the desired date and time. If vague (e.g., "next Monday morning"), pick a specific logical slot (e.g., 10:00 AM).
      3. Summarize the reason.
      
      Return a JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        foundDoctorId: { type: Type.STRING },
                        suggestedDateISO: { type: Type.STRING, description: "ISO 8601 Date string" },
                        reason: { type: Type.STRING },
                        confidence: { type: Type.NUMBER, description: "0 to 1 confidence level" }
                    },
                    required: ['foundDoctorId', 'suggestedDateISO', 'reason', 'confidence'],
                },
            },
        });
        
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Agentic Parsing Error:", error);
        return null;
    }
};