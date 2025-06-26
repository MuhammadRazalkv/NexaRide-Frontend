import IDriver from "@/interfaces/driver.interface";
import { IUserInfo } from "@/pages/admin/UserDetails";
import DriverOtherInfos from "./DriverOtherInfos";

interface IProfileBody {
  info?: IDriver | IUserInfo;
  variant: "driver" | "user";
}
function isDriver(info: IDriver | IUserInfo | undefined): info is IDriver {
  return (
    !!info && "license_number" in info && "license_exp" in info && "dob" in info
  );
}

const ProfileBody: React.FC<IProfileBody> = ({ info, variant }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
        {info ? (
          <>
            <div className="p-2 text-start">
              <p className="mb-1 text-sm text-gray-300">Name</p>
              <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
                {info.name}
              </p>
            </div>
            <div className="p-2 text-start">
              <p className="mb-1 text-sm text-gray-300">Email</p>
              <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
                {info.email}
              </p>
            </div>
            <div className="p-2 text-start">
              <p className="mb-1 text-sm text-gray-300">Phone</p>
              <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
                {info.phone}
              </p>
            </div>
            {variant === "driver" && isDriver(info) && (
              <DriverOtherInfos info={info} />
            )}
          </>
        ) : (
          <p className="text-gray-400">No data found</p>
        )}
      </div>
    </div>
  );
};

export default ProfileBody;
