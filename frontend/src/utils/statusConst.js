// Defines the constants that will be reused across the app.

const StatusList = {
  0: "Added",
  1: "Applied",
  2: "Interviewing",
  3: "Offer",
  "-1": "Rejected",
};

const ReverseStatusList = {};
Object.keys(StatusList).map(
  (key) => (ReverseStatusList[StatusList[key]] = key)
);

const Status = {
  StatusList,
  ReverseStatusList,
};

export default Status;
