import WorkoutList from "../WorkoutsList";
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
        <div data-testid="workout-item">{data[0].name}</div>
      ) : (
        "No Data"
      )}
    </div>
  ),
}));

describe("WorkoutsList", () => {
  test("renders WorkoutsList correctly", () => {
    render(<WorkoutList />);
    expect(screen.getByTestId("search-container")).toBeInTheDocument();
    expect(screen.getByTestId("search-list")).toBeInTheDocument();
  });

  test("updates SearchList when SearchContainer provides filtered data", async () => {
    render(<WorkoutList />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-btn"));
    expect(screen.getByTestId("workout-item")).toHaveTextContent("Push-up");
  });
});
