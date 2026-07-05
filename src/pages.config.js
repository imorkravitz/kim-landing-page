import Home from './pages/Home';
import SuccessStories from './pages/SuccessStories';
import Accessibility from './pages/Accessibility';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SuccessStories": SuccessStories,
    "Accessibility": Accessibility,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};