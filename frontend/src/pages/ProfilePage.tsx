import { useParams } from "react-router-dom";
import { useGetUser } from "../hooks/fetch/useGetUser";

import UserInformation from "../components/userProfile/UserInformation";
import UserPhotos from "../components/userProfile/UserPhotos";
import UserWorkouts from "../components/userProfile/UserWorkouts";
import { useUser } from "../context/UserContext";
import { UserFriendInfo } from "../components/userProfile/UserFriendInfo";
import { useUserPhotos } from "../hooks/useUserPhotos";

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
    <div className="grid grid-rows-[55%_35%] grid-cols-[30%_66%] w-full h-full gap-4 transition-all m-10">
      <div className="bg-amber-200 h-full row-start-1 row-end-3 shadow-2xl rounded-2xl">
        <UserInformation
          username={userData.username}
          profilePhoto={userData.profilePhoto}
          isLoggedUser={isLoggedUser}
        />
        <UserFriendInfo userId={userData._id} loggedUserId={user._id} />
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
