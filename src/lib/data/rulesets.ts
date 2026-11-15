export const EDITIONS = {
	lod: 'Lord of Destruction',
	'd2r-lod': 'Resurrected',
	rotw: 'Reign of the Warlock'
} as const;
export type Edition = keyof typeof EDITIONS;

export const MODES = {
	offline: 'Offline',
	'online-ladder': 'Online Ladder',
	'online-non-ladder': 'Online Non-Ladder'
} as const;
export type PlayMode = keyof typeof MODES;
export const ALL_MODES: PlayMode[] = ['offline', 'online-ladder', 'online-non-ladder'];

export enum LoDPatch {
	V1_09,
	V1_10,
	V1_11,
	V1_14d
}
export enum D2RLoDPatch {
	V2_4,
	V2_6,
	V3_1,
	V3_1_1,
	V3_3
}
export enum RotWPatch {
	V3_1,
	V3_1_1,
	V3_3
}
export const PATCHES = {
	lod: {
		'1.09': LoDPatch.V1_09,
		'1.10': LoDPatch.V1_10,
		'1.11': LoDPatch.V1_11,
		'1.14d': LoDPatch.V1_14d
	},
	'd2r-lod': {
		'2.4': D2RLoDPatch.V2_4,
		'2.6': D2RLoDPatch.V2_6,
		'3.1': D2RLoDPatch.V3_1,
		'3.1.1': D2RLoDPatch.V3_1_1,
		'3.3': D2RLoDPatch.V3_3
	},
	rotw: {
		'3.1': RotWPatch.V3_1,
		'3.1.1': RotWPatch.V3_1_1,
		'3.3': RotWPatch.V3_3
	}
} as const;

export type PatchId =
	| keyof (typeof PATCHES)['lod']
	| keyof (typeof PATCHES)['d2r-lod']
	| keyof (typeof PATCHES)['rotw'];

export interface Profile {
	edition: Edition;
	patch: string;
	mode: PlayMode;
}
export const DEFAULT_PROFILE: Profile = {
	edition: 'rotw',
	patch: '3.3',
	mode: 'online-ladder'
};

export function patch_value(edition: Edition, patch: string) {
	return (PATCHES[edition] as Readonly<Record<string, number>>)[patch];
}

export function patch_id(edition: Edition, patch: number): PatchId {
	return Object.entries(PATCHES[edition]).find(([, value]) => value === patch)![0] as PatchId;
}

export function patch_ids(edition: Edition) {
	return Object.keys(PATCHES[edition]);
}
