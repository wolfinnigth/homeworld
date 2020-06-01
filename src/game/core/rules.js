
import _ from 'lodash';


import {isEnough, gainCost} from '../../bdcgin/Gin';

import {storage, calcStorageCapacity} from '../knowledge/storage';
import {buildings, finishItem, collectItem, calcBuildCost, buildItem, calcCycle} from '../knowledge/buildings';
import {defences, finishDefItem, calcDefBuildCost, buildDefItem} from '../knowledge/defence';
import {events, genEvent} from '../knowledge/events';
import {managers, generateManager} from '../knowledge/managers';

import {shuffleObject} from '../helpers';


export const rules = {
    matrix_show: { onFrame: (store, params = {}) => { store.matrix_show = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); return store; }},
    
    income: {
        onFrame: (store, params = {}) => {
            let automated_buildings = [];
            _.each(store.managers, (manager, key) => {
                // console.log(manager, key);
                _.each(manager.auto_collect, (automated_building) => {
                    automated_buildings.push(automated_building);
                })
            });
            
            
            _.each(_.pickBy(store.buildings, (item) => item !== 'empty'), (building, key) => {
                if (building.level > 0 && store.buildings[key].fullness < calcCycle(store, key)) {
                    store.buildings[key].fullness++;
                }
    
                /*
                // /* auto_collect
                if (store.buildings[key].fullness >= calcCycle(store, key) && automated_buildings.includes(key)) { // store.managers[key].hired
                    store = collectItem(store, key);
                }
                */
            });
            return store;
        },
        
        onTick: (store, params = {}) => {
            
            return store;
        }
    },
    
    
    constructing: {
        onFrame: (store, params = {}) => {
            _.each(store.constructing, (task, key) => {
                if (task.start_frame + task.duration <= store.frame) {
                    if (task.item_type == 'buildings') {
                        store = finishItem(store, task.item_key);
                    }
                    if (task.item_type == 'defences') {
                        store = finishDefItem(store, task.item_key);
                    }
                }
            });
    
            _.remove(store.constructing, (task) => task.start_frame + task.duration <= store.frame);
            
    
    
            // /* auto_build
            if (store.constructing.length < store.permanent.constructors) {
                let automated_buildings = [];
                _.each(store.managers, (manager, key) => {
                    // console.log(manager, key);
                    _.each(manager.auto_build, (automated_building) => {
                        automated_buildings.push(automated_building);
                    })
                });
                
                store.automated_buildings = automated_buildings;
    
                _.each(shuffleObject(_.pickBy(store.buildings, {busy: false, auto_build: true})), (building, key) => {
                    if (automated_buildings.includes(key) && store.constructing.length < store.permanent.constructors && isEnough(store, calcBuildCost(store, key))) {
                        store = buildItem(store, key);
                    }
                });
            }
            
            return store;
        },
        
        onTick: (store, params = {}) => {
            
            return store;
        }
    },
    
    
    events: {
        onFrame: (store, params = {}) => {
            return store;
        },
        
        onTick: (store, params = {}) => {
            if (store.event === false && store.last_event_tick + 30 < store.tick) {
                if (_.random(100000) + (store.tick - store.last_event_tick) >= 100000) {
                    store.event = genEvent(store);
                }
            }
            
            if (store.event !== false && store.event.opened !== true && store.event.start_tick + 7 < store.tick) {
                store.event = false;
                store.last_event_tick = store.tick;
            }
            
            return store;
        }
    },
    
    
    
    
    
};