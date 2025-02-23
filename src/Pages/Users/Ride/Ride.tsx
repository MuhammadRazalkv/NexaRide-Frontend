import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../Redux/store";
import { CiLogout } from "react-icons/ci";
import { logout } from "../../../Redux/slices/authSlice";

const Ride = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  console.log('user img ', user?.profilePic);
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
      <img
        src={user?.profilePic || ''}
        alt="User Pic"
        className="h-30 w-30 rounded-full border-4 border-white shadow-lg"
        referrerPolicy="no-referrer"
      />
      <h4 className="font-primary text-4xl mt-4 text-center text-gray-800">
        {user ? user.name : 'NO user found'} <br />
        {user && <span className="text-xl text-gray-600">{user.email}</span>}
      </h4>
      <CiLogout onClick={handleLogout} />
    </div>
  )
}

export default Ride
