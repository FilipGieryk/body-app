import "./help.css";

const Help = () => {
  return (
    <div className="help-container">
      <div>
        <p className="help-content">help</p>
        <h1>Split - name</h1>
      </div>
      {/* 
      
      */}
      <div className="help-nav">
        <div className="help-nav-splits">
          <div className="splits-label">splits</div>
          <div className="splits-options">
            <div>fullBody</div>
            <div>push pull legs</div>
            <div>upper lower </div>
            <div>body part</div>
          </div>
        </div>
        <div className="help-nav-rest">
          <div>reps sets</div>
        </div>
      </div>
    </div>
  );
};
export default Help;
