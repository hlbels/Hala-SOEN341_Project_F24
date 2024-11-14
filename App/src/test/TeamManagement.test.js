import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamManagement from "../pages/TeamManagement";
import "@testing-library/jest-dom";

describe("TeamManagement Component Basic Functionality", () => {
  test("renders with basic elements and toggles team management form", () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    // Check if the "Menu" button is present and toggle it
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Menu/i));

    // Locate and click the "Team Management" button within the menu
    const teamManagementButton = screen
      .getAllByText(/Team Management/i)
      .find((el) => el.tagName.toLowerCase() === "button");
    fireEvent.click(teamManagementButton);

    // Check that the team management input field is displayed
    expect(screen.getByPlaceholderText("Enter Team Name")).toBeInTheDocument();
  });
});
