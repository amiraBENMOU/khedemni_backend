import mongoose from "mongoose";

const connectServer = (app) => {
  const PORT =50000;
  try {
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}.`));
  } catch (error) {
    throw new Error("Error in server connection: " + err);
  }
};

export default connectServer;
