"use client"
import RegisterForm from "@/app/component/RegisterForm";
import styles from "@/app/page.module.css";
import Sidebar from "@/app/component/Sidebar/Sidebar";

export default function join(){
    return(
        <main className={styles.main}>
            <div className={styles.description}>\
                <Sidebar/>
                <RegisterForm/>
            </div>
        </main>
    );
}