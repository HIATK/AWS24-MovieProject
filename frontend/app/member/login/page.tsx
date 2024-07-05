"use client";

import React, { useState } from "react";
import styles from "@/app/page.module.css";
import Login from "@/(components)/Member/Login";

export default function login() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Login />
      </div>
    </main>
  );
}
