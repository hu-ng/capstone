// Helper function to extract error from a failed mutation. Used across the app.

const extractErrorFromMutation = (mutation) => {
  const error = mutation.error;
  return error.response.data.detail[0].msg;
};

export default extractErrorFromMutation;
