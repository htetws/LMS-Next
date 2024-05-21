import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}
const Preview = ({ value }: PreviewProps) => {
  return <ReactQuill theme="bubble" value={value} readOnly />;
};

export default Preview;
