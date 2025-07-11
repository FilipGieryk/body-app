import { useUpdateUser } from "../../hooks/fetch/useUpdateUser";

export const EditUserInfo = (initialUserInfo) => {
  const { mutate: updateUser, isPending, isError, error } = useUpdateUser();

  const handleUpdate = (updatedFields) => {
    updateUser({ updatedFields });
  };

  return (
    <div className="flex relative text-4xl justify-start items-center flex-col">
      <div className="flex justify-center relative">
        <img
          src={initialUserInfo.profilePhoto}
          className="mt-20 w-60 rounded-[50%] transition-all profile-edit-photo"
        ></img>
        <p className="absolute top-0 translate-y-[50%] invisible text-4xl transition-all opacity-0">
          +
        </p>
      </div>
      <input
        className="w-20 h-8 border-2 mx-8"
        type="text"
        value={initialUserInfo.username}
        onChange={(e) =>
          setUserInfo((prev) => ({
            ...prev,
            username: e.target.value,
          }))
        }
      />
      <input placeholder="yt"></input>
      <input placeholder="insta"></input>
      <input placeholder="x"></input>
      <button
        onClick={() => handleUpdate(initialUserInfo.username)}
        className="absolute top-0 -right-60 w-20 h-20 rounded-[50%] border-0"
      >
        Save
      </button>
    </div>
  );
};
