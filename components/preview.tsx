import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}
const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  return <ReactQuill theme="bubble" value={value} readOnly />;
};

export default Preview;
