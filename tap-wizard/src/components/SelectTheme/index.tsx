import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ThemeModal from "@/components/ThemeModal"; // Import the ThemeModal component
import { ITheme } from "@/types/forms";

interface SelectThemeProps {
  themes: ITheme[];
  selectedTheme: string | null;
  onSelectTheme: (themeId: string) => void;
  onThemeSave: () => void; // Function to refresh theme list after save
}

const SelectTheme: React.FC<SelectThemeProps> = ({
  themes,
  selectedTheme,
  onSelectTheme,
  onThemeSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 p-4">
        {themes.map((theme) => (
          <div key={theme.id} className="relative">
            <div
              className={`relative p-4 rounded-md min-h-[60px] shadow-2xl cursor-pointer transition-transform transform hover:scale-105 ${
                selectedTheme === theme.id.toString()
                  ? "ring-2 ring-blue-500"
                  : "border border-gray-300"
              }`}
              style={{
                background: `linear-gradient(135deg, ${theme.background_color} 50%, ${theme.text_color} 50%)`,
              }}
              onClick={() => onSelectTheme(theme.id.toString())}
            >
              <input
                type="radio"
                checked={selectedTheme === theme.id.toString()}
                readOnly
                className="absolute top-2 right-2"
              />
            </div>
            <span className="text-xs text-gray-400 font-bold">
              {theme.name}
            </span>
          </div>
        ))}
        {/* Add custom theme box */}
        <div
          className="flex items-center border border-gray-300 justify-center p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 bg-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-2xl" />
        </div>
      </div>

      {/* Theme Modal */}
      <ThemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onThemeSave}
        isUpdating={false} // For creating new themes
      />
    </>
  );
};

export default SelectTheme;
