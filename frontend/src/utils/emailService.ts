// src/utils/emailService.ts

/**
 * Global Email Request System
 * Clean abstraction to send emails matching a unified template.
 * Easily switchable between Backend API, Web3Forms, or EmailJS.
 */

interface EmailPayload {
  subject: string;
  serviceType: string;
  template?: string;
  plan?: string;
  price?: string | null;
  customerName: string;
  email: string;
  phone?: string;
  company?: string;
  timeline?: string;
  budget?: string;
  description?: string;
  requirements?: string;
  additionalInfo?: string; // E.g., Payment details
}

export const sendEmailRequest = async (payload: EmailPayload) => {
  try {
    // You requested FormSubmit.co instead of the Node backend.
    // FormSubmit allows AJAX submissions directly without needing a separate backend server.
    const TARGET_EMAIL = "grandtwoaar@gmail.com";
    
    // Fallback payload using the structure requested
    const body = {
      _subject: payload.subject, // FormSubmit uses _subject to control the email subject
      name: payload.customerName,
      email: payload.email,
      
      // We pass the rest of the data dynamically
      Service_Requested: payload.serviceType,
      ...(payload.template && { Template_Selected: payload.template }),
      ...(payload.plan && { Tier_Plan: payload.plan }),
      ...(payload.price && { Total_Price_Quote: payload.price }),
      
      ...(payload.phone && { Phone: payload.phone }),
      ...(payload.company && { Company: payload.company }),
      
      ...(payload.timeline && { Requested_Timeline: payload.timeline }),
      ...(payload.budget && { Budget_Range: payload.budget }),
      ...(payload.description && { Project_Description: payload.description }),
      ...(payload.requirements && { Special_Requirements: payload.requirements }),
      ...(payload.additionalInfo && { Additional_Information: payload.additionalInfo }),
    };

    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Email server failed to respond.");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to send email API request:", error);
    throw error;
  }
};
