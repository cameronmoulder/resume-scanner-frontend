/* eslint-env jest */  // ✅ Add Jest environment

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";

test("renders resume scanner title", () => {
  render(<App />);
  expect(screen.getByText(/Resume Scanner/i)).toBeInTheDocument();
});
