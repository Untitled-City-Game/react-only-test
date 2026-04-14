import { addTeamPhoto } from "@/scripts/games/shared_moves/addTeamPhoto";
import { endGame } from "@/scripts/games/shared_moves/manageGame";
import { StripContext } from "@/scripts/types/types";

export const sharedMoves = {
	addTeamPhoto,
	endGame,
}

export type SharedMoves = StripContext<typeof sharedMoves>;
