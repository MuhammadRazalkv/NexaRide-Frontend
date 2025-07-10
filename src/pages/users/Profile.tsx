import NavBar from "@/components/user/NavBar";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/api/auth/user";
import { Default_Pfp } from "@/Assets";
import { MdKeyboardArrowRight, MdEdit } from "react-icons/md";
import {
  updateUserName,
  updateUserPhone,
  updateUserProfilePic,
} from "@/api/auth/user";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog";
import { message } from "antd";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: number;
  profilePic: string;
}

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [toUpdate, setToUpdate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  useEffect(() => {
    async function fetchUser() {
      const res = await getUserInfo();
      if (res?.user) {
        setUser(res.user);
      }
    }
    fetchUser();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (!value.trim()) {
      setNameErr("Name is required");
    } else if (!/^[A-Za-z\s]{3,}$/.test(value)) {
      setNameErr(
        "Name must be at least 3 characters and contain only alphabets & spaces"
      );
    } else {
      setNameErr(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setPhone(value);

    if (!value) {
      setPhoneErr("Phone number is required");
    } else if (!/^[6-9]\d{9}$/.test(value)) {
      setPhoneErr("Enter a valid phone number");
    } else {
      setPhoneErr(null);
    }
  };

  const openUpdateDialog = (field: string) => {
    setToUpdate(field);
    setIsDialogOpen(true);

    // Reset states based on what we're updating
    if (field === "name") {
      setName(user?.name || "");
      setNameErr(null);
    } else if (field === "phone") {
      setPhone(user?.phone.toString() || "");
      setPhoneErr(null);
    }
  };

  const handleSubmit = async (field: string) => {
    if ((field === "name" && nameErr) || (field === "phone" && phoneErr))
      return;

    try {
      messageApi.open({
        key,
        type: "loading",
        content: "Updating user info...",
      });

      if (field === "name" && name.trim() !== user?.name.trim()) {
        const res = await updateUserName(name.trim());
        if (res?.success) {
          messageApi.open({
            key,
            type: "success",
            content: "Name updated successfully!",
            duration: 2,
          });
          setUser((prev) => (prev ? { ...prev, name: res.name } : prev));
          setIsDialogOpen(false);
        }
      } else if (field === "phone" && phone !== user?.phone.toString()) {
        const res = await updateUserPhone(Number(phone));
        if (res?.success) {
          messageApi.open({
            key,
            type: "success",
            content: "Phone updated successfully!",
            duration: 2,
          });
          setUser((prev) => (prev ? { ...prev, phone: res.phone } : prev));
          setIsDialogOpen(false);
        }
      } else {
        messageApi.open({
          key,
          type: "info",
          content: "No changes detected",
          duration: 2,
        });
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error instanceof Error ? error.message : "Failed to update user info.";
      messageApi.open({ key, type: "error", content: errMsg, duration: 2 });
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
      if (reader.result) updateProfilePic(reader.result as string);
    };
    reader.onerror = () => {
      messageApi.error("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  const updateProfilePic = async (image: string) => {
    try {
      const res = await updateUserProfilePic(image);
      if (res.success) {
        messageApi.success("Profile picture updated successfully!");
        setUser((prev) => (prev ? { ...prev, profilePic: res.image } : prev));
      }
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Failed to update profile picture.";
      messageApi.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      {contextHolder}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {(nameErr || phoneErr) && (
            <p className="text-red-500 text-xs">{nameErr || phoneErr}</p>
          )}
          <div className="grid gap-4 py-4">
            {toUpdate === "name" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className="col-span-3"
                />
              </div>
            )}
            {toUpdate === "phone" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  type="text"
                  onChange={handlePhoneChange}
                  className="col-span-3"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNameErr(null);
                setPhoneErr(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(toUpdate)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
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
                  src={user?.profilePic || Default_Pfp}
                  alt="User profile pic"
                  className="rounded-full w-full h-full object-cover border-4 border-purple-100"
                />

                <div className="absolute bottom-2 right-2 bg-black p-1 rounded-full border-2 border-white">
                  <MdEdit className="text-white text-lg" />
                </div>
              </label>
            </div>

            <div className="text-start space-y-4 w-xs">
              <div
                className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                onClick={() => openUpdateDialog("name")}
              >
                <p className="text-xl font-medium text-gray-800">
                  {user?.name || "Name"}
                </p>
                <MdKeyboardArrowRight />
              </div>
              <div className="flex justify-between items-center hover:bg-gray-100 p-1.5">
                <p className="text-gray-600">{user?.email || "Email"}</p>
              </div>
              <div
                className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                onClick={() => openUpdateDialog("phone")}
              >
                <p className="text-gray-600">{user?.phone || "Phone"}</p>
                <MdKeyboardArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
