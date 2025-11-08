import axios from "axios";

import axiosAdminInstance from "../axios/admin.axios.instance";
import { IOffer } from "@/components/admin/AddOffers";
interface Fare {
  basic: number;
  premium: number;
  luxury: number;
}

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("Fields are missing");
    }
    const response = await axiosAdminInstance.post("/login", {
      email,
      password,
    });
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in login :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getUsers(
  page: number = 1,
  searchTerm: string = "",
  sortBy: string = "A-Z"
) {
  try {
    const response = await axiosAdminInstance.get(
      `/getUsers?page=${page}&search=${searchTerm}&sort=${sortBy}`
    );
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in login :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateStatus(id: string) {
  try {
    const response = await axiosAdminInstance.patch("/user/changeStatus", {
      id,
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getDrivers(
  page: number = 1,
  searchTerm: string = "",
  sortBy: string = "A-Z"
) {
  try {
    const response = await axiosAdminInstance.get(
      `/getDrivers?page=${page}&search=${searchTerm}&sort=${sortBy}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getPendingDriverCount() {
  try {
    const response = await axiosAdminInstance.get("/getPendingCount");
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function toggleBlockUnblockDriver(id: string) {
  try {
    const response = await axiosAdminInstance.patch(
      "/driver/toggleBlockUnblock",
      { id }
    );
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in login :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getPendingDrivers() {
  try {
    const response = await axiosAdminInstance.get("/pending-drivers");
    console.log("Pending drivers ", response.data.drivers);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in login :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function rejectDriver(id: string, reason: string) {
  try {
    if (!id || !reason) {
      return;
    }
    const response = await axiosAdminInstance.patch("/reject-driver", {
      id,
      reason,
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from reject vehicle :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function approveDriver(id: string) {
  try {
    if (!id) {
      return;
    }
    const response = await axiosAdminInstance.patch("/approve-driver", {
      id,
    });
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getVehicleById(vehicleId: string) {
  try {
    if (!vehicleId) {
      return;
    }
    const response = await axiosAdminInstance.get(
      `/getVehicleInfo/${vehicleId}`
    );
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from reject vehicle :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function approveVehicleById(id: string, category: string) {
  try {
    if (!id) {
      throw new Error("Vehicle ID is required");
    }

    const response = await axiosAdminInstance.patch("/approve-vehicle", {
      id,
      category,
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from approve vehicle:",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function rejectVehicleById(vehicleId: string, reason: string) {
  try {
    if (!vehicleId || !reason) {
      throw new Error("Vehicle ID and rejection reason are required");
    }

    const response = await axiosAdminInstance.patch("/reject-vehicle", {
      id: vehicleId,
      reason,
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from reject vehicle:",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateFare(fare: Fare) {
  try {
    if (!fare) {
      throw new Error("Fare info missing");
    }
    const response = await axiosAdminInstance.put(`/updateFare`, { ...fare });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from update fare :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getFares() {
  try {
    const response = await axiosAdminInstance.get(`/getFares`);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log("Error message from get fares:", err.response.data.message);
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getComplaints(
  page: number = 1,
  filter: string,
  search: string
) {
  try {
    const response = await axiosAdminInstance.get(
      `/getComplaints?page=${page}&filter=${filter}&search=${search}`
    );

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getComplaintInDetail(id: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/getComplaintInDetail?id=${id}`
    );

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in login :",
        err.response.data.message
      );
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  type: "resolved" | "rejected"
) {
  try {
    const response = await axiosAdminInstance.patch(`/changeComplaintStatus`, {
      id: complaintId,
      type,
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function sendWarningEmail(complaintId: string) {
  try {
    const response = await axiosAdminInstance.post(`/sendWarningMail`, {
      id: complaintId,
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function addOffers(data: IOffer) {
  try {
    const response = await axiosAdminInstance.post(`/addOffer`, data);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function changeOfferStatus(offerId: string) {
  try {
    const response = await axiosAdminInstance.patch(`/changeOfferStatus`, {
      id: offerId,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function fetchOffers() {
  try {
    const response = await axiosAdminInstance.get(`/getOffers`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function getDashBoardInfo() {
  try {
    const response = await axiosAdminInstance.get(`/dashboard`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getRideEarnings(page: number, search: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/rideEarnings?page=${page}&search=${search}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function getPremiumUsers(
  page: number,
  filter: "All" | "Active" | "InActive",
  search: string,
  sort: "A-Z" | "Z-A"
) {
  try {
    const response = await axiosAdminInstance.get(
      `/premiumUsers?page=${page}&filter=${filter}&sort=${sort}&search=${search}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getDriverInfo(driverId: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/driver-info?id=${driverId}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function getDriverRideAndRating(driverId: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/driver-ride-rating?id=${driverId}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function getVehicleInfoForDriver(driverId: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/vehicle-info?id=${driverId}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getUserInfoAdmin(userId: string) {
  try {
    const response = await axiosAdminInstance.get(`/user-info?id=${userId}`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getUserRideAndRating(userId: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/user-ride-rating?id=${userId}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function logoutAdmin() {
  try {
    const response = await axiosAdminInstance.get(`/logout`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function adminRideHistory(
  sort: string,
  filter: "all" | "ongoing" | "canceled" | "completed",
  search: string,
  page: number = 1
) {
  try {
    const response = await axiosAdminInstance.get(
      `/rides?page=${page}&sort=${sort}&filter=${filter}&search=${search}`
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
export async function adminRideInfo(rideId: string) {
  try {
    const response = await axiosAdminInstance.get(`/ride?id=${rideId}`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Unknown error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
