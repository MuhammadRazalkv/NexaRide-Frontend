import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { message } from "antd";
import { addOffers } from "@/api/auth/admin";
import { getDateOnlyTimestamp } from "@/utils/checkDate";

export interface IOffer {
  _id?: string;
  title: string;
  type: string;
  value: number;
  maxDiscount: number;
  minFare: number;
  validFrom: number;
  validTill: number;
  isActive?: boolean;
  usageLimitPerUser: number;
}

const AddOffers = ({
  isDialogOpen,
  setIsDialogOpen,
  setOffers,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOffers: React.Dispatch<React.SetStateAction<IOffer[]>>;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState("");
  const [form, setFormData] = useState<IOffer>({
    title: "",
    type: "",
    value: 0,
    maxDiscount: 0,
    minFare: 0,
    validFrom: 0,
    validTill: 0,
    usageLimitPerUser: 0,
  });

  function validate(
    type: keyof typeof form,
    rawValue: string | number
  ): string | null {
    setError("");
    let value = rawValue;

    if (type === "validFrom" || type === "validTill") {
      if (typeof rawValue === "string") {
        value = getDateOnlyTimestamp(rawValue);
      }
    }

    switch (type) {
      case "title":
        if (!(value as string).trim()) return "Title is required.";
        break;

      case "type":
        if (!["flat", "percentage"].includes(value as string))
          return "Invalid offer type.";
        break;

      case "value":
        if (!form.type) return "Please choose a type before adding value";
        if (!value || isNaN(value as number)) return "Value must be a number.";
        if (
          form.type === "percentage" &&
          ((value as number) <= 0 || (value as number) > 90)
        ) {
          return "Percentage must be between 1 and 90.";
        }
        if (form.type === "flat" && (value as number) <= 0) {
          return "Flat value must be greater than 0.";
        }
        break;

      case "maxDiscount":
        if (form.type === "percentage" && (!value || (value as number) <= 0)) {
          return "Max discount must be greater than 0 for percentage offers.";
        }
        break;

      case "minFare":
        if ((value as number) < 50) return "Minimum fare cannot be under 50.";
        break;

      case "validFrom": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if ((value as number) < today.getTime()) {
          return "Valid from must not be in the past.";
        }
        break;
      }

      case "validTill": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if ((value as number) < today.getTime()) {
          return "Valid till must not be in the past.";
        }
        if (form.validFrom && (value as number) <= form.validFrom) {
          return "Valid till must be after valid from.";
        }
        break;
      }

      case "usageLimitPerUser": {
        if ((value as number) < 1) {
          return "Limit per user must be positive number.";
        }
      }
    }
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: number | string = value;

    if (name === "validFrom" || name === "validTill") {
      parsedValue = getDateOnlyTimestamp(value);
    } else if (["value", "maxDiscount", "minFare"].includes(name)) {
      parsedValue = Number(value);
    }

    const errorMsg = validate(name as keyof typeof form, parsedValue);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    console.log(form);
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.type ||
      !form.value ||
      !form.minFare ||
      !form.maxDiscount ||
      !form.validFrom ||
      !form.validTill ||
      !form.usageLimitPerUser
    ) {
      setError("All fields are required.");
      return;
    }

    const updatedForm: IOffer = {
      ...form,
      value: Number(form.value),
      maxDiscount: Number(form.maxDiscount),
      minFare: Number(form.minFare),
      validFrom: Number(form.validFrom),
      validTill: Number(form.validTill),
      usageLimitPerUser: Number(form.usageLimitPerUser),
    };

    if (form.type === "flat") {
      updatedForm.maxDiscount = form.value;
    }
    try {
      const res = await addOffers(updatedForm);
      if (res.success && res.offer) {
        messageApi.success("Offer added successfully");
        setIsDialogOpen(false);
        setOffers((prev) => [...prev, res.offer]);
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to add Offer");
    }
  };

  return (
    <>
      {contextHolder}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black text-white">
          <DialogHeader>
            <DialogTitle>Add a new Offer</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>

              <select
                name="type"
                id="type"
                defaultValue={"choose"}
                className="bg-black text-sm p-1 w-fit border border-white"
                onChange={(e) => {
                  setFormData((pre) => ({
                    ...pre,
                    type: e.target.value,
                  }));
                }}
              >
                <option value="choose" disabled>
                  Choose
                </option>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                className="col-span-3"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fare" className="text-right">
                Min Fare
              </Label>
              <Input
                id="fare"
                name="minFare"
                type="number"
                className="col-span-3"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disc" className="text-right">
                Max Discount
              </Label>
              <Input
                id="disc"
                name="maxDiscount"
                type="number"
                className="col-span-3"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="from" className="text-right">
                Start
              </Label>
              <Input
                id="from"
                name="validFrom"
                type="date"
                className="col-span-3 "
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exp" className="text-right">
                EXP
              </Label>
              <Input
                id="exp"
                name="validTill"
                type="date"
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="from" className="text-right">
                Limit per user
              </Label>
              <Input
                id="usageLimit"
                name="usageLimitPerUser"
                type="number"
                className="col-span-3 "
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                setIsDialogOpen(false);
                setError("");
                setFormData({
                  title: "",
                  type: "",
                  value: 0,
                  maxDiscount: 0,
                  minFare: 0,
                  validFrom: 0,
                  validTill: 0,
                  usageLimitPerUser: 0,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant={"secondary"}
              disabled={error.length ? true : false}
              onClick={handleSubmit}
            >
              Add Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddOffers;
