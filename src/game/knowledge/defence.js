
import _ from 'lodash';

import {isEnough, gainCost} from '../../bdcgin/Gin';
import {checkStorageVolume} from './storage';
import {giveReward} from '../helpers';

export const calcDefBuildCost = (store, item_key) => {
    // console.log(item_key, store.defences, store.defences[item_key], defences[item_key].base_cost);
    
    return _.mapValues(defences[item_key].base_cost, (item_cost, key) => {
        
        let cost = item_cost * Math.pow(0.99, store.permanent.prestige);
        return Math.ceil(cost);
    });
};

export const calcDefBuildDuration = (store, item_key) => {
    // console.log(item_key, store.defences, store.defences[item_key], defences[item_key].base_duration, store.defences[item_key].level);
    
    return defences[item_key].base_duration * (store.defences[item_key].level + 1);
};

export const calcDefBuildPercent = (store, item_key) => {
    let task = _.find(store.constructing, {item_key: item_key});
    
    return ((store.frame - task.start_frame) * 100 / task.duration ).toFixed(0);
    
};

export const buildDefItem = (store, item_key) => {
    
    store.defences[item_key].busy = true;
    store.constructing.push({item_type: 'defences', item_key: item_key, start_frame: store.frame, duration: calcDefBuildDuration(store, item_key)});
    
    // store.defences[item_key].level++;
    return store;
};

export const finishDefItem = (store, item_key) => {
    store.defences[item_key].level++;
    store.defences[item_key].busy = false;
    
    if (!store.permanent.rewards_collected.includes(item_key)) {
        console.log(item_key);
        store.permanent.rewards_collected.push(item_key);
        store = giveReward(store, {"permanent.donate": 10});
    }
    
    console.log(store);
    
    return store;
};




export var defences = {
    def1: {name: "def1", base_cost: {'balances.energy': 1, 'balances.metal': 0, 'balances.crystal': 0, 'balances.fuel': 0}, base_duration: 10, text: 'text', isHidden: (store) => false },
    def2: {name: "def2", base_cost: {'balances.energy': 2, 'balances.metal': 0, 'balances.crystal': 0, 'balances.fuel': 0}, base_duration: 30, text: 'text', isHidden: (store) => false },
    def3: {name: "def3", base_cost: {'balances.energy': 4, 'balances.metal': 0, 'balances.crystal': 0, 'balances.fuel': 0}, base_duration: 90, text: 'text', isHidden: (store) => false },
    def4: {name: "def4", base_cost: {'balances.energy': 8, 'balances.metal': 0, 'balances.crystal': 0, 'balances.fuel': 0}, base_duration: 270, text: 'text', isHidden: (store) => false },
    def5: {name: "def5", base_cost: {'balances.energy': 16, 'balances.metal': 0, 'balances.crystal': 0, 'balances.fuel': 0}, base_duration: 810, text: 'text', isHidden: (store) => false },
    
};