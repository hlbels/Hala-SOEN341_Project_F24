import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import "@testing-library/jest-dom";
import { supabase } from "../client";

// Mock supabase and alert
jest.mock("../client");
global.alert = jest.fn();

describe("SignUp Component Basic Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
  });

  test("renders SignUp form with all input fields", () => {
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Filter for the "Sign Up" button within the form
    const signupButtons = screen.getAllByRole("button", { name: /sign up/i });
    const formButton = signupButtons.find(
      (button) => button.closest("form") !== null
    );
    expect(formButton).toBeInTheDocument();
  });

  test("handles successful signup", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { email: "newuser@example.com" } },
      error: null,
    });
    supabase.from.mockResolvedValueOnce({ data: {}, error: null });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    const signupButtons = screen.getAllByRole("button", { name: /sign up/i });
    const formButton = signupButtons.find(
      (button) => button.closest("form") !== null
    );
    fireEvent.click(formButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
        options: {
          data: { userName: "newuser", role: "student" },
        },
      });
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(window.alert).toHaveBeenCalledWith(
        "Check your email for Verification link"
      );
    });
  });

  test("displays error message if signup fails", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: "Signup failed" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invaliduser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "invaliduser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "invalidpass" },
    });

    const signupButtons = screen.getAllByRole("button", { name: /sign up/i });
    const formButton = signupButtons.find(
      (button) => button.closest("form") !== null
    );
    fireEvent.click(formButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Signup failed");
    });
  });
});
