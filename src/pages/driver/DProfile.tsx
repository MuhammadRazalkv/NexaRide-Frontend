import { getDriverInfo, updateProfilePic } from "@/api/auth/driver";
import DNavBar from "@/components/driver/DNavBar";
import { Default_Pfp } from "@/Assets";
import { useEffect, useState } from "react";
import { MdEdit, MdEditSquare } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog";

import { updateDriverInfo } from "@/api/auth/driver";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import IDriver from "@/interfaces/driver.interface";

const DProfile = () => {
  const [driver, setDriver] = useState<IDriver | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const [toUpdate, setToUpdate] = useState<keyof IDriver | null>(null);

  // const [editableFields, setEditableFields] = useState<Partial<IDriver>>({});
  const [fieldValue, setFieldValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!toUpdate) return;

    const value = e.target.value.trim();
    setError(null);
    if (!value) {
      setError("Please enter a value");
      return;
    }

    const validationRules: Record<string, { regex: RegExp; error: string }> = {
      name: {
        regex: /^[a-zA-Z\s]{2,50}$/,
        error: "Invalid name! No special characters allowed.",
      },
      phone: {
        regex: /^\d{10}$/,
        error: "Invalid phone number format!",
      },
      street: {
        regex: /^[a-zA-Z0-9\s,'-]{2,100}$/,
        error: "Invalid street address!",
      },
      city: {
        regex: /^[a-zA-Z\s]{2,50}$/,
        error: "Invalid city name!",
      },
      pin_code: {
        regex: /^\d{6}$/,
        error: "Invalid pin code!",
      },

      license_number: {
        regex: /^[A-Z0-9]{5,15}$/,
        error: "Invalid license format!",
      },
      dob: {
        regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        error: "Invalid date of birth format! Use DD/MM/YYYY.",
      },
      license_exp: {
        regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        error: "Invalid license expiry date format! Use DD/MM/YYYY.",
      },
    };

    const rule = validationRules[toUpdate];
    if (rule && !rule.regex.test(value)) {
      setError(rule.error);
      return;
    }

    // setEditableFields({
    //     ...editableFields,
    //     [toUpdate]: value
    // });

    setFieldValue(value);
  };

  useEffect(() => {
    async function fetchDriver() {
      const res = await getDriverInfo();
      if (res && res.driver) {
        
        
        setDriver({
          ...res.driver,
          ...res.driver.address,
        });
      } else {
        messageApi.open({
          key,
          type: "error",
          content: "Failed to load driver info",
        });
      }
    }
    fetchDriver();
  }, [messageApi]);

  const updateCall = (field: keyof IDriver) => {
    console.log("Update call");

    setIsDialogOpen(true);
    setError(null);
    setToUpdate(field);
  };

  const handleSubmit = async () => {
    if (!toUpdate || !fieldValue) return;

    try {
      // const res = await updateDriverInfo(toUpdate , editableFields[toUpdate] as string );
      const res = await updateDriverInfo(toUpdate, fieldValue);
      if (res.success && res.updatedFiled) {
        messageApi.success(`${toUpdate} updated successfully`);
        setDriver((prevDriver) => ({
          ...prevDriver!,
          [toUpdate]: res.updatedFiled,
        }));
        setIsDialogOpen(false);
        navigate("/driver/ride");
      } else {
        messageApi.error(`Failed to update ${toUpdate}`);
      }
    } catch (error) {
      console.log(error);

      messageApi.error(`Error updating ${toUpdate}`);
    }
  };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  
      if (!file) return;
  
      if (!ALLOWED_TYPES.includes(file.type)) {
        messageApi.error("Only JPG, PNG, and WEBP images are allowed.");
        return;
      }
  
      if (file.size > MAX_FILE_SIZE) {
        messageApi.error("File size must be less than 2MB.");
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) callUpdateProfilePic(reader.result as string);
      };
      reader.onerror = () => {
        messageApi.error("Failed to read the file.");
      };
      reader.readAsDataURL(file);
    };
  
    const callUpdateProfilePic = async (image: string) => {
      try {
        const res = await updateProfilePic(image);
        if (res.success) {
          messageApi.success("Profile picture updated successfully!");
          setDriver(prev => prev ? { ...prev, profilePic: res.image } : prev);
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Failed to update profile picture.";
        messageApi.error(errMsg);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <DNavBar />
      {contextHolder}

      <Dialog open={isDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your profile details below. Once you click Save, your
              changes will be submitted for review. Re-verification is required
              — you'll receive an email once your information has been verified.
            </DialogDescription>
          </DialogHeader>
          {/* {/* {nameErr && <p className="text-red-500 text-xs">{nameErr}</p>} */}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {driver && toUpdate ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  {toUpdate}
                </Label>
                <Input
                  id="username"
                  type="string"
                  defaultValue={driver?.[toUpdate]}
                  className="col-span-3"
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <p>Filed not found for Updating</p>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (isDialogOpen) {
                  setIsDialogOpen(false);
                }
                setError(null);
                // setPhoneErr('')
              }}
              variant={"outline"}
            >
              Cancel{" "}
            </Button>
            <Button onClick={() => handleSubmit()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center  space-y-4">
            <div className="relative w-32 h-32 mx-auto hover:opacity-90">
              <input
                type="file"
                id="profilePicInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <label
                htmlFor="profilePicInput"
                className="cursor-pointer block w-full h-full"
              >
                <img
                  src={driver?.profilePic || Default_Pfp}
                  alt="User profile pic"
                  className="rounded-full w-full h-full object-cover border-4 border-purple-100"
                />

                <div className="absolute bottom-2 right-2 bg-black p-1 rounded-full border-2 border-white">
                  <MdEdit className="text-white text-lg" />
                </div>
              </label>
            </div>

            <div className="text-start space-y-4 w-xs md:w-md">
              <div
                className="flex justify-center gap-3 items-center hover:bg-gray-100 p-1.5"
                onClick={() => updateCall("name")}
              >
                <p className="text-xl font-medium text-gray-800">
                  {driver?.name || "Name"}
                </p>
                <MdEditSquare opacity={0.5} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-between items-center hover:bg-gray-100 p-1.5">
                  <p className="text-gray-600">{driver?.email || "Email"}</p>
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  onClick={() => updateCall("phone")}
                >
                  <p className="text-gray-600">{driver?.phone || "Phone"}</p>
                  <MdEditSquare opacity={0.5} />
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  // onClick={() => updateCall('dob')}
                >
                  <p className="text-gray-600">
                    {driver?.dob
                      ? new Date(driver.dob).toLocaleDateString()
                      : "DOB"}
                  </p>
                  {/* <MdEditSquare opacity={0.5} /> */}
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  onClick={() => updateCall("license_number")}
                >
                  <p className="text-gray-600">
                    {driver?.license_number || "License number"}
                  </p>
                  <MdEditSquare opacity={0.5} />
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  // onClick={() => updateCall('license_exp')}
                >
                  <p className="text-gray-600">
                    {driver?.license_exp
                      ? new Date(driver.license_exp).toLocaleDateString()
                      : "Exp"}
                  </p>
                  {/* <MdEditSquare opacity={0.5} /> */}
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  onClick={() => updateCall("state")}
                >
                  <p className="text-gray-600">{driver?.state || "State"}</p>
                  <MdEditSquare opacity={0.5} />
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  onClick={() => updateCall("city")}
                >
                  <p className="text-gray-600">{driver?.city || "City"}</p>
                  <MdEditSquare opacity={0.5} />
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  onClick={() => updateCall("street")}
                >
                  <p className="text-gray-600">{driver?.street || "Street"}</p>
                  <MdEditSquare opacity={0.5} />
                </div>

                <div
                  className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                  onClick={() => updateCall("pin_code")}
                >
                  <p className="text-gray-600">
                    {driver?.pin_code || "Pin Code"}
                  </p>
                  <MdEditSquare opacity={0.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DProfile;
