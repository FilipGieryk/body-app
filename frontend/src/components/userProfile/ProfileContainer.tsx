import { useParams } from "react-router-dom";
import { useGetUser } from "../../hooks/fetch/useGetUser";
import UserInformation from "./UserInformation";
import Photos from "./UserPhotos";
import WokroutsList from "./WorkoutsList";
import React from "react";

export const ProfileContainer = () => {
  const { id } = useParams();
  if (!id) return;
  const { data, isLoading, isError, error } = useGetUser(id);

  if (isLoading) return <p>Loading user profile...</p>;
  if (isError) return <p>Error fetching user: {error.message}</p>;

  return (
    // <div className="w-full h-full flex flex-col overflow-hidden">
    <div className="grid grid-rows-[55%_35%] grid-cols-[30%_66%] w-full h-full gap-4 transition-all m-10">
      <UserInformation userInfo={data} />
      <div className="flex rounded-2xl flex-col justify-start items-center px-8 photos">
        {data && <Photos userInfo={data} userId={id} />}
      </div>
      <div className="flex rounded-2xl flex-col justify-start items-center px-8 workouts">
        <WokroutsList userInfo={data} />
      </div>
    </div>
    // <WorkoutsActivity userInfo={data} />
    // </div>
  );
};
