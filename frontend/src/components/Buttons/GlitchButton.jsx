const GlitchButton = ({ content }) => (
  <button className="btn-glitch" data-content={`${content}`}>
    {content}
  </button>
);

export default GlitchButton;
