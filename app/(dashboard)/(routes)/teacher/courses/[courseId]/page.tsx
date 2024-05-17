interface ICourseId {
  params: {
    courseId: string;
  };
}

const CourserIdPage = ({ params }: ICourseId) => {
  return <div>Course id:{params.courseId}</div>;
};

export default CourserIdPage;
