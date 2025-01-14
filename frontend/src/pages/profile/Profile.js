import { useEffect, useState } from "react";
// import User from "../../../backend/models/User";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Photos from "../../components/photos/Photos";
import { useNavigate } from "react-router";
import WokroutsList from "../../components/worktouts/WorkoutsList";
import WorkoutsActivity from "../../components/worktouts/WorkoutsActivity";
const Profile = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [userId, setUserId] = useState();
  const [activeSection, setActiveSection] = useState("profile");
  const [userInfo, setUserInfo] = useState({
    username: "",
    profilePhoto: "",
    photos: [],
    workouts: [],
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [requestStatus, setRequestStatus] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    }
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUserInfo(response.data);
      } catch (err) {
        console.error("error fetching user", err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo.friends?.includes(userId)) {
      setRequestStatus("friends");
    } else if (userInfo.pendingRequests?.some((req) => req.sender === userId)) {
      setRequestStatus("pending");
    } else {
      setRequestStatus("none");
    }
    fetchUser();
  }, [id]);

  const handleNavigation = (targetSection) => {
    setActiveSection(targetSection);
  };
  const editUserInfo = () => {
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/users/${userId}`,
        {
          username: editedUsername,
          description: editedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo(response.data);
      alert("User info updated successfully");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating user info", error);
    }
  };
  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(); // Assuming sendFriendRequest is a prop function
      setRequestStatus("pending");
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await acceptRequest(); // Assuming acceptRequest is a prop function
      setRequestStatus("friends");
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };
  const acceptRequest = async (friendId) => {
    try {
      await axios.post("/api/friendship/accept-request", { userId, friendId });
      // Optionally, update the UI to reflect the change
      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept the friend request. Please try again.");
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await declineRequest(); // Assuming declineRequest is a prop function
      setRequestStatus("none");
    } catch (error) {
      console.error("Failed to decline friend request", error);
    }
  };
  const declineRequest = async (friendId) => {
    try {
      await axios.post("/api/friendship/decline-request", { userId, friendId });
      // Optionally, update the UI to reflect the change
      alert("Friend request declined.");
    } catch (error) {
      console.error("Error declining friend request:", error);
      alert("Failed to decline the friend request. Please try again.");
    }
  };

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post("/api/friendships/send-request", {
        userId, // Current user's ID
        friendId: userInfo._id, // Profile owner's ID
      });

      // Optionally, handle the response (like updating state or showing a notification)
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again later.");
    }
  };

  // const photos = document.getElementsByClassName("photo-container");
  // photos.ondrag(console.log("dsad"));

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <>
      <div className="profile-layout">
        <div className="test">
          <div
            className={`profile-grid-layout ${
              activeSection === "profile"
                ? "default-position"
                : activeSection === "workout"
                ? "move-up"
                : "move-down"
            }`}
          >
            <div className="profile-grid-item about">
              {isEditing ? (
                <div className="profile-grid-inner display-column">
                  <div className="profile-edit-container">
                    <img
                      src={userInfo.profilePhoto}
                      className="profile-pic profile-edit-photo"
                    ></img>
                    <p className="profile-edit-photo-text">+</p>
                  </div>
                  <input
                    className="profile-edit-text"
                    type="text"
                    value={userInfo.username}
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={handleSaveChanges}
                    className="edit-user-button"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="profile-grid-inner display-column">
                  <img
                    src={userInfo.profilePhoto}
                    className="profile-pic"
                  ></img>
                  <p>{userInfo.username}</p>
                  {userId === userInfo._id ? (
                    <button
                      className="edit-user-button"
                      onClick={editUserInfo}
                    ></button>
                  ) : (
                    <>
                      {requestStatus === "friends" ? (
                        <p>Friends</p>
                      ) : requestStatus === "pending" ? (
                        <p>Request Sent</p>
                      ) : userInfo.pendingRequests?.some(
                          (req) => req.sender === userId
                        ) ? (
                        <>
                          <button onClick={handleAcceptRequest}>Accept</button>
                          <button onClick={handleDeclineRequest}>
                            Decline
                          </button>
                        </>
                      ) : (
                        <button onClick={handleSendFriendRequest}>
                          Add Friend
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="profile-grid-item photos">
              {userInfo && <Photos userInfo={userInfo} userId={id} />}
            </div>
            <div className="profile-grid-item workouts">
              <WokroutsList userInfo={userInfo} />
            </div>
          </div>
          <WorkoutsActivity
            className={`${
              activeSection === "workout"
                ? "move-up"
                : activeSection === "profile"
                ? "move-down"
                : "defautl-position"
            }`}
            userInfo={userInfo}
          />
        </div>
        <div className="profile-sections">
          <button
            onClick={() => handleNavigation("profile")}
            className={activeSection === "profile" ? "active" : ""}
          >
            Profile
          </button>
          <button
            onClick={() => handleNavigation("workout")}
            className={activeSection === "workout" ? "active" : ""}
          >
            Workout
          </button>
          <button
            onClick={() => handleNavigation("third")}
            className={activeSection === "third" ? "active" : ""}
          >
            Third
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
