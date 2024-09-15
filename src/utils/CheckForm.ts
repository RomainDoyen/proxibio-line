export const validateUsername = (value: string) => {
  if (value === "") {
    return { error: "Le nom d'utilisateur est requis.", isValid: false };
  }
  return { error: "", isValid: true };
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value === "") {
    return { error: "L'email est requis.", isValid: false };
  } else if (!emailRegex.test(value)) {
    return { error: "L'email n'est pas valide.", isValid: false };
  }
  return { error: "", isValid: true };
};

export const validatePassword = (value: string) => {
  if (value === "") {
    return { error: "Le mot de passe est requis.", isValid: false };
  } else if (value.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères.", isValid: false };
  }
  return { error: "", isValid: true };
};

export const validateConfirmPassword = (value: string, password: string) => {
  if (value === "") {
    return { error: "La confirmation du mot de passe est requise.", isValid: false };
  } else if (value !== password) {
    return { error: "Les mots de passe ne correspondent pas.", isValid: false };
  }
  return { error: "", isValid: true };
};

export const validateNameProducteur = (value: string) => {
  if (value === "") {
    return "Le nom du producteur est requis.";
  } else {
    return "";
  }
}

export const validateNameEnterprise = (value: string) => {
  if (value === "") {
    return "Le nom de l'entreprise est requis.";
  } else {
    return "";
  }
};

export const validateAddress = (value: string) => {
  if (value === "") {
    return "L'adresse est requise.";
  } else {
    return "";
  }
};