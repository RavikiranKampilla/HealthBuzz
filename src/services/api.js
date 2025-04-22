// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

export const fetchHealthReports = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-reports/student/${studentId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch health reports: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching health reports:', error);
    throw error;
  }
};

export const addHealthReport = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-reports`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add health report: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding health report:', error);
    throw error;
  }
};

export const fetchReportById = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-reports/${reportId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch report details: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};