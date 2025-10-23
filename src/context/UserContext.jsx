import React, { createContext, useState, useCallback } from "react";
import { userApi } from "../api/userApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setUsers([]);
      console.error("Failed to fetch user:", err);
      setUsersError("Could not fetch user. Please try again later.");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const createUser = async (userData) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await userApi.createUser(userData);
      // Add the new user to the existing list instead of refetching
      setUsers((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to create user:", err);
      setUsersError("Failed to create user.");
      return { success: false, error: err };
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUser = async (userId, updateData) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await userApi.updateUser(userId, updateData);
      // Update the specific station in the list
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...response.data } : user
        )
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to update user:", err);
      setUsersError("Failed to update user.");
      return { success: false, error: err };
    } finally {
      setUsersLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      await userApi.deleteUser(userId);
      // Update the station's status locally
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: false } : user
        )
      );
      return { success: true };
    } catch (err) {
      console.error("Failed to delete user:", err);
      setUsersError("Failed to delete user.");
      return { success: false, error: err };
    } finally {
      setUsersLoading(false);
    }
  };

  const getDeactivatedUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await userApi.getDeactivatedUsers();
      setUsers(response.data);
    } catch (err) {
      setUsers([]);
      console.error("Failed to fetch deactivated users:", err);
      setUsersError(
        "Could not fetch deactivated users. Please try again later."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const reactivateEmployee = async (userId) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await userApi.reactivateEmployee(userId);
      return { success: true, data: response.data };
    }
    catch (err) {
      console.error("Failed to reactivate user:", err);
      setUsersError("Failed to reactivate user.");
      return { success: false, error: err };
    }
    finally {
      setUsersLoading(false);
    }
  };

  const value = {
    users,
    usersLoading,
    usersError,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getDeactivatedUsers,
    reactivateEmployee
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
