import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, test, expect, vi, beforeAll } from "vitest";
import ChatPage from "../ChatPage";
import { useNavigate } from "react-router-dom";
// // beforeEach(() => {
//   global.localStorage = {
//     store: {},

//     getItem(key) {
//       return this.store[key] || null;
//     },
//     setItem(key, value) {
//       this.store[key] = value.toString();
//     },
//     clear() {
//       this.store = {};
//     },
//     removeItem(key) {
//       delete this.store[key];
//     },
//   };
// });

// Object.defineProperty(globalThis, "localStorage", {
//   value: localStorageMock,
// });

// expect.extend(toHaveNoViolations);
// Mock components
vi.mock("../../components/chats/ManageChatComponent", () => ({
  default: () => {
    const navigate = useNavigate();
    return (
      <div data-testid="manage-chat">
        Manage Chat
        <button data-testid="chat-item" onClick={() => navigate("/chat/123")}>
          Open Chat
        </button>
      </div>
    );
  },
}));
vi.mock("../../components/chats/MessageComponent", () => {
  console.log("Mocked MessageComponent is being used");
  return {
    default: () => <div data-testid="message-chat">Message Chat</div>,
  };
});

describe("ChatPage", () => {
  test("renders ChatPage and ManageChatComponent", () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("manage-chat")).toBeInTheDocument();
  });

  test("renders MessageComponent when navigating to a chat", () => {
    render(
      <MemoryRouter initialEntries={["/chat/123"]}>
        <Routes>
          <Route path="/chat/*" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>
    );

    screen.debug();

    expect(screen.getByTestId("message-chat")).toBeInTheDocument();
  });

  // test("handles invalid routes gracefully", () => {
  //   render(
  //     <MemoryRouter initialEntries={["/chat/invalid-route"]}>
  //       <Routes>
  //         <Route path="/chat/*" element={<ChatPage />} />
  //         <Route
  //           path="*"
  //           element={<div data-testid="not-found">Not Found</div>}
  //         />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   expect(screen.queryByTestId("message-chat")).not.toBeInTheDocument();
  //   expect(screen.getByTestId("not-found")).toBeInTheDocument();
  // });

  test("clicking a chat item navigates to the message component", async () => {
    render(
      <MemoryRouter initialEntries={["/chat"]}>
        <Routes>
          <Route path="/chat/*" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId("chat-item"));

    expect(screen.getByTestId("message-chat")).toBeInTheDocument();
  });

  // test("renders mobile layout correctly", () => {
  //   global.innerWidth = 375; // Simulate a mobile screen width
  //   global.dispatchEvent(new Event("resize")); // Trigger window resize event

  //   render(
  //     <MemoryRouter>
  //       <ChatPage />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByTestId("manage-chat")).toBeInTheDocument();
  //   // Add more assertions based on your mobile layout behavior
  // });

  //   test("ChatPage is accessible", async () => {
  //     const { container } = render(
  //       <MemoryRouter>
  //         <ChatPage />
  //       </MemoryRouter>
  //     );

  //     const results = await axe(container);
  //     expect(results).toHaveNoViolations();
  //   });
});
