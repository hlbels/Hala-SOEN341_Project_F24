// AssessmentResults.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AssessmentResults from "../pages/AssessmentResults";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock supabase client with only the `users`, `teams`, and `team_members` tables
jest.mock("../client", () => ({
  supabase: {
    from: jest.fn((table) => {
      switch (table) {
        case "users":
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({
                data: [
                  { id: 2, email: "student@example.com", is_teacher: false },
                ],
              }),
            })),
          };
        case "teams":
          return {
            select: jest.fn().mockResolvedValue({
              data: [{ id: 1, teamname: "Team Alpha" }],
            }),
          };
        case "team_members":
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({
                data: [{ user_id: 2, team_id: 1 }],
              }),
            })),
          };
        default:
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: [] }),
            })),
          };
      }
    }),
  },
}));

// Mock jsPDF to prevent any PDF-related errors
jest.mock("jspdf", () =>
  jest.fn(() => ({
    text: jest.fn(),
    autoTable: jest.fn(),
    save: jest.fn(),
  }))
);

test("renders assessor dropdown after loading data", async () => {
  render(
    <MemoryRouter>
      <AssessmentResults />
    </MemoryRouter>
  );

  // Wait for the <select> element to appear
  const dropdown = await waitFor(() => screen.getByRole("combobox"));
  expect(dropdown).toBeInTheDocument();
});
