import WatchProtectionController from './WatchProtectionController';
import VideoPlayerServerController from './VideoPlayerServerController';
import WatchlistController from './WatchlistController';
import LogController from './LogController';
import TmdbController from './TmdbController';
import TmdbConnectionController from './TmdbConnectionController';

const Admin = {
    WatchProtectionController: Object.assign(
        WatchProtectionController,
        WatchProtectionController,
    ),
    VideoPlayerServerController: Object.assign(
        VideoPlayerServerController,
        VideoPlayerServerController,
    ),
    WatchlistController: Object.assign(
        WatchlistController,
        WatchlistController,
    ),
    LogController: Object.assign(LogController, LogController),
    TmdbController: Object.assign(TmdbController, TmdbController),
    TmdbConnectionController: Object.assign(
        TmdbConnectionController,
        TmdbConnectionController,
    ),
};

export default Admin;
