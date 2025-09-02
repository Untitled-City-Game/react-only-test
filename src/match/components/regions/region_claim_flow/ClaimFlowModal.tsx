import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { ZoneData } from "@/scripts/games/connect_four/types";
import { GameBoardContext } from "@/scripts/types/types";
import { ChallengeDeckContext, GameContext } from "@/src/match/Board";
import claimZone from "@/src/match/components/regions/region_claim_flow/claimZone";
import { ModalHeader } from "@/src/match/components/regions/region_claim_flow/ui/ModalHeader";
import Loading from "@/src/match/screens/game_status/Loading";
import {
	Button,
	Container,
	FileInput,
	LoadingOverlay,
	Modal,
	Select,
	Stack
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";

const claimFormValues = {
			zone: "",
			challenge: "",
			evidence: "",
		}
export type ClaimFormValues = typeof claimFormValues;

export default function ClaimFlowModal({
	open,
	close,
	claimedZone,
	challengeTitle
}: {
	open: boolean;
	close: () => void;
	claimedZone?: ZoneData;
	challengeTitle?: string;
}) {
	const props: GameBoardContext = useContext(GameContext);
	const {allTeamsChallengeData} = useContext(ChallengeDeckContext)
	if(props.G.gameCode !== "connect_four"){
		throw new Error("no challenges, game code "+props.G.gameCode);
	}
	const [loading, setLoading] = useState(false);
	
	const claimForm = useForm({
		mode: "controlled",
		initialValues: {
			zone: claimedZone?.id ? String(claimedZone?.id) : claimFormValues.zone,
			challenge: challengeTitle || claimFormValues.challenge,
			evidence: claimFormValues.evidence,
		},
		validate: {
			zone: hasLength({min: 1}, 'Please select a zone'),
			challenge:hasLength({min: 1}, 'Please select a challenge'),
			evidence: hasLength({min: 1}, 'Please include evidence!'),
		}
	});

	useEffect(()=>{
		challengeTitle && claimForm.setValues({challenge: challengeTitle});
	}, [challengeTitle]);
	
	useEffect(()=>{
		claimedZone && claimForm.setValues({zone: String(claimedZone.id)});
	}, [claimedZone]);

	function closeClaim() {
		claimForm.reset();
		close();
	}
	
	const { allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsChallengeData[myTeam]?.challengeHand.map(challenge => challenge.title);
	const zoneSelectOptions = props.G.zoneData.map(zone => {return {value: `${zone.id}`, label: zone.name}});

	async function handleSubmit(values: ClaimFormValues){
		const moves = props.moves as ConnectFourMoves
		setLoading(true);
		await claimZone(props.playerData.data.playerID, moves.completeChallengeAndClaim, Number(values.zone), values.challenge, values.evidence as unknown as File[]);
		setLoading(false);
		closeClaim();
	}

	return (
		<Modal.Root
			opened={open}
			onClose={closeClaim}
			padding={0}
			radius={0}
			centered>
			<Modal.Overlay />
			<Modal.Content>
				<LoadingOverlay visible={loading} loaderProps={{ children: <Loading message="Claiming neighbourhood..." /> }} />
					{ModalHeader(props.playerData.data.teamColor)}
					<Modal.Body>
						<Container pb="md">
						<form onSubmit={claimForm.onSubmit(handleSubmit)}>
							<Stack ta="left">
															<Select label="Claiming neighbourhood" data={zoneSelectOptions} {...claimForm.getInputProps("zone")} defaultValue={String(claimedZone?.id || "")} />

							<Select label="With challenge" data={challengeHand} {...claimForm.getInputProps("challenge")} defaultValue={challengeTitle} />
							<FileInput
								label="Evidence"
								multiple
								{...claimForm.getInputProps("evidence")}
								/>
								<Button type="submit">Submit</Button>
							</Stack>
						</form>
						</Container>
					</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);
}


// <Stepper
// 							active={step}
// 							styles={{
// 								steps: { display: "none" },
// 							}}>
// 							{!challengeTitle ? <Stepper.Step>
// 								<ChooseChallenge
// 									props={props}
// 									radioGroupProps={{...claimForm.getInputProps('challenge')}}
// 								/>
// 							</Stepper.Step> : null}
// 							{!claimedZone ? <Stepper.Step>
// 								<ChooseZone
// 									props={props}
// 									radioGroupProps={{...claimForm.getInputProps('zone')}}
// 								/>
// 							</Stepper.Step> : null}
// 							<Stepper.Step>
// 								<Evidence props={props} radioGroupProps={{...claimForm.getInputProps('zone')}} />
// 							</Stepper.Step>
// 							<Stepper.Completed>
// 								<ConfirmClaim
// 									currentFormValues={claimForm.values}
// 									zoneName={claimForm.values.zone ? props.G.zoneData[Number(claimForm.values.zone)]?.name : ""}
// 								/>
// 							</Stepper.Completed>
// 						</Stepper>