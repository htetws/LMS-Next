import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Skeleton } from "./ui/skeleton";
import { Circle } from "lucide-react";
import { useMemo } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}
const Editor = ({ value, onChange }: EditorProps) => {
  const ReactQuill = useMemo(() => {
    return dynamic(() => import("react-quill"), {
      ssr: false,
      loading: () => (
        <Skeleton className="h-[110px] w-full rounded-md my-6 bg-slate-100/50 flex items-center justify-center">
          <Circle className="h-4 w-4 animate-spin" />
        </Skeleton>
      ),
    });
  }, []);

  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

export default Editor;
