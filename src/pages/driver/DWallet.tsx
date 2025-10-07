import DNavBar from "@/components/driver/DNavBar";
import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import { getDriverWalletInfo } from "@/api/auth/driver";
import { formatDate } from "@/utils/DateAndTimeFormatter";
import { IWallet } from "@/interfaces/wallet.interface";


const DWallet = () => {
  const [wallet, setWallet] = useState<IWallet | null>();
  const [messageApi, contextHolder] = message.useMessage();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        const res = await getDriverWalletInfo(currentPage);
        if (res.success && res.wallet && res.total) {
          console.log('Setting the updated data ');
          console.log(res.wallet);
          console.log(res.total);
          
          
          setWallet(res.wallet);
          setTotal(res.total);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          messageApi.error("Failed to load Wallet info");
        }
      }
    };
    fetchWalletInfo();
  }, [messageApi,currentPage]);
  return (
    <>
      {contextHolder}
      <DNavBar />
      <div className="grid grid-cols-1 mt-5 mx-5 gap-3 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto justify-items-center">
        {/* Wallet Balance Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-[500px] lg:w-[450px] min-h-[180px] max-h-[200px] flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Wallet Balance
            </h2>
            <p className="text-3xl font-bold  mt-4">₹{wallet?.balance || 0}</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-2/3 min-h-[250px] max-h-[300px] flex flex-col mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Transaction History
          </h2>

          {wallet && wallet.transactions?.length ? (
            <>
              <div className="overflow-y-auto max-h-[160px]  pr-2">
                <ul className="space-y-3 text-sm text-gray-700 max-h-[160px]  pr-1">
                  {[...wallet.transactions].reverse().map((item, index) => {
                    const isCredit = item.type === "credit";
                    const formattedDate = formatDate(item.date);

                    return (
                      <li key={index} className="flex justify-between">
                        <span>{formattedDate}</span>
                        <span>
                          {isCredit ? "Money Added" : "Payment to Driver"}
                        </span>
                        <span
                          className={
                            isCredit ? "text-green-500" : "text-red-500"
                          }
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
              <Pagination
                current={currentPage}
                total={total}
                pageSize={8}
                onChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            <p className="text-gray-500">No transactions found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DWallet;
