import { useParams } from "react-router-dom";
import { useGetUser } from "../hooks/fetch/useGetUser";

import UserInformation from "../components/userProfile/UserInformation";
import UserPhotos from "../components/userProfile/UserPhotos";
import UserWorkouts from "../components/userProfile/UserWorkouts";
import { useUser } from "../context/UserContext";

const ProfilePage = () => {
  // get params of user id from url
  const { id } = useParams();

  // get user data from query and currently logged user info from context
  const { data: userData, isLoading, isError, error } = useGetUser(id);
  const { user, loading } = useUser();

  // error and loading
  if (!id) return <p>User ID not found in URL</p>;

  if (isLoading || loading) return <p>Loading user profile...</p>;

  if (isError) return <p>Error fetching user: {error.message}</p>;

  if (!userData) return <p>User data not found</p>;

  // check if user is currLoggedUser
  const isLoggedUser = userData._id === user._id;

  return (
    <div className="grid grid-rows-[55%_35%] grid-cols-[30%_66%] w-full h-full gap-4 transition-all m-10">
      <UserInformation userInfo={userData} isLoggedUser={isLoggedUser} />
      <UserPhotos userPhotos={userData.photos} isLoggedUser={isLoggedUser} />
      <UserWorkouts
        userWorkouts={userData.workouts}
        isLoggedUser={isLoggedUser}
      />
    </div>
  );
};

export default ProfilePage;
