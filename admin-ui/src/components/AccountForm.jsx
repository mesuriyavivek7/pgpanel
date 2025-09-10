import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "../validations/accountSchema";
import { useForm, Controller } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getAllBranch } from "../services/branchService";
import { createAcManager, updateAcmanager } from "../services/accountService";
import MultiSelectDropdown from "./MultiSelectDropDown";

function AccountForm({ selectedAccount, onClose }) {
  const [loading, setLoading] = useState();
  const [branches, setBranches] = useState([]);
  // const [selectedBranch, setSelectedBranch] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(accountSchema),
    defaultValues: {
      full_name: "",
      contact_no: "",
      email: "",
      branch: [],
      password: "",
    },
  });

  useEffect(() => {
    if (selectedAccount) {
      console.log(selectedAccount)
      reset({
        full_name: selectedAccount?.full_name,
        contact_no: selectedAccount?.contact_no,
        email: selectedAccount?.email,
        branch: selectedAccount?.branch.map(b => b._id),
        password: "secure",
      });
    }
  }, []);

  useEffect(() => {
    const handleGetAllBranch = async () => {
      try {
        const data = await getAllBranch();
        setBranches(
          data.map((item) => ({ label: item.branch_name, value: item._id }))
        );
      } catch (err) {
        console.log(err);
        toast.error(err?.message);
      }
    };

    handleGetAllBranch();
  }, []);

  const handleAddAcmanager = async (acmanagerData) => {
    setLoading(true);
    try {
      const data = await createAcManager(acmanagerData);
      toast.success("New Acmanager created successfully.");
      onClose(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAcmanager = async (acmanagerData) => {
    setLoading(true);
    try {
      const data = await updateAcmanager(acmanagerData, selectedAccount._id);
      toast.success("Acmanager details updated successfully.");
      onClose(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center">
      <div className="flex w-xl flex-col gap-4 bg-white rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <ChevronLeft
            size={28}
            onClick={() => onClose(false)}
            className="cursor-pointer"
          ></ChevronLeft>
          <h1 className="text-2xl font-semibold">
            {selectedAccount ? "Edit Acmanager" : "Add Acmanager"}
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(
            selectedAccount ? handleEditAcmanager : handleAddAcmanager
          )}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label>
              Full Name <span className="text-sm text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                {...register("full_name")}
                className="p-2 border border-neutral-300 rounded-md outline-none"
                placeholder="Enter full name"
              ></input>
              {errors.full_name && (
                <span className="text-sm text-red-500">
                  {errors.full_name.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              Mobile No <span className="text-sm text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                {...register("contact_no")}
                className="p-2 border border-neutral-300 rounded-md outline-none"
                placeholder="Enter mobile no"
              ></input>
              {errors.contact_no && (
                <span className="text-sm text-red-500">
                  {errors.contact_no.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              Email <span className="text-sm text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                {...register("email")}
                className="p-2 border border-neutral-300 rounded-md outline-none"
                placeholder="Enter email address"
              ></input>
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              Branch <span className="text-sm text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={branches}
                    selected={field.value || []} // controlled by RHF
                    onChange={(val) => field.onChange(val)} // update RHF state
                    placeholder="--Select Branch--"
                  />
                )}
              />
              {errors.branch && (
                <span className="text-sm text-red-500">
                  {errors.branch.message}
                </span>
              )}
            </div>
          </div>
          {!selectedAccount && (
            <div className="flex flex-col gap-2">
              <label>
                Password <span className="text-sm text-red-500">*</span>
              </label>
              <div className="flex flex-col">
                <input
                  type="text"
                  {...register("password")}
                  className="p-2 border border-neutral-300 rounded-md outline-none"
                  placeholder="Enter password"
                ></input>
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className="p-2 hover:bg-blue-600 disabled:cursor-not-allowed w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium"
            >
              {loading ? (
                <LoaderCircle className="animate-spin"></LoaderCircle>
              ) : selectedAccount ? (
                "Save"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountForm;
