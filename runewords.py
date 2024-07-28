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

UPG = [3 if index < 20 else 2 for index in range(len(RUNES))]
RUNES_INDEX = {rune: i for i, rune in enumerate(RUNES)}

RUNEWORDS = []

def default_inventory():
    return [0 for _ in RUNES]

def load_rws():
    with open("runewords.json") as json_file:
        global RUNEWORDS
        RUNEWORDS = json.load(json_file)
        

def is_rw_possible(rune_inventory: list, runeword: list) -> bool:
    local_inv = rune_inventory.copy()
    rw_runes = runeword.copy()
    while len(rw_runes) > 0:
        highest_rune = max(rw_runes, key=lambda x: RUNES_INDEX[x])
        rw_runes.remove(highest_rune)
        for i in range(RUNES_INDEX[highest_rune]+1, len(RUNES)):
            local_inv[i] = 0
        score = get_el_value(local_inv)
        rune_score = get_rune_el_value(RUNES_INDEX[highest_rune])
        print(f"Score: {score}, Rune: {highest_rune}, Rune Score: {rune_score}")
        if rune_score > score:
            return False
        ## Remove the rune (or El valu equivalent) from the inventory
        current_score_removed = 0
        while current_score_removed < rune_score:
            for i in range(RUNES_INDEX[highest_rune], -1, -1):
                if local_inv[i] > 0:
                    max_remove = min(local_inv[i], (rune_score - current_score_removed) // get_rune_el_value(i))
                    local_inv[i] -= max_remove
                    current_score_removed += get_rune_el_value(i) * max_remove
                    print(f"Removed {max_remove} {RUNES[i]} (equivalent to {highest_rune})")
                    break
            
    return True
    

def get_possible_rws(rune_inventory: list):
    possible_runewords = []
    els = get_el_value(rune_inventory)
    for runeword in RUNEWORDS:
        can_make = is_rw_possible(rune_inventory, runeword['runes'])
        if can_make:
            possible_runewords.append(runeword)
    return possible_runewords
                    
def get_el_value(rune_inventory: list):
    NBRUNES = len(RUNES)
    working_inv = rune_inventory.copy()
    for i in range(1, NBRUNES):
        working_inv[NBRUNES-i-1] += working_inv[NBRUNES-i] * UPG[NBRUNES-i-1]
    return working_inv[0]

def get_rune_el_value(rune: int):
    return get_el_value([1 if i == rune else 0 for i in range(len(RUNES))])
        

if __name__ == "__main__":
    load_rws()
    test_inv = default_inventory()
    test_inv[El] = 0
    test_inv[Eld] = 0
    test_inv[Tir] = 1000000
    test_inv[Nef] = 0
    test_inv[Eth] = 0
    test_inv[Um] = 0
    test_inv[Mal] = 0
    test_inv[Zod] = 0
    #print(get_el_value(test_inv))
    print([rw["name"] for rw in get_possible_rws(test_inv)])