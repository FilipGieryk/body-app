import { useParams } from "react-router-dom";
import { useGetExercise } from "./hooks/useGetExercise";

export const ExerciseDetailPage = () => {
  const { exerciseId } = useParams();
  if (!exerciseId) return;
  const { data, isLoading, isError, error } = useGetExercise(exerciseId);

  function getYouTubeVideoId(url) {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
    return null;
  }

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="outer-box grid grid-cols-2 grid-rows-3 h-full">
      <div className="text-6xl row-start-1 col-start-1 col-end-3">
        {data.name}
      </div>
      {data?.videoLink?.includes("youtube.com") ||
      data?.videoLink?.includes("youtu.be") ? (
        <iframe
          className="row-start-2 col-start-1"
          width="570"
          height="290"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
            data.videoLink
          )}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video controls width={600}>
          <source src={data.videoLink} type="video/mp4"></source>
        </video>
      )}
      <div>{data.media}</div>
      <div className="col-start-1 col-end-3">{data.description}</div>
    </div>
  );
};
