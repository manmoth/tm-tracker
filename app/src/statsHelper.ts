import { Game, GameScores } from "./types";

export function calculateGameResult(gameScores: GameScores): { jv: { won: boolean; last: boolean; }, h: { won: boolean; last: boolean; }, gm: { won: boolean; last: boolean; }, t: { won: boolean; last: boolean; }} | undefined  {
    const allPoints = [gameScores.jv, gameScores.gm, gameScores.t, gameScores.h];
    const allValidPoints = allPoints.map(v => v ?? 0).filter(v => v > 0);

    if(allValidPoints.length === 0)
        return undefined;

    const winnerPoints = Math.max(...allValidPoints);
    const lastPoints = Math.min(...allValidPoints);

    const isTieBreaker = allValidPoints.filter(v => v === winnerPoints).length >= 2;

    return {
        jv: {
            won: winnerPoints === gameScores.jv && (!isTieBreaker || !!gameScores.jvWonTieBreaker),
            last: lastPoints === gameScores.jv
        },
        gm: {
            won: winnerPoints === gameScores.gm && (!isTieBreaker || !!gameScores.gmWonTieBreaker),
            last: lastPoints === gameScores.gm
        },
        h: {
            won: winnerPoints === gameScores.h && (!isTieBreaker || !!gameScores.hWonTieBreaker),
            last: lastPoints === gameScores.h
        },
        t: {
            won: winnerPoints === gameScores.t && (!isTieBreaker || !!gameScores.tWonTieBreaker),
            last: lastPoints === gameScores.t
        }
    }
}

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
            const gameResult = calculateGameResult(curr);

            if(!gameResult)
                return prev;
            
            return { jv: (gameResult.jv.won ? prev.jv + 1 : prev.jv), gm: (gameResult.gm.won ? prev.gm + 1 : prev.gm), h: (gameResult.h.won ? prev.h + 1 : prev.h), t: (gameResult.t.won ? prev.t + 1 : prev.t) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );
}

export function calculateGamesLast(gameScores: GameScores[] | undefined): { jv: number, gm: number, h: number, t: number } | undefined {
    return gameScores?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            const gameResult = calculateGameResult(curr);

            if(!gameResult)
                return prev;

            return { jv: (gameResult.jv.last ? prev.jv + 1 : prev.jv), gm: (gameResult.gm.last ? prev.gm + 1 : prev.gm), h: (gameResult.h.last ? prev.h + 1 : prev.h), t: (gameResult.t.last ? prev.t + 1 : prev.t) };
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

export const formatPercentOrNa = (num: number | undefined) => {
    if(num === undefined) {
        return "N/A";
    }
    else {
        return num.toFixed(1) + "%";
    }
}
