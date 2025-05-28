import { useState } from "react";

const AddUser = ({
  url,
  userFields = [],
  setUsers,
  handleAddUser,
  handleClose,
}) => {
  const [formData, setFormData] = useState({});

  return (
    <div className="add-user-container">
      <button className="close" onClick={handleClose}>
        X
      </button>

      <h3 className="header">Add User</h3>

      <div className="user-inputs-wrapper">
        {userFields.map((field) => {
          const id = field.split("_").join("-");
          const displayName = field
            .split("_")
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <div key={field} className="user-input-wrapper">
              <label htmlFor={id}>{displayName}</label>
              <input
                type="text"
                id={id}
                autoComplete="off"
                value={formData[[field]] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </div>
          );
        })}
      </div>

      <div className="buttons-wrapper">
        <button onClick={handleClose}>Cancel</button>
        <button
          onClick={() => {
            const inputFilled = (key) =>
              !userFields.includes(key) || formData[[key]];

            if (
              !inputFilled("email") ||
              !inputFilled("first_name") ||
              !inputFilled("name")
            )
              return;

            handleAddUser(url, formData)
              .then((res) => {
                setUsers((prev) => [...prev, res.results]);
                handleClose();
              })
              .catch(console.error);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddUser;
