import { useState } from "react";
import axios from "axios";
const UploadImg = () => {
  const [pre, setPre] = useState<string>("");

  const sendFile = async () => {
    if (!pre) {
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/driver/upload", {
        imgUrl: pre,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Ensure a file is selected
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);

      setPre(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {pre && <img src={pre} alt="Preview" className="w-100 h-100" />}
      <button onClick={sendFile}>send</button>
    </div>
  );
};

export default UploadImg;
