import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfilePage from "./features/profile/ProfilePage.tsx";
import ChatPage from "./features/chat/ChatPage.tsx";
import Help from "./features/help/Help.tsx";
import ExercisesList from "./features/exercise/ExercisesList.tsx";
import WorkoutsList from "./features/workout/WorkoutsList.tsx";
import { ExerciseDetailPage } from "./features/exercise/ExerciseDetailPage.tsx";
import { WorkoutDetailPage } from "./features/workout/WorkoutDetailPage.tsx";
import { Header } from "./features/navigation/components/Header.tsx";
import { GLTFViewer } from "./features/home/GLTFViewer.tsx";
import { CreateWorkout } from "./features/workout/components/CreateWorkout.tsx";
import { WebSocketProvider } from "./context/webSocketContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FriendRequestsProvider } from "./context/FriendRequestsContext.tsx";
import { WorkoutProvider } from "./context/WorkoutContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";

// import AdminDashboard from "./components/notusedfornow/adminDashboard/AdminDashboard.js";
// import ProtectedRoute from "./components/notusedfornow/adminDashboard/ProtectedRoute.js";
// const user = { isAdmin: true };
function App() {
  const queryClient = new QueryClient();
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <WorkoutProvider>
            <WebSocketProvider>
              <FriendRequestsProvider>
                <Header />
                <div
                  className="absolute inset-4 w-23/25 h-24/25 z-10 "
                  id="container"
                >
                  <Routes>
                    {/* <Route
                      path="/admin"
                      element={
                        <ProtectedRoute isAdmin={user.isAdmin}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    /> */}
                    <Route path="/" Component={GLTFViewer} />
                    <Route path="/profile/:id" Component={ProfilePage} />
                    <Route path="/help" Component={Help} />
                    <Route path="/exercises" Component={ExercisesList} />
                    <Route path="/workout/create" Component={CreateWorkout} />
                    <Route path="/workouts" Component={WorkoutsList} />
                    <Route
                      path="/workouts/:workoutId"
                      Component={WorkoutDetailPage}
                    />
                    <Route path="/chat/:chatId?" Component={ChatPage} />
                    <Route
                      path="/exercises/:exerciseId"
                      Component={ExerciseDetailPage}
                    />
                  </Routes>
                </div>
              </FriendRequestsProvider>
            </WebSocketProvider>
          </WorkoutProvider>
        </UserProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
