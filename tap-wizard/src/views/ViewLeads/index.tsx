import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IFormField, ILead } from "@/types/forms"; // Ensure this type matches the structure of your data
import { consumeLead, fetchLeads } from "@/utils/services/turnx/forms";
import { FaArchive, FaSearch } from "react-icons/fa";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import Pagination from "@/components/Pagination"; // Assume you have a Pagination component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleDollar } from "@fortawesome/free-solid-svg-icons";

const ViewLeads: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const getLeads = async () => {
    try {
      const response = await fetchLeads();
      if (response.status === 200) {
        setLeads(response?.data ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  const openModal = (lead: ILead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  const handleArchive = (id: number) => {
    setIsArchiveModalOpen(true);
  };

  const onArchive = (id: any) => { };

  const onChangeStatus = async (id: string, status: any) => {
    try {
      const response = await consumeLead({ id, status: status });
      if (response.status == 200) {
        await getLeads();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmArchive = async (id: number) => {
    try {
      await onArchive(id);
      setIsArchiveModalOpen(false);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Failed to archive lead:", error);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (selectedLead) {
      await onChangeStatus(`${selectedLead.id}`, status);
      // setLeads((prevLeads) =>
      //   prevLeads.map((lead) =>
      //     lead.id === selectedLead.id ? { ...lead, status } : lead
      //   )
      // );
      closeModal();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = leads?.length ? [...(leads)].sort((a, b) => {
    if (!sortConfig || !sortConfig.key) return 0; // Check if sortConfig and sortConfig.key are defined

    const key = sortConfig.key as keyof ILead;

    // Null checks for a[key] and b[key]
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === null || aValue === undefined) return 1; // Consider null or undefined as greater
    if (bValue === null || bValue === undefined) return -1; // Consider null or undefined as lesser

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  }) : [];

  const filteredLeads = sortedLeads.filter(
    (lead) =>
      lead.lead_name?.toLowerCase().includes(searchQuery) ||
      lead.lead_email?.toLowerCase().includes(searchQuery) ||
      (Array.isArray(lead.form_response) && // Ensure it's an array
        lead.form_response.some((field: IFormField) =>
          field.response.toLowerCase().includes(searchQuery)
        ))
  );

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  return (
    <div className="bg-gray-100 p-4">
      <h3 className="text-2xl py-2 px-4 bg-blue-500 text-white mb-5">
        <FontAwesomeIcon icon={faFilterCircleDollar} className="mr-2" /> Manage
        Leads
      </h3>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          className="p-2 border rounded-md w-full"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("lead_name")}
              >
                Lead Name
                {sortConfig?.key === "lead_name" ? (
                  sortConfig.direction === "asc" ? (
                    <HiChevronUp className="inline ml-1" />
                  ) : (
                    <HiChevronDown className="inline ml-1" />
                  )
                ) : null}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Created At
                {sortConfig?.key === "created_at" ? (
                  sortConfig.direction === "asc" ? (
                    <HiChevronUp className="inline ml-1" />
                  ) : (
                    <HiChevronDown className="inline ml-1" />
                  )
                ) : null}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads?.map?.((lead) => (
              <tr
                key={lead.id}
                className="cursor-pointer"
                onClick={() => openModal(lead)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {lead.lead_name || "Unnamed Lead"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {lead.lead_email || "No Email"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {lead.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(lead.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center space-x-1"
                  >
                    <FaArchive className="mx-2" />
                    <span>Archive</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredLeads.length}
        itemsPerPage={leadsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal for viewing lead details and changing status */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4  ">
              <Dialog.Panel className="max-w-lg w-full rounded-lg bg-white p-6 shadow-lg">
                {selectedLead && (
                  <>
                    <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4 text-center">
                      Lead Details
                    </Dialog.Title>
                    {Array.isArray(selectedLead.form_response)
                      ? selectedLead.form_response.map((response, index) => (
                        <div key={index} className="mb-2">
                          <p className="text-sm font-medium text-gray-700">
                            {response.desc}:
                          </p>
                          <p className="text-sm text-gray-500">
                            {response.response}
                          </p>
                        </div>
                      ))
                      : Object.entries(selectedLead.form_response).map(
                        ([key, value], index) => (
                          <div key={index} className="mb-2">
                            <p className="text-sm font-medium text-gray-700">
                              {key}:
                            </p>
                            <p className="text-sm text-gray-500">{value}</p>
                          </div>
                        )
                      )}

                    <div className="flex justify-center space-x-4 mt-4">
                      <button
                        onClick={() => handleStatusChange("Declined")}
                        className="bg-red-500 text-white px-4 py-2 rounded-full"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusChange("Accepted")}
                        className="bg-green-500 text-white px-4 py-2 rounded-full"
                      >
                        Accept
                      </button>
                    </div>
                  </>
                )}
                <div className="text-center">
                  <button
                    onClick={closeModal}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md mx-auto"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Archive Confirmation Modal */}
      <Transition appear show={isArchiveModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsArchiveModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="max-w-sm w-full rounded-lg bg-white p-6 shadow-lg">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Archive
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to archive this lead?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsArchiveModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmArchive(selectedLead?.id || 0)}
                    className="bg-tomato-500 text-white px-4 py-2 rounded-md"
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ViewLeads;
