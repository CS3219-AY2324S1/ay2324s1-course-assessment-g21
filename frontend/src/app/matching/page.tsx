"use client";

import Button from "@/app/components/button/Button";
import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import StatusBar from "@/app/components/status-bar/StatusBar";
import { useInnkeeperSocket } from "@/app/hooks/useInnKeeper";
import {
  innkeeperWriteAtom,
  isConnectedAtom,
  isMatchedAtom,
  roomIdAtom,
} from "@/libs/room-jotai";
import { Space } from "antd";
import { getAuth } from "firebase/auth";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { FetchAuth } from "../api";
import QuestionModal from "../components/modal/QuestionModal";
import MatchingPage from "../components/matching/MatchingPage";
type UserDetails = { displayName: string; authToken: string };
const userDetailsAtom = atom<UserDetails | null>(null);

import { useState } from "react";
import QueueButton from "../components/button/QueueButton";
import Loading from "../loading";
import { useQuery } from "@tanstack/react-query";
import { QuestionType } from "../admin/question/page";

const MatchingPage = () => {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );

  // const { data: questionObj, isLoading: questionDescriptionLoading } = useQuery<
  //   { payload: QuestionType } | undefined
  // >(["question", currQn], () => {
  //   if (currQn) {
  //     return fetchActivity(currQn?._id ?? "");
  //   }
  // });

  const activityTableColumns: any = [
    {
      title: "Question",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      width: 20,
      sorter: (a: QuestionType, b: QuestionType) => a.difficulty < b.difficulty,
      align: "center",
      render: (difficulty: string) => {
        if (!difficulty) {
          return null;
        }
        let color = difficulty.length > 5 ? "geekblue" : "green";
        switch (difficulty.toLowerCase()) {
          case "easy":
            color = "bg-success text-white";
            break;
          case "medium":
            color = "bg-warning text-white";
            break;
          case "hard":
            color = "bg-error text-white";
            break;
        }

const roomPage = () => {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  useInnkeeperSocket(userDetails?.authToken ?? null);
  const isConnected = useAtomValue(isConnectedAtom);
  const isMatched = useAtomValue(isMatchedAtom);
  const roomId = useAtomValue(roomIdAtom);
  useEffect(() => {
    FetchAuth.getFirebaseToken().then((authToken) => {
      const displayName = getAuth().currentUser?.displayName ?? "Anonymous";
      setUserDetails({ displayName, authToken });
    });
  }, []);

  console.dir({ isConnected, isMatched, roomId, at: "rendering room page" });

  if (!userDetails) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Checking your login status...</h1>
      </section>
    );
  }

  if (!isConnected) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Connecting to InnKeeper...</h1>
      </section>
    );
  }

  console.log(isMatched);
  if (isMatched === "UNMATCHED") {
    return <MatchingPage />;
  }

  //For status bar

  const executeFunction = async () => {};

  // Connected, matched but hasn't received room state yet.
  if (!roomId) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </section>
    );
  }

  return (
    <>
      <QuestionModal />
      <div className="flex h-full flex-col justify-between">
        <section className="flex flex-col justify-center gap-4 pb-14 pt-4 lg:flex-row lg:pb-0">
          <MarkdownQuestionPane />
          <CodeMirrorEditor
            userId={userDetails.displayName}
            authToken={userDetails.authToken}
            roomId={roomId}
          />
        </section>
        <StatusBar exitMethod={executeFunction} />
      </div>
    </>
  );
};

export default roomPage;
