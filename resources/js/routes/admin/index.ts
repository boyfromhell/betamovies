import watchProtection from './watch-protection';
import playerServers from './player-servers';
import watchlist from './watchlist';
import logs from './logs';
import tmdb from './tmdb';

const admin = {
    watchProtection: Object.assign(watchProtection, watchProtection),
    playerServers: Object.assign(playerServers, playerServers),
    watchlist: Object.assign(watchlist, watchlist),
    logs: Object.assign(logs, logs),
    tmdb: Object.assign(tmdb, tmdb),
};

export default admin;
