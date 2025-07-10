import { useEffect, useState } from "react";
import { getPendingDrivers } from "../../api/auth/admin";
import { rejectDriver, approveDriver } from "../../api/auth/admin";
import AdminNavBar from "../../components/admin/AdminNavbar";
import { approveVehicleById, rejectVehicleById } from "../../api/auth/admin";
import { Car, User } from "lucide-react";
import { message } from "antd";
import PendingDriverInfo from "@/components/admin/PendingDriverInfo";
import AdminPendingVehicleInfo from "./AdminPendingVehicleInfo";

export interface IPendingDriver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  vehicle_id?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pin_code: string;
  };
  dob: string;
  status: string;
  license_exp: string;
  vehicleDetails: {
    _id: string;
    nameOfOwner: string;
    addressOfOwner: string;
    brand: string;
    vehicleModel: string;
    color: string;
    numberPlate: string;
    regDate: Date;
    expDate: Date;
    insuranceProvider: string;
    policyNumber: string;
    status: string;
    category?: string;
    vehicleImages: {
      frontView: string;
      rearView: string;
      interiorView: string;
    };
  };
}

export interface IPendingVehicle {
  _id: string;
  nameOfOwner: string;
  addressOfOwner: string;
  brand: string;
  vehicleModel: string;
  color: string;
  numberPlate: string;
  regDate: Date;
  expDate: Date;
  status: string;
  insuranceProvider: string;
  policyNumber: string;
  vehicleImages: {
    frontView: string;
    rearView: string;
    interiorView: string;
  };
  category?: string;
}

const AdminPendingDriver = () => {
  const [drivers, setDrivers] = useState<IPendingDriver[] | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<IPendingDriver | null>(
    null
  );
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [showRejectModalVehicle, setShowRejectModalVehicle] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [vehicleReject, setVehicleReject] = useState("");

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] =
    useState<IPendingVehicle | null>(null);
  const [vehicleCategory, setVehicleCategory] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await getPendingDrivers();
        if (res.success) {
          setDrivers(res.drivers);
        }
      } catch (error) {
        console.error("Error fetching drivers", error);
      }
    };
    fetchDrivers();
  }, []);

  const handleRejectClick = (driverId: string) => {
    setSelectedDriverId(driverId);
    setShowRejectModal(true);
  };

  const handleRejectClickVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setShowRejectModalVehicle(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      messageApi.warning("Please enter a rejection reason.");
      return;
    }

    try {
      if (!selectedDriverId || !rejectionReason) {
        console.log("data is missing");
        return;
      }
      messageApi.open({
        key,
        type: "loading",
        content: "Updating status...",
      });

      const res = await rejectDriver(selectedDriverId, rejectionReason);
      if (res.success) {
        messageApi.open({
          key,
          type: "success",
          content: "Driver rejection successful!",
          duration: 2,
        });
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.map((driver) =>
                driver._id === selectedDriverId
                  ? { ...driver, status: "rejected" }
                  : driver
              )
            : null
        );
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.filter(
                (driver) =>
                  driver.status == "pending" ||
                  driver.vehicleDetails?.status == "pending"
              )
            : []
        );

        setSelectedDriver(null);
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedDriver(null);
      }
    } catch (error) {
      console.log("Error rejecting driver", error);
      if (error instanceof Error) {
        messageApi.error(error.message || "Error rejecting driver");
      }
    }
  };

  const submitApproval = async (driverId: string) => {
    try {
      if (!driverId) {
        return;
      }
      messageApi.open({
        key,
        type: "loading",
        content: "Updating status...",
      });

      const res = await approveDriver(driverId);
      if (res.success) {
        messageApi.open({
          key,
          type: "success",
          content: "Driver approval successful!",
          duration: 2,
        });
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.map((driver) =>
                driver._id === driverId
                  ? { ...driver, status: "approved" }
                  : driver
              )
            : null
        );
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.filter(
                (driver) =>
                  driver.status == "pending" ||
                  driver.vehicleDetails?.status == "pending"
              )
            : []
        );

        setSelectedDriver(null);
      }
    } catch (error) {
      console.log("Error approving driver", error);
      if (error instanceof Error) {
        messageApi.error(error.message || "Error approving driver");
      }
    }
  };

  const approveVehicle = async (vehicleId: string, category: string) => {
    try {
      if (!category) {
        messageApi.open({
          key,
          type: "error",
          content: "Please choose a category!.",
        });
        return;
      }
      messageApi.open({
        key,
        type: "loading",
        content: "Updating status...",
      });

      const res = await approveVehicleById(vehicleId, category);
      if (res.success) {
        messageApi.open({
          key,
          type: "success",
          content: "Vehicle approval successful!",
          duration: 2,
        });
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.map((driver) =>
                driver.vehicleDetails?._id === vehicleId
                  ? {
                      ...driver,
                      vehicleDetails: {
                        ...driver.vehicleDetails,
                        status: "approved",
                        category: category,
                      },
                    }
                  : driver
              )
            : null
        );

        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.filter(
                (driver) =>
                  driver.status == "pending" ||
                  driver.vehicleDetails?.status == "pending"
              )
            : []
        );

        setShowVehicleModal(false);

        setSelectedVehicle(null);
        setSelectedDriver(null);
        setVehicleCategory("");
      }
    } catch (error) {
      console.log("Error approving vehicle", error);
      if (error instanceof Error) {
        messageApi.error(error.message || "Error approving vehicle");
      }
    }
  };

  const rejectVehicle = async () => {
    if (!selectedVehicleId || !vehicleReject.trim()) {
      messageApi.warning("Please enter a reason ");
      return;
    }
    try {
      messageApi.open({
        key,
        type: "loading",
        content: "Updating status...",
      });

      const res = await rejectVehicleById(selectedVehicleId, vehicleReject);
      if (res.success) {
        messageApi.open({
          key,
          type: "success",
          content: "Vehicle rejection successful!",
          duration: 2,
        });
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.map((driver) =>
                driver.vehicleDetails?._id === selectedVehicleId
                  ? {
                      ...driver,
                      vehicleDetails: {
                        ...driver.vehicleDetails,
                        status: "rejected",
                      },
                    }
                  : driver
              )
            : null
        );
        setDrivers((prevDrivers) =>
          prevDrivers
            ? prevDrivers.filter(
                (driver) =>
                  driver.status == "pending" ||
                  driver.vehicleDetails?.status == "pending"
              )
            : []
        );
        setShowRejectModalVehicle(false);
        setSelectedVehicle(null);
        setSelectedDriver(null);
        setShowVehicleModal(false);
      }
    } catch (error) {
      console.log("Error rejecting vehicle", error);
      if (error instanceof Error) {
        messageApi.error(error.message || "Error rejecting vehicle");
      }
    }
  };

  return (
    <div className="bg-[#0E1220] min-h-screen flex flex-col items-center  justify-center lg:flex-row p-6 ">
      {/* Pending Drivers List */}
      <AdminNavBar />
      {contextHolder}
      <div className=" w-full  max-w-4xl bg-[#1A2036] rounded-lg p-6 shadow-lg border border-[#2C3347]/50">
        <h2 className="text-white text-xl font-semibold mb-4">
          Pending Drivers
        </h2>

        {/* Table Headers */}
        <div className="flex bg-[#2e345c] h-12 rounded-lg items-center px-6 text-white font-semibold">
          <p className="w-[15%] text-center">#</p>
          <p className="w-[40%] text-left">Name</p>
          <p className="w-[30%] text-left">Pending</p>
          <p className="w-[15%] text-center">View</p>
        </div>

        {/* List of Pending Drivers */}
        {drivers && drivers.length > 0 ? (
          drivers.map((driver, index) => (
            <div
              key={driver._id}
              className="bg-[#394065] mt-2 rounded-lg p-4 h-12 flex items-center px-6 text-white"
            >
              <p className="w-[15%] text-center">{index + 1}</p>
              <p className="w-[40%] text-left">{driver.name}</p>

              {/* Pending Status Logic */}
              <div className="w-[30%] flex items-center gap-2">
                {driver.status === "pending" && <User />}
                {driver.vehicleDetails?.status === "pending" && <Car />}
              </div>

              <div className="w-[15%] flex justify-center">
                <button
                  onClick={() => setSelectedDriver(driver)}
                  className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 transition-all"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white mt-4 text-center">No pending drivers</p>
        )}
      </div>

      {/* Individual Driver Details */}

      {selectedDriver && (
        <PendingDriverInfo
          handleRejectClick={handleRejectClick}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          setSelectedVehicle={setSelectedVehicle}
          setShowVehicleModal={setShowVehicleModal}
          submitApproval={submitApproval}
        />
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1A2036] p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">
              Rejection Reason
            </h3>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white"
              rows={3}
              placeholder="Enter rejection reason..."
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showVehicleModal && selectedVehicle && (
        <AdminPendingVehicleInfo approveVehicle={approveVehicle} handleRejectClickVehicle={handleRejectClickVehicle} selectedVehicle={selectedVehicle} setShowVehicleModal={setShowVehicleModal} setVehicleCategory={setVehicleCategory} vehicleCategory={vehicleCategory}/> 
      )}

      {showRejectModalVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1A2036] p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">
              Rejection Reason
            </h3>

            <textarea
              value={vehicleReject}
              onChange={(e) => setVehicleReject(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white"
              rows={3}
              placeholder="Enter rejection reason..."
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModalVehicle(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={rejectVehicle}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingDriver;
