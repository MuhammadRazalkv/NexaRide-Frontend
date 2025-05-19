import NavBar from "@/components/user/NavBar";
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
import { useEffect, useState } from "react";
import { addMoneyToWallet, getWalletInfo } from "@/api/auth/user";
import { message } from "antd";
import WaitingModal from "@/components/user/WaitingModal";
import { formatDate, formatTime } from "@/utils/DateAndTimeFormatter";
import Loader from "@/components/Loader";
// import {  useNavigate } from "react-router-dom";
interface IWallet {
  balance: number;
  transactions?: [
    {
      type: string;
      date: number;
      amount: number;
    }
  ];
}

const Wallet = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [page, setPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  //   const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [wallet, setWallet] = useState<IWallet | null>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchWalletInfo = async () => {
      setFetchingData(true);
      try {
        const res = await getWalletInfo();
        if (res.success && res.wallet) {
          setWallet(res.wallet);
          setFetchingData(false);
        }
      } catch (error) {
        setFetchingData(false);
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          messageApi.error("Failed to load Wallet info");
        }
      }
    };
    fetchWalletInfo();
  }, [messageApi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value);
    setAmountError(null);
    if (isNaN(amount)) {
      setAmountError("Please enter a valid number.");
    } else if (amount < 50) {
      setAmountError("Minimum amount to add is ₹50.");
    } else if (amount > 3000) {
      setAmountError("Maximum allowed amount is ₹3000.");
    } else {
      setAmountError(null);
      setAmount(amount);
    }
  };

  const addMoney = async () => {
    if (amountError) {
      return;
    }
    if (!amount) {
      return;
    }
    setLoading(true);
    setIsDialogOpen(false);
    try {
      const res = await addMoneyToWallet(amount);
      if (res.success && res.url) {
        setLoading(false);
        window.location.href = res.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {contextHolder}
      <NavBar />
      <WaitingModal open={loading} message="Redirecting..." />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add money to wallet</DialogTitle>
            <DialogDescription>
              Please enter the amount you want to add to your wallet .
            </DialogDescription>
          </DialogHeader>
          {amountError && <p className="text-red-500 text-xs">{amountError}</p>}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Amount
              </Label>
              <Input
                id="username"
                type="number"
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant={"outline"}>
              Cancel
            </Button>
            <Button disabled={!!amountError || !amount} onClick={addMoney}>
              Add Amount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 mt-5 mx-5 gap-3 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto justify-items-center">
        {/* Wallet Balance Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-[500px] lg:w-[450px] min-h-[220px] max-h-[250px] flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Wallet Balance
            </h2>
            <p className="text-3xl font-bold  mt-4">₹{wallet?.balance || 0}</p>
          </div>
          <button
            className="mt-6 w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            onClick={() => {
              setIsDialogOpen(true);
              setAmountError(null);
            }}
          >
            Add Money
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-2/3 min-h-[220px] max-h-[250px] flex flex-col mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Transaction History
          </h2>

          {wallet && wallet.transactions?.length ? (
            <div className="overflow-y-auto max-h-[160px]  pr-2">
              <ul className="space-y-3 text-sm text-gray-700 max-h-[160px]  pr-1">
                {[...wallet.transactions].reverse().map((item, index) => {
                  const isCredit = item.type === "credit";
                  const formattedDate = formatDate(item.date);
                  const formattedTime = formatTime(item.date);

                  return (
                    <li key={index} className="flex justify-between ">
                      <span>
                        {formattedDate},{formattedTime}
                      </span>
                      <span>
                        {isCredit ? "Money Added" : "Payment to Driver"}
                      </span>
                      <span
                        className={isCredit ? "text-green-500" : "text-red-500"}
                      >
                        {isCredit
                          ? `+ ₹${item.amount.toFixed(2)}`
                          : `- ₹${item.amount.toFixed(2)}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No transactions found</p>
          )}
          {fetchingData && <Loader />}

        </div>
      </div>
    </>
  );
};

export default Wallet;
