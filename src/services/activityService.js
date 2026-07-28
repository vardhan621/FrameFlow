import API from "./api";

export const getClientActivities = (clientId) =>
  API.get(`/activity/${clientId}`);

export const getProjectActivities = (projectId) =>
  API.get(`/activity/project/${projectId}`);