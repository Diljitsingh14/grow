import React, { useEffect, useState } from "react";
import { IFormField, ITheme } from "@/types/forms";
import { Button } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormDisplayProps {
  fields: IFormField[];
  isPreview: boolean;
  theme: ITheme | null; // New prop for the selected theme
  availableSlots?: { [key: string]: string[] }[];
  onClickSubmit?: (responses: IFormField[]) => void; // Update to pass responses
}

const FormDisplay: React.FC<FormDisplayProps> = ({
  fields,
  isPreview,
  theme,
  onClickSubmit,
  availableSlots = [],
}) => {
  // Default styles if no theme is selected
  const defaultBackgroundColor = "#ffffff";
  const defaultTextColor = "#000000";

  const formBackgroundColor = theme?.background_color || defaultBackgroundColor;
  const formTextColor = theme?.text_color || defaultTextColor;
  const brandLogo = theme?.brand_logo; // Use the brand logo if available
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeOptions, setTimeOptions] = useState<any>([]);

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
  // Generate date options from available slots
  const dateOptions = availableSlots.map((slot) => {
    const dateStr = Object.keys(slot)[0];
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  });

  useEffect(() => {
    // Generate time options based on selected date
    const t = selectedDate
      ? availableSlots.find(
          (slot) =>
            Object.keys(slot)[0] ===
            selectedDate
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replaceAll("/", "-")
        )?.[
          selectedDate
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replaceAll("/", "-")
        ] || []
      : [];
    console.log(t);

    setTimeOptions(t);
  }, [selectedDate]);

  const handleDateChange = (fieldName: string, date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      handleResponseChange(fieldName, date.toISOString().split("T")[0]);
      setSelectedTime(""); // Reset selected time when date changes
    }
  };

  const handleTimeChange = (
    fieldName: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const time = event.target.value;
    setSelectedTime(time);
    handleResponseChange(fieldName, time);
  };

  const renderField = (field: any) => {
    switch (field?.type) {
      case "date":
        return (
          <div key={field.name} className="mb-4">
            <DatePicker
              disabled={isPreview}
              selected={selectedDate}
              onChange={(e) => handleDateChange(field.name, e)}
              includeDates={dateOptions}
              className="block w-full px-4 py-2 border rounded"
              placeholderText="Select a date"
            />
          </div>
        );

      case "time":
        return (
          <div key={field.name} className="mb-4">
            <select
              value={selectedTime}
              onChange={(e) => handleTimeChange(field.name, e)}
              disabled={!selectedDate}
              className="block w-full px-4 py-2 border rounded"
            >
              <option value="">Select a time</option>
              {timeOptions.map((time: any) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        );

      case "textarea":
        return (
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
        );

      default:
        return (
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
        );
    }
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
          {renderField(field)}
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
