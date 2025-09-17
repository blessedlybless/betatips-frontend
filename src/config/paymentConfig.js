// Your real bank account details for Beta Tips
export const PAYMENT_CONFIG = {
  bankName: "Your Bank Name",              // Replace with your real bank name
  accountNumber: "1234567890",             // Replace with your real account number
  accountName: "Your Account Name",        // Replace with your real account name
  whatsappNumber: "2348012345678",         // Replace with your real WhatsApp number
  whatsappLink: "https://wa.me/2348012345678", // Replace with your WhatsApp link
  
  // Payment amounts
  vipPrice: 10000,
  vipDuration: "30 days",
  
  // Additional payment methods (optional)
  alternativePayments: [
    {
      method: "Opay",
      number: "08012345678",               // Replace with your real Opay number
      name: "Your Name"                    // Replace with your real name
    },
    {
      method: "Palmpay", 
      number: "08012345678",               // Replace with your real Palmpay number
      name: "Your Name"                    // Replace with your real name
    }
  ]
};
