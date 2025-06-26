import React from "react";
import { FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

interface UserTableProps {
  users: User[] | null;
  onBlockToggle: (user: User) => void;
  onView: (id:string) => void;
}

const AdminTable: React.FC<UserTableProps> = ({ users, onBlockToggle , onView }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-[#1A2036] rounded-lg shadow-lg border border-[#2C3347]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2C3347]">
              <thead className="bg-[#2e345c]">
                <tr>
                  <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-16">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">
                    Email
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-24">
                    Action
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-20">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C3347] bg-[#394065]">
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-[#424b72] transition-colors"
                    >
                      <td className="px-4 py-4 text-center text-sm font-medium text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-white truncate max-w-xs">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-center text-sm">
                        <Button
                          variant={user.isBlocked ? "success" : "destructive"}
                          onClick={() => onBlockToggle(user)}
                          className="px-3 py-1 text-xs font-medium"
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          className="p-2 rounded hover:bg-[#5a63a1] transition-colors"
                            onClick={() => onView(user._id)}
                        >
                          <FaEye className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-white text-base"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
