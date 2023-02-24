import mongoose from "mongoose";

// Connect Server at default port 8000.
const connectServer = (app) => {
  const PORT = process.env.PORT || 8000;
  try {
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}.`));
  } catch (error) {
    throw new Error("Error in server connection: " + err);
  }
};

export default connectServer;
