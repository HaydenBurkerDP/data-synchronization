import { Fragment, useEffect, useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const initialFormData = { body: {}, hasChanged: false, isUpdating: false };

const UserRow = (props) => {
  const {
    user,
    userFields,
    handleEditUser,
    handleDeleteUser,
    url,
    setUsers,
    onMouseEnter,
    onMouseLeave,
    isHighlighted,
  } = props;

  const [formData, setFormData] = useState(initialFormData);
  const debouncedFormData = useDebounce(formData);

  const userId = useMemo(() => user?.user_id, [user]);

  const handleFormData = (newFormData) => {
    setFormData((prev) => ({
      ...prev,
      hasChanged: true,
      body: { ...prev.body, ...newFormData },
    }));
  };

  useEffect(() => {
    const inputFilled = (key) =>
      !Object.keys(debouncedFormData.body).includes(key) ||
      debouncedFormData.body[[key]];

    if (!debouncedFormData.hasChanged || debouncedFormData.isUpdating) return;

    if (
      !inputFilled("email") ||
      !inputFilled("first_name") ||
      !inputFilled("name")
    )
      return;

    setFormData((prev) => ({ ...prev, isUpdating: true, hasChanged: false }));
    handleEditUser(url, userId, debouncedFormData.body)
      .then((res) => {
        setFormData((prev) =>
          prev.hasChanged ? { ...prev, isUpdating: false } : initialFormData
        );
        setUsers((prev) =>
          prev.map((user) => (user.user_id === userId ? res.results : user))
        );
      })
      .catch((err) => {
        console.error(err);
        setFormData((prev) => ({ ...prev, isUpdating: false }));
      });
  }, [debouncedFormData, handleEditUser, url, userId]);

  return (
    <div
      className={`user-row-container ${isHighlighted ? "highlighted" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
              id={id}
              type="text"
              autoComplete="off"
              value={
                formData.body[[field]] !== undefined
                  ? formData.body[[field]]
                  : user[[field]]
              }
              onChange={(e) => handleFormData({ [field]: e.target.value })}
            />
          </div>
        );
      })}

      <button
        onClick={() =>
          handleDeleteUser(url, user.user_id)
            .then(() =>
              setUsers((prev) => prev.filter((user) => user.user_id !== userId))
            )
            .catch(console.error)
        }
      >
        X
      </button>
    </div>
  );
};

export default UserRow;
