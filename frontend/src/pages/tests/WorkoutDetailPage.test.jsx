import { describe, test, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import WorkoutDetailPage from "../WorkoutDetailPage";

vi.mock("../../components/workouts/WorkoutDetail", () => ({
  default: () => <div data-testid="workout-detail">Exercise Detail</div>,
}));

test("renders workout Detail page correctly", () => {
  render(<WorkoutDetailPage />);
  expect(screen.getByTestId("workout-detail")).toBeInTheDocument();
});
