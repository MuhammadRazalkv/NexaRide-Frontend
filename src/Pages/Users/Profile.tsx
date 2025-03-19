import NavBar from "@/components/User Comp/NavBar";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/api/auth/user";
import { Default_Pfp } from "@/Assets";
import { MdKeyboardArrowRight } from "react-icons/md";
import { updateUserName, updateUserPhone , updateUserProfilePic } from "@/api/auth/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog"
import { message } from 'antd'
import { MdEdit } from "react-icons/md";

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
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string>('')
  const [toUpdate, setToUpdate] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  useEffect(() => {
    async function fetchUser() {
      const res = await getUserInfo();
      if (res && res.user) {
        setUser(res.user);
      }
    }

    fetchUser();
  }, []);

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (!value.trim()) {
      setNameErr("Name is required");
    } else if (!/^[A-Za-z\s]{3,}$/.test(value)) {
      setNameErr("Name must be at least 3 characters and contain only alphabets & spaces");
    } else {
      setNameErr(null);
    }

  };

  // Phone Number Validation
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setPhone(value);

    if (!value.trim()) {
      setPhoneErr("Phone number is required");
    } else if (!/^[6-9]\d{9}$/.test(value)) {
      setPhoneErr("Enter a valid  phone number ");
    } else {
      setPhoneErr('');
    }
  };

  const updateCall = (field: string) => {
    setIsDialogOpen(true)
    setToUpdate(field)
  }

  const handleSubmit = async (field: string) => {
    if (!field || nameErr || phoneErr) return
    try {
      messageApi.open({
        key,
        className: '',
        type: 'loading',
        content: 'Updating user info...',
      });

      if (field == 'name' && name) {

        const res = await updateUserName(name)
        if (res && res.success) {
          messageApi.open({
            key,
            type: 'success',
            content: 'Name updated successfully!',
            duration: 2,
          });

          setUser((prevUser) => {
            if (!prevUser) return prevUser;


            return {
              ...prevUser,
              name: res.name,
            };
          });
          setIsDialogOpen(false)
        }
      } else if (field == 'phone' && phone) {
        const res = await updateUserPhone(parseInt(phone))
        if (res.success) {
          if (res && res.success) {
            messageApi.open({
              key,
              type: 'success',
              content: 'Phone updated successfully!',
              duration: 2,
            });

            setUser((prevUser) => {
              if (!prevUser) return prevUser;


              return {
                ...prevUser,
                phone: res.phone,
              };
            });
            setIsDialogOpen(false)
          }

        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message) {
        messageApi.error(error.message);
        setIsDialogOpen(false)
        return
      }
      messageApi.error("Failed to update status.");
      setIsDialogOpen(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]; // Allowed image types
  
    const file = e.target.files?.[0]; // Ensure a file is selected
    if (!file) return;
  
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      messageApi.open({
        type:'error',
        content:"Only JPG, PNG, and WEBP images are allowed.",
        duration:2, 
      })

      return;
    }
  
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      messageApi.open({
        type:'error',
        content:"File size must be less than 2MB.",
        duration:2, 
      })
      return;
    }
  

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        updateProfilePic(reader.result as string);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      messageApi.open({
        type:'error',
        content:"Failed to read the file.", 
      })

    };
    reader.readAsDataURL(file);
  };

  const updateProfilePic = async (image:string)=>{
    if (!image) {
      messageApi.open({
        type:'error',
        content:"Failed to read the file.",
      })
      return
    }

    try {
      const res = await updateUserProfilePic(image)
      if (res.success) {
        messageApi.open({
          type:'success',
          content:'Profile picture has been update successfully',
          duration:2, 
        })
        setUser((prevUser) => {
          if (!prevUser) return prevUser;


          return {
            ...prevUser,
            profilePic: res.image,
          };
        });
      }
      
    } catch (error) {
      if (error instanceof Error) {   
        messageApi.open({
          type:'error',
          content:error.message || 'Failed to update user profile ',
          duration:2, 
        })
        return
      }
      messageApi.open({
        type:'error',
        content: 'Failed to update user profile ',
        duration:2, 
      })
    }


  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      {contextHolder}

      <Dialog open={isDialogOpen} >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {nameErr && <p className="text-red-500 text-xs">{nameErr}</p>}
          {phoneErr && <p className="text-red-500 text-xs">{phoneErr}</p>}

          <div className="grid gap-4 py-4">
            {
              toUpdate == 'name' ?

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>

                  <Input id="name" type="string" defaultValue={user?.name}
                    onChange={handleName}
                    className="col-span-3" />
                </div>


                :

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Phone
                  </Label>
                  <Input id="username" type="number" defaultValue={user?.phone}
                    onChange={handlePhone}
                    className="col-span-3" />
                </div>

            }
          </div>
          <DialogFooter>
            <Button onClick={() => {
              if (isDialogOpen) {
                setIsDialogOpen(false)
              }
              setNameErr(null)
              setPhoneErr('')
            }}
              variant={'outline'}
            >Cancel </Button>
            <Button
              onClick={() => handleSubmit(toUpdate)}
            >Save changes</Button>
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

              <label htmlFor="profilePicInput" className="cursor-pointer block w-full h-full">
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
              <div className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                onClick={() => updateCall('name')}
              >
                <p className="text-xl font-medium text-gray-800">{user?.name || "Name"}</p>
                <MdKeyboardArrowRight />
              </div>
              <div className="flex justify-between items-center hover:bg-gray-100 p-1.5">
                <p className="text-gray-600">{user?.email || "Email"}</p>

              </div>
              <div className="flex justify-between items-center hover:bg-gray-100 p-1.5"
                onClick={() => updateCall('phone')}
              >
                <p className="text-gray-600">{user?.phone || "Phone"}</p>
                <MdKeyboardArrowRight />
              </div>


            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Profile;