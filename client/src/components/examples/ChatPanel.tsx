import { ChatPanel } from "../editor/ChatPanel";

export default function ChatPanelExample() {
  return (
    <div className="h-[600px]">
      <ChatPanel
        isOpen={true}
        onClose={() => console.log("Close clicked")}
        onSendMessage={(msg) => console.log("Message sent:", msg)}
      />
    </div>
  );
}
