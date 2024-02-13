/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  imageUrl: string;
  file: File;
}

export const API_URL = "http://localhost:3001";

export async function handleLogin(
  username: string,
  password: string,
  navigate: NavigateFunction // Gunakan NavigateFunction dari react-router-dom
): Promise<void> {
  try {
    const response = await axios.post<{ message: string; user: User }>(
      `${API_URL}/user/login`,
      {
        username,
        password,
      }
    );

    // Simpan data user ke dalam local storage
    localStorage.setItem("user_detail", JSON.stringify(response.data.user.id));

    // Arahkan pengguna ke halaman utama jika login berhasil
    navigate("/");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw (
        (error as AxiosError).response?.data ||
        new Error("Failed to login. Please try again later.")
      );
    } else {
      throw new Error("Failed to login. Please try again later.");
    }
  }
}

export async function getUserInfo(userId: string): Promise<User> {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get user info. Please try again later.");
  }
}

// Function to update user profile
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>
): Promise<void> {
  try {
    await axios.put(`${API_URL}/user/${userId}`, userData);
  } catch (error) {
    throw new Error("Failed to update user profile");
  }
}

export async function getBooksByUserId(userId: number): Promise<Book[]> {
  try {
    const response = await axios.get(`${API_URL}/book/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch books. Please try again later.");
  }
}

export async function addBook(
  title: string,
  userId: number,
  document: File,
  image: File
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("userId", String(userId));
    formData.append("document", document);
    formData.append("image", image);

    await axios.post(`${API_URL}/book`, formData);
  } catch (error) {
    throw new Error("Failed to add book. Please try again later.");
  }
}
// Fungsi untuk memperbarui buku
export const updateBook = async (bookId: number, formData: FormData) => {
  try {
    const response = await axios.put(`${API_URL}/book/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Failed to update book: " + error.message);
  }
};

export async function deleteBook(
  bookId: number,
  userId: number
): Promise<void> {
  try {
    await axios.delete(`${API_URL}/book/${bookId}`, {
      data: { userId }, // Pass userId in data object for DELETE request
    });
  } catch (error) {
    throw new Error("Failed to delete book. Please try again later.");
  }
}
