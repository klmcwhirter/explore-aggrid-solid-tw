import { createResource, Resource } from "solid-js";

const fetchData = async () => (await fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')).json();

export interface OlympicWinner {
    athlete: string,
    age: number,
    country: string,
    year: string,
    date: string,
    sport: string,
    gold: number,
    silver: number,
    bronze: number,
    total: number
};

export function OlympicWinnersData(): Resource<any> {
    const [datafetch] = createResource(fetchData, { deferStream: true });
    return datafetch;
}
