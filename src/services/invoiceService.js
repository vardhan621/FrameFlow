import api from "./api";

// Generate / Preview Invoice
export const getInvoice = async (clientId) => {
  const response = await api.get(`/invoice/${clientId}`, {
    responseType: "blob",
  });

  return response.data;
};

// Download Invoice
export const downloadInvoice = async (clientId) => {
  const response = await api.get(`/invoice/${clientId}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);

  const link = document.createElement("a");

  link.href = url;
  link.download = `Invoice-${clientId}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
export const emailInvoice = async (clientId) => {
  const res = await api.post(`/invoice/${clientId}/email`);
  return res.data;
};
export const whatsappInvoice = async (clientId) => {
  const res = await api.post(
    `/invoice/${clientId}/whatsapp`
  );

  return res.data;
};
// Print Invoice
export const printInvoice = (blob) => {
  const url = window.URL.createObjectURL(blob);

  const frame = document.createElement("iframe");

  frame.style.display = "none";

  frame.src = url;

  document.body.appendChild(frame);

  frame.onload = () => {
    frame.contentWindow.print();
  };
};