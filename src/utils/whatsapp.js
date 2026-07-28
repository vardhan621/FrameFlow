// ======================================
// whatsapp.js
// ======================================

export const sendWhatsApp = ({
  phone,
  clientName = "",
  eventType = "",
  eventDate = "",
  bookingId = "",
  totalAmount = 0,
  paidAmount = 0,
}) => {

  if (!phone) return;

  const mobile = String(phone).replace(/\D/g, "");

  const balance = Number(totalAmount) - Number(paidAmount);

  const message = `Hello ${clientName},

📸 Event : ${eventType}

📅 Event Date :
${eventDate
    ? new Date(eventDate).toLocaleDateString()
    : "-"}

🆔 Booking ID :
${bookingId}

💰 Package :
₹ ${Number(totalAmount).toLocaleString("en-IN")}

✅ Paid :
₹ ${Number(paidAmount).toLocaleString("en-IN")}

⌛ Balance :
₹ ${Number(balance).toLocaleString("en-IN")}

Thank You 🙏
FrameFlow Studio`;

  const url =
    `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};