import { useCallback, useState } from "react";

export const useSorting = () => {
  const [sortOrder, setSortOrder] = useState({
    order: "asc",
    field: "name",
  });

  const toggleSortOrder = (field) => {
    setSortOrder((prev) => {
      const newOrder =
        prev.field === field && prev.order === "asc" ? "desc" : "asc";
      return { order: newOrder, field };
    });
  };

  const sortData = useCallback(
    (data) => {
      const sortedData = [...data];
      if (sortOrder.field === "name") {
        sortedData.sort((a, b) =>
          sortOrder.order === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
      } else if (sortOrder.field === "averageRating") {
        sortedData.sort((a, b) =>
          sortOrder.order === "asc"
            ? a.averageRating - b.averageRating
            : b.averageRating - a.averageRating
        );
      }
      return sortedData;
    },
    [sortOrder]
  );

  return { sortOrder, toggleSortOrder, sortData };
};
