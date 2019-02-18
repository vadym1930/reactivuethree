import React, { Component } from "react";
import styles from "./app.scss";
import s from "./search.scss";
import u from "./utils.scss";

export class Search extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.fetch();
  };
  render() {
    const { name, onNameChange, total } = this.props;
    return (
      <div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label className={styles.oLabel} htmlFor="nameStartWith">
              Pers by name&nbsp;
              <input
                onChange={onNameChange}
                id="nameStartWith"
                type="text"
                value={name}
                className={styles.oInput}
              />
              <button
                className={`${styles.cBtn} ${s.cSearch__submit}`}
                type="submit"
              >
                go
              </button>
            </label>
            <span className={s.cSearch__small}>
              <i>{total}</i> pers in the base
            </span>
          </form>
        </div>
      </div>
    );
  }
}
