import { useCallback, useEffect, useState } from "react";
import { RideContext } from "@/hooks/useRide";
import { socket, connectSocket } from "@/utils/socket";
import {
  resetRide,
  setDriverArrivedInSlice,
  setInPaymentInSlice,
  setRideIdInSlice,
  setRemainingRouteInSlice,
  setRemainingDropOffRouteInSlice,
  setStripePaymentInSlice,
  setRideCompletedInSlice,
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
  messages: IMessage[];
  chatOn: boolean;
  setChatOn: React.Dispatch<React.SetStateAction<boolean>>;
  isRateModalOpen: boolean;
  setIsRateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  clearAllStateDataInContext: () => void;
  rideGotCancelled: boolean;
  removeAllRideListeners: () => void;
}

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isRideActive: isRideStarted,
    inPayment,
    stripePayment,
    rideId,
  } = useSelector((state: RootState) => state.ride);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatOn, setChatOn] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rideGotCancelled, setRideGotCancelled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  // const [rideFinished,setRideFinished] = useState(false)
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");

  useEffect(() => {
    if (stripePayment && rideId) {
      console.log("the payment checking useEffect worked well ");
      const checkRidePaymentStatus = async () => {
        try {
          const res = await checkPaymentStatus(rideId);
          if (res.success && res.paymentStatus == "completed") {
            setIsRateModalOpen(true);
            // setRideFinished(true)
            console.log("payment status completed ");

            dispatch(setInPaymentInSlice(false));
            dispatch(setRideCompletedInSlice(true));

            // setPaymentModalOpen(false);
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
  }, [stripePayment, rideId, dispatch]);

  const clearAllStateDataInContext = useCallback(() => {
    setMessages([]);
    setChatOn(false);
    setIsRateModalOpen(false);
    setRideGotCancelled(false);
    dispatch(setRideCompletedInSlice(false));

    setRating(0);
    setReviewComments("");
    setRatingError("");
    dispatch(resetRide());
  }, [dispatch]);

  const handleChat = useCallback(
    (data: IMessage) => {
      messageApi.info("You have a new message ");
      setMessages((prev) => [...prev, data]);
    },
    [messageApi]
  );

  const handleDriverReached = useCallback(() => {
    dispatch(setDriverArrivedInSlice(true));
    dispatch(setRemainingRouteInSlice([]));
    setTimeout(() => {
      messageApi.success(
        "Driver reached your location, please share your OTP."
      );
    }, 0);
  }, [dispatch, messageApi]);

  const handleDropOffReached = useCallback(
    (data: { rideId: string; fare: number }) => {
      dispatch(setRideIdInSlice(data.rideId));
      dispatch(setInPaymentInSlice(true));
      dispatch(setRemainingDropOffRouteInSlice([]));
    },
    [dispatch]
  );

  const handlePaymentSuccess = useCallback(() => {
    setIsRateModalOpen(true);
    dispatch(setInPaymentInSlice(false));
    setChatOn(false);
    dispatch(setRideCompletedInSlice(true));
    // setRideFinished(true)
    setTimeout(() => {
      messageApi.success("Payment success");
    }, 0);
  }, [dispatch, messageApi]);

  const handleError = useCallback(
    ({ message }: { message: string }) => {
      console.log(message);
      messageApi.error(message);
    },
    [messageApi]
  );

  const removeAllRideListeners = () => {
    // socket.off("ride-error");
    socket.off("driver-reached");
    socket.off("ride-cancelled");
    socket.off("dropOff-reached");
    socket.off("payment-success");
    socket.off("chat-msg");
    socket.off("driver-location-update");
    socket.off("ride-accepted");
    socket.off("no-driver-response");
  };

  const handleRideCancelled = useCallback(() => {
    clearAllStateDataInContext();
    removeAllRideListeners();
    setRideGotCancelled(true);
    socket.off("driver-location-update");
    setTimeout(() => {
      messageApi.error("The ride was cancelled by the driver");
    }, 0);
  }, [messageApi, clearAllStateDataInContext]);

  useEffect(() => {
    if (!token) return;

    connectSocket(token, "user");
    if (isRideStarted) {
      socket.on("ride-error", handleError);
      socket.on("driver-reached", handleDriverReached);
      socket.on("ride-cancelled", handleRideCancelled);
      socket.on("dropOff-reached", handleDropOffReached);
      socket.on("payment-success", handlePaymentSuccess);
      socket.on("chat-msg", handleChat);
    }
    const interval = setInterval(() => {
      if (socket.connected) {
        socket.emit("keep-alive");
      }
    }, 100000);

    return () => {
      socket.off("ride-error", handleError);
      socket.off("driver-reached", handleDriverReached);
      socket.off("ride-cancelled", handleRideCancelled);
      socket.off("dropOff-reached", handleDropOffReached);
      socket.off("payment-success", handlePaymentSuccess);
      socket.off("chat-msg", handleChat);
      clearInterval(interval);
    };
  }, [
    token,
    isRideStarted,
    handleError,
    handleRideCancelled,
    handleDriverReached,
    handleDropOffReached,
    handlePaymentSuccess,
    handleChat,
  ]);

  const handlePaymentSelection = async (method: "wallet" | "stripe") => {
    console.log("Ride id ", rideId);
    if (!rideId) {
      message.error("Ride id not found");
      return;
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
          // setPaymentModalOpen(false);
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
    removeAllRideListeners();
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
        // dispatch(resetRide());
        removeAllRideListeners();
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to submit feedback");
    }
  };
  return (
    <RideContext.Provider
      value={{
        setMessages,
        setIsRateModalOpen,
        setChatOn,
        clearAllStateDataInContext,
        rideGotCancelled,
        isRideStarted,
        isRateModalOpen,
        messages,
        chatOn,
        removeAllRideListeners,
      }}
    >
      <PaymentOptions isOpen={inPayment} onSelect={handlePaymentSelection} />
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
