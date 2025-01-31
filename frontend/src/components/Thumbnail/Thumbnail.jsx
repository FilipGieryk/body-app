import GlitchButton from "../Buttons/GlitchButton";
import Rating from "../Other/Rating";
import clsx from "clsx";
const Thumbnail = ({ data, className }) => {
  return (
    <div className={clsx("w-60 h-80 border-1", className)}>
      <img src={data?.media} className="w-full h-[50%]"></img>

      <h2 className="mg-0 text-3xl">{data?.name}</h2>
      {/* <BodyParts /> */}
      {/* <Rating itemId={data._id} averageRating={data.averageRating} /> */}
      <GlitchButton content={"ADD"} />
    </div>
  );
};
export default Thumbnail;
