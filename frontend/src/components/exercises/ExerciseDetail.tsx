import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import React from "react";
const ExerciseDetail = () => {
  const [exercise, setExercise] = useState("");
  const { exerciseId } = useParams();
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get(`/api/admin/exercises/${exerciseId}`);
        setExercise(response.data);
      } catch (error) {
        console.error("failed to fetch exercise", error);
      }
    };
    fetchExercise();
  }, []);

  function getYouTubeVideoId(url) {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1); // Extract ID from short URLs
    }
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v"); // Extract ID from query string
    }
    return null; // Not a valid YouTube URL
  }
  return (
    <div className="outer-box">
      <div>{exercise.name}</div>
      {exercise?.videoLink?.includes("youtube.com") ||
      exercise?.videoLink?.includes("youtu.be") ? (
        <iframe
          width="350"
          height="200"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
            exercise.videoLink
          )}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video controls width={600}>
          <source src={exercise.videoLink} type="video/mp4"></source>
        </video>
      )}
      <div>{exercise.media}</div>
    </div>
  );
};

export default ExerciseDetail;
