import React from "react";
import styles from "./pagination.scss";

export const PaginationButton = ({
  calculatedOffset,
  className,
  fetchCharacters,
  children,
  cached
}) => {
  const cssClasses = (className += ` ${styles.cPagination__btn} ${cached}`);
  const page = children;
  return (
    <button
      className={cssClasses}
      onClick={() => fetchCharacters(calculatedOffset, page)}
    >
      {children}
    </button>
  );
};
