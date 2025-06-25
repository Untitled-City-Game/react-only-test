import { storage } from "@/scripts/firebase";
import { ClaimStateMoves } from "@/scripts/games/connect_four/connect_four";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function claimZone(playerId : `${number}`, completeChallengeAndClaim : ClaimStateMoves["completeChallengeAndClaim"], zoneId: number, challenge : string, evidence : File[] ) {
	console.log("claiming zone on client", zoneId, challenge, evidence);
	const evidenceUrls = await uploadEvidence(evidence, zoneId, playerId)
	completeChallengeAndClaim(zoneId, challenge, evidenceUrls);
	return;
}

async function uploadEvidence(evidence: File[], zoneId: number, playerId: `${number}`) {
	const evidenceUrls = await Promise.all(evidence.map(file => uploadImage(file, zoneId, playerId)));
	return evidenceUrls;
}

async function uploadImage(image: File, zoneId: number, playerId: `${number}`) {
	const imageRef = ref(
		storage,
		`images/zone${zoneId}player${playerId}${Date.now()}.jpg`
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