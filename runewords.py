import dataclasses
import json
import time


El, Eld, Tir, Nef, Eth, Ith, Tal, Ral, Ort, Thul, Amn, \
Sol, Shael, Dol, Hel, Io, Lum, Ko, Fal, Lem, Pul, Um, \
Mal, Ist, Gul, Vex, Ohm, Lo, Sur, Ber, Jah, Cham, Zod = range(33) 

RUNES = ['El', 'Eld', 'Tir', 'Nef', 'Eth',
         'Ith', 'Tal', 'Ral', 'Ort', 'Thul',
         'Amn', 'Sol', 'Shael', 'Dol', 'Hel',
         'Io', 'Lum', 'Ko', 'Fal', 'Lem', 'Pul',
         'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
         'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod']

GEM_Q = ['Chipped', 'Flawed', '', 'Flawless']
GEM_TYPE = ['Topaz', 'Amethyst', 'Sapphire', 'Ruby', 'Emerald', 'Diamond']

UPG_COST = ["" for i in range(9)] + [" ".join([i,j]).strip() for i in GEM_Q for j in GEM_TYPE]


RUNES_INDEX = {rune: i for i, rune in enumerate(RUNES)}

RUNEWORDS = []


def upg_nb(rune_index:int) -> int:
    return 3 if rune_index < 20 else 2

def get_el_value(rune_index: int):
    return (3 ** (min(rune_index, 20))) * (2 ** (max(rune_index - 20, 0)))

def get_inv_el_value(rune_inventory: list):
    return sum(get_el_value(i) * rune_inventory[i] for i in range(len(RUNES)))

def default_inventory():
    return [0 for _ in RUNES]

def load_rws():
    with open("runewords.json") as json_file:
        global RUNEWORDS
        RUNEWORDS = json.load(json_file)

def get_path_rw(rune_inventory: list, rw_runes : list):
    working_inv = rune_inventory.copy()
    working_runes =  [0 if r not in rw_runes else rw_runes.count(r) for r in RUNES]
    upgs_done = [0 for _ in RUNES]
    highest_index = max([i for i in range(len(RUNES)) if working_runes[i] > 0])

    for rune_index in range(highest_index, 0, -1):
        ## remove runes we already have
        for i in range(len(RUNES)):
            if working_runes[i] > 0 and working_inv[i] > 0:
                substract = min(working_runes[i], working_inv[i])
                working_runes[i] -= substract
                working_inv[i] -= substract
                
        highest_nb = working_runes[rune_index]
        working_runes[rune_index] = 0
        working_runes[rune_index - 1] += upg_nb(rune_index-1) * highest_nb
        upgs_done[rune_index-1] += highest_nb
    
    success = working_inv[0] >= working_runes[0]
    lacking = default_inventory()
    return (success, upgs_done, working_runes[0] - working_inv[0])
        
def els_decompose(els: int):
    runes = [0 if i != "El" else els for i in RUNES]
    for i in range(1, len(RUNES)):
        if runes[i-1] >= upg_nb(i-1):
            runes[i] += runes[i-1] // upg_nb(i-1)
            runes[i-1] = runes[i-1] % upg_nb(i-1)
    return runes

def format_lacking(lacking):
    return ", ".join([f"{lacking[i]} {RUNES[i]}" for i in range(len(RUNES)) if lacking[i] > 0])

def format_upgs(upgs):
    return "\n".join([f"{upgs[i] * upg_nb(i)} {RUNES[i]}{' '.join([' +', str(upgs[i]), UPG_COST[i]]) if upgs[i] > 0 and UPG_COST[i] != '' else ''}  ->  {upgs[i]} {RUNES[i+1]}" for i in range(len(RUNES)-1) if upgs[i] > 0])

if __name__ == "__main__":
    load_rws()
    test_inv = default_inventory()
    test_inv[El] = 16
    test_inv[Eld] = 4
    test_inv[Tir] = 4
    test_inv[Nef] = 1
    test_inv[Eth] = 3
    test_inv[Ith] = 2
    test_inv[Tal] = 4
    test_inv[Ral] = 5
    test_inv[Ort] = 4
    test_inv[Thul] = 5
    test_inv[Amn] = 5
    test_inv[Sol] = 2
    test_inv[Shael] = 2
    test_inv[Dol] = 2
    test_inv[Hel] = 6
    test_inv[Io] = 2
    test_inv[Lum] = 3
    test_inv[Ko] = 4
    test_inv[Fal] = 3
    test_inv[Lem] = 4
    test_inv[Pul] = 3
    test_inv[Um] = 4
    test_inv[Mal] = 5
    test_inv[Ist] = 3
    test_inv[Gul] = 2
    test_inv[Vex] = 1
    test_inv[Ohm] = 1
    test_inv[Lo] = 2
    test_inv[Sur] = 0
    test_inv[Ber] = 1
    test_inv[Jah] = 0
    test_inv[Cham] = 0
    test_inv[Zod] = 0
    test_inv2 = default_inventory()
    test_inv2[El] = 9912978591
    #test_inv2[Um] = 64
    RUNEWORDS.sort(key=lambda x: sum([get_el_value(RUNES_INDEX[r]) for r in x["runes"]]), reverse=True)
    for rw in RUNEWORDS:
        print("Checking: " + rw['name'] + " (" + " / ".join(rw['runes']) + ")")
        success, upgs, lacking = get_path_rw(test_inv2, rw['runes'])
        print(f"Success: {success}")
        if success:
            if sum(upgs) > 0:
                print("Upgrades:")
                print(format_upgs(upgs))
        else:
            print("Lacking: " + str(lacking) + " Els, or...")
            print(format_lacking(els_decompose(lacking)))