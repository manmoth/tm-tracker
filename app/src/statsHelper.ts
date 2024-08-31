import { Game, GameScores } from "./types";

export function calculateTimesPlayed(games: Game[] | undefined): { jv: number, gm: number, h: number, t: number } | undefined {
    return games?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            return { jv: prev.jv + (curr.jv ? 1 : 0), gm: prev.gm + (curr.gm ? 1 : 0), h: prev.h + (curr.h ? 1 : 0), t: prev.t + (curr.t ? 1 : 0) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );
}

export function calculateGamesWon(gameScores: GameScores[] | undefined): { jv: number, gm: number, h: number, t: number } | undefined {
    return gameScores?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            const winnerPoints = Math.max(curr.gm ?? 0, curr.jv ?? 0, curr.h ?? 0, curr.t ?? 0);

            if(winnerPoints === 0)
                return prev;

            return { jv: (curr.jv == winnerPoints ? prev.jv + 1 : prev.jv), gm: (curr.gm == winnerPoints ? prev.gm + 1 : prev.gm), h: (curr.h == winnerPoints ? prev.h + 1 : prev.h), t: (curr.t == winnerPoints ? prev.t + 1 : prev.t) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );
}

export function calculateGamesLast(gameScores: GameScores[] | undefined): { jv: number, gm: number, h: number, t: number } | undefined {
    return gameScores?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            const loserPoints = Math.min(curr.gm ?? 1000, curr.jv ?? 1000, curr.h ?? 1000, curr.t ?? 1000);

            if(loserPoints === 1000)
                return prev;

            return { jv: (curr.jv == loserPoints ? prev.jv + 1 : prev.jv), gm: (curr.gm == loserPoints ? prev.gm + 1 : prev.gm), h: (curr.h == loserPoints ? prev.h + 1 : prev.h), t: (curr.t == loserPoints ? prev.t + 1 : prev.t) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );
}

export function calculateTimeAbsent(games: Game[] | undefined): { jv: number, gm: number, h: number, t: number } | undefined {
    return games?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            return { jv: (curr.jv ? prev.jv : prev.jv + 1), gm: (curr.gm ? prev.gm : prev.gm + 1), h: (curr.h ? prev.h : prev.h + 1), t: (curr.t ? prev.t : prev.t + 1) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );
}

export function calculateTimesPlayedPerMap(games: Game[] | undefined): Record<number, number> | undefined {
    return games?.reduce<Record<number, number>>(
        (prev, curr) => { 
            return { ...prev, [curr.map]: (prev[curr.map] ?? 0) + 1 };
        },
        {}
    );
}
