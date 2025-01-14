import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import "./WorkoutsActivity.css";

const WorkoutsActivity = ({ userInfo, className }) => {
  const navigate = useNavigate();

  const generateDaysInYear = (year) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Populate dates grouped by day of the week for each month
    const daysByMonth = months.map(() => ({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    }));

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
        const date = new Date(year, month, day);
        const dayName = daysOfWeek[date.getDay()];
        daysByMonth[month][dayName].push(date.toISOString().split("T")[0]);
      }
    }

    return { months, daysOfWeek, daysByMonth };
  };
  const { months, daysOfWeek, daysByMonth } = generateDaysInYear(2025);
  useEffect(() => {
    const tableCells = document.querySelectorAll(
      ".activity-table-head-element"
    );
    tableCells.forEach((cell, index) => {
      const iconCount = daysByMonth[index]["Sunday"]; // Count FontAwesome icons (rendered as SVGs
      cell.colSpan = `${iconCount.length}`;
    });
  }, []);
  const workoutSessions = userInfo.workoutSessions;
  return (
    <div className={`workout-activity-container ${className}`}>
      <div className="workout-activity-count">
        <div className="workout-sessions-container">
          {workoutSessions.slice(-4).map((el) => (
            <div className="workout-session-container">{el.user}</div>
          ))}
        </div>
        <button onClick={() => navigate("/workouts")}>StartWorkout</button>
      </div>
      <div className="workout-activity-count">
        <div className="workout-activity-table-container">
          <table className="workout-activity-table">
            <thead>
              <tr>
                <td></td>
                {months.map((month, index) => (
                  <td
                    className="activity-table-head-element"
                    key={index}
                    style={{ textAlign: "start", fontWeight: "bold" }}
                  >
                    {month}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{day}</td>

                  {daysByMonth.map((monthData, monthIndex) => {
                    {
                      return monthData[day].map((day, dayIndex) => {
                        // const dateString = new Date(day)
                        //   .toISOString()
                        //   .split("T")[0];
                        const sessionCount = workoutSessions.filter(
                          (session) => session.createdAt.split("T")[0] === day
                        ).length;

                        // Set the icon color based on the session count
                        let iconColor = "grey"; // Default color
                        if (sessionCount > 0) {
                          iconColor =
                            sessionCount === 1 ? "green" : "darkgreen"; // Change color based on session count
                        }
                        return (
                          <td
                            key={dayIndex}
                            className="activity-table-body-element"
                          >
                            <FontAwesomeIcon
                              className="activity-square"
                              icon={faSquare}
                              key={dayIndex}
                              style={{ color: iconColor }}
                            />
                          </td>
                        );
                      });
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkoutsActivity;
