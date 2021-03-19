import { Typography, AppBar, Tabs, Tab, Box } from "@material-ui/core";
import React, { useState } from "react";

import TodoTab from "./TodoTab";

// A tab panel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ backgroundColor: "#ECECEC" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Props for the tabs
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

// Main component
function JobTabs(props) {
  const [value, setValue] = useState(0);
  const { job } = props;

  const handleTabChange = (_, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="Contents of each job"
          centered
        >
          <Tab label="Description" {...a11yProps(0)} />
          <Tab label="Todos" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* Description */}
      <TabPanel value={value} index={0}>
        <div style={{ whiteSpace: "pre-line" }}>
          {job.description ||
            "Add a description for the job or any notes you'd like to record!"}
        </div>
      </TabPanel>

      {/* Todos */}
      <TabPanel value={value} index={1}>
        <TodoTab job={job}></TodoTab>
      </TabPanel>
    </div>
  );
}

export default JobTabs;
