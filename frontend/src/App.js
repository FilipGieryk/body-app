import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Other/Header";
import GLTFViewer from "./components/Other/GLTFViewer.js";
import Profile from "./pages/profile/Profile.js";
import "./styles/style.css";
import ExercisesList from "./pages/exercise/ExercisesList.js";
import WorkoutsList from "./pages/workout/WorkoutsList.js";
import AdminDashboard from "./components/Create/AdminDashboard/AdminDashboard.js";
import WorkoutDetail from "./components/Details/WorkoutDetail.js";
import ExerciseDetail from "./components/Details/ExerciseDetail.js";
import ProtectedRoute from "./components/Other/ProtectedRoute.js";
import CreateWorkout from "./components/Create/CreateWorkout.js";
import ChatPage from "./pages/chat/ChatPage.js";
import { WebSocketProvider } from "./hooks/webSocketContext.js";
import Help from "./pages/help/Help.js";
import { UserProvider } from "./hooks/UserContext.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const user = { isAdmin: true };
function App() {
  const queryClient = new QueryClient();
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <UserProvider>
            <Header />
            <div className="content-box" id="container">
              <Routes>
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAdmin={user.isAdmin}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" exact Component={GLTFViewer} />
                <Route path="/profile/:id" exact Component={Profile} />
                <Route path="/help" exact Component={Help} />
                <Route path="/exercises" exact Component={ExercisesList} />
                <Route path="/workout/create" exact Component={CreateWorkout} />
                <Route path="/workouts" exact Component={WorkoutsList} />
                <Route
                  path="/workouts/:workoutId"
                  exact
                  Component={WorkoutDetail}
                />
                <Route path="/chat/*" exact Component={ChatPage} />
                <Route
                  path="/exercises/:exerciseId"
                  exact
                  Component={ExerciseDetail}
                />
              </Routes>
            </div>
          </UserProvider>
        </WebSocketProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
