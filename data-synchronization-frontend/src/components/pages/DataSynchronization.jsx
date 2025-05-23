import { useCallback, useEffect, useState } from "react";

import AddUser from "../forms/AddUser";
import UserRow from "../forms/UserRow";
import Modal from "../modal/Modal";

import { backend1Url, backend2Url } from "../../envConfig";

const headers = {
  "Content-Type": "application/json",
};
const [user1Modal, user2Modal] = ["user1", "user2"];
const user1Fields = ["first_name", "last_name", "email", "favorite_color"];
const user2Fields = ["name", "email", "color"];

const DataSynchronization = () => {
  const [users1, setUsers1] = useState([]);
  const [users2, setUsers2] = useState([]);
  const [selectedModal, setSelectedModal] = useState("");

  const modalContent = {
    [user1Modal]: {
      url: backend1Url,
      setUsers: setUsers1,
      userFields: user1Fields,
    },
    [user2Modal]: {
      url: backend2Url,
      setUsers: setUsers2,
      userFields: user2Fields,
    },
  };

  const handleResponse = (res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  };

  const handleAddUser = useCallback(
    (url, body) =>
      fetch(`${url}/user`, {
        headers,
        method: "POST",
        body: JSON.stringify(body),
      }).then(handleResponse),
    []
  );

  const handleEditUser = useCallback(
    (url, userId, body) =>
      fetch(`${url}/user/${userId}`, {
        headers,
        method: "PUT",
        body: JSON.stringify(body),
      }).then(handleResponse),
    []
  );

  const handleDeleteUser = useCallback(
    (url, userId) =>
      fetch(`${url}/user/${userId}`, {
        headers,
        method: "DELETE",
      }).then(handleResponse),
    []
  );

  const renderUsers1 = (users) =>
    users.map((user) => (
      <UserRow
        key={user.user_id}
        user={user}
        userFields={user1Fields}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        url={backend1Url}
        setUsers={setUsers1}
      />
    ));

  const renderUsers2 = (users) =>
    users.map((user) => (
      <UserRow
        key={user.user_id}
        user={user}
        userFields={user2Fields}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        url={backend2Url}
        setUsers={setUsers2}
      />
    ));

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${backend1Url}/users`, { signal })
      .then((res) => res.json())
      .then((res) => setUsers1(res.results))
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${backend2Url}/users`, { signal })
      .then((res) => res.json())
      .then((res) => setUsers2(res.results))
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="data-synchronization-container">
      <h2>Data Synchronization</h2>

      <div className="users-lists-wrapper">
        <div className="users-list">{renderUsers1(users1)}</div>
        <div className="users-list">{renderUsers2(users2)}</div>

        <div className="user-buttons">
          <button onClick={() => setSelectedModal(user1Modal)}>Add user</button>
        </div>
        <div className="user-buttons">
          <button onClick={() => setSelectedModal(user2Modal)}>Add user</button>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedModal)}
        onRequestClose={() => setSelectedModal("")}
      >
        <AddUser
          url={modalContent[[selectedModal]]?.url}
          setUsers={modalContent[[selectedModal]]?.setUsers}
          userFields={modalContent[[selectedModal]]?.userFields}
          handleAddUser={handleAddUser}
          handleClose={() => setSelectedModal("")}
        />
      </Modal>
    </div>
  );
};

export default DataSynchronization;
