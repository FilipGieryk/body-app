import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import Help from "./pages/Help.tsx";
import ExercisesList from "./pages/ExercisesList.tsx";
import WorkoutsList from "./pages/WorkoutsList.tsx";
import ExerciseDetailPage from "./pages/ExerciseDetailPage.js";
import WorkoutDetailPage from "./pages/WorkoutDetailPage.js";
import { Header } from "./components/header/Header.js";
import GLTFViewer from "./components/gltfObject/GLTFViewer.tsx";
import AdminDashboard from "./components/adminDashboard/AdminDashboard.js";
import ProtectedRoute from "./components/adminDashboard/ProtectedRoute.js";
import CreateWorkout from "./components/workouts/CreateWorkout.tsx";
import { WebSocketProvider } from "./hooks/webSocketContext.jsx";
import { UserProvider } from "./hooks/UserContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FriendRequestsProvider } from "./context/FriendRequestsContext.tsx";
import { WorkoutProvider } from "./context/WorkoutContext.tsx";

const user = { isAdmin: true };
function App() {
  const queryClient = new QueryClient();
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <WorkoutProvider>
            <FriendRequestsProvider>
              <UserProvider>
                <Header />
                <div
                  className="absolute inset-4 w-23/25 h-24/25 z-10 "
                  id="container"
                >
                  <Routes>
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute isAdmin={user.isAdmin}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
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
                    <Route path="/chat/*" Component={ChatPage} />
                    <Route
                      path="/exercises/:exerciseId"
                      Component={ExerciseDetailPage}
                    />
                  </Routes>
                </div>
              </UserProvider>
            </FriendRequestsProvider>
          </WorkoutProvider>
        </WebSocketProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
