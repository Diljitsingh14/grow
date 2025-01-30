import { TURNX_API } from "@/constants/urls";
import { ITheme } from "@/types/forms";
import axiosInstance from "@/utils/http/axiosInstance";
import React, { useState, useEffect } from "react";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Function to call after saving theme
  isUpdating?: boolean; // Whether the modal is for updating an existing theme
  initialThemeData?: ITheme; // Prefill data if updating
}

const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isUpdating = false,
  initialThemeData,
}) => {
  // States for form fields
  const [name, setName] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);

  useEffect(() => {
    // Prefill form fields if updating an existing theme
    if (isUpdating && initialThemeData) {
      setName(initialThemeData.name);
      setBackgroundColor(initialThemeData.background_color);
      setTextColor(initialThemeData.text_color);
    }
  }, [isUpdating, initialThemeData]);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBrandLogo(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("background_color", backgroundColor);
    formData.append("text_color", textColor);
    if (brandLogo) {
      formData.append("brand_logo", brandLogo);
    }

    try {
      if (isUpdating && initialThemeData) {
        // Update existing theme
        // await axiosInstance.put(
        //   `${TURNX_API.MASTER_FORM_THEMES}/${initialThemeData.id}/`,
        //   formData
        // );
      } else {
        // Create new theme
        // await axiosInstance.post(TURNX_API.MASTER_FORM_THEMES, formData);
      }

      onSave(); // Call the save callback to refresh theme list or notify the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {isUpdating ? "Update Theme" : "Create Custom Theme"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Logo (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isUpdating ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemeModal;
