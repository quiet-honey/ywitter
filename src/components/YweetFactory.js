import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

const YweetFactory = ({ userObj }) => {
  const [yweet, setYweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "") {
      const attatchmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      await uploadString(attatchmentRef, attachment, "data_url");
      attachmentURL = await getDownloadURL(ref(storageService, attatchmentRef));
    }
    await addDoc(collection(dbService, "yweets"), {
      text: yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    });
    setYweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setYweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  return (
    <form onSubmit={onSubmit}>
      <input
        value={yweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind"
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Yweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};
export default YweetFactory;
