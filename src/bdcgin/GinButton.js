
import React, { Component } from 'react';

import _ from 'lodash';

import {isEnough} from "./Gin";

import {storage, calcStorageCost, buyStorage} from '../game/knowledge/storage';
import {buildings, buildItem, buildNewItem, calcBuildCost, calcBuildDuration, calcProfit, calcBuildPercent, collectItem, calcCycle} from "../game/knowledge/buildings";
import {defences, calcDefBuildCost, buildDefItem, calcDefBuildPercent, calcDefBuildDuration} from '../game/knowledge/defence';
import {hire, fire} from "../game/knowledge/managers";
import {calcUpgradeCost, upgrade} from "../game/knowledge/upgrades";

export default class GinButton extends Component {
    render() {
        let item = this.props.item;
        let state = this.props.state;
        return (
            <button style={{padding: '4px 4px'}}
                    className={(item.isDisabled && item.isDisabled(state)) ? 'disabled' : (item.cost ? isEnough(state, item.cost) ? '' : 'disabled' : '')}
                    onClick={() => { this.props.gin.onClick(item); }}>
                {item.name}
            </button>
        );
    }
}



export class CollectGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name: 'Collect ' + _.values(calcProfit(this.props.state, this.props.item_key))[0] + ' ' + this.props.state.buildings[this.props.item_key].type,
                    isDisabled: (state) => state.buildings[this.props.item_key].fullness < calcCycle(state, this.props.item_key),
                    cost: false,
                    onClick: (state) => collectItem(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class StorageGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name:    'Expand',
                    cost:    calcStorageCost(this.props.state, this.props.item_key),
                    onClick: (state) => buyStorage(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class BuildingGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name:    this.props.state.buildings[this.props.item_key].busy
                                 ? 'Build ' + calcBuildPercent(this.props.state, this.props.item_key) + '%'
                                 : 'Build ' + (calcBuildDuration(this.props.state, this.props.item_key)/10).toFixed(0) + ' sec',
                    cost:    calcBuildCost(this.props.state, this.props.item_key),
                    isDisabled: (state) => this.props.state.buildings[this.props.item_key].busy || this.props.state.constructing.length >= this.props.state.permanent.constructors,
                    onClick: (state) => buildItem(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class BuildingDefGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name:    this.props.state.defences[this.props.item_key].busy
                                 ? 'Build ' + calcDefBuildPercent(this.props.state, this.props.item_key) + '%'
                                 : 'Build ' + (calcDefBuildDuration(this.props.state, this.props.item_key)/10).toFixed(0) + ' sec',
                    cost:    calcDefBuildCost(this.props.state, this.props.item_key),
                    isDisabled: (state) => this.props.state.defences[this.props.item_key].busy || this.props.state.constructing.length >= this.props.state.permanent.constructors,
                    onClick: (state) => buildDefItem(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class NewBuildingGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name: 'Build',
                    isDisabled: (state) => this.props.state.constructing.length >= this.props.state.permanent.constructors,
                    onClick: (state) => buildNewItem(state, this.props.item_key),
                    cost: this.props.item.base_cost
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class UnlockGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name:    'Unlock Slot ' + Math.pow(10, this.props.state.slots + 1) + ' energy',
                    cost:    {'balances.energy': Math.pow(10, this.props.state.slots + 1)},
                    onClick: (state) => {
                        state.slots = state.slots+1;
                        state.buildings.push('empty');
                        return state;
                    },
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class AutoBuildingGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name:    this.props.state.buildings[this.props.item_key].auto_build
                                 ? 'Off Auto Build'
                                 : 'On Auto Build',
                    onClick: (state) => { state.buildings[this.props.item_key].auto_build = !state.buildings[this.props.item_key].auto_build; return state; }
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class HireGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name: 'Hire $' + Math.pow(10, this.props.state.managers.length+1) + ' money',
                    cost: {'balances.money': Math.pow(10, this.props.state.managers.length+1)},
                    onClick: (state) => hire(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class FireGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name: 'Fire!',
                    onClick: (state) => fire(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}

export class UpGinButton extends Component {
    render() {
        return (
            <GinButton
                item={{
                    name: 'Upgrade',
                    cost:    calcUpgradeCost(this.props.state, this.props.item_key),
                    onClick: (state) => upgrade(state, this.props.item_key)
                }}
                state={this.props.state}
                gin={this.props.gin}
            />
        );
    }
}
