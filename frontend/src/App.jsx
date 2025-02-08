import { useState } from "react";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Help from "./pages/Help.jsx";
import ExercisesList from "./pages/ExercisesList.jsx";
import WorkoutsList from "./pages/WorkoutsList.jsx";
import Header from "./components/header/Header.jsx";
import GLTFViewer from "./components/gltfObject/GLTFViewer.jsx";
import AdminDashboard from "./components/adminDashboard/AdminDashboard.jsx";
import WorkoutDetail from "./components/workouts/WorkoutDetail.jsx";
import ExerciseDetail from "./components/exercises/ExerciseDetail.jsx";
import ProtectedRoute from "./components/adminDashboard/ProtectedRoute.jsx";
import CreateWorkout from "./components/workouts/CreateWorkout.jsx";
import { WebSocketProvider } from "./hooks/webSocketContext.jsx";
import { UserProvider } from "./hooks/UserContext.jsx";
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
            <div
              className="absolute top-7 left-11 w-23/25 h-24/25 z-10 "
              id="container"
            >
              <div className="absolute inset-0 -left-11 -right-10 -bottom-20 bg-[url(./assets/bg-brush.png)] bg-center bg-[length:104%_105%] z-[-10] opacity-5" />
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
