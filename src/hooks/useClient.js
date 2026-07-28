import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { downloadGallery as downloadGalleryUtil } from "../utils/downloadGallery";

export default function useClient(clientId) {
  const [loading, setLoading] = useState(true);

  const [client, setClient] = useState(null);

  const [payments, setPayments] = useState([]);

  const [activities, setActivities] = useState([]);

  const [timeline, setTimeline] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [paidAmount, setPaidAmount] = useState(0);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    loadAll();
  }, [clientId]);

  const loadAll = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchClient(),
        fetchEmployees(),
        fetchActivities(),
        fetchTimeline(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Client
  // ==========================

  const fetchClient = async () => {
    try {
      const { data } = await API.get(`/client/${clientId}`);

      if (data.success) {
        setClient(data.client);
        setPayments(data.payments || []);
        setPaidAmount(data.paidAmount || 0);
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load client"
      );
    }
  };

  // ==========================
  // Employees
  // ==========================

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employee");

      setEmployees(data.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Activities
  // ==========================

  const fetchActivities = async () => {
    try {
      const { data } = await API.get(
        `/activity/${clientId}`
      );

      setActivities(data.activities || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Timeline
  // ==========================

  const fetchTimeline = async () => {
    try {
      const { data } = await API.get(
        `/timeline/${clientId}`
      );

      setTimeline(data.timeline || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Update Client
  // ==========================

  const updateClient = async (updatedData) => {
    try {
      const { data } = await API.put(
        `/client/${clientId}`,
        updatedData
      );

      if (data.success) {
        setClient(data.client);

        toast.success(
          data.message ||
            "Client updated successfully"
        );

        await fetchActivities();
        await fetchTimeline();

        return true;
      }

      return false;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update client"
      );

      return false;
    }
  };

  // ==========================
  // Workflow Update
  // ==========================

  const updateWorkflow = async (workflowData) => {
    try {
      const { data } = await API.put(
        `/client/${clientId}`,
        workflowData
      );

      if (data.success) {
        setClient(data.client);

        toast.success(
          data.message || "Workflow updated"
        );

        await fetchActivities();
        await fetchTimeline();

        return true;
      }

      return false;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Workflow update failed"
      );

      return false;
    }
  };
    // ==========================
  // Add Payment
  // ==========================

  const addPayment = async (payment) => {
    try {
      await API.post("/payment/add", {
        ...payment,
        client: clientId,
      });

      toast.success("Payment added successfully");

      await fetchClient();
      await fetchActivities();
      await fetchTimeline();

      return true;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to add payment"
      );

      return false;
    }
  };

  // ==========================
  // Delete Payment
  // ==========================

  const deletePayment = async (paymentId) => {
    try {
      await API.delete(`/payment/delete/${paymentId}`);

      toast.success("Payment deleted");

      await fetchClient();
      await fetchActivities();
      await fetchTimeline();

      return true;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to delete payment"
      );

      return false;
    }
  };

  // ==========================
  // Upload Files
  // ==========================

  const uploadFiles = async (category, files) => {
    if (!files || files.length === 0) return false;

    try {
      setUploading(true);
      setUploadProgress(0);
      // Album PDF Upload
        if (category === "albumPdf") {
        const formData = new FormData();
        formData.append("file", files[0]);

        const { data } = await API.post(
            `/client/upload-pdf/${clientId}`,
            formData,
            {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;

                setUploadProgress(
                Math.round(
                    (progressEvent.loaded * 100) /
                    progressEvent.total
                )
                );
            },
            }
        );

        if (data.success) {
            setClient(data.client);

            toast.success(data.message || "Album uploaded");

            await fetchActivities();
            await fetchTimeline();

            return true;
        }

        return false;
        }

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await API.post(
        `/client/upload/${clientId}/${category}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;

            const progress = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );

            setUploadProgress(progress);
          },
        }
      );

      if (data.success) {
        setClient(data.client);

        toast.success(
          data.message || "Files uploaded"
        );

        await fetchActivities();
        await fetchTimeline();

        return true;
      }

      return false;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Upload failed"
      );

      return false;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ==========================
  // Delete File
  // ==========================

  const deleteFile = async (category, index) => {
    try {
      const { data } = await API.delete(
        `/client/upload/${clientId}/${category}/${index}`
      );

      toast.success(
        data.message || "File deleted"
      );

      await fetchClient();
      await fetchActivities();
      await fetchTimeline();

      return true;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Delete failed"
      );

      return false;
    }
  };

  // ==========================
  // Download Gallery
  // ==========================

  const downloadGallery = async () => {
    
    try {
      await downloadGalleryUtil({
        client,

        onStart: () => {
          setDownloading(true);
        },

        onFinish: () => {
          setDownloading(false);
          toast.success("Gallery downloaded");
        },

        onError: () => {
          setDownloading(false);
          toast.error("Download failed");
        },
      });
    } catch (err) {
      console.error(err);

      setDownloading(false);

      toast.error("Download failed");
    }
  };

  return {
    loading,
    client,
    payments,
    activities,
    timeline,
    employees,
    paidAmount,

    uploading,
    uploadProgress,
    downloading,

    fetchClient,
    fetchEmployees,
    fetchActivities,
    fetchTimeline,

    updateClient,
    updateWorkflow,

    addPayment,
    deletePayment,

    uploadFiles,
    deleteFile,

    downloadGallery,
  };
}