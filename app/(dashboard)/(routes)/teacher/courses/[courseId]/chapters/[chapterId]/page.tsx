interface ChapterProps {
  params: {
    courseId: string;
    id: string;
  };
}

const ChapterPage = ({ params }: ChapterProps) => {
  return <div>Chapter</div>;
};

export default ChapterPage;
