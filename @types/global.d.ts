type PlayerInfo = {
    mcid: string;
    uuid: string;
    history: NameHistory[];
}

type NameHistory = {
    mcid: string;
    changedAt: string;
    hidden: boolean;
}