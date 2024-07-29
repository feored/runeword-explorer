import dataclasses
import json

El, Eld, Tir, Nef, Eth, Ith, Tal, Ral, Ort, Thul, Amn, \
Sol, Shael, Dol, Hel, Io, Lum, Ko, Fal, Lem, Pul, Um, \
Mal, Ist, Gul, Vex, Ohm, Lo, Sur, Ber, Jah, Cham, Zod = range(33) 

RUNES = ['El', 'Eld', 'Tir', 'Nef', 'Eth',
         'Ith', 'Tal', 'Ral', 'Ort', 'Thul',
         'Amn', 'Sol', 'Shael', 'Dol', 'Hel',
         'Io', 'Lum', 'Ko', 'Fal', 'Lem', 'Pul',
         'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
         'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod']


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
        

def is_rw_possible(rune_inventory: list, runeword: list) -> tuple[bool, list]:
    local_inv = rune_inventory.copy()
    rw_runes = runeword.copy()
    upgs_done = [0 for _ in RUNES]
    while len(rw_runes) > 0:
        highest_rune = max(rw_runes, key=lambda x: RUNES_INDEX[x])
        rw_runes.remove(highest_rune)
        for i in range(RUNES_INDEX[highest_rune]+1, len(RUNES)):
            local_inv[i] = 0
        score = get_inv_el_value(local_inv)
        rune_score = get_rune_el_value(RUNES_INDEX[highest_rune])
        print(f"Score: {score}, Rune: {highest_rune}, Rune Score: {rune_score}")
        if rune_score > score:
            return False, []
        ## Remove the rune (or El valu equivalent) from the inventory
        current_score_removed = 0
        while current_score_removed < rune_score:
            for i in range(RUNES_INDEX[highest_rune], -1, -1):
                if local_inv[i] > 0:
                    max_remove = min(local_inv[i], (rune_score - current_score_removed) // get_rune_el_value(i))
                    upgs_done[i] = (rune_score - current_score_removed) // get_rune_el_value(i) - max_remove
                    local_inv[i] -= max_remove
                    current_score_removed += get_rune_el_value(i) * max_remove
                    print(f"Removed {max_remove} {RUNES[i]} (equivalent to {highest_rune})")
                    break
            
    return True, upgs_done


def get_possible_rws(rune_inventory: list):
    possible_runewords = []
    els = get_el_value(rune_inventory)
    for runeword in RUNEWORDS:
        print(f"Checking {runeword['name']}")
        can_make, upgs_to_make = is_rw_possible(rune_inventory, runeword['runes'])
        runeword["upgs"] = upgs_to_make 
        if can_make:
            possible_runewords.append(runeword)
    return possible_runewords
                    



if __name__ == "__main__":
    load_rws()
    test_inv = default_inventory()
    test_inv[El] = 3
    test_inv[Eld] = 1
    test_inv[Tir] = 2
    test_inv[Nef] = 4
    test_inv[Eth] = 2
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
    
    test_inv2 = [0 if r != El else 64 for r in range(len(RUNES))]
    
    #print(get_el_value(test_inv))
    possible_rws = get_possible_rws(test_inv)
    possible_rws.sort(key=lambda x: sum(get_rune_el_value(RUNES_INDEX[r]) for r in x["runes"]), reverse=True)
    for rw in possible_rws:
        print(rw["name"] + " " + "/".join(rw["runes"]))
        #print(rw["upgs"])
        
