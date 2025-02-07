import GlitchButton from "../Buttons/GlitchButton";
import Rating from "../Other/Rating";
import clsx from "clsx";
const Thumbnail = ({ data, className }) => {
  return (
    <div className={clsx(className)}>
      <img
        src={data?.media}
        className="w-full h-[60%] rounded-2xl overflow-visible"
      ></img>
      <div className="grid grid-cols-2 grid-rows-2">
        <h2 className="mg-0 text-3xl truncate text-start">{data?.name}</h2>
        <Rating averageRating={data.averageRating} />
      </div>
      {/* <BodyParts /> */}
      {/* <Rating itemId={data._id} averageRating={data.averageRating} /> */}
      {/* <GlitchButton content={"ADD"} /> */}
    </div>
  );
};
export default Thumbnail;
