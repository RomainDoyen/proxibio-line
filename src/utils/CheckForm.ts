export const validateUsername = (value: string) => {
  if (value === "") {
    return "Le nom d'utilisateur est requis";
  } else {
    return "";
  }
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value === "") {
    return "L'email est requis";
  } else if (!emailRegex.test(value)) {
    return "L'email n'est pas valide";
  } else {
    return "";
  }
};

export const validatePassword = (value: string) => {
  if (value === "") {
    return "Le mot de passe est requis";
  } else if (value.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  } else {
    return "";
  }
};

export const validateConfirmPassword = (value: string, password: string) => {
  if (value === "") {
    return "La confirmation du mot de passe est requise";
  } else if (value !== password) {
    return "Les mots de passe ne correspondent pas";
  } else {
    return "";
  }
};

export const validateNameProducteur = (value: string) => {
  if (value === "") {
    return "Le nom du producteur est requis";
  } else {
    return "";
  }
}

export const validateNameEnterprise = (value: string) => {
  if (value === "") {
    return "Le nom de l'entreprise est requis";
  } else {
    return "";
  }
};

export const validateAddress = (value: string) => {
  if (value === "") {
    return "L'adresse est requise";
  } else {
    return "";
  }
};