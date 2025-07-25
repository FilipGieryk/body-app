import { useParams } from "react-router-dom";
import { useGetUser } from "./hooks/useGetUser";

import UserInformation from "../../shared/components/UserInformation";
import UserPhotos from "./components/UserPhotos";
import UserWorkouts from "./components/UserWorkouts";
import { useUser } from "../../context/UserContext";
import { UserFriendInfo } from "./components/UserFriendInfo";
import { useUserPhotos } from "./hooks/useUserPhotos";

const ProfilePage = () => {
  // get params of user id from url
  const { id } = useParams();
  if (!id) return <p>User ID not found in URL</p>;

  // get user data from query and currently logged user info from context
  const { data: userData, isLoading, isError, error } = useGetUser(id);
  const { user, loading } = useUser();

  // photos
  const { handleFileChangeAndAdd, handleDeletePhotos } = useUserPhotos();

  // error and loading

  if (isLoading || loading) return <p>Loading user profile...</p>;

  if (isError) return <p>Error fetching user: {error.message}</p>;

  if (!userData) return <p>User data not found</p>;

  const isLoggedUser = userData._id === user._id;

  return (
    <div className="grid lg:grid-rows-[50%_45%] grid-cols-1 grid-rows-[80%_40%_30%] lg:grid-cols-[33%_60%] w-3/4 lg:w-full h-[95%] gap-4 transition-all m-auto">
      <div className="bg-amber-200 h-full row-start-1 row-end-1 lg:row-end-3 shadow-2xl rounded-2xl">
        <UserInformation
          username={userData.username}
          profilePhoto={userData.profilePhoto}
          isLoggedUser={isLoggedUser}
        />
        {userData._id != user._id && (
          <UserFriendInfo userId={userData._id} loggedUserInfo={user} />
        )}
      </div>
      <UserPhotos
        userPhotos={userData.photos}
        isLoggedUser={isLoggedUser}
        handleFileChangeAndAdd={handleFileChangeAndAdd}
        handleDeletePhotos={handleDeletePhotos}
      />
      <UserWorkouts
        userWorkouts={userData.workouts}
        isLoggedUser={isLoggedUser}
      />
    </div>
  );
};

export default ProfilePage;
