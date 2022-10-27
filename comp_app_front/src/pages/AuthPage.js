import React from "react";
import AuthForm from "../components/AuthForm";

import styles from "./AuthPage.module.css";

function AuthPage() {
  return (
    <div className={styles.container}>
      <AuthForm />
    </div>
  );
}

export default AuthPage;
