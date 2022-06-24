import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Yweet from "../components/Yweet";
import { dbService } from "../fbase";
import YweetFactory from "../components/YweetFactory";

const Home = ({ userObj }) => {
  const [yweets, setYweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "yweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const yweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setYweets(yweetArr);
    });
  }, []);

  return (
    <div className="container">
      <YweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {yweets.map((yweet) => (
          <Yweet
            key={yweet.id}
            yweetObj={yweet}
            isOwner={yweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
