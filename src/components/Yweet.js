import React from "react";
import { useState } from "react";
import { dbService, storageService } from "../fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

const Yweet = ({ yweetObj, isOwner }) => {
  const YweetTextRef = doc(dbService, "yweets", `${yweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newYweet, setNewYweet] = useState(yweetObj.text);
  const onDelClk = async () => {
    const ok = window.confirm("Are you sure you want to delete this yweet?");
    if (ok) {
      try {
        await deleteDoc(YweetTextRef);
        if (yweetObj.attachmentURL) {
          await deleteObject(ref(storageService, yweetObj.attachmentURL));
        }
      } catch (e) {
        window.alert("Fail to delete Yweet.");
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(YweetTextRef, { text: newYweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewYweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit Your Yweet"
                  value={newYweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Yweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}{" "}
        </>
      ) : (
        <>
          <h4>{yweetObj.text}</h4>
          {yweetObj.attachmentURL && (
            <img src={yweetObj.attachmentURL} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDelClk}>Delete Yweet</button>
              <button onClick={toggleEditing}>Edit Yweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Yweet;
