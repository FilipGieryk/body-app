import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import GLTFViewer from "./components/GLTFViewer.js";
import Profile from "./pages/profile/Profile.js";
import "./styles/style.css";
import Exercises from "./pages/exercise/Exercises.js";
import Workouts from "./pages/workout/Workouts.js";
import Register from "./components/Register.js";
import { oneMinus } from "three/src/nodes/TSL.js";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import WorkoutDetail from "./pages/workout/WorkoutDetail.js";
import WorkoutsList from "./pages/workout/WorkoutsList.js";
import ExerciseDetail from "./pages/exercise/ExerciseDetail.js";

const user = { isAdmin: true };
function App() {
  return (
    <Router>
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
          <Route path="/exercises" exact Component={Exercises} />
          <Route path="/workout/create" exact Component={Workouts} />
          <Route path="/workouts" exact Component={WorkoutsList} />
          <Route path="/workouts/:workoutId" exact Component={WorkoutDetail} />
          <Route
            path="/exercises/:exerciseId"
            exact
            Component={ExerciseDetail}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
