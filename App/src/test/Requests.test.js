// Requests.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Requests from "../pages/Requests";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom"; // Provides toBeInTheDocument

test("displays loading message initially and hides it after loading", async () => {
  render(
    <MemoryRouter>
      <Requests />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading requests.../i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText(/loading requests.../i)).not.toBeInTheDocument();
  });
});
