// app/page.tsx

"use client";

import styles from "./page.module.css";


// 회원가입 폼
import RegisterForm from "./component/RegisterForm";

export default function Index() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <RegisterForm />
      </div>
    </main>
  );
}
