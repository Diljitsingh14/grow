import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FormDisplay from "@/components/FormDisplay";
import {
  getPublishedFormView,
  submitFormResponses,
} from "@/utils/services/turnx/forms"; // Assumed API utility
import { IFormField, ITemplate, ITheme } from "@/types/forms";
import { DEFAULT_FORM_THEME } from "@/constants/forms";

// I also want following data:
// 1. the slots parameter in the response: which is

interface PublicFormViewProps {}

const PublicFormView: React.FC<PublicFormViewProps> = () => {
  const router = useRouter();
  const [fullTemplate, setFullTemplate] = useState<any>(null);
  const [formTemplate, setFormTemplate] = useState<ITemplate | null>(null);
  const [formFields, setFormFields] = useState<IFormField[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any>([]);
  const [formTheme, setFormTheme] = useState<ITheme>(DEFAULT_FORM_THEME);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchFormData = async (uuid: string) => {
      try {
        const { data } = await getPublishedFormView(uuid);
        setFullTemplate(data);
        if (data.status === "Active") {
          setFormTemplate(data.form_template);
          setFormFields(data.form_template.fields);
          setFormTheme(data.form_theme);
          setAvailableSlots(data.available_slots);
          console.log(data.available_slots);
          setIsFormActive(true);
        } else {
          setIsFormActive(false);
        }
      } catch (error) {
        console.error("Failed to fetch form data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.query.uuid) {
      fetchFormData(router.query.uuid as string);
    }
  }, [router.query.uuid]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!isFormActive) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Form is not available or is inactive.
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Thank you. Your Request has been submitted. Business owner will contact
        you soon.
      </div>
    );
  }

  const buildDataToSubmitResponse = async (response: IFormField[]) => {
    return {
      connected_form: fullTemplate?.id,
      form_response: [...response],
      pushed_to_google: false,
      status: "Pending",
    };
  };

  const handleSubmitForm = async (formResponse: IFormField[]) => {
    try {
      const buildedData = await buildDataToSubmitResponse(formResponse);
      const response = await submitFormResponses(buildedData);
      if (response.status == 201) {
        setIsSubmitted(true);
      }
    } catch (error) {}
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{
        backgroundColor: formTheme.background_color,
        color: formTheme.text_color,
      }}
    >
      <div className="w-full max-w-lg p-6 bg-white rounded-md shadow-md">
        {formTemplate?.name && (
          <h1 className="text-2xl mb-4">{formTemplate.name}</h1>
        )}
        <FormDisplay
          onClickSubmit={async (fieldResponses: IFormField[]) => {
            await handleSubmitForm(fieldResponses);
          }}
          theme={formTheme}
          fields={formFields}
          isPreview={false}
          availableSlots={availableSlots}
        />
      </div>
    </div>
  );
};

export default PublicFormView;
