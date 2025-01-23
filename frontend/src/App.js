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
import Workouts from "./components/Create/Workouts.js";
import ChatPage from "./pages/chat/ChatPage.js";
import { WebSocketProvider } from "./hooks/webSocketContext.js";
import { UserProvider } from "./hooks/UserContext.js";

const user = { isAdmin: true };
function App() {
  return (
    <Router>
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
              <Route path="/exercises" exact Component={ExercisesList} />
              <Route path="/workout/create" exact Component={Workouts} />
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
    </Router>
  );
}

export default App;
