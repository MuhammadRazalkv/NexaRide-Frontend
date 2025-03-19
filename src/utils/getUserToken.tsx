import { RootState } from "@/Redux/store"
import { useSelector } from "react-redux"

const GetUserToken = () => {
    const token = useSelector((state:RootState)=> state.auth.token)
  return (
   token
  )
}

export default GetUserToken
