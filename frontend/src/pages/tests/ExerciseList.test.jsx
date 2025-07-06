import ExercisesList from "../ExercisesList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../components/search/SearchContainer", () => ({
  default: ({ onFilteredDataChange }) => (
    <div data-testid="search-container">
      <button
        data-testid="filter-btn"
        onClick={() => onFilteredDataChange([{ id: 1, name: "Push-up" }])}
      >
        Filtered Data
      </button>
    </div>
  ),
}));

vi.mock("../../components/search/SearchList", () => ({
  default: ({ data }) => (
    <div data-testid="search-list">
      {data.length > 0 ? (
        <div data-testid="exercise-item">{data[0].name}</div>
      ) : (
        "No Data"
      )}
    </div>
  ),
}));

describe("ExerciseList", () => {
  test("renders ExercisesList correctly", () => {
    render(<ExercisesList />);
    expect(screen.getByTestId("search-container")).toBeInTheDocument();
    expect(screen.getByTestId("search-list")).toBeInTheDocument();
  });

  test("updates SearchList when SearchContainer provides filtered data", async () => {
    render(<ExercisesList />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-btn"));
    expect(screen.getByTestId("exercise-item")).toHaveTextContent("Push-up");
  });
});
