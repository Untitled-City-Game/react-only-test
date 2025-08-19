import { storage } from "@/scripts/firebase";
import { ClaimStateMoves } from "@/scripts/games/connect_four/connect_four";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function claimZone(playerId : string, completeChallengeAndClaim : ClaimStateMoves["completeChallengeAndClaim"], zoneId: number, challenge : string, evidence : File[] ) {
	console.log("claiming zone on client", zoneId, challenge, evidence);
	const evidenceUrls = await uploadEvidence(evidence, playerId)
	completeChallengeAndClaim(zoneId, challenge, evidenceUrls);
	return;
}

export async function uploadEvidence(evidence: File[], playerId: string) {
	if(!evidence) return [];
	const evidenceUrls = await Promise.all(evidence.map(file => uploadImage(file, playerId)));
	return evidenceUrls;
}

async function uploadImage(image: File, playerId: string) {
	const imageRef = ref(
		storage,
		`images/player${playerId}${Date.now()}.${image.name.split('.').pop()}`
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