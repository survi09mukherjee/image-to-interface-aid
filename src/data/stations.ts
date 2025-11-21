export interface Station {
    id: string;
    name: string;
    code: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export const stations: Station[] = [
    {
        id: "cbe",
        name: "Coimbatore Junction",
        code: "CBE",
        coordinates: {
            lat: 11.018,
            lng: 76.970
        }
    },
    {
        id: "cbf",
        name: "Coimbatore North Junction",
        code: "CBF",
        coordinates: {
            lat: 11.039,
            lng: 76.983
        }
    },
    {
        id: "ptj",
        name: "Podanur Junction",
        code: "PTJ",
        coordinates: {
            lat: 10.974,
            lng: 76.933
        }
    },
    {
        id: "shi",
        name: "Singanallur",
        code: "SHI",
        coordinates: {
            lat: 11.005,
            lng: 76.991
        }
    }
];
