import * as yup from "yup";
const TODAY = new Date();

const MIN_REGISTRATION_YEAR = 1985;
const MAX_REGISTRATION_AGE_YEARS = 40;
const MAX_INSURANCE_YEARS = 20;

const MS_YEAR = 365 * 24 * 60 * 60 * 1000;

const minRegistrationDate = new Date(MIN_REGISTRATION_YEAR, 0, 1);
const maxOldRegistration = new Date(
  TODAY.getTime() - MAX_REGISTRATION_AGE_YEARS * MS_YEAR
);

const maxInsuranceExpiry = new Date(
  TODAY.getTime() + MAX_INSURANCE_YEARS * MS_YEAR
);

function validateLicensePlate(numberPlate: string): boolean {
  if (!numberPlate) return false;

  // Indian vehicle format approximation:
  // KL-07-BR-1234, KA01AB1234, MH 12 CD 5678

  const regex =
    /^[A-Z]{2}(?: |-)?(0[1-9]|[1-9][0-9])(?: |-)?[A-Z]{1,2}(?: |-)?(000[1-9]|00[1-9]\d|0[1-9]\d{2}|[1-9]\d{2,3})$/;

  return regex.test(numberPlate.toUpperCase().trim());
}

export const vehicleSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(15, "First name cannot exceed 15 characters")
    .matches(/^[A-Za-z]+$/, "First name should contain letters only"),

  lastName: yup
    .string()
    .trim()
    .max(15, "Last name cannot exceed 15 characters")
    .matches(/^[A-Za-z]*$/, "Last name should contain letters only")
    .default(""),

  address: yup
    .string()
    .trim()
    .required("Street address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),

  brand: yup
    .string()
    .trim()
    .required("Vehicle brand is required")
    .min(2)
    .max(30)
    .matches(/^[A-Za-z0-9 .-]+$/, "Brand contains invalid characters"),

  model: yup
    .string()
    .trim()
    .required("Vehicle model is required")
    .min(1)
    .max(30)
    .matches(/^[A-Za-z0-9 .-]+$/, "Model contains invalid characters"),

  color: yup
    .string()
    .trim()
    .required("Vehicle color is required")
    .min(3)
    .max(20)
    .matches(/^[A-Za-z ]+$/, "Color must contain only letters"),

  registrationDate: yup
    .date()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Registration Date is required")
    .min(minRegistrationDate, "Registration date is unrealistically old")
    .min(maxOldRegistration, "Vehicle cannot be older than 40 years")
    .max(TODAY, "Registration date cannot be in the future"),

  licenseNumber: yup
    .string()
    .required("Number plate is required")
    .transform((v) => v.toUpperCase().trim())
    .test(
      "valid-number-plate",
      "Invalid Number Plate Format",
      (value) => !!value && validateLicensePlate(value)
    ),

  expirationDate: yup
    .date()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Expiration date is required")
    .min(new Date(), "Expiration date must be in the future")
    .max(
      maxInsuranceExpiry,
      "Expiration date cannot be more than 20 years in the future"
    )
    .test(
      "after-registration",
      "Expiration date must be after registration date",
      function (value) {
        const { registrationDate } = this.parent;
        return (
          !!value &&
          !!registrationDate &&
          value.getTime() > new Date(registrationDate).getTime()
        );
      }
    ),

  insuranceProvider: yup
    .string()
    .trim()
    .required("Insurance provider is required")
    .min(3)
    .max(50)
    .matches(
      /^[A-Za-z0-9 .,&()-]+$/,
      "Insurance provider contains invalid characters"
    ),

  policyNumber: yup
    .string()
    .required("Policy number is required")
    .matches(/^\d{10}$/, "Policy number must be exactly 10 digits"),
});
