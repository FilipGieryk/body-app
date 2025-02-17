import { useParams } from "react-router";
import Photos from "../components/userProfile/UserPhotos";
import WokroutsList from "../components/userProfile/WorkoutsList";
import WorkoutsActivity from "../components/activity/WorkoutsActivity";
import UserInformation from "../components/userProfile/UserInformation";
import { useGetUser } from "../hooks/users/useGetUser";
import React from "react";
import { ProfileContainer } from "../components/userProfile/ProfileContainer";
const ProfilePage = () => {
  return <ProfileContainer />;
};

export default ProfilePage;
