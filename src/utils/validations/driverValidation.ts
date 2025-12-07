import * as yup from "yup";
function validateDrivingLicense(licenseNumber: string): boolean {
  if (!licenseNumber) return false;

  // Pan-India driving license formats
  const regex = /^[A-Z]{2}\d{2}[/\s-]?(19|20)\d{2}[/\s-]?\d{7}$/;

  return regex.test(licenseNumber);
}

export const driverDefaultSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "First name can contain only letters (A-Z).")
    .min(2, "First name must be at least 2 characters long.")
    .max(15, "First name cannot be more than 15 characters.")
    .required("First name is required."),

  lastName: yup
    .string()
    .matches(/^[A-Za-z]*$/, "Last name can contain only letters (A-Z).")
    .max(20, "Last name cannot be more than 20 characters.")
    .optional(),

  street: yup
    .string()
    .min(3, "Street address must be at least 3 characters long.")
    .matches(
      /^[A-Za-z0-9 ,.-]{3,}$/,
      "Street address contains invalid characters."
    )
    .required("Street address is required."),

  city: yup
    .string()
    .min(2, "City must be at least 2 characters long.")
    .matches(/^[A-Za-z ]+$/, "City name must contain only letters.")
    .required("City is required."),

  state: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "State name must contain only letters.")
    .required("State is required."),

  zip: yup
    .string()
    .required("Postal code is required.")
    .matches(
      /^[1-9]\d{5}$/,
      "Postal code must be 6 digits and cannot start with 0."
    ),

  phone: yup
    .string()
    .matches(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid 10-digit Indian mobile number starting with 6-9."
    )
    .required("Phone number is required."),

  dob: yup
    .date()
    .typeError("Please enter a valid date of birth.")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Date of birth is required.")
    .max(new Date(), "Date of birth cannot be in the future.")
    .test(
      "is-at-least-18",
      "You must be at least 18 years old to register as a driver.",
      (value) => {
        if (!value) return false;
        const today = new Date();
        const minAge = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        return value <= minAge;
      }
    )
    .test("is-not-too-old", "Age cannot be more than 100 years.", (value) => {
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
    .required("Driving license number is required.")
    .test(
      "valid-driving-license",
      "Invalid driving license format. Example: KA01 2000 1234567",
      (value) => !!value && validateDrivingLicense(value)
    ),

  expirationDate: yup
    .date()
    .typeError("Please enter a valid expiration date.")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("License expiration date is required.")
    .min(new Date(), "Expiration date cannot be in the past.")
    .test(
      "max-20-years",
      "Expiration date cannot be more than 20 years in the future.",
      (value) => {
        if (!value) return false;
        const maxFuture = new Date();
        maxFuture.setFullYear(maxFuture.getFullYear() + 20);
        return value <= maxFuture;
      }
    ),
});

// Add password + confirmPassword rules
export const driverSchema = driverDefaultSchema.concat(
  yup.object().shape({
    password: yup
      .string()
      .required("Password is required.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/\d/, "Password must contain at least one number.")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)."
      ),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match.")
      .required("Confirm password is required."),
  })
);

export type DriverDefaultSchema = yup.InferType<typeof driverDefaultSchema>;
export type DriverSchema = yup.InferType<typeof driverSchema>;
