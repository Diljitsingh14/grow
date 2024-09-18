import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  fetchConnectedForms,
  fetchFormTemplates,
} from "@/utils/services/turnx/forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNodes,
  faFileInvoice,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { IConnectedForm, IFormField, ITemplate } from "@/types/forms";
import FormTemplate from "@/components/FormTemplate";
import { PUBLIC_FORM_URL_PREFIX } from "@/constants/routes";

// Define the interfaces for fields and templates

// Component to render each form template
// const FormTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   return (
//     <>
//       <div
//         className={`relative p-4 border rounded-md shadow-md cursor-pointer flex flex-col justify-between
//           ${
//             template.is_master
//               ? "bg-lime-100 text-olive-800"
//               : "bg-gray-100 text-gray-800"
//           }
//           w-full aspect-square overflow-hidden transition hover:shadow-lg`}
//         onClick={openModal}
//       >
//         {/* Template Header with Icon and Title */}
//         <div className="flex justify-between items-start">
//           <div className="flex items-center">
//             <FontAwesomeIcon
//               icon={faFolder}
//               className={`mr-2 ${
//                 template.is_master ? "text-olive-600" : "text-gray-600"
//               }`}
//             />
//             <span className="font-medium">{template.name}</span>
//           </div>
//           {/* Conditional rendering for the master template badge */}
//           {template.is_master && (
//             <span className="absolute top-0 right-0 w-10 h-10 bg-lime-300 text-olive-800 flex justify-center items-center transform translate-x-3 -translate-y-3 font-bold">
//               M
//             </span>
//           )}
//         </div>

//         {/* Cut corner effect using pseudo-element */}
//         <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-transparent border-l-[40px] border-l-lime-100"></div>
//       </div>

//       {/* Modal for displaying template details */}
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900 mb-4"
//                   >
//                     {template.name}
//                   </Dialog.Title>
//                   <div className="mt-2">
//                     {/* Form fields display */}
//                     <form className="space-y-4">
//                       {template.fields.map((field) => (
//                         <div key={field.name}>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             {field.desc}
//                           </label>
//                           {field.type !== "textarea" ? (
//                             <input
//                               type={field.type}
//                               name={field.name}
//                               placeholder={field.helptext}
//                               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                           ) : (
//                             <textarea
//                               name={field.name}
//                               placeholder={field.helptext}
//                               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </form>
//                   </div>
//                   {/* Close button */}
//                   <div className="mt-4">
//                     <button
//                       type="button"
//                       className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                       onClick={closeModal}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// };

// Component to render the list of form templates
const MyForms: React.FC = () => {
  const [formTemplates, setFormTemplates] = useState<ITemplate[]>([]);
  const [connectedForms, setConnectedForms] = useState<IConnectedForm[]>([]); // State for connected forms

  // Fetch form templates
  const fetchTemplates = async () => {
    try {
      const { data } = await fetchFormTemplates();
      setFormTemplates(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch connected forms
  const fetchConnectedFormsData = async () => {
    try {
      const { data } = await fetchConnectedForms(); // Assuming this is how you fetch connected forms
      setConnectedForms(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchConnectedFormsData(); // Fetch connected forms on component mount
  }, []);

  return (
    <>
      {/* Header */}
      <h3 className="text-xl py-2 px-4 bg-blue-500 text-white mb-5">
        <FontAwesomeIcon icon={faFileInvoice} className="mr-2" /> Form Templates
      </h3>

      {/* Form Templates Grid */}
      {formTemplates.length ? (
        <FormTemplate templates={formTemplates} />
      ) : (
        <h1 className="text-gray-500 text-center text-sm col-span-full">
          Sorry, no Templates found!
        </h1>
      )}

      {/* Connected Forms Section Header */}
      <h3 className="text-xl py-2 px-4 bg-purple-500 text-white my-5">
        <FontAwesomeIcon icon={faCircleNodes} className="mr-2" /> Connected
        Forms
      </h3>

      {/* Connected Forms Grid */}
      {connectedForms.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {connectedForms.map((form) => (
            <div key={form.id} className="border p-4 rounded shadow">
              <h4 className="text-lg font-bold mb-2">{form.form_theme.name}</h4>
              <p className="text-sm text-gray-600">Status: {form.status}</p>
              <p className="text-sm text-gray-600">
                Account: {form.account.social_profile.email}
              </p>
              <img
                src={form.account.social_profile.picture}
                alt={form.account.social_profile.name}
                className="w-16 h-16 rounded-full mt-2"
              />
              <a
                href={`${PUBLIC_FORM_URL_PREFIX}${form.public_link_uuid}`}
                className="text-blue-500 underline mt-2 block"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Form
              </a>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-gray-500 text-center text-sm col-span-full">
          No Connected Forms found!
        </h1>
      )}
    </>
  );
};

export default MyForms;
