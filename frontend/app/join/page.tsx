"use client";
import RegisterForm from "@/app/component/RegisterForm";
import styles from "@/app/page.module.css";

export default function join() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <RegisterForm />
      </div>
    </main>
  );
}
