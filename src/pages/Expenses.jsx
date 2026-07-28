import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function Expenses() {

  const navigate = useNavigate();
  const location = useLocation();

  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [thisMonthExpense, setThisMonthExpense] = useState(0);
  const [categorySummary, setCategorySummary] = useState({});

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [studio, setStudio] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "Other",
    amount: "",
    paymentMode: "Cash",
    paidBy: "",
    notes: "",
  });
  
  const categories = [
    "All",
    "Salary",
    "Equipment",
    "Travel",
    "Food",
    "Marketing",
    "Office",
    "Rent",
    "Internet",
    "Electricity",
    "Maintenance",
    "Other",
  ];

  useEffect(() => {

    loadExpenses();

  }, []);

  useEffect(() => {

    const params = new URLSearchParams(location.search);

    if (params.get("new") === "true") {

      document
        .querySelector("form")
        ?.scrollIntoView({
          behavior: "smooth",
        });

    }

  }, [location]);

  const loadExpenses = async () => {

    try {

      const [expenseRes, settingRes] = await Promise.all([
        API.get("/expense"),
        API.get("/settings"),
      ]);

      setExpenses(expenseRes.data.expenses);

      setTotalExpense(expenseRes.data.totalExpense);

      setThisMonthExpense(
        expenseRes.data.thisMonthExpense
      );

      setCategorySummary(
        expenseRes.data.categorySummary
      );

      setStudio(settingRes.data.studio);

    } catch (err) {

      console.log(err);

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const filteredExpenses = useMemo(() => {

    return expenses.filter((expense) => {

      const searchMatch =
        expense.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (expense.paidBy || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const monthMatch =
        monthFilter === ""
          ? true
          : new Date(expense.expenseDate)
              .getMonth() + 1 ===
            Number(monthFilter);

      const categoryMatch =
        categoryFilter === "All"
          ? true
          : expense.category === categoryFilter;

      return (
        searchMatch &&
        monthMatch &&
        categoryMatch
      );

    });

  }, [
    expenses,
    search,
    monthFilter,
    categoryFilter,
  ]);

  const addExpense = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await API.put(
          `/expense/${editingId}`,
          form
        );

        toast.success(
          "Expense Updated"
        );

      } else {

        await API.post(
          "/expense",
          form
        );

        toast.success(
          "Expense Added"
        );

      }

      setEditingId(null);

      setForm({
        title: "",
        category: "Other",
        amount: "",
        paymentMode: "Cash",
        paidBy: "",
        notes: "",
      });

      await loadExpenses();

      if (
        location.search.includes("new=true")
      ) {

        navigate("/dashboard");

      }

    } catch (err) {

      console.log(err);

      toast.error("Failed");

    }

  };

  const deleteExpense = async (id) => {

    if (
      !window.confirm(
        "Delete Expense?"
      )
    )
      return;

    try {

      await API.delete(
        `/expense/${id}`
      );

      toast.success(
        "Expense Deleted"
      );

      loadExpenses();

    } catch {

      toast.error(
        "Delete Failed"
      );

    }

  };

  const exportPDF = async() => {

    const doc = new jsPDF("p", "mm", "a4");
    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
    };

    // ===== Header =====

    // ===== Header =====

    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 32, "F");

    if (studio?.logo) {

      try {

        const logo = await getBase64FromUrl(studio.logo);

        // Black Circle
        doc.setFillColor(0, 0, 0);
        doc.circle(20, 16, 12, "F");

        // White Inner Circle
        doc.setFillColor(255, 255, 255);
        doc.circle(20, 16, 10.5, "F");

        // Logo
        doc.addImage(
          logo,
          "PNG",
          10.5,
          6.5,
          19,
          19
        );

      } catch (err) {

        console.log(err);

      }

    }

    doc.setTextColor(255);

    doc.setFont("times", "bold");

    doc.setFontSize(20);

    doc.text(
      studio?.studioName || "FRAMEFLOW STUDIO",
      105,
      12,
      { align: "center" }
    );

    doc.setFontSize(11);

    doc.text(
      "Expense Report",
      105,
      21,
      { align: "center" }
    );
    // ===== Studio Details =====

    doc.setTextColor(0);

    doc.setFontSize(11);

    let y = 38;

    doc.setFont("times", "bold");
    doc.text("Studio Details", 14, y);

    y += 7;

    doc.setFont("times", "normal");

    doc.text(
      `Owner : ${studio?.ownerName || "-"}`,
      14,
      y
    );

    y += 6;

    doc.text(
      `Phone : ${studio?.phone || "-"}`,
      14,
      y
    );

    y += 6;

    doc.text(
      `Email : ${studio?.email || "-"}`,
      14,
      y
    );

    y += 6;

    doc.text(
      `Generated : ${new Date().toLocaleString()}`,
      14,
      y
    );

    // ===== Summary =====

    y += 12;

    doc.setFillColor(245, 245, 245);

    doc.roundedRect(
      14,
      y,
      182,
      28,
      2,
      2,
      "F"
    );

   doc.setFont("times", "bold");
    doc.setFontSize(13);

    doc.text(
      "Expense Summary",
      18,
      y + 8
    );

    doc.setFontSize(11);
    doc.setFont("times", "normal");

    doc.text(
      `Total Expense : Rs. ${totalExpense.toLocaleString()}`,
      18,
      y + 17
    );

    doc.text(
      `This Month : Rs. ${thisMonthExpense.toLocaleString()}`,
      90,
      y + 17
    );

    doc.text(
      `Records : ${filteredExpenses.length}`,
      155,
      y + 17
    );

    // ===== Expense Table =====

    autoTable(doc, {

      startY: y + 38,

      head: [[
        "#",
        "Title",
        "Category",
        "Amount",
        "Paid By",
        "Date",
      ]],

      body: filteredExpenses.map(
        (e, index) => [

          index + 1,

          e.title,

          e.category,

          `Rs. ${Number(e.amount).toLocaleString()}`,

          e.paidBy || "-",

          new Date(
            e.expenseDate
          ).toLocaleDateString(),

        ]
      ),

      headStyles: {

        fillColor: [37, 99, 235],

        textColor: 255,

        halign: "center",

        fontStyle: "bold",

      },

      styles: {

        fontSize: 10,

        cellPadding: 3,

      },

      alternateRowStyles: {

        fillColor: [248, 250, 252],

      },
      theme: "grid",

      tableWidth: "auto",

      styles: {
        font: "times",
        fontSize: 10,
        cellPadding: 3,
      },

      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 55 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
      },

    });

    // ===== Category Summary =====

    let finalY = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(13);
    doc.setFont("times", "bold");

    doc.text(
      "Category Summary",
      14,
      finalY
    );

    finalY += 8;

    doc.setFontSize(10);
    doc.setFont("times", "normal");

    Object.entries(categorySummary).forEach(
      ([cat, amt]) => {

        doc.text(
          cat,
          20,
          finalY
        );

        doc.text(
          `Rs. ${Number(amt).toLocaleString()}`,
          150,
          finalY
        );

        finalY += 6;

      }
    );

    finalY += 5;

    doc.setDrawColor(180);

    doc.line(
      14,
      finalY,
      196,
      finalY
    );

    finalY += 8;

    doc.setFontSize(13);

    doc.setFont("times","normal");

    doc.setFillColor(37,99,235);

    doc.roundedRect(
      14,
      finalY-7,
      182,
      12,
      2,
      2,
      "F"
    );

    doc.setTextColor(255);

    doc.setFontSize(12);

    doc.setFont("times","bold");

    doc.text(
      `Grand Total : Rs. ${totalExpense.toLocaleString()}`,
      18,
      finalY
    );

    doc.setTextColor(0);

    // ===== Footer =====

    doc.setFontSize(9);

    doc.setFont(
      "helvetica",
      "italic"
    );

    doc.setTextColor(120);

    doc.setFontSize(9);

    doc.setTextColor(120);

    doc.text(
      "Generated by FrameFlow Studio Management System",
      105,
      287,
      { align: "center" }
    );

    doc.text(
      `Page 1`,
      185,
      287
    );

    doc.save("Expense_Report.pdf");

  };

  const exportExcel = () => {

    const ws =
      XLSX.utils.json_to_sheet(
        filteredExpenses
      );

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Expenses"
    );

    XLSX.writeFile(
      wb,
      "Expense_Report.xlsx"
    );

  };
    return (
    <Layout>

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold text-white">
              Expense Management
            </h1>

            <p className="text-gray-400 mt-1">
              Manage all studio expenses
            </p>

          </div>

        </div>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

            <p className="text-gray-400">
              Total Expense
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              ₹{totalExpense.toLocaleString()}
            </h2>

          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

            <p className="text-gray-400">
              This Month Expense
            </p>

            <h2 className="text-3xl font-bold text-yellow-400 mt-2">
              ₹{thisMonthExpense.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* Add / Edit Expense */}

        <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-800">

          <h2 className="text-xl font-bold text-white mb-6">

            {editingId
              ? "Edit Expense"
              : "Add Expense"}

          </h2>

          <form
            onSubmit={addExpense}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Expense Title"
              required
              className="p-3 rounded-lg bg-slate-800 text-white outline-none"
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
              className="p-3 rounded-lg bg-slate-800 text-white outline-none"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 text-white"
            >

              {categories
                .filter(
                  (c) => c !== "All"
                )
                .map((cat) => (

                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>

                ))}

            </select>

            <select
              name="paymentMode"
              value={form.paymentMode}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 text-white"
            >

              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Card</option>
              <option>Cheque</option>

            </select>

            <input
              name="paidBy"
              value={form.paidBy}
              onChange={handleChange}
              placeholder="Paid By"
              className="p-3 rounded-lg bg-slate-800 text-white outline-none"
            />

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="md:col-span-2 p-3 rounded-lg bg-slate-800 text-white outline-none"
            />

            <div className="md:col-span-2 flex gap-3">

              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3"
              >

                {editingId
                  ? "Update Expense"
                  : "Add Expense"}

              </button>

              {editingId && (

                <button
                  type="button"
                  onClick={() => {

                    setEditingId(null);

                    setForm({
                      title: "",
                      category: "Other",
                      amount: "",
                      paymentMode: "Cash",
                      paidBy: "",
                      notes: "",
                    });

                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 rounded-lg"
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>
                {/* Search & Filters */}

        <div className="bg-slate-900 rounded-xl p-5 mb-8 border border-slate-800">

          <div className="grid lg:grid-cols-5 gap-4">

            <input
              type="text"
              placeholder="🔍 Search Expense..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-slate-800 rounded-lg px-4 py-3 text-white outline-none"
            />

            <select
              value={monthFilter}
              onChange={(e) =>
                setMonthFilter(e.target.value)
              }
              className="bg-slate-800 rounded-lg px-4 py-3 text-white"
            >
              <option value="">
                All Months
              </option>

              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>

            </select>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="bg-slate-800 rounded-lg px-4 py-3 text-white"
            >

              {categories.map((cat) => (

                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>

              ))}

            </select>

            <button
              onClick={exportPDF}
              className="bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              Export PDF
            </button>

            <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 rounded-lg text-white"
            >
              Export Excel
            </button>

          </div>

        </div>

        {/* Expense Table */}

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-8">

          <div className="flex justify-between items-center p-5 border-b border-slate-800">

            <h2 className="text-2xl font-bold text-white">
              Expense List
            </h2>

            <span className="text-red-400 font-bold text-xl">
              ₹{totalExpense.toLocaleString()}
            </span>

          </div>

          {filteredExpenses.length === 0 ? (

            <div className="text-center py-10 text-gray-400">
              No Matching Expenses Found
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-white">

                <thead className="bg-slate-800">

                  <tr>

                    <th className="p-4 text-left">
                      Title
                    </th>

                    <th className="p-4">
                      Category
                    </th>

                    <th className="p-4">
                      Amount
                    </th>

                    <th className="p-4">
                      Payment
                    </th>

                    <th className="p-4">
                      Paid By
                    </th>

                    <th className="p-4">
                      Date
                    </th>

                    <th className="p-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredExpenses.map((expense) => (

                    <tr
                      key={expense._id}
                      className="border-t border-slate-800 hover:bg-slate-800"
                    >

                      <td className="p-4">
                        {expense.title}
                      </td>

                      <td className="text-center">
                        {expense.category}
                      </td>

                      <td className="text-center text-red-400 font-semibold">
                        ₹{Number(expense.amount).toLocaleString()}
                      </td>

                      <td className="text-center">
                        {expense.paymentMode}
                      </td>

                      <td className="text-center">
                        {expense.paidBy || "-"}
                      </td>

                      <td className="text-center">
                        {new Date(
                          expense.expenseDate
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => {

                              setEditingId(expense._id);

                              setForm({

                                title: expense.title,
                                category: expense.category,
                                amount: expense.amount,
                                paymentMode: expense.paymentMode,
                                paidBy: expense.paidBy,
                                notes: expense.notes,

                              });

                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });

                            }}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteExpense(expense._id)
                            }
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
                {/* Category Summary */}

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">

          <h2 className="text-2xl font-bold text-white mb-6">
            Category Summary
          </h2>

          {Object.keys(categorySummary).length === 0 ? (

            <div className="text-center py-10 text-gray-400">
              No Expense Data Found
            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {Object.entries(categorySummary).map(
                ([category, amount]) => (

                  <div
                    key={category}
                    className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-blue-500 transition"
                  >

                    <p className="text-gray-400 text-sm">
                      {category}
                    </p>

                    <h3 className="text-3xl font-bold text-red-400 mt-2">
                      ₹{Number(amount).toLocaleString()}
                    </h3>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </Layout>

  );

}

export default Expenses;