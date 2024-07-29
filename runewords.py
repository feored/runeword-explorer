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
        rune_score = get_el_value(RUNES_INDEX[highest_rune])
        ## print(f"Score: {score}, Rune: {highest_rune}, Rune Score: {rune_score}")
        if rune_score > score:
            return False, []
        ## Remove the rune (or El valu equivalent) from the inventory
        current_score_removed = 0
        while current_score_removed < rune_score:
            for i in range(RUNES_INDEX[highest_rune], -1, -1):
                if local_inv[i] > 0:
                    max_remove = min(local_inv[i], (rune_score - current_score_removed) // get_el_value(i))
                    upgs_done[i] = (rune_score - current_score_removed) // get_el_value(i) - max_remove
                    local_inv[i] -= max_remove
                    current_score_removed += get_el_value(i) * max_remove
                    ## print(f"Removed {max_remove} {RUNES[i]} (equivalent to {highest_rune})")
                    break
            
    return True, upgs_done


def get_possible_rws(rune_inventory: list):
    possible_runewords = []
    for runeword in RUNEWORDS:
        ## print(f"Checking {runeword['name']}")
        can_make, upgs_to_make = is_rw_possible(rune_inventory, runeword['runes'])
        runeword["upgs"] = upgs_to_make 
        if can_make:
            possible_runewords.append(runeword)
    return possible_runewords
                

def runes_list_to_inv(runes: list):
    return [0 if r not in runes else runes.count(r) for r in RUNES]

def inv_empty(rune_inventory: list):
    return

def get_path_rw(rune_inventory: list, rw_runes : list):
    working_inv = rune_inventory.copy()
    working_runes = runes_list_to_inv(rw_runes)
    upgs_done = [0 for _ in RUNES]
    highest_index = max([i for i in range(len(RUNES)) if working_runes[i] > 0])
    # for i in range(len(RUNES)):
    #     if working_runes[i] > 0 and working_inv[i] > 0:
    #         substract = min(working_runes[i], working_inv[i])
    #         working_runes[i] -= substract
    #         working_inv[i] -= substract
    for rune_index in range(highest_index, 0, -1):
        # print("Working inv  : " + str(working_inv))
        # print("Working runes: " + str(working_runes))
        # print("Upgs done    : " + str(upgs_done))
        ## remove runes we already have
        for i in range(len(RUNES)):
            if working_runes[i] > 0 and working_inv[i] > 0:
                substract = min(working_runes[i], working_inv[i])
                working_runes[i] -= substract
                working_inv[i] -= substract
        # print("AFTER CLEANUP")
        # print("Working inv  : " + str(working_inv))
        # print("Working runes: " + str(working_runes))
        # print("Upgs done    : " + str(upgs_done))
        if sum(working_runes) == 0:
            break
        highest_nb = working_runes[rune_index]
        # print("Highest index: " + str(rune_index))
        # print("Highest nb: " + str(highest_nb))
        working_runes[rune_index] = 0
        working_runes[rune_index - 1] += upg_nb(rune_index-1) * highest_nb
        upgs_done[rune_index-1] += highest_nb
        
    
    success = working_inv[0] >= working_runes[0]
    # if success:
    #     print("Success")
    # else:
    #     print("Failure")
    #     print("Lacking " + str(working_runes[0] - working_inv[0]) + " Els")
    #     print("Aka")
    #     lacking = els_decompose(working_runes[0] - working_inv[0])
    #     print(", ".join([f"{lacking[i]} {RUNES[i]}" for i in range(len(RUNES)) if lacking[i] > 0]))
    # print(format_upgs(upgs_done))
        
def els_decompose(els: int):
    runes = [0 if i != "El" else els for i in RUNES]
    for i in range(1, len(RUNES)):
        if runes[i-1] >= upg_nb(i-1):
            runes[i] += runes[i-1] // upg_nb(i-1)
            runes[i-1] = runes[i-1] % upg_nb(i-1)
    return runes

def format_upgs(upgs):
    return "\n".join([f"{upgs[i] * upg_nb(i)} {RUNES[i]} * {upg_nb(i)} ->  {upgs[i]} {RUNES[i+1]}" for i in range(len(RUNES)-1) if upgs[i] > 0])
        


if __name__ == "__main__":
    load_rws()
    test_inv = default_inventory()
    test_inv[El] = 16
    test_inv[Eld] = 4
    test_inv[Tir] = 0
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
    
    test_inv2 = [0 if r != El else 64 for r in range(len(RUNES))]
    t = time.perf_counter()
    for rw in RUNEWORDS:
        get_path_rw(test_inv, rw["runes"])
    elapsed_time = (time.perf_counter() - t)/len(RUNEWORDS)
    print("Average time path: " + f'{elapsed_time:.20f}')
    t = time.perf_counter() 
    possible_rws = get_possible_rws(test_inv)
    elapsed_time = (time.perf_counter() - t)/len(RUNEWORDS)
    print("Average time possiblecheck: " + f'{elapsed_time:.20f}')
    #get_path_rw(test_inv, ["Tir", "Nef", "Nef", "Eth", "Eth", "Eth"])
    #print(get_el_value(test_inv))
    # possible_rws = get_possible_rws(test_inv)
    # possible_rws.sort(key=lambda x: sum(get_el_value(RUNES_INDEX[r]) for r in x["runes"]), reverse=True)
    # for rw in possible_rws:
    #     print(rw["name"] + " " + "/".join(rw["runes"]))
    #     #print(rw["upgs"])
        
