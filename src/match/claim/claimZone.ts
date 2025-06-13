import { storage } from "@/scripts/firebase";
import { ClaimStateMoves } from "@/scripts/games/connect_four";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function claimZone(playerId : `${number}`, completeChallengeAndClaim : ClaimStateMoves["completeChallengeAndClaim"], zoneId: number, challenge : string, evidence : File ) {
	console.log("claiming zone on client", zoneId, challenge, evidence);
	const imageRef = ref(
		storage,
		`images/zone${zoneId}player${playerId}${Date.now()}.jpg`
	);
	try {
		const uploadTask = await uploadBytes(imageRef, evidence);
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

	completeChallengeAndClaim(zoneId, challenge, evidenceURL);
	return;
}
