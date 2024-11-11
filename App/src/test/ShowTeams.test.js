import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ShowTeams from "../pages/ShowTeams";
import { supabase } from "../client";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

jest.mock("../client", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("ShowTeams Component", () => {
  beforeEach(() => {
    // Mock getUser to return a mock user
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { email: "testuser@example.com" } },
    });

    // Mock the `from` function for fetching teams and users
    supabase.from.mockImplementation((table) => {
      if (table === "users") {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 1 },
              }),
            }),
          }),
        };
      } else if (table === "team_members") {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { team_id: 1 },
              }),
            }),
          }),
        };
      } else if (table === "teams") {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 1,
                  teamname: "Team Alpha",
                  team_members: [
                    { user_id: 1, users: { email: "member1@example.com" } },
                  ],
                },
                {
                  id: 2,
                  teamname: "Team Beta",
                  team_members: [
                    { user_id: 2, users: { email: "member2@example.com" } },
                  ],
                },
              ],
            }),
          }),
        };
      }
      return { select: jest.fn().mockResolvedValue({ data: [] }) };
    });
  });

  it("renders the component with basic elements", async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds for this test

    render(
      <MemoryRouter>
        <ShowTeams />
      </MemoryRouter>
    );

    // Wait for teams to load and check if they are rendered
    await waitFor(() => {
      expect(screen.getByText(/All Teams/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Beta/i)).toBeInTheDocument();
    });
  });
});
