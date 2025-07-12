import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { UserProvider } from "./context/UserContext.tsx";
import { WorkoutProvider } from "./context/WorkoutContext.tsx";
import { WebSocketProvider } from "./context/webSocketContext.tsx";
import { FriendRequestsProvider } from "./context/FriendRequestsContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Header } from "./features/navigation/components/Header.tsx";

const ChatPage = lazy(() => import("./features/chat/ChatPage"));
const ProfilePage = lazy(() => import("./features/profile/ProfilePage.tsx"));
const Help = lazy(() => import("./features/help/Help.tsx"));
const ExercisesList = lazy(
  () => import("./features/exercise/ExercisesList.tsx")
);
const CreateWorkout = lazy(
  () => import("./features/workout/components/CreateWorkout.tsx")
);
const WorkoutsList = lazy(() => import("./features/workout/WorkoutsList.tsx"));
const WorkoutDetailPage = lazy(
  () => import("./features/workout/WorkoutDetailPage.tsx")
);
const ExerciseDetailPage = lazy(
  () => import("./features/exercise/ExerciseDetailPage.tsx")
);
const GLTFViewer = lazy(() => import("./features/home/GLTFViewer.tsx"));

// import AdminDashboard from "./components/notusedfornow/adminDashboard/AdminDashboard.js";
// import ProtectedRoute from "./components/notusedfornow/adminDashboard/ProtectedRoute.js";
// const user = { isAdmin: true };

export const SkeletonLoader = () => {
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          backgroundColor: "#eee",
          height: 20,
          marginBottom: 10,
          borderRadius: 4,
          width: "80%",
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          backgroundColor: "#eee",
          height: 20,
          marginBottom: 10,
          borderRadius: 4,
          width: "60%",
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          backgroundColor: "#eee",
          height: 20,
          borderRadius: 4,
          width: "90%",
          animation: "pulse 1.5s infinite",
        }}
      />

      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

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
                  <Suspense fallback={<div> Loadgng page...</div>}>
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
                  </Suspense>
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
