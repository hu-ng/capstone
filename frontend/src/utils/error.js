const extractErrorFromMutation = (mutation) => {
  const error = mutation.error;
  return error.response.data.detail[0].msg;
};

export default extractErrorFromMutation;
