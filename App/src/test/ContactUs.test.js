import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactUs from "../pages/ContactUs";
import "@testing-library/jest-dom";

// Mock fetch and alert
global.fetch = jest.fn();
global.alert = jest.fn(); // Mock window.alert

describe("ContactUs Component Basic Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );
  });

  test("renders Contact Us form with all input fields", () => {
    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  test("allows user to input values into form fields", () => {
    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Message"), {
      target: { value: "Hello, this is a test message." },
    });

    expect(screen.getByPlaceholderText("Your Name")).toHaveValue("John Doe");
    expect(screen.getByPlaceholderText("Your Email")).toHaveValue(
      "john.doe@example.com"
    );
    expect(screen.getByPlaceholderText("Your Message")).toHaveValue(
      "Hello, this is a test message."
    );
  });

  test("handles successful form submission", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Message"), {
      target: { value: "Hello, this is a test message." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        {
          method: "POST",
          body: JSON.stringify({
            name: "John Doe",
            email: "john.doe@example.com",
            message: "Hello, this is a test message.",
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(window.alert).toHaveBeenCalledWith("Message sent! Thank you.");
    });
  });

  test("displays error message if form submission fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Message"), {
      target: { value: "This is a test failure message." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error sending message. Please try again."
      );
    });
  });
});
