export const messages = {

  booking(client){

    return `Hello ${client.clientName},

Your booking has been confirmed.

📅 Event : ${client.eventType}

📆 Date : ${new Date(client.eventDate).toLocaleDateString()}

Thank you.

- ${client.studioName || "FrameFlow Studio"}`;

  },

  payment(client){

    return `Hello ${client.clientName},

Pending Amount : ₹${client.pendingAmount}

Kindly complete your payment.

Thank you.`;

  },

  gallery(client){

    return `Hello ${client.clientName},

Your Gallery is Ready.

Gallery Link:

${window.location.origin}/gallery/${client.galleryToken}`;

  },

  album(client){

    return `Hello ${client.clientName},

Your Album is Ready for Delivery.

Thank you.`;

  },

  delivery(client){

    return `Hello ${client.clientName},

Your Project has been Delivered.

Thank you for choosing us ❤️`;

  }

};