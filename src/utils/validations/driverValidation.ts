import * as yup from "yup";
function validateDrivingLicense(licenseNumber: string): boolean {
  if (!licenseNumber) return false;
  const regex = /^[A-Z]{2}\d{2} \d{4} \d{7}$/;
  return regex.test(licenseNumber);
}

export const driverDefaultSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "Name cannot be under two char")
    .max(15, "Name cannot exceed 15 char")
    .required("First name is required"),
  lastName: yup.string().default("").optional(),
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup
    .string()
    .required("Zip code is required")
    .matches(/^\d{6}$/, "Postal Code must be exactly 6 digits"),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Phone number must be a valid Indian number")
    .required("Phone is required"),

  dob: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("is-at-least-18", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return value <= minAge;
    })
    .test("is-not-too-old", "Age cannot exceed 100 years", (value) => {
      if (!value) return false;
      const today = new Date();
      const maxAge = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      return value >= maxAge;
    }),

  licenseNumber: yup
    .string()
    .required("License Number is required")
    .test(
      "valid-driving-license",
      "Invalid License Format",
      (value) => !!value && validateDrivingLicense(value)
    ),

  expirationDate: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value; // Convert "" to undefined
    })
    .required("Expiration Date is required")
    .min(new Date(), "Expiration date must not be in the past"),
});

export const driverSchema = driverDefaultSchema.concat(
  yup.object().shape({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number & special character"
      ),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  })
);
