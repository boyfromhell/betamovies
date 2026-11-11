import HomeController from './HomeController';
import LocaleController from './LocaleController';
import SitemapController from './SitemapController';
import ContactController from './ContactController';
import WatchlistController from './WatchlistController';
import CatalogSearchController from './CatalogSearchController';
import MovieController from './MovieController';
import PersonController from './PersonController';
import WatchVerificationController from './WatchVerificationController';
import MovieWatchController from './MovieWatchController';
import SeriesController from './SeriesController';
import SeriesWatchController from './SeriesWatchController';
import Admin from './Admin';

const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
    LocaleController: Object.assign(LocaleController, LocaleController),
    SitemapController: Object.assign(SitemapController, SitemapController),
    ContactController: Object.assign(ContactController, ContactController),
    WatchlistController: Object.assign(
        WatchlistController,
        WatchlistController,
    ),
    CatalogSearchController: Object.assign(
        CatalogSearchController,
        CatalogSearchController,
    ),
    MovieController: Object.assign(MovieController, MovieController),
    PersonController: Object.assign(PersonController, PersonController),
    WatchVerificationController: Object.assign(
        WatchVerificationController,
        WatchVerificationController,
    ),
    MovieWatchController: Object.assign(
        MovieWatchController,
        MovieWatchController,
    ),
    SeriesController: Object.assign(SeriesController, SeriesController),
    SeriesWatchController: Object.assign(
        SeriesWatchController,
        SeriesWatchController,
    ),
    Admin: Object.assign(Admin, Admin),
};

export default Controllers;
