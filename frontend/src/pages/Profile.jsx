import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Profile.module.css";
import { FiEdit, FiX } from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [modalField, setModalField] = useState(""); // field being edited
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const openModal = (field) => {
    setModalField(field);
    setFieldValue(user[field]);
  };

  const closeModal = () => {
    setModalField("");
    setFieldValue("");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put("/users/me", { [modalField]: fieldValue });
      setUser(res.data);
      closeModal();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Profile</h1>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.infoValue}>{user.name}</span>
              <button className={styles.editButton} onClick={() => openModal("name")}>
                <FiEdit />
              </button>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email}</span>
              <button className={styles.editButton} onClick={() => openModal("email")}>
                <FiEdit />
              </button>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Bio:</span>
              <span className={styles.infoValue}>{user.bio || "No bio yet"}</span>
              <button className={styles.editButton} onClick={() => openModal("bio")}>
                <FiEdit />
              </button>
            </div>
          </div>

          {modalField && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2>Edit {modalField.charAt(0).toUpperCase() + modalField.slice(1)}</h2>
                  <button className={styles.closeButton} onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                <div className={styles.modalForm}>
                  {modalField === "bio" ? (
                    <textarea
                      className={styles.input}
                      rows="4"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                  ) : (
                    <input
                      type={modalField === "email" ? "email" : "text"}
                      className={styles.input}
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                  )}
                  <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={closeModal}>
                      Cancel
                    </button>
                    <button className={styles.submitButton} onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
