import yup from 'yup';

const postSchema = yup.object().shape({
  title: yup.string('Title must be a string').required('Title is required'),
  author: yup.string('Author must be a string').required('Author is required'),
  content: yup.string('Content must be a string').required('Content is required'),
});

export default postSchema;