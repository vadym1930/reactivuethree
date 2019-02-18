import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import { FooterContent } from "./FooterContent";
import { Search } from "./Search";
import "normalize.css";
import { Pagination } from "./Pagination";
import { Hero } from "./Hero";
import styles from "./app.scss";
import u from "./utils.scss";

const PARAM_NAME_STARTS_WITH = "nameStartsWith=";
const PARAM_API_KEY = "apikey=";
const PARAM_LIMIT = "limit=";
const PARAM_OFFSET = "offset=";
const BASE_URL = "//gateway.marvel.com/v1/public/characters";
const API_KEY = process.env.PUBLIC_KEY;

class App extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      isLoaded: false,
      all: {
        1: {
          charactersOffset: 0,
          list: [],
          total: null,
          pages: null
        }
      },
      limit: 5,
      searchTerm: "",
      askedPage: 0,
      pers: {},
      // that help hide previouse result status — button.
      isSearchTermChangedBeforeSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;

    // first default call of fetch.
    this.fetchCharacters();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  needToFetch = page => {
    const { searchTerm, pers, all } = this.state;
    this.setState({ isSearchTermChangedBeforeSubmit: true });

    if (searchTerm) {
      return (pers && pers[searchTerm] && pers[searchTerm].hits) || false;
    } else {
      return (all && all[page] && all && all[page].list.length) || false;
    }
  };

  fetchCharacters = (offset = 0, page = 1) => {
    this.setState({ askedPage: page });

    if (!this.needToFetch(page)) {
      this.setState({ isLoaded: false, isSearchTermChangedBeforeSubmit: true });

      let url;
      const { limit, searchTerm } = this.state;

      if (searchTerm) {
        url = `${BASE_URL}?${PARAM_NAME_STARTS_WITH}${searchTerm}&${PARAM_LIMIT}${limit}&${PARAM_OFFSET}${offset}&${PARAM_API_KEY}${API_KEY}`;
      } else {
        url = `${BASE_URL}?${PARAM_LIMIT}${limit}&${PARAM_OFFSET}${offset}&${PARAM_API_KEY}${API_KEY}`;
      }
      axios
        .get(url)
        .then(res => this._isMounted && this.setCharacters(res.data.data))
        .catch(err => console.log(err));
    }
  };

  fetchPersByStartName = (offset = 0) => {
    const { searchTerm, limit } = this.state;
    console.log("here");
    this.setState({ isLoaded: false, isSearchTermChangedBeforeSubmit: true });

    const url = `${BASE_URL}?${PARAM_NAME_STARTS_WITH}${searchTerm}&${PARAM_LIMIT}${limit}&${PARAM_OFFSET}${offset}&${PARAM_API_KEY}${API_KEY}`;

    axios
      .get(url)
      .then(res => this._isMounted && this.setCharacters(res.data.data))
      .catch(err => console.log(err));
  };

  setCharacters = res => {
    const { results, offset, total, limit } = res;
    const page = offset / limit + 1;

    if (!results.length) {
      this.setState({ isEmpty: true });
    } else {
      this.setState({ isEmpty: false });
    }

    const { all, pers, searchTerm } = this.state;

    if (searchTerm) {
      const oldHits = (pers && pers[searchTerm] && pers[searchTerm].hits) || [];

      const updatedList = [...results, ...oldHits];
      this.setState({
        pers: {
          ...pers,
          [searchTerm]: {
            hits: updatedList,
            page,
            total,
            pages: total / limit,
            charactersOffset: offset
          }
        },
        isLoaded: true
      });
    } else {
      const oldPages = (all && all) || {};
      const newPage = {
        [page]: {
          list: results,
          charactersOffset: offset,
          total,
          pages: total / limit
        }
      };
      this.setState({
        all: {
          ...oldPages,
          ...newPage
        },
        isLoaded: true,
        allTogether: total
      });
    }
  };

  onNameChange = e => {
    const { pers } = this.state;

    let flag = false;

    if (e.target.value in pers) {
      flag = true;
    }

    this.setState({
      searchTerm: e.target.value,
      isSearchTermChangedBeforeSubmit: flag
    });
  };

  render() {
    const {
      isLoaded,
      searchTerm,
      askedPage,
      all,
      pers,
      limit,
      isEmpty,
      allTogether,
      isSearchTermChangedBeforeSubmit
    } = this.state;
    let list;
    let charactersOffset;
    let pages;
    let total;
    let btnCssClasses;

    // handle variables when search name inputed.
    if (searchTerm) {
      list =
        (pers &&
          pers[searchTerm] &&
          pers[searchTerm] &&
          pers[searchTerm].hits) ||
        [];
      charactersOffset =
        (pers &&
          pers[searchTerm] &&
          pers[searchTerm] &&
          pers[searchTerm].charactersOffset) ||
        0;
      pages =
        (pers &&
          pers[searchTerm] &&
          pers[searchTerm] &&
          pers[searchTerm].pages) ||
        null;
      total =
        (pers &&
          pers[searchTerm] &&
          pers[searchTerm] &&
          pers[searchTerm].total) ||
        null;

      // add btn classes depending on the state changing.
      btnCssClasses = [`${styles.cBtn}`, `${styles.cMain__more}`];
      if (!isLoaded) {
        btnCssClasses.push(u.isHidden);
      }
      if (!isSearchTermChangedBeforeSubmit && !list.length) {
        btnCssClasses.push(u.isHidden);
      }
      if (total <= list.length) {
        btnCssClasses.push(u.isDisabled);
      } else {
        btnCssClasses.push(u.isActive);
      }
      // handle scenarion when going throught pages.
    } else {
      list = (all && all[askedPage] && all[askedPage].list) || [];
      charactersOffset =
        (all[askedPage] && all[askedPage].charactersOffset) || 0;
      pages = (all && all[askedPage] && all[askedPage].pages) || null;
      total = (all && all[askedPage] && all[askedPage].total) || null;
    }

    return (
      <div className={styles.cApp}>
        <header className={styles.cApp__header}>
          <div className={styles.oContainer}>
            <div className={styles.cApp__search}>
              <Search
                name={searchTerm}
                fetch={this.fetchCharacters}
                onNameChange={this.onNameChange}
                total={allTogether}
              />
            </div>
          </div>
        </header>
        <main className={styles.cApp__main}>
          <div className={styles.oContainer}>
            <div className={styles.cMain__inner}>
              <div className={styles.cMain__results}>
                {isLoaded
                  ? list.map(item => <Hero key={item.id} item={item} />)
                  : "loading..."}
                {/* {isEmpty && isSearchTermChangedBeforeSubmit ? "Nothing" : ""} */}
              </div>
              {searchTerm ? (
                <div className="c-more c-main__more">
                  <button
                    className={btnCssClasses.join(" ")}
                    onClick={() =>
                      this.fetchPersByStartName(charactersOffset + 5)
                    }
                  >
                    loaded {list.length}
                    {total - list.length > 0
                      ? `, but ${total - list.length} left -> load more`
                      : ", nothing to load more"}
                  </button>
                </div>
              ) : (
                <div className={styles.cMain__pagination}>
                  <Pagination
                    pages={pages}
                    limit={limit}
                    charactersOffset={charactersOffset}
                    total={total}
                    fetchCharacters={this.fetchCharacters}
                    list={all && all}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        <footer>
          <div className={styles.oContainer}>
            <FooterContent>
              Data provided by Marvel. © 2014 Marvel
            </FooterContent>
          </div>
        </footer>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
