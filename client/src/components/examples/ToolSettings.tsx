import { ToolSettings } from "../editor/ToolSettings";

export default function ToolSettingsExample() {
  return (
    <div className="relative h-[400px] bg-background flex items-end justify-center pb-8">
      <ToolSettings
        tool="exposure"
        onApply={(settings) => console.log("Apply:", settings)}
        onCancel={() => console.log("Cancel")}
      />
    </div>
  );
}
