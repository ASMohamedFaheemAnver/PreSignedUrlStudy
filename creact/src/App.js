import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [file, changeFile] = useState();
  const BASE_URL = "http://localhost:8080/";

  const onFileChange = (e) => {
    changeFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    console.log({ file });
    if (file) {
      try {
        const res = await axios.post(BASE_URL, { filePath: file.name });
        console.log({ data: res.data });
        const preSignedFormData = new FormData();
        preSignedFormData.append("Content-Type", file.type);
        Object.keys(res.data.fields).forEach((key) => {
          preSignedFormData.append(key, res.data.fields[key]);
        });
        preSignedFormData.append("file", file);
        const s3Res = await axios.post(res.data.url, preSignedFormData);
        console.log({ s3Res });
      } catch (e) {
        console.log({ e });
      }
    }
  };

  return (
    <div className="container">
      <input type="file" onChange={onFileChange} />
      <button className="button" onClick={onFileUpload}>
        Upload
      </button>
    </div>
  );
}

export default App;
