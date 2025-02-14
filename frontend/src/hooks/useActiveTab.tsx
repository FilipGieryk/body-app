import { useState } from "react";

export const useActiveTab = (initialTab = "chats") => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return { activeTab, setActiveTab };
};
