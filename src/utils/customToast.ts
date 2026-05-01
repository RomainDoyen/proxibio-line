import toast from "react-hot-toast";

const baseStyle = {
  borderRadius: "14px",
  background: "rgba(17, 31, 48, 0.96)",
  color: "#f4f8f5",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow: "0 24px 60px -20px rgba(0, 0, 0, 0.5)",
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontSize: "0.9rem",
};

export const errorMessage = (message: string): void => {
  toast.error(message, {
    style: {
      ...baseStyle,
      borderColor: "rgba(251, 113, 133, 0.45)",
    },
    iconTheme: {
      primary: "#fb7185",
      secondary: "#0f1f33",
    },
  });
};

export const successMessage = (message: string): void => {
  toast.success(message, {
    style: {
      ...baseStyle,
      borderColor: "rgba(94, 234, 212, 0.45)",
    },
    iconTheme: {
      primary: "#5eead4",
      secondary: "#0f1f33",
    },
  });
};
