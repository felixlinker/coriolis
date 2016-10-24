import React from 'react';
import cn from 'classnames';
import TranslatedComponent from './TranslatedComponent';
import { jumpRange } from '../shipyard/Calculations';
import { diffDetails } from '../utils/SlotFunctions';
import AvailableModulesMenu from './AvailableModulesMenu';
import { ListModifications } from './SvgIcons';
import Slider from './Slider';
import { Modifications } from 'coriolis-data/dist';

/**
 * Standard Slot
 */
export default class StandardSlot extends TranslatedComponent {

  static propTypes = {
    slot: React.PropTypes.object,
    modules: React.PropTypes.array.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    onOpen: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    ship: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool,
    warning: React.PropTypes.func,
  };

  /**
   * Render the slot
   * @return {React.Component} Slot component
   */
  render() {
    let { translate, formats, units } = this.context.language;
    let { modules, slot, warning, onSelect, ladenMass, ship } = this.props;
    let m = slot.m;
    let classRating = m.class + m.rating;
    let menu;
    let validMods = m == null ? [] : (Modifications.validity[m.grp] || []);

    if (this.props.selected) {
      menu = <AvailableModulesMenu
        className='standard'
        modules={modules}
        shipMass={ship.ladenMass}
        m={m}
        onSelect={onSelect}
        warning={warning}
        diffDetails={diffDetails.bind(ship, this.context.language)}
      />;
    }

    return (
      <div className={cn('slot', { selected: this.props.selected })} onClick={this.props.onOpen}>
        <div className={cn('details-container', { warning: warning && warning(slot.m) })}>
          <div className={'sz'}>{slot.maxClass}</div>
          <div>
            <div className='l'>{classRating} {translate(m.grp == 'bh' ? m.grp : m.name || m.grp)}</div>
            <div className={'r'}>{m.getMass() || m.fuel || 0}{units.T}</div>
	    <div/>
            <div className={'cb'}>
                { m.grp == 'bh' && m.name ? <div className='l'>{translate(m.name)}</div> : null }
                { m.optmass ? <div className='l'>{translate('optimal mass')}: {m.optmass}{units.T}</div> : null }
                { m.maxmass ? <div className='l'>{translate('max mass')}: {m.maxmass}{units.T}</div> : null }
                { m.range ? <div className='l'>{translate('range')}: {m.range}{units.km}</div> : null }
                { m.time ? <div className='l'>{translate('time')}: {formats.time(m.time)}</div> : null }
                { m.eff ? <div className='l'>{translate('efficiency')}: {m.eff}</div> : null }
                { m.getPowerGeneration() > 0 ? <div className='l'>{translate('power')}: {formats.round(m.getPowerGeneration())}{units.MW}</div> : null }
                { m.maxfuel ? <div className='l'>{translate('max')} {translate('fuel')}: {m.maxfuel}{units.T}</div> : null }
                { m.weaponcapacity ? <div className='l'>{translate('WEP')}: {m.weaponcapacity}{units.MJ} / {m.weaponrecharge}{units.MW}</div> : null }
                { m.systemcapacity ? <div className='l'>{translate('SYS')}: {m.systemcapacity}{units.MJ} / {m.systemrecharge}{units.MW}</div> : null }
                { m.enginecapacity ? <div className='l'>{translate('ENG')}: {m.enginecapacity}{units.MJ} / {m.enginerecharge}{units.MW}</div> : null }
	        { validMods.length > 0 ? <div className='r' ><ListModifications /></div> : null }
            </div>
          </div>
        </div>
        {menu}
      </div>
    );
  }
  // {validMods.length > 0 ? <div className='cb' ><Slider onChange={this._updateSliderValue.bind(this)} min={-1} max={1} percent={this._getSliderValue()}/></div> : null }

  /**
   * Update power usage modification given a slider value.
   * Note that this is a temporary function until we have a slider section
   * @param {Number} value The value of the slider
   */
  _updateSliderValue(value) {
    let m = this.props.slot.m;
    if (m) {
      m.setModValue(2, value * 2 - 1);
    }
    this.props.onChange();
  }

  /**
   * Obtain slider value from a power usage modification.
   * Note that this is a temporary function until we have a slider section
   * @return {Number} value The value of the slider
   */
  _getSliderValue() {
    let m = this.props.slot.m;
    if (m && m.getModValue(2)) {
      return (m.getModValue(2) + 1) / 2;
    }
    return 0;
  }

}
