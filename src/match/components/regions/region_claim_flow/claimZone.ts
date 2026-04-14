import { storage } from "@/scripts/firebase";
import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const DEBUG = true

export default async function claimZone(playerId : string, completeChallengeAndClaim : ConnectFourMoves["completeChallengeAndClaim"], zoneId: number, challenge : string, evidence : File[] ) {
	DEBUG && console.log("claiming zone on client", zoneId, challenge, evidence);
	const evidenceUrls = await uploadEvidence(evidence, playerId);
	DEBUG && console.log("got urls", evidenceUrls)
	completeChallengeAndClaim(zoneId, challenge, evidenceUrls);
	return;
}

export async function uploadEvidence(evidence: File[], playerId: string) {
	if(!evidence) return [];
	const evidenceUrls = await Promise.all(evidence.map((file, index) => uploadImage(file, playerId, index)));
	return evidenceUrls;
}

async function uploadImage(image: File, playerId: string, index:number) {
	DEBUG && console.log("image name", image.name, "playerid", playerId, "time", Date.now(), "index", index)
	const imageRef = ref(
		storage,
		`images/player${playerId}${Date.now()}${index}.${image.name.split('.').pop()}`
	);
	try {
		const uploadTask = await uploadBytes(imageRef, image);
		console.log("Uploaded bytes to: ", uploadTask.metadata.fullPath);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
	
	let evidenceURL = "";

	try{
		 evidenceURL = await getDownloadURL(imageRef);
	} catch{
		console.error("couldn't get download url");
	}
	return evidenceURL;
}