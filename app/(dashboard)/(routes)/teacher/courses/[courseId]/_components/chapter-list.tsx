import { type Chapter } from "@prisma/client";

interface ChapterListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (items: { id: string; position: number }[]) => void;
}

const ChapterLists = ({ onEdit, onReorder, items }: ChapterListProps) => {
  return <div>List chapter</div>;
};

export default ChapterLists;
