import toast from "react-hot-toast";

export const errorMessage = (message: string): void => {
  toast.error(message, {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      border: "2px solid #ff0000",
    },
    iconTheme: {
      primary: "#ff0000",
      secondary: "#FFFAEE",
    },
  });
}

export const successMessage = (message: string): void => {
  toast.success(message, {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      border: "2px solid #00ff00",
    },
    iconTheme: {
      primary: "#00ff00",
      secondary: "#FFFAEE",
    },
  });
}