import React from "react";
import { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
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
    <div className="yweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container yweetEdit">
                <input
                  type="text"
                  placeholder="Edit Your Yweet"
                  value={newYweet}
                  required
                  autoFocus
                  onChange={onChange}
                  className="formInput"
                />
                <input type="submit" value="Update Yweet" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}{" "}
        </>
      ) : (
        <>
          <h4>{yweetObj.text}</h4>
          {yweetObj.attachmentURL && <img src={yweetObj.attachmentURL} />}
          {isOwner && (
            <div className="yweet__actions">
              <span onClick={onDelClk}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Yweet;
