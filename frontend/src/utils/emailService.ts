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
    // We are using Web3Forms as an immediate, reliable backend API out-of-the-box.
    // Unlike FormSubmit, it doesn't require "activation link" clicking per form.
    // To change to the Node backend we created, simply change the URL to 'http://localhost:5000/api/send-email'
    const WEB3FORMS_ACCESS_KEY = "8e983411-cf47-49cc-85e7-2b5d4fb1758c"; // Place your Web3forms access key here. You can get a free one at web3forms.com
    
    // Fallback payload using the structure requested
    const body = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: payload.subject,
      from_name: `SeeV Platforms - ${payload.customerName}`,
      to_email: "grandtwoaar@gmail.com", // Target admin inbox
      
      "Service Requested": payload.serviceType,
      ...(payload.template && { "Template Selected": payload.template }),
      ...(payload.plan && { "Tier Plan": payload.plan }),
      ...(payload.price && { "Total Price/Quote": payload.price }),
      
      "--- CUSTOMER DETAILS ---": "",
      "Name": payload.customerName,
      "Email": payload.email,
      ...(payload.phone && { "Phone": payload.phone }),
      ...(payload.company && { "Company": payload.company }),
      
      "--- PROJECT PARAMETERS ---": "",
      ...(payload.timeline && { "Requested Timeline": payload.timeline }),
      ...(payload.budget && { "Budget Range": payload.budget }),
      ...(payload.description && { "Project Description": payload.description }),
      ...(payload.requirements && { "Special Requirements": payload.requirements }),
      ...(payload.additionalInfo && { "Additional Information": payload.additionalInfo }),
    };

    const res = await fetch("https://api.web3forms.com/submit", {
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
