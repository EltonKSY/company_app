//Boolean to validate an email address
const validateEmail = email => /\S+@\S+\.\S+/.test(email);

const padTo2Digits = num => num.toString().padStart(2, '0');

//gets difference between two date objects
const diff_years = (dt2, dt1) => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export { validateEmail, diff_years, padTo2Digits, getCookie };
