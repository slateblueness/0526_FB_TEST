import React, { useState } from "react";

import { db } from "../database/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function AddBookBox({ getBook }) {
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");

  // 책 추가 메소드
  const addBook = async (e) => {
    e.preventDefault();
    try {
      // try안에 작성하는 내용은 서버와 연결하고,
      // 서버에서 받아온 값을 활용하는 내용
      const docRef = await addDoc(collection(db, "readingbooks"), {
        done: false, //고정
        memo: "", //고정
        startDate: Timestamp.fromDate(new Date()), //고정
        title: title, //입력 받아오는 값
        writer: writer, //입력 받아오는 값
      });
      console.log("Document written with ID: ", docRef.id);
      // 값이 제대로 추가 되었다면 실행
      getBook();
    } catch (e) {
      // 어떤 오류가 발생했는지, 발생했다면 어떻게 처리할지
      console.error("Error adding document: ", e);
    }
    // try-catch 상관없이 실행될 내용
    setTitle("");
    setWriter("");
  };

  return (
    <form onSubmit={addBook}>
      <label htmlFor="">책 이름</label>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />{" "}
      <br />
      <label htmlFor="">작가 이름</label>
      <input
        type="text"
        value={writer}
        onChange={(e) => {
          setWriter(e.target.value);
        }}
      />{" "}
      <br />
      <button type="submit">추가</button>
    </form>
  );
}
