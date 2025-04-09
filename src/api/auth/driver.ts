import axios from "axios";
import axiosDriverInstance from "../axios/driver.axios.instance";

interface driverInfo {
  googleId?: string;
  profilePic?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  license_number: string;
  street: string;
  city: string;
  state: string;
  pin_code: string;
  dob: Date;
  license_exp: Date;
}

interface vehicleInfo {
  driverId?: string;
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
  vehicleImages: {
    frontView: string;
    rearView: string;
    interiorView: string;
  };
}

export async function verifyEmail(email: string) {
  try {
    if (!email) {
      throw new Error("Email is missing");
    }
    const response = await axiosDriverInstance.post("/verify-email", {
      email: email,
    });
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to add driver info";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error in addInfo:", errorMessage);
    throw new Error(errorMessage);
  }
}

//! sending otp and email to backend for verification
export async function sendOTP(otp: string) {
  try {
    const email = localStorage.getItem("D-email");
    if (!email) throw new Error("Email is missing");
    const response = await axiosDriverInstance.post("/verify-otp", {
      email: email,
      otp: otp,
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log("Error message from server:", err.response.data.message);
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

//! Re send OTP
export async function reSendOTP() {
  const email = localStorage.getItem("D-email");
  if (!email) throw new Error("Email is missing");
  const response = await axiosDriverInstance.post("/resend-otp", {
    email: email,
  });
  return response.data;
}

export async function addInfo(data: driverInfo) {
  try {
    if (!data.email) throw new Error("Email is missing");

    const response = await axiosDriverInstance.post("/addInfo", { data });
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to add driver info";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error in addInfo:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function addVehicle(data: vehicleInfo) {
  try {
    if (!data.driverId)
      throw new Error("Driver info not found . Please re-signup ");

    const response = await axiosDriverInstance.post("/addVehicle", { data });
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to add driver info";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error in addInfo:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("Fields are missing");
    }
    const response = await axiosDriverInstance.post("/login", {
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

export async function getStatus() {
  try {
    const response = await axiosDriverInstance.get("/status");

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in getStatus :",
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

export async function rejectReason() {
  try {
    const response = await axiosDriverInstance.get("/rejectReason");
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in rejectReason :",
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

export async function reApplyDriver(data: driverInfo) {
  try {
    // if (!token) throw new Error("token is missing");
    console.log("data", data);

    const response = await axios.patch("/reApplyDriver", data);

    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to add driver info";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error in addInfo:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function vehicleRejectReason() {
  try {
    const response = await axiosDriverInstance.get("/vehicleRejectReason");
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in rejectReason :",
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

export async function reApplyVehicle(data: vehicleInfo) {
  try {
    const response = await axiosDriverInstance.patch(
      "/reApplyVehicle",
      { data }
      // { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to add driver info";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error in addInfo:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function loginWithGoogle({
  email,
  googleId,
  profilePic,
}: {
  email: string;
  googleId: string;
  profilePic: string;
}) {
  try {
    if (!email) {
      throw new Error("Email is missing");
    } else if (!googleId) {
      throw new Error("Google Id  is missing");
    }

    const response = await axiosDriverInstance.post("/google-login", {
      email,
      googleId,
      profilePic,
    });
    console.log(response.data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in google driver login :",
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

export async function checkGoogleAuth(id: string, email: string) {
  try {
    const response = await axiosDriverInstance.post("/checkGoogleAuth", {
      id,
      email,
    });
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to use google auth ";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error in addInfo:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function forgotPass(email: string) {
  try {
    if (!email) {
      throw new Error("Email is required ");
    }
    const response = await axiosDriverInstance.post("/requestPasswordReset", {
      email,
    });
    console.log(response.data);

    return response.data;
  } catch (err) {
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

export async function resetPassword(
  id: string,
  token: string,
  password: string
) {
  try {
    if (!id || !token) {
      throw new Error("Credentials missing ");
    }
    const response = await axiosDriverInstance.post("/resetPassword", {
      id,
      token,
      password,
    });
    console.log(response.data);

    return response.data;
  } catch (err) {
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

export async function getDriverInfo() {
  try {
    const response = await axiosDriverInstance.get("/getDriverInfo");

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in getDriver info :",
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

export async function updateDriverInfo(field: string, value: string) {
  try {
    const response = await axiosDriverInstance.patch("/updateDriverInfo", {
      field,
      value,
    });

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in getDriver info :",
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

export async function updateIsAvailable() {
  try {
    const response = await axiosDriverInstance.patch("/updateAvailability");

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server updateIsAvailable :",
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

export async function updateRandomLoc() {
  try {
    const response = await axiosDriverInstance.post("/useRandomLocation",{});

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in updateRandom loc  :",
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

export async function fetchCurrentStoredLocation() {
  try {
    const response = await axiosDriverInstance.get("/getCurrentLoc");

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in get  loc  :",
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



export async function verifyRideOTP(otp:string) {
  if (!otp) {
    throw new Error('Please provide an OTP')
  }
  try {
    const response = await axiosDriverInstance.post("/verifyRideOTP",{otp});

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in get  loc  :",
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


export async function getDriverWalletInfo() {

  try {
    const response = await axiosDriverInstance.get("/getWalletInfo");

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in get  wallet info driver  :",
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



export async function getRideHistory(){
  try {
    const res = await axiosDriverInstance.get(`/getRideHistory`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log(
        "Error message from server in getRide history  :",
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