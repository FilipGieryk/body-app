import { useParams } from "react-router";
import Photos from "../components/userProfile/UserPhotos";
import WokroutsList from "../components/userProfile/WorkoutsList";
import WorkoutsActivity from "../components/activity/WorkoutsActivity";
import UserInformation from "../components/userProfile/UserInformation";
import { useGetUser } from "../hooks/users/useGetUser";
import React from "react";
const Profile = () => {
  let { id } = useParams();

  if (!id) {
    return <p>User ID is not available.</p>;
  }
  const { data, isLoading, isError, error } = useGetUser(id);

  if (isLoading) return <p>Loading user profile...</p>;

  if (isError) return <p>Error fetching user: {error.message}</p>;

  return (
    <>
      <div className="flex w-full h-full items-center justify-between overflow-hidden">
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div className="grid grid-rows-2 grid-cols-[1fr 2fr] w-full h-full gap-4 transition-all">
            <UserInformation
              userInfo={data}
              userId={id}
              setUserInfo={undefined}
              socket={undefined}
            />
            <div className="flex rounded-2xl flex-col justify-start items-center px-8 photos">
              {data && <Photos userInfo={data} userId={id} />}
            </div>
            <div className="flex rounded-2xl flex-col justify-start items-center px-8 workouts">
              <WokroutsList userInfo={data} />
            </div>
          </div>
          <WorkoutsActivity userInfo={data} className={undefined} />
        </div>
      </div>
    </>
  );
};

export default Profile;
