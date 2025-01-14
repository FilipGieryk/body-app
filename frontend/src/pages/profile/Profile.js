import { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router";
import Photos from "../../components/photos/Photos";
import WokroutsList from "../../components/worktouts/WorkoutsList";
import WorkoutsActivity from "../../components/worktouts/WorkoutsActivity";
import UserInformation from "../../components/UserInformation";

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

  const handleNavigation = (targetSection) => {
    setActiveSection(targetSection);
  };

  // const photos = document.getElementsByClassName("photo-container");
  // photos.ondrag(console.log("dsad"));

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }
  console.log(userInfo);
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
            <UserInformation
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              userId={userId}
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
