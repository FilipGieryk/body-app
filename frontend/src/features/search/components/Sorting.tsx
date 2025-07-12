import React from "react";

const Sorting = ({ sortOrder, toggleSortOrder }) => {
  return (
    <div className="flex gap-3">
      <button
        className="w-30 h-10 rounded-xl shadow-lg hover:scale-105 hover:bg-gray-100"
        onClick={() => toggleSortOrder("name")}
      >
        name({sortOrder.order === "asc" ? "A-Z" : "Z-A"})
      </button>
      <button
        className="w-30 h-10 rounded-xl shadow-lg hover:scale-105 hover:bg-gray-100"
        onClick={() => toggleSortOrder("averageRating")}
      >
        rating({sortOrder.order === "asc" ? "A-Z" : "Z-A"})
      </button>
    </div>
  );
};
export default Sorting;
