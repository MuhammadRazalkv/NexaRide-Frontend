import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

interface IDashBoardCards {
  title: string;
  info?: { [key: string]: string | number };
}

const DashBoardCards: FC<IDashBoardCards> = ({ title, info }) => {
  return (
    <Card className="hover:shadow-2xl transition-all rounded-2xl border p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          {title}
        </CardTitle>
        {/* Optional description can go here */}
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {info ? (
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(info).map(([key, value]) => (
              <div key={key} className="flex justify-between text-gray-700">
                <span className="font-medium capitalize">{key}</span>
                <span className="text-right">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500">Failed to fetch data</p>
        )}
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
};

export default DashBoardCards;
