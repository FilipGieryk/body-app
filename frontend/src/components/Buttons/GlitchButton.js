import styles from "./GlitchButton.module.css";

const GlitchButton = ({ content }) => (
  <button className={styles.button} style={{ "--btn-content": `"${content}"` }}>
    ADD
  </button>
);

export default GlitchButton;
