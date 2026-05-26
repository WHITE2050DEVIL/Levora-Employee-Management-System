import React from "react";
import classNames from "classnames";

const LevoraBrand = ({
  compact = false,
  className = "",
  showTagline = true,
}) => {
  return (
    <span className={classNames("levora-brand", className, { compact })}>
      <span className="levora-brand-mark" aria-hidden="true">
        <span className="levora-brand-core">L</span>
      </span>
      {!compact && (
        <span className="levora-brand-copy">
          <span className="levora-brand-name">Levora</span>
          {showTagline && (
            <span className="levora-brand-tagline">
              Smarter Leave. Better Workflow.
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export default LevoraBrand;
