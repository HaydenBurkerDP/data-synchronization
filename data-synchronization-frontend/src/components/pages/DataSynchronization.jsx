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
  const [isUsers1Loading, setIsUsers1Loading] = useState(true);
  const [isUsers2Loading, setIsUsers2Loading] = useState(true);
  const [selectedModal, setSelectedModal] = useState("");
  const [highlightedUser, setHighlightedUser] = useState("");

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

  const handleResponse = useCallback((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }, []);

  const handleAddUser = useCallback(
    (url, body) =>
      fetch(`${url}/user`, {
        headers,
        method: "POST",
        body: JSON.stringify(body),
      }).then(handleResponse),
    [handleResponse]
  );

  const handleEditUser = useCallback(
    (url, userId, body) =>
      fetch(`${url}/user/${userId}`, {
        headers,
        method: "PUT",
        body: JSON.stringify(body),
      }).then(handleResponse),
    [handleResponse]
  );

  const handleDeleteUser = useCallback(
    (url, userId) =>
      fetch(`${url}/user/${userId}`, {
        headers,
        method: "DELETE",
      }).then(handleResponse),
    [handleResponse]
  );

  const handleSyncUsers = useCallback(
    () =>
      fetch(`${backend1Url}/users/sync`, { headers, method: "PATCH" })
        .then(handleResponse)
        .then((res) => {
          const updateUsers = (prev, userResults) => {
            const userMapping = Object.fromEntries(
              userResults.map((user) => [user.user_id, user])
            );
            const updatedUsers = prev.map(
              (user) => userMapping[[user.user_id]] || user
            );
            const userIds = prev.map((user) => user.user_id);

            for (const userId in userMapping) {
              if (!userIds.includes(userId)) {
                updatedUsers.push(userMapping[[userId]]);
              }
            }

            return updatedUsers;
          };

          setUsers1((prev) => updateUsers(prev, res.results[0]));
          setUsers2((prev) => updateUsers(prev, res.results[1]));
        }),
    [backend1Url, backend2Url, handleResponse]
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
        onMouseEnter={() => {
          setHighlightedUser(user.user_id);
        }}
        onMouseLeave={() => {
          setHighlightedUser("");
        }}
        isHighlighted={
          highlightedUser === user.user_id ||
          highlightedUser === user.external_id
        }
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
        onMouseEnter={() => {
          setHighlightedUser(user.user_id);
        }}
        onMouseLeave={() => {
          setHighlightedUser("");
        }}
        isHighlighted={
          highlightedUser === user.user_id ||
          highlightedUser === user.external_id
        }
      />
    ));

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${backend1Url}/users`, { signal })
      .then(handleResponse)
      .then((res) => setUsers1(res.results))
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      })
      .finally(() => {
        if (!signal.aborted) setIsUsers1Loading(false);
      });

    return () => controller.abort();
  }, [backend1Url, handleResponse]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${backend2Url}/users`, { signal })
      .then(handleResponse)
      .then((res) => setUsers2(res.results))
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      })
      .finally(() => {
        if (!signal.aborted) setIsUsers2Loading(false);
      });

    return () => controller.abort();
  }, [backend2Url, handleResponse]);

  return (
    <div className="data-synchronization-container">
      <h2>Data Synchronization</h2>

      <div className="users-lists-wrapper">
        <div className="users-list">
          {isUsers1Loading ? (
            <h4>Loading...</h4>
          ) : users1.length ? (
            renderUsers1(users1)
          ) : (
            <h4>Users not found</h4>
          )}
        </div>
        <div className="users-list">
          {isUsers2Loading ? (
            <h4>Loading...</h4>
          ) : users2.length ? (
            renderUsers2(users2)
          ) : (
            <h4>Users not found</h4>
          )}
        </div>

        <div className="user-buttons">
          <button onClick={() => setSelectedModal(user1Modal)}>Add user</button>
          <button onClick={handleSyncUsers}>Sync users</button>
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
