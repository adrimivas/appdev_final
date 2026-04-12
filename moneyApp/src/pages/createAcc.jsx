import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAcc() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

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
      one_time: [{ name: "", amount: "" }],
      monthly: [{ name: "", amount: "" }],
    },
  });

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

  const handleExpenseChange = (type, index, field, value) => {
    const updated = [...formData.expenses[type]];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [type]: updated,
      },
    }));
  };

  const addExpense = (type) => {
    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [type]: [...prev.expenses[type], { name: "", amount: "" }],
      },
    }));
  };

  const removeExpense = (type, index) => {
    const updated = formData.expenses[type].filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [type]: updated.length ? updated : [{ name: "", amount: "" }],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        one_time: formData.expenses.one_time
          .filter((item) => item.name.trim() !== "" && item.amount !== "")
          .map((item) => ({
            name: item.name.trim(),
            amount: Number(item.amount),
          })),
        monthly: formData.expenses.monthly
          .filter((item) => item.name.trim() !== "" && item.amount !== "")
          .map((item) => ({
            name: item.name.trim(),
            amount: Number(item.amount),
          })),
      },
      date_of_birth: formData.date_of_birth,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/Login", {
          state: { message: "Account created successfully!" },
        });
      } else {
        setMessage(data.message || "Account creation failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      {message && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            maxWidth: "400px"
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
              onChange={handleBasicChange}
              required
            />
            <br /><br />

            <label>Last Name</label>
            <br />
            <input
              type="text"
              name="last"
              value={formData.name.last}
              onChange={handleBasicChange}
              required
            />
            <br /><br />

            <label>Username</label>
            <br />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleBasicChange}
              required
            />
            <br /><br />

            <label>Email</label>
            <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleBasicChange}
              required
            />
            <br /><br />

            <label>Password</label>
            <br />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleBasicChange}
              required
            />
            <br /><br />

            <label>Date of Birth</label>
            <br />
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleBasicChange}
            />
            <br /><br />

            <button type="button" onClick={() => setStep(2)}>
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
              onChange={handleBasicChange}
              required
            />
            <br /><br />

            <h3>One-Time Expenses</h3>
            {formData.expenses.one_time.map((expense, index) => (
              <div key={index}>
                <label>Expense Name</label>
                <br />
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) =>
                    handleExpenseChange("one_time", index, "name", e.target.value)
                  }
                />
                <br /><br />

                <label>Amount</label>
                <br />
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) =>
                    handleExpenseChange("one_time", index, "amount", e.target.value)
                  }
                />
                <br /><br />

                <button
                  type="button"
                  onClick={() => removeExpense("one_time", index)}
                >
                  Remove
                </button>
                <br /><br />
              </div>
            ))}

            <button type="button" onClick={() => addExpense("one_time")}>
              Add One-Time Expense
            </button>

            <br /><br />

            <h3>Monthly Expenses</h3>
            {formData.expenses.monthly.map((expense, index) => (
              <div key={index}>
                <label>Expense Name</label>
                <br />
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) =>
                    handleExpenseChange("monthly", index, "name", e.target.value)
                  }
                />
                <br /><br />

                <label>Amount</label>
                <br />
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) =>
                    handleExpenseChange("monthly", index, "amount", e.target.value)
                  }
                />
                <br /><br />

                <button
                  type="button"
                  onClick={() => removeExpense("monthly", index)}
                >
                  Remove
                </button>
                <br /><br />
              </div>
            ))}

            <button type="button" onClick={() => addExpense("monthly")}>
              Add Monthly Expense
            </button>

            <br /><br />

            <button type="button" onClick={() => setStep(1)}>
              Back
            </button>

            <button type="submit" style={{ marginLeft: "10px" }}>
              Create Account
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateAcc;