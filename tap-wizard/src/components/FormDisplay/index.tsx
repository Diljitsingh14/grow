import React, { useEffect, useState } from "react";
import { IFormField, ITheme } from "@/types/forms";
import { Button } from "@headlessui/react";

interface FormDisplayProps {
  fields: IFormField[];
  isPreview: boolean;
  theme: ITheme | null; // New prop for the selected theme
  onClickSubmit?: (responses: IFormField[]) => void; // Update to pass responses
}

const FormDisplay: React.FC<FormDisplayProps> = ({
  fields,
  isPreview,
  theme,
  onClickSubmit,
}) => {
  // Default styles if no theme is selected
  const defaultBackgroundColor = "#ffffff";
  const defaultTextColor = "#000000";

  const formBackgroundColor = theme?.background_color || defaultBackgroundColor;
  const formTextColor = theme?.text_color || defaultTextColor;
  const brandLogo = theme?.brand_logo; // Use the brand logo if available

  const [fieldsResponse, setFieldsResponse] = useState<IFormField[]>([
    ...fields,
  ]);

  // Function to update response for a specific field
  const handleResponseChange = (name: string, value: string) => {
    setFieldsResponse((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, response: value } : field
      )
    );
  };

  return (
    <form
      className="space-y-4 p-4 rounded-md"
      style={{
        backgroundColor: formBackgroundColor,
        color: formTextColor,
      }}
    >
      {/* Display brand logo if available */}
      {brandLogo && (
        <div className="flex justify-center mb-4">
          <img src={brandLogo} alt="Brand Logo" className="h-16 w-auto" />
        </div>
      )}

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label
            htmlFor={field.name}
            className="font-medium"
            style={{ color: formTextColor }}
          >
            {field.desc}
            {field.is_required && <span className="text-red-500"> *</span>}
          </label>
          {field.type !== "textarea" ? (
            <input
              id={field.name}
              required={field.is_required}
              name={field.name}
              type={field.type}
              placeholder={field.helptext}
              disabled={isPreview}
              className={`mt-1 p-2 border rounded-md ${
                isPreview ? "bg-gray-200 cursor-not-allowed" : "bg-white"
              }`}
              style={{
                color: formTextColor,
                backgroundColor: isPreview ? "#f0f0f0" : "#ffffff",
              }}
              defaultValue={field.response || ""} // Set default value
              onChange={(e) => handleResponseChange(field.name, e.target.value)} // Update response
            />
          ) : (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.helptext}
              required={field.is_required}
              disabled={isPreview}
              className={`mt-1 p-2 border rounded-md ${
                isPreview ? "bg-gray-200 cursor-not-allowed" : "bg-white"
              }`}
              style={{
                color: formTextColor,
                backgroundColor: isPreview ? "#f0f0f0" : "#ffffff",
              }}
              defaultValue={field.response || ""} // Set default value
              onChange={(e) => handleResponseChange(field.name, e.target.value)} // Update response
            />
          )}
        </div>
      ))}

      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isPreview}
        onClick={() => {
          if (onClickSubmit) onClickSubmit(fieldsResponse); // Pass responses on submit
        }}
      >
        Submit
      </Button>
    </form>
  );
};

export default FormDisplay;
