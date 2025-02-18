import GlitchButton from "../buttons/GlitchButton";
import Rating from "./Rating";
import clsx from "clsx";
const Thumbnail = ({ data, className }) => {
  return (
    <div className={clsx(className)}>
      <img
        src={data?.media}
        className="w-full h-[15rem] rounded-2xl overflow-visible bg-[url(./assets/bg-thumb.png)] bg-[length:100%_100%]"
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
