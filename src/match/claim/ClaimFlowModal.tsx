import { ClaimStateMoves } from "@/scripts/connect_four";
import { storage } from "@/scripts/firebase";
import { MetroGameBoardProps, ZoneData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { ChooseChallenge } from "@/src/match/claim/ChooseChallenge";
import ConfirmClaim from "@/src/match/claim/ConfirmClaim";
import { Evidence } from "@/src/match/claim/Evidence";
import Header from "@/src/userInterface/Header";
import { Button, Center, Group, Modal, Stack, Stepper } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";

export type Form = UseFormReturnType<
	{
		challenge: string;
		evidence: string;
	},
	(values: { challenge: string; evidence: string }) => {
		challenge: string;
		evidence: string;
	}
>;

export default function ClaimFlowModal({
	open,
	close,
	claimedZone,
}: {
	open: boolean;
	close: () => void;
	claimedZone?: ZoneData;
}) {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const [step, setStep] = useState(0);
	const claimForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			challenge: "None",
			evidence: "",
		},
	});
	const zoneName = claimedZone?.name;
	async function claimZone(zone: number, challenge: string, evidence: File) {
		console.log("claiming zone on client", zone, challenge, evidence);
		const imageRef = ref(
			storage,
			`images/zone${zone}player${props.playerID}${Date.now()}.jpg`
		);
		try {
			const uploadTask = await uploadBytes(imageRef, evidence);
			console.log("Uploaded bytes to: ", uploadTask.metadata.fullPath);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
		const evidenceURL = await getDownloadURL(imageRef);

		moves.completeChallengeAndClaim(zone, challenge, evidenceURL);
		closeClaim();
	}

	function closeClaim(){
		console.log("closing claim form");
		claimForm.reset();
		setStep(0);
		close();
	}

	return claimedZone ? (
		<Modal
			opened={open}
			onClose={closeClaim}
			size="xl"
			title={`Claim ${zoneName}`}
			fullScreen
			radius={0}>
			<Header>
				<h1>Claiming {zoneName}</h1>
			</Header>
			<Center>
				<Stack pb="md">
					<Stepper
						active={step}
						styles={{
							steps: { display: "none" },
						}}>
						<Stepper.Step>
							<ChooseChallenge
								props={props}
								claimForm={claimForm}
							/>
						</Stepper.Step>
						<Stepper.Step>
							<Evidence props={props} claimForm={claimForm} />
						</Stepper.Step>
						<Stepper.Completed>
							<ConfirmClaim
								claimForm={claimForm}
								claimedZone={claimedZone}
							/>
						</Stepper.Completed>
					</Stepper>
					<Group justify="center" mt="xl">
						{step !== 2 ? (
							<>
								<Button onClick={() => setStep(step + 1)}>
									Next step
								</Button>
								{step === 0 ? (
									<Button onClick={closeClaim}>Back</Button>
								) : (
									<Button onClick={() => setStep(step - 1)}>
										Back
									</Button>
								)}
							</>
						) : (
							<Button
								onClick={() =>
									claimZone(
										claimedZone.id,
										claimForm.getValues().challenge,
										claimForm.getValues()
											.evidence as unknown as File
									)
								}>
								Claim
							</Button>
						)}
					</Group>
				</Stack>
			</Center>
		</Modal>
	) : null;
}
