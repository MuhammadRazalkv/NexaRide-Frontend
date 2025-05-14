import AdminNavBar from "@/components/admin/AdminNavbar";
import { message } from "antd";
import AddOffers, { IOffer } from "@/components/admin/AddOffers";
import { useEffect, useState } from "react";
import { changeOfferStatus, fetchOffers } from "@/api/auth/admin";
import { formatDate } from "@/utils/DateAndTimeFormatter";
import { Button } from "@/components/ui/button";
const AdminOffers = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [addOffer, setAddOffer] = useState(false);
  const [offers, setOffers] = useState<IOffer[]>([]);

  useEffect(() => {
    async function getOffers() {
      try {
        const res = await fetchOffers();
        if (res.success && res.offers) {
          console.log(res.offers);

          setOffers(res.offers);
        }
      } catch (error) {
        if (error instanceof Error) messageApi.error(error.message);
        else messageApi.error("Failed to fetch offers");
      }
    }
    getOffers();
  }, [messageApi]);

  const updateOfferStatus = async (offerId: string) => {
    if (!offerId || offerId == "undefined") {
      messageApi.error("Offer not found");
      return;
    }
    try {
      const res = await changeOfferStatus(offerId);
      if (res.success) {
        setOffers((prev) =>
          prev.map((offer) =>
            offer._id === offerId
              ? { ...offer, isActive: !offer.isActive }
              : offer
          )
        );
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to fetch offers");
    }
  };

  return (
    <div className="bg-[#0E1220] min-h-screen p-10 md:p-20  ">
      <AdminNavBar />
      {contextHolder}
      <AddOffers
        isDialogOpen={addOffer}
        setIsDialogOpen={setAddOffer}
        setOffers={setOffers}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white m-2 font-semibold px-4 py-2 rounded-md transition"
        onClick={() => setAddOffer(true)}
      >
        Add Offer
      </button>

      {offers && offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-[#1E253A] rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-1">{offer.title}</h3>

                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Type:</span>{" "}
                  {offer.type === "percentage"
                    ? `${offer.value}% off`
                    : `Flat ₹${offer.value} off`}
                </p>

                {offer.type === "percentage" && (
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="font-medium">Max Discount:</span> ₹
                    {offer.maxDiscount}
                  </p>
                )}

                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Minimum Fare Required:</span> ₹
                  {offer.minFare}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Limit per user:</span>{" "}
                  {offer.usageLimitPerUser}
                </p>

                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Valid From:</span>{" "}
                  {formatDate(offer.validFrom)}
                </p>

                <p className="text-sm text-gray-300 mb-3">
                  <span className="font-medium">Valid Till:</span>{" "}
                  {formatDate(offer.validTill)}
                </p>

                <p
                  className={`text-sm font-semibold ${
                    offer.isActive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {offer.isActive
                    ? "Auto-applied at checkout"
                    : "Offer inactive"}
                </p>
              </div>

              <Button
                variant={offer.isActive ? "destructive" : "success"}
                className="mt-4"
                onClick={() => updateOfferStatus(offer._id as string)}
              >
                {offer.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <h3 className="text-white text-center text-lg mt-10">
          No Offers Found
        </h3>
      )}
    </div>
  );
};

export default AdminOffers;
