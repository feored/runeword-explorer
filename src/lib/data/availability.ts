import { ALL_MODES, LoDPatch, D2RLoDPatch, RotWPatch, type PlayMode } from './rulesets.ts';

type Period<P> = {
	since: P;
	until?: P;
	modes: PlayMode[];
};

export type Availability =
	| { edition: 'lod'; periods: Period<LoDPatch>[] }
	| { edition: 'd2r-lod'; periods: Period<D2RLoDPatch>[] }
	| { edition: 'rotw'; periods: Period<RotWPatch>[] };

export const LOD_ALL_MODES_FROM_109: Availability = {
	edition: 'lod',
	periods: [{ since: LoDPatch.V1_09, modes: ALL_MODES }]
};
export const LOD_ALL_MODES_FROM_110: Availability = {
	edition: 'lod',
	periods: [{ since: LoDPatch.V1_10, modes: ALL_MODES }]
};
export const LOD_ALL_MODES_FROM_111: Availability = {
	edition: 'lod',
	periods: [{ since: LoDPatch.V1_11, modes: ALL_MODES }]
};
export const LOD_LADDER_FROM_110: Availability = {
	edition: 'lod',
	periods: [{ since: LoDPatch.V1_10, modes: ['online-ladder'] }]
};
export const D2R_ALL_MODES_FROM_24: Availability = {
	edition: 'd2r-lod',
	periods: [{ since: D2RLoDPatch.V2_4, modes: ALL_MODES }]
};
export const D2R_24_UNLOCKED_26: Availability = {
	edition: 'd2r-lod',
	periods: [
		{ since: D2RLoDPatch.V2_4, until: D2RLoDPatch.V2_6, modes: ['offline', 'online-ladder'] },
		{ since: D2RLoDPatch.V2_6, modes: ALL_MODES }
	]
};
export const D2R_OFFLINE_LADDER_FROM_26: Availability = {
	edition: 'd2r-lod',
	periods: [{ since: D2RLoDPatch.V2_6, modes: ['offline', 'online-ladder'] }]
};
export const ROTW_ALL_MODES_FROM_31: Availability = {
	edition: 'rotw',
	periods: [{ since: RotWPatch.V3_1, modes: ALL_MODES }]
};
export const ROTW_31_UNLOCKED_33: Availability = {
	edition: 'rotw',
	periods: [
		{ since: RotWPatch.V3_1, until: RotWPatch.V3_3, modes: ['offline', 'online-ladder'] },
		{ since: RotWPatch.V3_3, modes: ALL_MODES }
	]
};
export const MOSAIC_D2R: Availability = {
	edition: 'd2r-lod',
	periods: [
		{ since: D2RLoDPatch.V2_6, until: D2RLoDPatch.V3_1, modes: ['offline', 'online-ladder'] },
		{ since: D2RLoDPatch.V3_1, until: D2RLoDPatch.V3_1_1, modes: ['offline'] },
		{ since: D2RLoDPatch.V3_1_1, modes: ['offline', 'online-non-ladder'] }
	]
};
export const MOSAIC_ROTW: Availability = {
	edition: 'rotw',
	periods: [
		{ since: RotWPatch.V3_1, until: RotWPatch.V3_1_1, modes: ['offline'] },
		{ since: RotWPatch.V3_1_1, modes: ['offline', 'online-non-ladder'] }
	]
};
