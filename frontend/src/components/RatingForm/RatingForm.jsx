import React, { useState } from "react";
import styles from "./RatingForm.module.css";

export default function RatingForm({ role, onSubmit }) {
  const [form, setForm] = useState({
    quality: 0,
    delay: 0,
    friendliness: 0,
    interaction: 0,
    punctuality: 0,
    comment: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
      {role === "buyer" && (
        <>
          <label>Qualité de la marchandise :
            <input type="number" min="1" max="5" name="quality" onChange={handleChange} required />
          </label>
          <label>Respect des délais :
            <input type="number" min="1" max="5" name="delay" onChange={handleChange} required />
          </label>
          <label>Convivialité :
            <input type="number" min="1" max="5" name="friendliness" onChange={handleChange} required />
          </label>
        </>
      )}

      {role === "seller" && (
        <>
          <label>Interaction :
            <input type="number" min="1" max="5" name="interaction" onChange={handleChange} required />
          </label>
          <label>Respect du rendez-vous :
            <input type="number" min="1" max="5" name="punctuality" onChange={handleChange} required />
          </label>
        </>
      )}

      <label>Commentaire :
        <textarea name="comment" onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))} />
      </label>

      <button type="submit">Soumettre l’évaluation</button>
    </form>
  );
}
