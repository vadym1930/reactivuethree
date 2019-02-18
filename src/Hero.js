import React from "react";
import a from "./app.scss";
import styles from "./hero.scss";
import u from "./utils.scss";

export const Hero = props => (
  <div className={styles.cItem}>
    <div className={styles.cItem__name}>{props.item.name}</div>
    <div className={styles.cItem__details}>
      <div className={styles.cItem__img}>
        <img
          src={`${props.item.thumbnail.path}.${props.item.thumbnail.extension}`}
          alt={props.item.name}
        />
      </div>
      {props.item.description ? (
        <div className={styles.cItem__description}>
          {props.item.description}
        </div>
      ) : (
        ""
      )}

      <div className={styles.cItem__more}>
        <a
          className={`${u.isActive} ${a.cBtn}`}
          rel="nofollow"
          target="blanc"
          href={props.item.urls[0].url}
        >
          Details
        </a>
      </div>
    </div>
  </div>
);
