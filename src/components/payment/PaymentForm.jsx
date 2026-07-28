import { useEffect, useState } from "react";
import API from "../../services/api";
import InputField from "../common/InputField";
import LoadingButton from "../common/LoadingButton";
import toast from "react-hot-toast";

function PaymentForm({
  payment,
  onSuccess,
}){
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    amount: "",
    paymentMethod: "Cash",
    notes: "",
  });

  useEffect(() => {
    fetchClients();

  }, []);
  useEffect(() => {
  if (payment) {
    setFormData({
      client: payment.client?._id || payment.client || "",
      amount: payment.amount || "",
      paymentMethod: payment.paymentMethod || "Cash",
      notes: payment.notes || "",
    });
  }
}, [payment]);

  const fetchClients = async () => {
    try {
      const res = await API.get("/client");
      setClients(res.data.clients);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (payment) {
        await API.put(
            `/payment/update/${payment._id}`,
            formData
        );

        toast.success("Payment Updated Successfully");
      } else {
        await API.post("/payment/add", formData);

        toast.success("Payment Added Successfully");
      }

      if (onSuccess) {
       onSuccess();
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <label className="text-white block">
        Client
      </label>

      <select
        name="client"
        value={formData.client}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
      >
        <option value="">Select Client</option>

        {clients.map((client) => (
          <option
            key={client._id}
            value={client._id}
          >
            {client.clientName}
          </option>
        ))}
      </select>

      <InputField
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
      />

      <label className="text-white block">
        Payment Method
      </label>

      <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Bank</option>
      </select>

      <InputField
        label="Notes"
        name="notes"
        type="text"
        value={formData.notes}
        onChange={handleChange}
      />

      <LoadingButton
        loading={loading}
        type="submit"
      >
        Save Payment
      </LoadingButton>

    </form>
  );
}

export default PaymentForm;