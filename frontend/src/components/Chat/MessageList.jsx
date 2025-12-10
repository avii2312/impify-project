import React from "react";
import { FixedSizeList as List } from "react-window";

export default function MessageList({ messages }) {
  const Row = ({ index, style }) => {
    const msg = messages[index];
    return (
      <div style={style} className={`p-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white/10 text-white'}`}>
          {msg.content}
        </div>
      </div>
    );
  };

  return (
    <List
      height={500}
      itemCount={messages.length}
      itemSize={80}
      width={"100%"}
    >
      {Row}
    </List>
  );
}