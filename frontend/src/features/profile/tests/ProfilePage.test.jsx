import ProfilePage from "../ProfilePage";
import { render, screen } from "@testing-library/react";

vi.mock("../../components/userProfile/ProfileContainer", () => ({
  ProfileContainer: () => (
    <div data-testid="profile-container"> Profile Container</div>
  ),
}));

test("renders profilePage correctly", () => {
  render(<ProfilePage />);
  expect(screen.getByTestId("profile-container")).toBeInTheDocument();
});
