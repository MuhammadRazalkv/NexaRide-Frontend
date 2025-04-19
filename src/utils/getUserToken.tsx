import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

const GetUserToken = () => {
    const token = useSelector((state:RootState)=> state.auth.token)
  return (
   token
  )
}

export default GetUserToken
