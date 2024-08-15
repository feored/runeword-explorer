import { read as d2s_read } from '@dschu012/d2s/lib/d2/d2s';
import { constants as CONSTANTS_99 } from '@dschu012/d2s/lib/data/versions/99_constant_data';
import { constants as CONSTANTS_96 } from '@dschu012/d2s/lib/data/versions/96_constant_data';
import type { IConstantData, IItem } from '@dschu012/d2s/lib/d2/types';
import { BitReader } from '@dschu012/d2s/lib/binary/bitreader';
import { getConstantData, setConstantData } from '@dschu012/d2s/lib/d2/constants';
import { readItems } from '@dschu012/d2s/lib/d2/items';

const FILE_HEADER = 'aa55aa55';
const DEFAULT_CONFIG = {
	extendedStash: false,
	sortProperties: true
};

export interface ParsedItems {
	items: IItem[];
	error: boolean;
	error_message?: string;
}

export class d2s_reader {
	constructor() {
		setConstantData(0x60, CONSTANTS_96);
		setConstantData(0x61, CONSTANTS_96);
		setConstantData(0x62, CONSTANTS_96);
		setConstantData(0x63, CONSTANTS_99);
	}

	async read_character_items(buffer: Uint8Array): Promise<ParsedItems> {
		let response: ParsedItems = { items: [], error: false };
		try {
			let character = await d2s_read(buffer);
			response.items = character.items;
			return response;
		} catch (e: unknown) {
			response.error = true;
			if (typeof e === 'string') {
				response.error_message = e;
			} else if (e instanceof Error) {
				response.error_message = e.message;
			}
			return response;
		}
	}

	async read_shared_stash_items(buffer: Uint8Array): Promise<ParsedItems> {
		const reader = new BitReader(buffer);
		let stash: ParsedItems = { items: [], error: false };
		let version: number = 0;
		let constants: IConstantData;
		while (reader.bits.length != reader.offset) {
			if (reader.ReadUInt32().toString(16).padStart(8, '0').toLowerCase() != FILE_HEADER) {
				stash.error = true;
				stash.error_message = 'Unexpected file header.';
				return stash;
			}
			reader.SkipBytes(4);
			version = reader.ReadUInt32();
			if (version > 0x63) {
				version = 0x63;
			}
			reader.SkipBytes(52);
			try {
				let next_page_items = await readItems(
					reader,
					version,
					getConstantData(version),
					DEFAULT_CONFIG
				);
				stash.items = stash.items.concat(next_page_items);
			} catch (e: unknown) {
				stash.error = true;
				if (typeof e === 'string') {
					stash.error_message = e;
				} else if (e instanceof Error) {
					stash.error_message = e.message;
				}
				return stash;
			}
		}
		return stash;
	}
}
