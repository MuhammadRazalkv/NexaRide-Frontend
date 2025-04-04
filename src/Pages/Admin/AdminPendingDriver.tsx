import { useEffect, useState } from "react";
import { getPendingDrivers } from "../../api/auth/admin";
import { rejectDriver, approveDriver } from "../../api/auth/admin";
import AdminNavBar from "../../components/Admin Comp/AdminNavBar";
import { approveVehicleById, rejectVehicleById } from "../../api/auth/admin";
import { Car, User } from "lucide-react";
import { message } from "antd";

interface IPendingDriver {
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

interface IPendingVehicle {
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await getPendingDrivers();
        if (res.success) {
          setDrivers(res.drivers);
          console.log("Drivers ", res.drivers);
        }
      } catch (error) {
        console.error("Error fetching drivers", error);
      }
    };
    fetchDrivers();
  }, []);

  // useEffect(() => {
  //     setDrivers((prevDrivers) => prevDrivers?.filter(driver => driver.status == 'pending' || driver.vehicleDetails?.status == 'pending') || []);

  // }, [drivers])

  const handleRejectClick = (driverId: string) => {
    setSelectedDriverId(driverId);
    setShowRejectModal(true);
  };

  const handleRejectClickVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setShowRejectModalVehicle(true);
  };

  const submitRejection = async () => {
    console.log("driver id ", selectedDriverId);

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
        // setDrivers((prevDrivers) => prevDrivers?.filter(driver => driver.status == 'pending' || driver.vehicleDetails?.status == 'pending') || []);
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
        // setDrivers((prevDrivers) => prevDrivers?.filter(driver => driver._id !== driverId) || []);
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

  // const fetchVehicleInfo = async (vehicleId: string) => {
  //     if (!vehicleId) return;

  //     try {

  //         const res = await getVehicleById(vehicleId);
  //         if (res.success) {
  //             setSelectedVehicle(res.vehicle);
  //             setShowVehicleModal(true);
  //         }
  //     } catch (error) {
  //         console.log("Error fetching vehicle data", error);
  //     }
  // };

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
        setTimeout(() => {
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
        }, 1000);
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
        <div className="w-full max-w-md bg-[#1A2036] p-6 rounded-lg shadow-lg border border-[#2C3347]/50 mt-6 md:mt-0 md:ml-6 relative">
          {/* Close Button (Top Right) */}
          <button
            onClick={() => setSelectedDriver(null)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
          >
            ✕
          </button>

          <h3 className="text-white text-xl font-semibold mb-4">
            Driver Details
          </h3>
          <div className="space-y-2">
            <p className="text-gray-400">
              <strong>Name:</strong> {selectedDriver.name}
            </p>
            <p className="text-gray-400">
              <strong>Email:</strong> {selectedDriver.email}
            </p>
            <p className="text-gray-400">
              <strong>License:</strong> {selectedDriver.license_number}
            </p>
            <p className="text-gray-400">
              <strong>Address:</strong> {selectedDriver.address.street},{" "}
              {selectedDriver.address.city}, {selectedDriver.address.state},{" "}
              {selectedDriver.address.pin_code}
            </p>
            <p className="text-gray-400">
              <strong>Date of Birth:</strong>{" "}
              {new Date(selectedDriver.dob).toLocaleDateString()}
            </p>
            <p className="text-gray-400">
              <strong>License Expiry:</strong>{" "}
              {new Date(selectedDriver.license_exp).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-4">
            {selectedDriver.status == "pending" ? (
              <>
                <button
                  onClick={() => submitApproval(selectedDriver._id)}
                  className="h-12 px-4 bg-green-500 hover:bg-green-600 text-white rounded transition-all"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleRejectClick(selectedDriver._id)}
                  className="h-12 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                >
                  Reject
                </button>
              </>
            ) : (
              <p className="text-white font-bold px-4 text-center ">
                Driver info verified
              </p>
            )}
            <button
              onClick={() => {
                setSelectedVehicle(selectedDriver.vehicleDetails);
                setShowVehicleModal(true);
              }}
              className="h-12 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all"
            >
              Vehicle Info
            </button>
          </div>
        </div>
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#1A2036] p-6 rounded-lg shadow-xl border border-[#2C3347]/50 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowVehicleModal(false)}
              className="absolute top-3 right-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-lg"
            >
              &times;
            </button>

            {/* Modal Title */}
            <h3 className="text-white text-2xl font-bold text-center mb-4">
              Vehicle Details
            </h3>

            {/* Vehicle Information */}
            <div className="text-gray-400 space-y-2">
              <p>
                <strong>Owner:</strong> {selectedVehicle.nameOfOwner}
              </p>
              <p>
                <strong>Address:</strong> {selectedVehicle.addressOfOwner}
              </p>
              <p>
                <strong>Brand:</strong> {selectedVehicle.brand}
              </p>
              <p>
                <strong>Model:</strong> {selectedVehicle.vehicleModel}
              </p>
              <p>
                <strong>Color:</strong> {selectedVehicle.color}
              </p>
              <p>
                <strong>License Plate:</strong> {selectedVehicle.numberPlate}
              </p>
              <p>
                <strong>Reg Date:</strong>{" "}
                {new Date(selectedVehicle.regDate).toLocaleDateString("en-GB")}
              </p>
              <p>
                <strong>Exp Date:</strong>{" "}
                {new Date(selectedVehicle.expDate).toLocaleDateString("en-GB")}
              </p>
              <p>
                <strong>Insurance Provider:</strong>{" "}
                {selectedVehicle.insuranceProvider}
              </p>
              <p>
                <strong>Policy Number:</strong> {selectedVehicle.policyNumber}
              </p>
              {selectedVehicle.category ? (
                <p>
                  <strong>Category :</strong> {selectedVehicle.category}
                </p>
              ) : (
                <div className="w-full h-4 mt-2 mb-6 ">
                  <label htmlFor="">
                    <strong>Choose a vehicle category :</strong>{" "}
                  </label>
                  <select
                    onChange={(e) => setVehicleCategory(e.target.value)}
                    name="Category"
                    className="rounded-sm px-2 p-1 border text-sm"
                  >
                    <option disabled selected>
                      Choose{" "}
                    </option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              )}
            </div>

            {/* Vehicle Images with Click Event */}
            <div className="flex justify-center gap-3 mt-4">
              {["frontView", "rearView", "interiorView"].map((view) => (
                <img
                  key={view}
                  src={
                    (selectedVehicle.vehicleImages as Record<string, string>)[
                      view
                    ]
                  }
                  alt={`${view} view`}
                  className="w-24 h-24 rounded-lg object-cover border border-[#2C3347] cursor-pointer"
                  onClick={() =>
                    setSelectedImage(
                      (selectedVehicle.vehicleImages as Record<string, string>)[
                        view
                      ]
                    )
                  }
                />
              ))}
            </div>

            {/* Full-Size Image Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                onClick={() => setSelectedImage(null)}
              >
                <img
                  src={selectedImage}
                  alt="Full-size view"
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            {selectedVehicle.status == "pending" ? (
              <div className="flex gap-3 mt-6 justify-center">
                <button
                  onClick={() =>
                    approveVehicle(selectedVehicle._id, vehicleCategory)
                  }
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleRejectClickVehicle(selectedVehicle._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all"
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className="text-white font-bold mt-3">
                Vehicle has been{" "}
                {selectedVehicle.status == "approved"
                  ? "approved"
                  : "rejected "}{" "}
                successfully
              </p>
            )}
          </div>
        </div>
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
