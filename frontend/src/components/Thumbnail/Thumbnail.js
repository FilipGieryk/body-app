import GlitchButton from "../Buttons/GlitchButton";
import styles from "./Thumbnail.module.css";
import Rating from "../Other/Rating";
const Thumbnail = ({ data }) => {
  console.log(data);
  return (
    <div className={styles.container}>
      <img src={data?.media} className={styles.img}></img>
      <div>
        <h2 className={styles.name}>{data?.name}</h2>
        {/* <BodyParts /> */}
        {/* <Rating itemId={data._id} averageRating={data.averageRating} /> */}
        <GlitchButton />
      </div>
    </div>
  );
};
export default Thumbnail;
