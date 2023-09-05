import axios from "axios";
import { useRef, useState } from "react";
import "./App.css";
import { useScreenshot } from "use-react-screenshot";

function App() {
  const [file, changeFile] = useState();
  const difRef = useRef();
  const [image, takeScreenshot] = useScreenshot();
  const BASE_URL = "http://localhost:8080/";

  const onFileChange = (e) => {
    changeFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (file) {
      console.log({ file });
      try {
        const res = await axios.post(BASE_URL);
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
    } else {
      alert("Select the file");
    }
  };

  const onUploadScreenShotUpload = async () => {
    const base64String = await takeScreenshot(difRef.current);
    const base64Data = new Buffer.from(
      base64String.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = base64String.split(";")[0].split("/")[1];
    console.log({ base64Data, type });
    const res = await axios.post(BASE_URL);
    const preSignedFormData = new FormData();
    preSignedFormData.append("Content-Type", `image/${type}`);
    preSignedFormData.append("Content-Encoding", "base64");
    Object.keys(res.data.fields).forEach((key) => {
      preSignedFormData.append(key, res.data.fields[key]);
    });

    const blobFile = await (await fetch(base64String)).blob();
    // Below 2 is not working
    // preSignedFormData.append("file", base64String);
    // preSignedFormData.append("file", base64Data);
    preSignedFormData.append("file", blobFile);
    const s3Res = await axios.post(res.data.url, preSignedFormData);
    console.log({ s3Res });
    try {
      const res = await axios.post(BASE_URL);
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <div ref={difRef} className="container">
      <input type="file" onChange={onFileChange} />
      <button className="button" onClick={onFileUpload}>
        Upload selected file
      </button>
      {!!image && <img width={"200px"} height={"200px"} src={image} />}
      <button className="button" onClick={onUploadScreenShotUpload}>
        Take and upload screenshot
      </button>
    </div>
  );
}

export default App;
