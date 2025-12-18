import { UploadZone } from "../editor/UploadZone";

export default function UploadZoneExample() {
  return (
    <div className="h-[400px] bg-background flex">
      <UploadZone
        onImageUpload={(file, dataUrl) => console.log("Uploaded:", file.name)}
      />
    </div>
  );
}
