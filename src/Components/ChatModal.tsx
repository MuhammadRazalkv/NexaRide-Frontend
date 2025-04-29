import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IMessage } from "@/interfaces/chat.interface";
import { useEffect, useState } from "react";

import { BiSend } from "react-icons/bi";

const ChatModal = ({
  messages,
  currentUserId,
  isOpen,
  changeOpen,
  submit,
}: {
  messages: IMessage[];
  currentUserId?: string;
  isOpen: boolean;
  changeOpen: () => void;
  submit: (text: string) => void;
}) => {
  useEffect(() => {
    if (currentUserId) {
      return;
    }
  }, [currentUserId]);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) {
      console.log("no msg trim");

      return;
    }
    submit(text);
    setText("");
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={changeOpen}>
        <SheetContent className="min-h-full w-full   flex flex-col ">
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex-grow text-sm overflow-y-auto ">
            {messages.length ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId !== currentUserId
                      ? "justify-start "
                      : "justify-end"
                  } `}
                >
                  <p
                    className={`${
                      message.senderId !== currentUserId
                        ? "text-left  bg-black text-white"
                        : "text-right  bg-neutral-600 text-white"
                    } p-2 px-2 rounded-2xl w-fit m-1.5 `}
                  >
                    {message.text}
                  </p>
                </div>
              ))
            ) : (
              <p>Start a conversation</p>
            )}
          </div>

          <div className="mt-auto flex ">
            <input
              type="text"
              value={text}
              className="w-9/10 bg-neutral-200 text-gray-950 text-sm p-2 rounded-xl shadow-2xl"
              placeholder="Type a message"
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={sendMessage}>
              <BiSend
                className="bg-black px-2 rounded-xl"
                size={"35px"}
                color="white"
              />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatModal;
