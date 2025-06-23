import { getSiteSettings, updateSiteSettings, resetSiteSettings } from "../services/settingService.js";

// Get site settings
export const getSettingsHandler = async (req, res) => {
  try {
    const settings = await getSiteSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error getting site settings:", error);
    res.status(500).json({ error: "Failed to get site settings" });
  }
};

// Update site settings
export const updateSettingsHandler = async (req, res) => {
  try {
    const updatedSettings = await updateSiteSettings(req.body);
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ error: "Failed to update site settings" });
  }
};

// Reset site settings to default
export const resetSettingsHandler = async (req, res) => {
  try {
    const defaultSettings = await resetSiteSettings();
    res.status(200).json(defaultSettings);
  } catch (error) {
    console.error("Error resetting site settings:", error);
    res.status(500).json({ error: "Failed to reset site settings" });
  }
};
