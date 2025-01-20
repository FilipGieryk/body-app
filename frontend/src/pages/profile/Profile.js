import { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router";
import Photos from "../../components/photos/Photos";
import WokroutsList from "../../components/worktouts/WorkoutsList";
import WorkoutsActivity from "../../components/worktouts/WorkoutsActivity";
import UserInformation from "../../components/UserInformation";
import FriendsComponent from "../../components/friends/FriendsComponent";

const Profile = () => {
  let { id } = useParams();
  const [userId, setUserId] = useState();
  const [activeSection, setActiveSection] = useState("profile");
  const [userInfo, setUserInfo] = useState({
    username: "",
    profilePhoto: "",
    photos: [],
    workouts: [],
  });
  const [friendRequests, setFriendRequests] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          // change id to authentication in backend
          `/api/friendships/pending-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const requests = response.data;
        setFriendRequests(requests);

        if (userInfo.friends?.includes(userInfo._id)) {
          setRequestStatus("friends");
        } else if (
          requests.some(
            (req) => req.friend._id === userInfo._id && req.user._id === userId
          )
        ) {
          setRequestStatus("sent");
        } else if (
          requests.some(
            (req) => req.user._id === userInfo._id && req.friend._id === userId
          )
        ) {
          setRequestStatus("received");
        } else {
          setRequestStatus("none");
        }
      } catch (err) {
        console.error("Error fetching pending requests:", err);
      }
    };
    fetchPendingRequests();
  }, [userId, userInfo]);

  const handleNavigation = (targetSection) => {
    setActiveSection(targetSection);
  };
  const handleAcceptRequest = async (friendInfo) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friendships/accept-request",
        {
          friendId: friendInfo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequestStatus("friends");
      setUserInfo((prev) => ({
        ...prev,
        friends: [...prev.friends, userId], // Add the userId to the friends list
      }));
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };

  const handleDeclineRequest = async (friendInfo) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friendships/decline-request",
        {
          friendId: friendInfo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequestStatus("none");
    } catch (error) {
      console.error("Failed to decline friend request", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
                ? "move-up-one"
                : activeSection === "friends"
                ? "move-up-two"
                : ""
            }`}
          >
            <UserInformation
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              userId={userId}
              requestStatus={requestStatus}
              setRequestStatus={setRequestStatus}
              handleAcceptRequest={handleAcceptRequest}
              handleDeclineRequest={handleDeclineRequest}
            />
            <div className="profile-grid-item photos">
              {userInfo && <Photos userInfo={userInfo} userId={id} />}
            </div>
            <div className="profile-grid-item workouts">
              <WokroutsList userInfo={userInfo} />
            </div>
          </div>
          <WorkoutsActivity
            className={`${
              activeSection === "profile"
                ? "default-position"
                : activeSection === "workout"
                ? "move-up-one"
                : activeSection === "friends"
                ? "move-up-two"
                : ""
            }`}
            userInfo={userInfo}
          />
          <FriendsComponent
            className={`${
              activeSection === "profile"
                ? "default-position"
                : activeSection === "workout"
                ? "move-up-one"
                : activeSection === "friends"
                ? "move-up-two"
                : ""
            }`}
            userInfo={userInfo}
            userId={userId}
            friendRequests={friendRequests}
            handleAcceptRequest={handleAcceptRequest}
            handleDeclineRequest={handleDeclineRequest}
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
            onClick={() => handleNavigation("friends")}
            className={activeSection === "friends" ? "active" : ""}
            style={{ position: "relative" }}
          >
            Friends
            <div className="notification-dot"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
