// Analysis.test.js
import React from "react";
import { render } from "@testing-library/react";
import Analysis from "../pages/Analysis";
import { MemoryRouter } from "react-router-dom";

test("renders Analysis component without crashing", () => {
  render(
    <MemoryRouter>
      <Analysis />
    </MemoryRouter>
  );
});
