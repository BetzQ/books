/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, getUserInfo, updateUserProfile } from "../api";
import "../styles/Account.css";

const Account: React.FC = () => {
  const params = useParams<{ userId: string }>();
  const { userId } = params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [flashMessageType, setFlashMessageType] = useState<string>("");
  const [changeUsername, setChangeUsername] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setError("User ID is not provided");
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserInfo(userId);
        setUser(userData);
        setUsernameInput(userData.username);
        setPasswordInput(userData.password);
        setLoading(false);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
        } else {
          setError("Failed to fetch user data");
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!userId) {
        throw new Error("User ID is not provided");
      }

      // Check if the username checkbox is checked and there is input
      const isUsernameChanged = changeUsername && usernameInput.trim() !== "";
      // Check if the password checkbox is checked and there is input
      const isPasswordChanged = changePassword && passwordInput.trim() !== "";

      // If neither username nor password is changed, display an error
      if (!isUsernameChanged && !isPasswordChanged) {
        throw new Error("Please select at least one field to update");
      }

      // Prepare the updated profile object
      const updatedProfile: any = {};
      if (isUsernameChanged) {
        updatedProfile.username = usernameInput;
      }
      if (isPasswordChanged) {
        updatedProfile.password = passwordInput;
      }

      // If either username or password is changed, proceed with the update
      await updateUserProfile(userId, updatedProfile);
      setUpdateStatus("User updated successfully");
      setFlashMessageType("success");
    } catch (error: any) {
      setUpdateStatus(error.message);
      setFlashMessageType("error");
      console.error("Failed to update user:", error);
    }
  };

  const handleCloseFlashMessage = () => {
    setUpdateStatus("");
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === "changeUsername") {
      setChangeUsername(checked);
    } else if (name === "changePassword") {
      setChangePassword(checked);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="account-container">
      <h2>User Info</h2>
      <div className="user-info">
        <p>ID: {user.id}</p>
        {updateStatus && (
          <div className={`flash-message ${flashMessageType}`}>
            <span>{updateStatus}</span>
            <button className="closex-button" onClick={handleCloseFlashMessage}>
              x
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Change Username:
            <input
              type="checkbox"
              name="changeUsername"
              checked={changeUsername}
              onChange={handleCheckboxChange}
            />
          </label>
          {changeUsername && (
            <label>
              Username:
              <input
                type="text"
                value={usernameInput}
                onChange={handleUsernameChange}
                className="input-field"
              />
            </label>
          )}
          <label>
            Change Password:
            <input
              type="checkbox"
              name="changePassword"
              checked={changePassword}
              onChange={handleCheckboxChange}
            />
          </label>
          {changePassword && (
            <label>
              Password:
              <input
                type="password"
                value={passwordInput}
                onChange={handlePasswordChange}
                className="input-field"
              />
            </label>
          )}
          <button type="submit" className="submit-button">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
