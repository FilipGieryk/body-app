import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/ProfilePage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import Help from "./pages/Help.tsx";
import ExercisesList from "./pages/ExercisesList.tsx";
import WorkoutsList from "./pages/WorkoutsList.tsx";
import { Header } from "./components/header/Header.js";
import GLTFViewer from "./components/gltfObject/GLTFViewer.tsx";
import AdminDashboard from "./components/adminDashboard/AdminDashboard.js";
import WorkoutDetail from "./components/workouts/WorkoutDetail.js";
import ExerciseDetail from "./components/exercises/ExerciseDetail.js";
import ProtectedRoute from "./components/adminDashboard/ProtectedRoute.js";
import CreateWorkout from "./components/workouts/CreateWorkout.tsx";
import { WebSocketProvider } from "./hooks/webSocketContext.jsx";
import { UserProvider } from "./hooks/UserContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FriendRequestsProvider } from "./context/FriendRequestsContext.tsx";

const user = { isAdmin: true };
function App() {
  const queryClient = new QueryClient();
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <FriendRequestsProvider>
            <UserProvider>
              <Header />
              <div
                className="absolute inset-4 w-23/25 h-24/25 z-10 "
                id="container"
              >
                {" "}
                {/* <div className="absolute inset-0 -left-11 -right-10 -bottom-20 bg-[url(./assets/bg-brush.png)] bg-center bg-[length:104%_105%] z-[-10] " />
                 */}
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
                  <Route path="/profile/:id" Component={Profile} />
                  <Route path="/help" Component={Help} />
                  <Route path="/exercises" Component={ExercisesList} />
                  <Route path="/workout/create" Component={CreateWorkout} />
                  <Route path="/workouts" Component={WorkoutsList} />
                  <Route
                    path="/workouts/:workoutId"
                    Component={WorkoutDetail}
                  />
                  <Route path="/chat/*" Component={ChatPage} />
                  <Route
                    path="/exercises/:exerciseId"
                    Component={ExerciseDetail}
                  />
                </Routes>
              </div>
            </UserProvider>
          </FriendRequestsProvider>
        </WebSocketProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
