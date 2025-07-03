import { useEffect, useState } from "react";
import { RideContext } from "@/hooks/useRide";
import { socket, connectSocket, RideInfo } from "@/utils/socket";
import {
  resetRide,
  setDriverArrivedInSlice,
  setInPaymentInSlice,
  setRideIdInSlice,
  setRemainingRouteInSlice,
  setRemainingDropOffRouteInSlice,
  setStripePaymentInSlice,
} from "@/redux/slices/rideSlice";

import { IMessage } from "@/interfaces/chat.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { message } from "antd";
import { useDispatch } from "react-redux";
import {
  checkPaymentStatus,
  giveFeedback,
  payUsingStripe,
  payUsingWallet,
} from "@/api/auth/user";
import PaymentOptions from "@/components/user/PaymentOptions";
import RatingModal from "@/components/RatingModal";
export interface SocketContextTypes {
  isRideStarted: boolean;
  setIsRideStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  messages: IMessage[];
  chatOn: boolean;
  setChatOn: React.Dispatch<React.SetStateAction<boolean>>;
  driverArrived: boolean;
  setDriverArrived: React.Dispatch<React.SetStateAction<boolean>>;
  paymentModalOpen: boolean;
  isRateModalOpen: boolean;
  setIsRateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  rideId: string;
  setRideId: React.Dispatch<React.SetStateAction<string>>;
  rideInfo?: RideInfo;
  setRideInfo: React.Dispatch<React.SetStateAction<RideInfo | undefined>>;
  clearAllStateDataInContext: () => void;
  rideGotCancelled: boolean;
}

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [rideInfo, setRideInfo] = useState<RideInfo>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatOn, setChatOn] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [rideId, setRideId] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);
  const [driverArrived, setDriverArrived] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rideGotCancelled, setRideGotCancelled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { stripePayment } = useSelector((state: RootState) => state.ride);
  const dispatch = useDispatch();
  const rideIdInSlice = useSelector((state: RootState) => state.ride.rideId);

  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");

  //! this is for temp use remove it when changing the rideId state to use  redux
  const tempRideId = useSelector((state: RootState) => state.ride.rideId);

  const clearAllStateDataInContext = () => {
    setIsRideStarted(false);
    setRideInfo(undefined);
    setMessages([]);
    setChatOn(false);
    setPaymentModalOpen(false);
    setRideId("");
    setDriverArrived(false);
    setIsRateModalOpen(false);
    setRideGotCancelled(false);
  };

  useEffect(() => {
    console.log("Inside the useEffect");
    console.log(stripePayment, tempRideId);

    if (stripePayment && tempRideId) {
      //! change this as well
      setRideId(tempRideId);
      console.log("the payment checking useEffect worked well ");
      const checkRidePaymentStatus = async () => {
        try {
          const res = await checkPaymentStatus(tempRideId);
          if (res.success && res.paymentStatus == "completed") {
            setIsRateModalOpen(true);
            console.log("payment status completed ");

            dispatch(setInPaymentInSlice(false));
            setPaymentModalOpen(false);
            setIsRateModalOpen(true);
            dispatch(setStripePaymentInSlice(false));
            setChatOn(false);
          }
        } catch (error) {
          if (error instanceof Error) message.error(error.message);
        }
      };
      checkRidePaymentStatus();
    }
  }, [stripePayment, tempRideId, dispatch]);

  // socket listeners
  useEffect(() => {
    if (!token) return;
    connectSocket(token, "user");

    const handleChat = (data: IMessage) => {
      messageApi.info("You have a new message ");
      setMessages((prev) => [...prev, data]);
    };

    const handleRideCancelled = async () => {
      clearAllStateDataInContext();
      dispatch(resetRide());
      setRideGotCancelled(true);
      socket.off("driver-location-update");
      setTimeout(() => {
        messageApi.error("The ride was cancelled by the driver");
      }, 0);
    };

    const handleDriverReached = async () => {
      setDriverArrived(true);
      dispatch(setDriverArrivedInSlice(true));
      dispatch(setRemainingRouteInSlice([]));
      setTimeout(() => {
        messageApi.success(
          "Driver reached your location please share your otp to start the ride"
        );
      }, 0);
    };

    const handleDropOffReached = async (data: {
      rideId: string;
      fare: number;
    }) => {
      setPaymentModalOpen(true);

      setRideId(data.rideId);
      dispatch(setRideIdInSlice(data.rideId));
      dispatch(setInPaymentInSlice(true));
      dispatch(setRemainingDropOffRouteInSlice([]));
    };

    const handlePaymentSuccess = async () => {
      setIsRateModalOpen(true);
      // dispatch(setRideIdInSlice(""));
      dispatch(setInPaymentInSlice(false));
      setPaymentModalOpen(false);

      // setRideId(undefined);
      setChatOn(false);
      // clearAllStateData();
      setTimeout(() => {
        messageApi.success("Payment success");
      }, 0);
    };
    const handleError = async ({ message }: { message: string }) => {
      console.log(message);

      messageApi.error(message);
    };
    socket.on("ride-error", handleError);
    socket.on("driver-reached", handleDriverReached);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("dropOff-reached", handleDropOffReached);
    socket.on("payment-success", handlePaymentSuccess);
    socket.on("chat-msg", handleChat);
    return () => {
      socket.off("chat-msg", handleChat);
    };
  }, [token, messageApi, dispatch]);

  const handlePaymentSelection = async (method: "wallet" | "stripe") => {
    console.log("Ride id ", rideId);
    if (!rideId && rideIdInSlice) {
      setRideId(rideIdInSlice);
    }

    if (method === "wallet") {
      try {
        if (!rideId) {
          console.log("Ride id not found ");
          return;
        }
        const response = await payUsingWallet(rideId);
        if (response.success) {
          messageApi.success("Payment successful");
          setPaymentModalOpen(false);
          setIsRateModalOpen(true);
          // clearAllStateData();
          // dispatch(setRideIdInSlice(""));
          dispatch(setInPaymentInSlice(false));
          // setRideId(undefined);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          messageApi.error(error.message);
        } else {
          messageApi.error("Failed to pay using wallet");
        }
      }
    } else if (method === "stripe") {
      try {
        if (!rideId) {
          console.log("Ride id not found ");
          return;
        }
        dispatch(setStripePaymentInSlice(true));
        const res = await payUsingStripe(rideId);
        if (res.success && res.url) {
          window.location.href = res.url;
          // window.open(res.url, "_blank");
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          messageApi.error(error.message);
        } else {
          messageApi.error("Failed to pay using wallet");
        }
      }
    }
  };

  const handleRating = (rating: number) => {
    setRating(rating);
  };
  const handleReviewComments = (value: string) => {
    setReviewComments(value.trim());
  };
  const closeReviewModal = () => {
    clearAllStateDataInContext();
    setIsRateModalOpen(false);
    dispatch(resetRide());
  };

  const submitReview = async () => {
    setRatingError("");
    if (!rating) {
      setRatingError("Please give a rating");
      return;
    }
    if (reviewComments.length > 0 && reviewComments.length < 5) {
      setRatingError("Please enter minimum five characters");
      return;
    }
    if (/[^a-zA-Z0-9\s]/g.test(reviewComments)) {
      setRatingError("No special characters allowed");
      return;
    }
    if (!rideId) {
      messageApi.error("Ride id not found");
      return;
    }

    try {
      const res = await giveFeedback(rideId, rating, reviewComments);
      if (res.success) {
        messageApi.success("Your feedback has been saved ");
        setIsRateModalOpen(false);
        clearAllStateDataInContext();
        dispatch(resetRide());
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to submit feedback");
    }
  };
  return (
    <RideContext.Provider
      value={{
        setRideInfo,
        setRideId,
        setMessages,
        setIsRateModalOpen,
        setPaymentModalOpen,
        setChatOn,
        setIsRideStarted,
        clearAllStateDataInContext,
        setDriverArrived,
        rideGotCancelled,
        rideInfo,
        rideId,
        isRideStarted,
        driverArrived,
        isRateModalOpen,
        paymentModalOpen,
        messages,
        chatOn,
      }}
    >
      <PaymentOptions
        isOpen={paymentModalOpen}
        onSelect={handlePaymentSelection}
      />
      {isRateModalOpen && (
        <RatingModal
          handleChange={handleRating}
          handleComments={handleReviewComments}
          closeModal={closeReviewModal}
          error={ratingErr}
          submitReview={submitReview}
        />
      )}
      {contextHolder}
      {children}
    </RideContext.Provider>
  );
};
