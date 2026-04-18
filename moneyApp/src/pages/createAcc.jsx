import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAcc() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const emptyMonthlyExpense = {
    name: "",
    amount: "",
    category: "",
    debt_type: "",
    current_balance: "",
    interest_rate: "",
    minimum_payment: "",
    current_payment: "",
  };

  const [formData, setFormData] = useState({
    username: "",
    name: {
      first: "",
      last: "",
    },
    email: "",
    password: "",
    date_of_birth: "",
    income: "",
    expenses: {
      monthly: [{ ...emptyMonthlyExpense }],
    },
  });

  const clearFieldValidity = (e) => {
    e.target.setCustomValidity("");
  };

  const setRequiredMessage = (e) => {
    e.target.setCustomValidity("Please be sure to fill out all fields");
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;

    if (name === "first" || name === "last") {
      setFormData((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          [name]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpenseChange = (index, field, value) => {
    const updated = [...formData.expenses.monthly];
    updated[index][field] = value;

    if (field === "category" && value !== "debt") {
      updated[index].debt_type = "";
      updated[index].current_balance = "";
      updated[index].interest_rate = "";
      updated[index].minimum_payment = "";
      updated[index].current_payment = "";
    }

    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        monthly: updated,
      },
    }));
  };

  const addMonthlyExpense = () => {
    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        monthly: [...prev.expenses.monthly, { ...emptyMonthlyExpense }],
      },
    }));
  };

  const removeMonthlyExpense = (index) => {
    const updated = formData.expenses.monthly.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        monthly: updated.length ? updated : [{ ...emptyMonthlyExpense }],
      },
    }));
  };

  const handleNext = () => {
    if (
      !formData.name.first.trim() ||
      !formData.name.last.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setMessage("Please be sure to fill out all fields");
      return;
    }

    setMessage("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.first.trim() ||
      !formData.name.last.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      formData.income === ""
    ) {
      setMessage("Please be sure to fill out all fields");
      return;
    }

    const payload = {
      username: formData.username.trim(),
      name: {
        first: formData.name.first.trim(),
        last: formData.name.last.trim(),
      },
      email: formData.email.trim(),
      password: formData.password,
      income: Number(formData.income) || 0,
      expenses: {
        monthly: formData.expenses.monthly
          .filter(
            (item) =>
              item.name.trim() !== "" ||
              item.amount !== "" ||
              item.category !== ""
          )
          .map((item) => ({
            name: item.name.trim(),
            amount: Number(item.amount) || 0,
            category: item.category || "",
            ...(item.category === "debt"
              ? {
                  type: item.debt_type || "",
                  current_balance: Number(item.current_balance) || 0,
                  interest_rate: Number(item.interest_rate) || 0,
                  minimum_payment: Number(item.minimum_payment) || 0,
                  current_payment: Number(item.current_payment) || 0,
                }
              : {}),
          })),
      },
      date_of_birth: formData.date_of_birth || null,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("Register raw response:", text);

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text || "Invalid server response" };
      }

      if (response.ok) {
        navigate("/login", {
          state: { message: "Account created successfully!" },
        });
      } else {
        setMessage(data.message || "Account creation failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage(`Register failed: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Create Account</h1>

        {message && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "5px",
              margin: "0 auto 20px auto",
              maxWidth: "500px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2>Step 1</h2>

              <label>First Name</label>
              <br />
              <input
                type="text"
                name="first"
                value={formData.name.first}
                onChange={(e) => {
                  clearFieldValidity(e);
                  handleBasicChange(e);
                }}
                onInvalid={setRequiredMessage}
                required
              />
              <br />
              <br />

              <label>Last Name</label>
              <br />
              <input
                type="text"
                name="last"
                value={formData.name.last}
                onChange={(e) => {
                  clearFieldValidity(e);
                  handleBasicChange(e);
                }}
                onInvalid={setRequiredMessage}
                required
              />
              <br />
              <br />

              <label>Username</label>
              <br />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => {
                  clearFieldValidity(e);
                  handleBasicChange(e);
                }}
                onInvalid={setRequiredMessage}
                required
              />
              <br />
              <br />

              <label>Email</label>
              <br />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  clearFieldValidity(e);
                  handleBasicChange(e);
                }}
                onInvalid={setRequiredMessage}
                required
              />
              <br />
              <br />

              <label>Password</label>
              <br />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  clearFieldValidity(e);
                  handleBasicChange(e);
                }}
                onInvalid={setRequiredMessage}
                required
              />
              <br />
              <br />

              <label>Date of Birth </label>
              <br />
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleBasicChange}
                max={new Date().toISOString().split("T")[0]}
              />
              <br />
              <br />

              <button type="button" onClick={handleNext}>
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Step 2</h2>

              <label>Income</label>
              <br />
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={(e) => {
                  clearFieldValidity(e);
                  handleBasicChange(e);
                }}
                onInvalid={setRequiredMessage}
                required
              />
              <br />
              <br />

              <h3>Monthly Expenses</h3>

              {formData.expenses.monthly.map((expense, index) => (
                <div
                  key={index}
                  style={{
                    margin: "0 auto 20px auto",
                    padding: "18px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    maxWidth: "500px",
                    textAlign: "center",
                  }}
                >
                  <label>Custom Expense Name</label>
                  <br />
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) =>
                      handleExpenseChange(index, "name", e.target.value)
                    }
                  />
                  <br />
                  <br />

                  <label>Total Amount</label>
                  <br />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) =>
                      handleExpenseChange(index, "amount", e.target.value)
                    }
                  />
                  <br />
                  <br />

                  <label>Monthly Expense Type</label>
                  <br />
                  <select
                    value={expense.category}
                    onChange={(e) =>
                      handleExpenseChange(index, "category", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="subscription">Subscription</option>
                    <option value="rent">Rent</option>
                    <option value="utilities">Utilities</option>
                    <option value="transportation">Transportation</option>
                    <option value="insurance">Insurance</option>
                    <option value="investment">Investment</option>
                    <option value="debt">Debt</option>
                    <option value="other">Other</option>
                  </select>
                  <br />
                  <br />

                  {expense.category === "debt" && (
                    <>
                      <label>Debt Type</label>
                      <br />
                      <select
                        value={expense.debt_type}
                        onChange={(e) =>
                          handleExpenseChange(index, "debt_type", e.target.value)
                        }
                      >
                        <option value="">Select Debt Type</option>
                        <option value="car_loan">Car Loan</option>
                        <option value="student_loan">Student Loan</option>
                        <option value="mortgage">Mortgage</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="personal_loan">Personal Loan</option>
                        <option value="medical_debt">Medical Debt</option>
                        <option value="other">Other</option>
                      </select>
                      <br />
                      <br />

                      <label>Current Balance</label>
                      <br />
                      <input
                        type="number"
                        value={expense.current_balance}
                        onChange={(e) =>
                          handleExpenseChange(index, "current_balance", e.target.value)
                        }
                      />
                      <br />
                      <br />

                      <label>Interest Rate (%)</label>
                      <br />
                      <input
                        type="number"
                        step="0.01"
                        value={expense.interest_rate}
                        onChange={(e) =>
                          handleExpenseChange(index, "interest_rate", e.target.value)
                        }
                      />
                      <br />
                      <br />

                      <label>Minimum Payment</label>
                      <br />
                      <input
                        type="number"
                        value={expense.minimum_payment}
                        onChange={(e) =>
                          handleExpenseChange(index, "minimum_payment", e.target.value)
                        }
                      />
                      <br />
                      <br />

                      <label>Current Payment</label>
                      <br />
                      <input
                        type="number"
                        value={expense.current_payment}
                        onChange={(e) =>
                          handleExpenseChange(index, "current_payment", e.target.value)
                        }
                      />
                      <br />
                      <br />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => removeMonthlyExpense(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" onClick={addMonthlyExpense}>
                Add Monthly Expense
              </button>

              <br />
              <br />

              <div style={{ textAlign: "center" }}>
                <button type="button" onClick={() => setStep(1)}>
                  Back
                </button>

                <button type="submit" style={{ marginLeft: "10px" }}>
                  Create Account
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateAcc;