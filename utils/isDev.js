const isDev = () =>
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? true
      : false;
  
  export default isDev;