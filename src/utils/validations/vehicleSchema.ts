import * as yup from "yup";
function validateLicensePlate(numberPlate: string): boolean {
  if (!numberPlate) return false;
  const regex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{1,4}$/;
  return regex.test(numberPlate);
}
export const vehicleSchema = yup.object().shape({
  firstName: yup.string().required("First name is required").max(15,'Name cannot exceed 15 char'),
  lastName: yup.string().default("").optional(),
  address: yup.string().required("Street address is required"),
  brand: yup.string().required("Vehicle brand is required"),
  model: yup.string().required("Vehicle model is required"),
  color: yup.string().required("Vehicle color is required"),
  registrationDate: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .required("Registration Date is required")
    .max(new Date(), "Registration date cannot be in the future"),

  licenseNumber: yup
    .string()
    .required("Number plate is required")
    .test(
      "valid-number-plate",
      "Invalid Number Plate Format",
      (value) => !!value && validateLicensePlate(value)
    ),

  expirationDate: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .required("Expiration Date is required")
    .min(new Date(), "Expiration date must not be in the past"),
  insuranceProvider: yup.string().required("Insurance provider is required"),
  policyNumber: yup
    .string()
    .required("Policy number is required")
    .matches(/^\d{10}$/, "Policy number must be exactly 10 digits"),
});
