import { Link } from "react-router-dom";

type UserWorkoutsProps = {
  userWorkouts: any;
  isLoggedUser: boolean;
};

const UserWorkouts = ({ userWorkouts, isLoggedUser }: UserWorkoutsProps) => {
  return (
    <div className="flex flex-row w-[90%] h-full flex-wrap content-start gap-4 bg-amber-200 rounded-2xl shadow-xl">
      {userWorkouts.map((el) => (
        <Link
          className="h-20 rounded-4xl text-2xl relative mt-15"
          to={`/workouts/${el._id}`}
        >
          {el.name}
        </Link>
      ))}
      {isLoggedUser && (
        <Link
          to={"/workout/create"}
          className="min-w-60 h-20 rounded-4xl text-2xl"
        >
          +
        </Link>
      )}
    </div>
  );
};

export default UserWorkouts;
