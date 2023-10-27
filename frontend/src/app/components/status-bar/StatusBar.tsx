import { executeCode } from "@/app/api";
import { UserState } from "@/libs/innkeeper-api-types";
import {
  codeLangAtom,
  codeMirrorValueAtom,
  innkeeperWriteAtom,
  resultAtom,
  userStatesAtom,
} from "@/libs/room-jotai";
import { atom, useAtomValue, useSetAtom } from "jotai";
import Button from "../button/Button";
import UserStateBadge from "./UserStatusBadge";

interface StatusBarProps {
  exitMethod: () => void;
}

const triggerExecutionRequestAtom = atom(null, async (get, set) => {
  const code = get(codeMirrorValueAtom);
  const codeLang = get(codeLangAtom);
  const result = await executeCode(code, codeLang);
  set(resultAtom, result);
});

const triggerExitRoomRequestAtom = atom(null, (get, set) => {
  set(innkeeperWriteAtom, { eventName: "leaveRoom", eventArgs: [] });
});

const StatusBar = ({ exitMethod }: StatusBarProps) => {
  const code = useAtomValue(codeMirrorValueAtom);
  const userStates = useAtomValue(userStatesAtom);
  const callExecution = useSetAtom(triggerExecutionRequestAtom);
  const callExitRoom = useSetAtom(triggerExitRoomRequestAtom);

  return (
    <footer className="fixed bottom-0 left-0 flex w-[100svw] items-center justify-between border-black bg-primary px-4 py-2 shadow-sm lg:static lg:w-full lg:px-12">
      <div className="flex gap-4">
        {userStates &&
          userStates.map((userState: UserState) => (
            <UserStateBadge userState={userState} key={userState.userId} />
          ))}
      </div>
      <div className="flex items-center gap-4">
        <Button
          className="btn-sm"
          onClick={callExecution}
          children={<span>Execute</span>}
        />
        <Button
          className="btn-error btn-sm"
          onClick={callExitRoom}
          children={<span>Exit</span>}
        />
      </div>
    </footer>
  );
};

export default StatusBar;