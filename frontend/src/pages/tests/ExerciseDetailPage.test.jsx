import { describe, test, expect, vi, beforeAll } from "vitest";
import ExerciseDetail from "../ExerciseDetailPage";
import ExerciseDetailPage from "../ExerciseDetailPage";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("../../components/exercises/ExerciseDetail", () => ({
  default: () => <div data-testid="exercise-detail">Exercise Detail</div>,
}));

test("renders exercise Detail page correctly", () => {
  render(<ExerciseDetailPage />);
  expect(screen.getByTestId("exercise-detail")).toBeInTheDocument();
});
