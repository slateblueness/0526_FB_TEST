import React, { useEffect, useState } from "react";

// 파이어 스토어
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../database/firebase";
import AddBookBox from "./AddBookBox";

export default function BookComp() {
  //검색하기 위한 제목
  const [searchTitle, setSearchTitle] = useState("");
  //검색된 책 배열
  const [searchBooks, setSearchBooks] = useState();

  // 천제 화면에 출력 될 책 배열
  const [books, setBooks] = useState();

  // 책을 가져오는 메소드
  const getBook = async () => {
    const querySnapshot = await getDocs(collection(db, "readingbooks"));

    // 가져온 컬렉션의 문서배열을 새로운 배열을 만들에서 저장
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push({
        id: doc.id,
        ...doc.data(),
      });
      console.log(`${doc.id} => ${doc.data()}`);
      // doc.data()객체 확인 > timestamp는 toDate를 통해 Date객체로 변환
      console.dir(doc.data().startDate.toDate());
    });
    setBooks(array);
  };

  // 책을 삭제하는 메소드
  const deleteBook = async (id) => {
    await deleteDoc(doc(db, "readingbooks", id));
    getBook();
  };

  // 감상문을 추가하고 책의 값을 수정하는 메소드
  const updateBook = async (id) => {
    const memo = prompt("느낀점을 입력하세요");

    //memo의 값이 없을때 return을 실행하여 메소드 종료
    if (!memo) return;

    // 값이 있을때 아래 코드 실행
    const updateRef = doc(db, "readingbooks", id);
    await updateDoc(updateRef, {
      memo: memo,
      done: true,
      endDate: Timestamp.fromDate(new Date()),
    });
    // 수정된 값 화면에 출력
    getBook();
  };

  // 책 제목을 통해서 책을 찾는 메소드
  const searchBook = async (e) => {
    e.preventDefault();
    const q = query(
      collection(db, "readingbooks"),
      where("title", "==", searchTitle)
    );

    // 배열에 담아서 사용
    const querySnapshot = await getDocs(q);
    let array = [];

    querySnapshot.forEach((doc) => {
      array.push({
        id: doc.id,
        ...doc.data(),
      });
      console.log(doc.id, " => ", doc.data());
    });
    // 찾은 정보값 화면에 출력
    setSearchBooks(array);
  };

  // 현재 컴포넌트가 실행됬을때 바로 출력
  useEffect(() => {
    getBook();
  }, []);

  // return 화면에 값을 출력하기 위한 함수
  // 타임스탬프값을 넣으면 값을 변환해서 문자열로 return하는 함수
  const printTime = (date) => {
    const month = date.toDate().getMonth() + 1;
    const day = date.toDate().getDate();
    return `${month}/${day}`;
  };

  return (
    <div>
      <h3>readingbooks 컬렉션</h3>
      <h3> 책 추가</h3>
      <AddBookBox getBook={getBook} />
      <hr />
      <form onSubmit={searchBook}>
        <input
          type="text"
          onChange={(e) => {
            setSearchTitle(e.target.value);
          }}
        />
        <button type="submit">읽은 책 검색하기</button>
      </form>
      <hr />
      {searchBooks &&
        searchBooks.map((book) => (
          <div>
            <h4>
              {printTime(book.startDate)} {book.title}
            </h4>
            <p>{book.memo ? book.memo : "메모없음"}</p>
          </div>
        ))}

      <hr />

      {
        // 외부에서 값을 가져오는 시간이 걸림
        books &&
          books.map((book) => (
            <div key={book.id}>
              <h4>
                {printTime(book.startDate)}~{" "}
                {book.done ? printTime(book.endDate) : "읽는중"}
                {` `} {book.title}
              </h4>
              {book.done ? (
                <p>{book.memo}</p>
              ) : (
                <button
                  onClick={() => {
                    updateBook(book.id);
                  }}
                >
                  감상문 적기
                </button>
              )}
              <button
                onClick={() => {
                  deleteBook(book.id);
                }}
              >
                X
              </button>
            </div>
          ))
      }
    </div>
  );
}
