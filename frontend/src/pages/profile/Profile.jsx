import { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router";
import Photos from "../../components/Main/Photos/UserPhotos";
import WokroutsList from "../../components/Main/Workouts/WorkoutsList";
import WorkoutsActivity from "../../components/Activity/WorkoutsActivity";
import UserInformation from "../../components/Main/Information/UserInformation";
import { useUser } from "../../hooks/UserContext";
const Profile = () => {
  let { id } = useParams();
  const [userInfo, setUserInfo] = useState({
    username: "",
    profilePhoto: "",
    photos: [],
    workouts: [],
  });
  const [loading, setLoading] = useState(true);
  const { loggedUserInfo } = useUser();

  // git
  useEffect(() => {
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
    if (loggedUserInfo && id === loggedUserInfo._id) {
      setUserInfo(loggedUserInfo); // Use loggedUserInfo directly
      setLoading(false);
    } else {
      fetchUser(); // Fetch other user's data
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // git

  return (
    <>
      <div className="profile-layout">
        <div className="test">
          <div className={"profile-grid-layout"}>
            <UserInformation userInfo={userInfo} userId={id} />
            <div className="profile-grid-item photos">
              {userInfo && <Photos userInfo={userInfo} userId={id} />}
            </div>
            <div className="profile-grid-item workouts">
              <WokroutsList userInfo={userInfo} />
            </div>
          </div>
          <WorkoutsActivity userInfo={userInfo} />
        </div>
      </div>
    </>
  );
};

export default Profile;
