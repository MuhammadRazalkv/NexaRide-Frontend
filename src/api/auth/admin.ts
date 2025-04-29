import axios from "axios";

import axiosAdminInstance from "../axios/admin.axios.instance";
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

export async function rejectDriver(driverId: string, reason: string) {
  try {
    if (!driverId || !reason) {
      return;
    }
    const response = await axiosAdminInstance.patch("/reject-driver", {
      driverId,
      reason,
    });
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

export async function approveDriver(driverId: string) {
  try {
    if (!driverId) {
      return;
    }
    const response = await axiosAdminInstance.patch("/approve-driver", {
      driverId,
    });
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

export async function approveVehicleById(vehicleId: string, category: string) {
  try {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    const response = await axiosAdminInstance.patch("/approve-vehicle", {
      vehicleId,
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
      vehicleId,
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

    const response = await axiosAdminInstance.put(`/updateFare`, {
      fare,
    });

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
  filter: string = ""
) {
  try {
    const response = await axiosAdminInstance.get(
      `/getComplaints?page=${page}&filter=${filter}`
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

export async function getComplaintInDetail(id: string) {
  try {
    const response = await axiosAdminInstance.get(
      `/getComplaintInDetail?complaintId=${id}`
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
      complaintId,
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
      complaintId,
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
