import React, { useEffect, useState } from "react";
import FormDisplay from "@/components/FormDisplay";
import SetupForm from "@/components/SetupForm";
import { Dialog } from "@headlessui/react";
import { ITemplate, ITheme } from "@/types/forms";
import { fetchConnectedOAuthAccounts } from "@/utils/services/turnx/accounts";
import { FaTimes } from "react-icons/fa"; // Import FontAwesome close icon
import { DEFAULT_FORM_THEME } from "@/constants/forms";

interface FormTemplateProps {
  templates: ITemplate[];
}

const FormTemplate: React.FC<FormTemplateProps> = ({ templates }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] =
    useState<ITheme>(DEFAULT_FORM_THEME);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetchConnectedOAuthAccounts();
      if (response.status == 200) setConnectedAccounts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTemplateClick = (template: ITemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleFormSetupComplete = () => {
    // Handle other actions after form setup
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="relative bg-green-200 text-green-700 p-4 rounded-lg cursor-pointer hover:shadow-md"
          onClick={() => handleTemplateClick(template)}
        >
          <div className="font-bold">{template.name}</div>
          <div className="text-sm">{template.description}</div>
          <div className="absolute top-0 right-0 w-8 h-8 bg-green-400 text-green-900 flex items-center justify-center font-bold">
            M
          </div>
        </div>
      ))}

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30"></div>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Close Icon Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>

            {selectedTemplate && (
              <>
                <SetupForm
                  selectedForm={selectedTemplate}
                  accounts={connectedAccounts} // Replace with actual accounts data
                  themes={[]} // Replace with actual themes data
                  onFormSetupComplete={handleFormSetupComplete}
                  onSelectedThemeChange={(theme: ITheme) => {
                    setSelectedTheme(theme);
                  }}
                />
                <div className="border-orange-400 border p-4 m-2 rounded-lg shadow">
                  <h4 className="text-center">Preview</h4>
                  <FormDisplay
                    fields={selectedTemplate.fields}
                    isPreview={true}
                    theme={selectedTheme}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default FormTemplate;
