import NavBar from "@/components/user/NavBar";
import SubHistoryTable from "@/components/user/SubHistoryTable";
import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import { subscriptionHistory } from "@/api/auth/user";

export interface ISubHistory {
  amount: number;
  expiresAt: number;
  takenAt: number;
  type: string;
}
const SubscriptionHistory = () => {
  const [history, setHistory] = useState<ISubHistory[]>();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await subscriptionHistory(currentPage);
        if (res.success && res.history && res.total) {
          console.log(res.history);

          setHistory(res.history);
          setTotal(res.total);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
        else message.error("Failed to fetch history");
      }
    };
    fetchHistory();
  }, [currentPage]);
  return (
    <>
      <NavBar />
     <div className="min-h-[calc(100vh-70px)] w-full px-4 md:px-8 py-8 flex flex-col items-center gap-6">
        <div className="w-full max-w-6xl">
          <SubHistoryTable data={history} />
        </div>
        <div className="self-center">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={8}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default SubscriptionHistory;
