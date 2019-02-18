import React from "react";
import { PaginationButton } from "./PaginationButton";
import styles from "./pagination.scss";
import u from "./utils.scss";

export const Pagination = props => {
  let pages = [];
  let offset = -props.limit;
  for (let i = 0; i < props.pages; i++) {
    offset += props.limit;
    if (offset >= props.total) {
      offset = props.total - props.limit;
    }
    pages.push(
      <PaginationButton
        fetchCharacters={props.fetchCharacters}
        key={`${i}-key`}
        calculatedOffset={offset}
        className={props.charactersOffset === offset ? `${u.isActive}` : ""}
        cached={i + 1 in props.list ? `${u.isCached}` : ""}
      >
        {(i + 1).toString()}
      </PaginationButton>
    );
  }
  return (
    <div>
      <p>
        Unique UI pattern — mega pager.
        <span role="img" aria-label="joke">
          🤪
        </span>
        &nbsp;Cached pages marked as blue
      </p>
      <div className={styles.cPagination__inner}>{pages}</div>
    </div>
  );
};
