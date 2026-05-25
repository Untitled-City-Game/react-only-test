import { RawChallenge } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { City } from "@/scripts/types/types";
import csv2json from "csvjson-csv2json";

const SHEET_ID = "1OSomdkztsLD4Tz4_xsflaVnPeKHhufCX9SlkGqW0lQ4";

function sheetCsvUrl(tab: string): string {
	return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

async function fetchTab(tab: string): Promise<RawChallenge[]> {
	const res = await fetch(sheetCsvUrl(tab));
	if (!res.ok) {
		throw new Error(`Failed to fetch challenges tab "${tab}": ${res.status} ${res.statusText}`);
	}
	const csv = await res.text();
	return csv2json(csv) as RawChallenge[];
}

export async function fetchChallenges(city: City): Promise<RawChallenge[]> {
	const generic = await fetchTab("generic");
	let cityRows: RawChallenge[] = [];
	try {
		cityRows = await fetchTab(city);
	} catch (e) {
		console.warn(`No challenges tab for city "${city}":`, e);
	}
	return [...generic, ...cityRows];
}
