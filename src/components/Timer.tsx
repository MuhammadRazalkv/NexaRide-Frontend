import { useEffect, useState } from "react";

interface ProgressBarProps {
  duration: number;
}

const ProgressBar = ({ duration }: ProgressBarProps) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(interval);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const progressPercentage = (remainingTime / duration) * 100;

  const getProgressColor = () => {
    if (progressPercentage > 50) return "bg-gray-300";
    if (progressPercentage > 20) return "bg-yellow-400";
    return "bg-red-400 animate-pulse";
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md my-3">
      <div
        className={`h-3 rounded-lg transition-all duration-1000 ease-linear ${getProgressColor()}`}
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
