/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';

// import App from './App';
import App2 from './App2';

// Still on my todo list to learn about routing in solid - <sigh>

render(() => <App2 />, document.getElementById('root') as HTMLElement);
