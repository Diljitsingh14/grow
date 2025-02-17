import React, { useEffect, useState } from "react";
import ConnectedAccountList from "@/components/ConnectedAccountList";
import SelectTheme from "@/components/SelectTheme"; // Import the SelectTheme component
import {
  connectFormWithOauthAccount,
  fetchMasterFormThemes,
} from "@/utils/services/turnx/forms";
import { ITemplate, ITheme } from "@/types/forms";
import { DEFAULT_FORM_THEME } from "@/constants/forms";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PUBLIC_FORM_URL_PREFIX } from "@/constants/routes";

interface SetupFormProps {
  selectedForm: ITemplate;
  onFormSetupComplete: () => void;
  accounts: any[];
  themes: ITheme[];
  onSelectedThemeChange: (t: ITheme) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({
  selectedForm,
  onFormSetupComplete,
  accounts,
  themes,
  onSelectedThemeChange,
}) => {
  const [step, setStep] = useState(1);
  const [masterThemes, setMasterThemes] = useState<ITheme[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [publicLink, setPublicUrl] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const fetchMasterThemes = async () => {
    try {
      const { data } = await fetchMasterFormThemes();
      setMasterThemes(data?.results);
    } catch (error) {
      console.error(error);
    }
  };

  const buildDataForConnectForm = async () => {
    return {
      form_template: selectedForm.id,
      status: "Active",
      form_theme: selectedTheme,
      account: selectedAccount,
    };
  };

  const configureForm = async () => {
    try {
      const data = await buildDataForConnectForm();
      const response = await connectFormWithOauthAccount(data);
      console.log(response);
      if (response.status == 201) {
        const { data } = response;
        setPublicUrl(`${PUBLIC_FORM_URL_PREFIX}${data.public_link_uuid}`);
        setIsSetupComplete(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = async () => {
    if (publicLink) {
      try {
        await navigator.clipboard.writeText(publicLink);
        // Close the form or perform additional actions here
        setIsSetupComplete(false);
        onFormSetupComplete();

        setStep(1); // Reset to the initial step if you want to reset the form
      } catch (err) {
        console.error("Failed to copy the text to clipboard", err);
      }
    }
  };

  useEffect(() => {
    fetchMasterThemes();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Setup Your Form</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleNextStep}
          >
            Start Setup
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Select Google Account</h2>
          <ConnectedAccountList
            connectedAccounts={accounts}
            onClickAccount={(account_id) => {
              if (selectedAccount === account_id) {
                setSelectedAccount("");
              } else setSelectedAccount(account_id);
            }}
            isOnlyView={true}
            selectedAccountList={[selectedAccount]}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Choose Theme</h2>
          <SelectTheme
            themes={masterThemes}
            selectedTheme={selectedTheme}
            onSelectTheme={(themeId) => {
              const selectedTheme =
                masterThemes.find((t: ITheme) => `${t.id}` === themeId) ||
                DEFAULT_FORM_THEME;
              onSelectedThemeChange(selectedTheme);
              setSelectedTheme(themeId);
            }}
            onThemeSave={fetchMasterThemes} // Refresh the theme list after saving a theme
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={async () => {
              await configureForm();
              handleNextStep();
            }}
          >
            Finish Setup
          </button>
        </div>
      )}
      {step === 4 && (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Form Setup Complete!</h2>
          <span className="text-sm font-bold text-gray-400">{publicLink}</span>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded my-2"
            onClick={copyToClipboard}
          >
            Copy link <FontAwesomeIcon icon={faCopy} className="mx-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SetupForm;
