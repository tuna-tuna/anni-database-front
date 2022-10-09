declare type PlayerInfo = {
    mcid: string;
    uuid: string;
    history: NameHistory[];
}

declare type NameHistory = {
    mcid: string;
    changedAt: string;
    hidden: boolean;
}

declare type AnniStats = {
    mcid: string;
    playTime: {
        playHour: string;
        playMin: string;
    };
    winLose: string;
    bowKills: string;
    meleeKills: string;
    nexusDamage: string;
    oresMined: string;
}