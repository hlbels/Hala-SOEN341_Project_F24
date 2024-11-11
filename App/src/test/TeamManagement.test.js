import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamManagement from "../pages/TeamManagement";
import "@testing-library/jest-dom";

describe("TeamManagement Component", () => {
  test("renders the component with basic elements", () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    // Check if the main title is rendered
    expect(screen.getByText(/Sharky Peer Assessment/i)).toBeInTheDocument();

    // Check if the "Menu" button is present
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();

    // Toggle the menu and then team management form
    fireEvent.click(screen.getByText(/Menu/i));

    // Locate the correct "Team Management" button and click it
    const teamManagementButton = screen
      .getAllByText(/Team Management/i)
      .find((el) => el.tagName.toLowerCase() === "button");
    fireEvent.click(teamManagementButton);

    // Confirm that the team management heading is displayed
    expect(
      screen
        .getAllByText(/Team Management/i)
        .some((el) => el.tagName.toLowerCase() === "h2")
    ).toBe(true);

    // Check if the team name input is visible after toggling the team management form
    expect(screen.getByPlaceholderText("Enter Team Name")).toBeInTheDocument();
  });
});
