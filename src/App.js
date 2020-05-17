import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import './app.scss';
import './reactivuetythree';
import img from './assets/og-img.jpg';

const mainStyles = {
    backgroundImage: `url(${img})`,
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    color: '#fff',
    backgroundPosition: 'center',
    padding: '20px'
};

class App extends Component {
    render() {
        return (
            <Fragment>
                <div className="wrapper" style={mainStyles}>
                    <main style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontWeight: 'normal' }}>
                            [Reacti
                            <b style={{ color: '#42B883' }}>
                                (v<i style={{ color: '#fff' }}>]</i>ue)
                            </b>
                            3{' '}
                            <span role="img" aria-label="fencer emoji">
                                🤺
                            </span>{' '}
                        </h1>
                        The Game shell begin — open console and reload.
                    </main>
                    <footer>
                        Photo by Alperen Yazgı from https://unsplash.com/
                    </footer>
                </div>
            </Fragment>
        );
    }
}

render(<App />, document.getElementById('root'));
