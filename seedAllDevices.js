const fs = require('fs');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

// 1. Load AWS env
const envPath = path.resolve(__dirname, 'infra/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length > 0 && !k.trim().startsWith('#')) {
      process.env[k.trim()] = v.join('=').trim();
    }
  });
}

// Full 22 Devices List
const allDevices = [
  {
    deviceId: 'smartphone',
    name: 'Smartphone',
    icon: 'smartphone',
    commonSymptoms: ['screen_cracked', 'battery_drain', 'not_charging', 'water_damage', 'camera_not_working', 'buttons_unresponsive', 'network_issues']
  },
  {
    deviceId: 'laptop',
    name: 'Laptop',
    icon: 'laptop',
    commonSymptoms: ['not_charging', 'wont_turn_on', 'overheating', 'screen_issue', 'slow_performance', 'wifi_issues', 'trackpad_issues']
  },
  {
    deviceId: 'headphones',
    name: 'Headphones / Earphones',
    icon: 'headphones',
    commonSymptoms: ['one_side_silent', 'bluetooth_disconnect', 'distorted_sound', 'broken_hinge_cable', 'case_not_charging', 'mic_not_working']
  },
  {
    deviceId: 'television',
    name: 'Television',
    icon: 'television',
    commonSymptoms: ['screen_black_no_display', 'no_sound', 'lines_on_screen', 'hdmi_not_working', 'wont_turn_on', 'wifi_smart_tv_issue']
  },
  {
    deviceId: 'washing_machine',
    name: 'Washing Machine',
    icon: 'washing_machine',
    commonSymptoms: ['not_spinning', 'leaking_water', 'not_draining', 'excessive_vibration', 'wont_start_no_power', 'abnormal_noise']
  },
  {
    deviceId: 'refrigerator',
    name: 'Refrigerator',
    icon: 'refrigerator',
    commonSymptoms: ['not_cooling', 'excessive_frost_ice', 'water_leakage', 'compressor_clicking_noise', 'foul_odor_fan_issue', 'door_seal_loose']
  },
  {
    deviceId: 'air_conditioner',
    name: 'Air Conditioner',
    icon: 'air_conditioner',
    commonSymptoms: ['not_cooling_blowing_warm', 'water_dripping_leak', 'foul_smell_or_smoke', 'remote_unresponsive_pcb', 'loud_compressor_rattle', 'frequent_tripping']
  },
  {
    deviceId: 'router',
    name: 'Router / WiFi',
    icon: 'router',
    commonSymptoms: ['no_internet_led_red', 'frequent_disconnects', 'slow_wifi_speeds', 'cannot_access_admin_page', 'overheating_restart', 'ethernet_port_dead']
  },
  {
    deviceId: 'printer',
    name: 'Printer',
    icon: 'printer',
    commonSymptoms: ['paper_jam', 'faded_or_streaked_prints', 'printer_offline', 'carriage_jam_grinding', 'ink_cartridge_unrecognized', 'wifi_connection_error']
  },
  {
    deviceId: 'mixer_blender',
    name: 'Mixer / Blender',
    icon: 'mixer_blender',
    commonSymptoms: ['motor_smells_burning', 'blades_not_spinning_jammed', 'jar_leaking_bottom', 'sparks_or_excessive_noise', 'speed_knob_broken', 'trips_overload_button']
  },
  {
    deviceId: 'electric_kettle',
    name: 'Electric Kettle',
    icon: 'electric_kettle',
    commonSymptoms: ['not_heating_water', 'auto_shutoff_not_working', 'base_connection_loose', 'water_leaking_seals', 'trips_circuit_breaker', 'indicator_light_dead']
  },
  {
    deviceId: 'gaming_console',
    name: 'Gaming Console',
    icon: 'gaming_console',
    commonSymptoms: ['overheating_fan_jet_noise', 'no_video_hdmi_port', 'disc_drive_not_reading', 'random_shutdown_error_code', 'controller_sync_failure', 'power_supply_failure']
  },
  {
    deviceId: 'power_bank',
    name: 'Power Bank',
    icon: 'power_bank',
    commonSymptoms: ['swollen_battery_casing', 'not_holding_charge', 'usb_ports_loose_dead', 'fast_charging_stopped', 'wont_charge_itself', 'gets_extremely_hot']
  },
  {
    deviceId: 'smartwatch',
    name: 'Smartwatch',
    icon: 'smartwatch',
    commonSymptoms: ['touchscreen_unresponsive', 'battery_drains_under_day', 'sensor_not_tracking_pulse', 'not_charging_pins_corroded', 'screen_cracked', 'bluetooth_pairing_loop']
  },
  {
    deviceId: 'tablet',
    name: 'Tablet',
    icon: 'tablet',
    commonSymptoms: ['digitizer_touch_ghosting', 'charging_port_damaged', 'battery_rapid_drop', 'screen_glass_shattered', 'bootloop_logo_stuck', 'audio_crackling']
  },
  {
    deviceId: 'microwave',
    name: 'Microwave Oven',
    icon: 'microwave',
    commonSymptoms: ['turntable_not_turning', 'sparks_inside_cavity', 'keypad_touch_unresponsive', 'not_heating_food', 'loud_buzzing_hum', 'door_latch_broken']
  },
  {
    deviceId: 'camera',
    name: 'Digital Camera',
    icon: 'camera',
    commonSymptoms: ['lens_error_jammed_extended', 'sensor_dust_spots', 'shutter_button_stuck', 'sd_card_write_error', 'lcd_screen_blank', 'battery_depletes_instantly']
  },
  {
    deviceId: 'speaker',
    name: 'Bluetooth Speaker',
    icon: 'speaker',
    commonSymptoms: ['distorted_bass_blown_cone', 'bluetooth_stutters', 'aux_port_crackling', 'wont_charge_or_power_on', 'low_max_volume', 'auto_shutoff_after_minutes']
  },
  {
    deviceId: 'desktop_pc',
    name: 'Desktop PC',
    icon: 'desktop_pc',
    commonSymptoms: ['no_display_beep_codes', 'bsod_random_crashes', 'power_supply_no_led', 'gpu_artifacting_lines', 'heavy_fan_throttling', 'front_io_dead']
  },
  {
    deviceId: 'vacuum_cleaner',
    name: 'Vacuum Cleaner',
    icon: 'vacuum_cleaner',
    commonSymptoms: ['loss_of_suction', 'roller_brush_stalled', 'battery_dies_5_mins', 'motor_whining_screech', 'filter_blockage_sensor', 'burning_belt_smell']
  },
  {
    deviceId: 'water_purifier',
    name: 'Water Purifier (RO)',
    icon: 'water_purifier',
    commonSymptoms: ['slow_water_flow', 'bad_taste_odor', 'continuous_drain_water', 'membrane_choked_high_tds', 'pump_vibrating_loudly', 'auto_shutoff_float_failed']
  },
  {
    deviceId: 'other_device',
    name: 'Other Device',
    icon: 'other_device',
    commonSymptoms: ['wont_turn_on', 'physical_damage', 'intermittent_operation', 'unusual_noise_or_smell', 'port_connector_loose']
  }
];

// Helper to format device items
const formattedDevices = allDevices.map(d => ({
  PK: `DEVICE#${d.deviceId}`,
  SK: 'METADATA',
  deviceId: d.deviceId,
  name: d.name,
  icon: d.icon,
  commonSymptoms: d.commonSymptoms
}));

// Additional Diagnostic Rules for all new categories
const newDiagnosticRules = [
  // Television
  {
    deviceId: 'television',
    ruleId: 'screen_black_no_display',
    symptomLabel: 'TV powers on but screen is completely black or no display',
    questions: [
      { id: 'has_sound', text: 'Can you hear audio/sound from the TV even though the screen is dark?', type: 'boolean' },
      { id: 'flashlight_test', text: 'When shining a bright flashlight close to the dark screen, can you faintly see an image or menu?', type: 'boolean' },
      { id: 'power_led_blinking', text: 'Is the standby power LED blinking in a repeating pattern or color code?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'popping_sound'],
    possibleIssues: ['backlight_led_strips', 'power_supply_board', 'tcon_logic_board']
  },
  {
    deviceId: 'television',
    ruleId: 'lines_on_screen',
    symptomLabel: 'Horizontal or vertical colored lines appearing across the TV display',
    questions: [
      { id: 'lines_on_all_inputs', text: 'Do the lines appear on all HDMI inputs and internal smart TV menus?', type: 'boolean' },
      { id: 'impact_damage', text: 'Was the screen physically pressed, hit, or cleaned with liquid recently?', type: 'boolean' },
      { id: 'lines_flicker_when_tapped', text: 'Do the lines flicker or change position when lightly pressing near the frame edge?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['tcon_logic_board', 'cof_bonding_cable', 'panel_lcd_defect']
  },
  {
    deviceId: 'television',
    ruleId: 'no_sound',
    symptomLabel: 'Picture is normal but TV has no sound or distorted audio',
    questions: [
      { id: 'internal_speakers_only', text: 'Is the sound missing from both built-in TV speakers and external audio/soundbars?', type: 'boolean' },
      { id: 'audio_settings_reset', text: 'Have you verified that the TV audio output is set to Internal Speakers and not Optical/Bluetooth?', type: 'boolean' },
      { id: 'crackling_buzzing', text: 'Do you hear a loud buzzing or popping noise before the audio cuts out?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['audio_amplifier_ic', 'internal_speaker_units', 'main_motherboard']
  },

  // Washing Machine
  {
    deviceId: 'washing_machine',
    ruleId: 'not_spinning',
    symptomLabel: 'Washing machine fills with water but drum does not spin or agitate',
    questions: [
      { id: 'motor_humming', text: 'Can you hear the motor humming or attempting to rotate during the spin cycle?', type: 'boolean' },
      { id: 'can_rotate_drum_by_hand', text: 'Can you easily rotate the drum smoothly by hand when the machine is turned off?', type: 'boolean' },
      { id: 'drain_completed', text: 'Has all the water completely drained before the spin cycle begins?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks'],
    possibleIssues: ['drive_belt_snapped', 'motor_carbon_brushes', 'motor_capacitor_failure']
  },
  {
    deviceId: 'washing_machine',
    ruleId: 'leaking_water',
    symptomLabel: 'Water puddle forming underneath or around the washing machine',
    questions: [
      { id: 'leak_during_fill', text: 'Does water leak immediately when the machine starts filling?', type: 'boolean' },
      { id: 'door_gasket_torn', text: 'Is the front door rubber bellow seal/gasket torn, dislodged, or mouldy?', type: 'boolean' },
      { id: 'leak_during_drain', text: 'Does water only leak during the drain or high-speed spin cycle?', type: 'boolean' }
    ],
    dangerousFlags: ['electric_shock', 'exposed_wiring'],
    possibleIssues: ['door_bellow_gasket', 'drain_pump_hose', 'inlet_solenoid_valve']
  },

  // Refrigerator
  {
    deviceId: 'refrigerator',
    ruleId: 'not_cooling',
    symptomLabel: 'Refrigerator or freezer compartment is warm and not cooling',
    questions: [
      { id: 'compressor_running', text: 'Can you hear the compressor humming or vibrating at the back bottom of the fridge?', type: 'boolean' },
      { id: 'clicking_sound', text: 'Does the fridge make a regular clicking sound every few minutes at the back?', type: 'boolean' },
      { id: 'interior_light_on', text: 'Are the interior lights working when opening the door?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'smoke'],
    possibleIssues: ['compressor_relay_overload', 'refrigerant_gas_leak', 'evaporator_fan_motor']
  },
  {
    deviceId: 'refrigerator',
    ruleId: 'excessive_frost_ice',
    symptomLabel: 'Heavy ice or frost buildup covering the freezer walls and coils',
    questions: [
      { id: 'frost_blocks_airflow', text: 'Is ice blocking the air vents between the freezer and fresh food compartment?', type: 'boolean' },
      { id: 'door_seal_gap', text: 'Can you slide a sheet of paper easily through the magnetic door gasket when closed?', type: 'boolean' },
      { id: 'frost_reappears_fast', text: 'Does the ice return within 2-3 days after manually defrosting?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['defrost_thermostat_bimetal', 'defrost_heater_element', 'magnetic_door_gasket']
  },

  // Air Conditioner
  {
    deviceId: 'air_conditioner',
    ruleId: 'not_cooling_blowing_warm',
    symptomLabel: 'AC blows room-temperature or warm air instead of cold air',
    questions: [
      { id: 'outdoor_unit_fan_spinning', text: 'Is the outdoor condenser fan spinning and motor running when AC is turned on?', type: 'boolean' },
      { id: 'copper_pipes_iced_up', text: 'Is there frost or ice forming on the thin copper pipes at the outdoor unit?', type: 'boolean' },
      { id: 'filters_clean', text: 'Have the indoor unit dust mesh filters been cleaned in the past month?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'frequent_tripping'],
    possibleIssues: ['run_capacitor_failure', 'refrigerant_gas_leak_refill', 'compressor_fault']
  },
  {
    deviceId: 'air_conditioner',
    ruleId: 'water_dripping_leak',
    symptomLabel: 'Water dripping or leaking down the wall from indoor AC unit',
    questions: [
      { id: 'drain_pipe_flowing_outside', text: 'Is water freely flowing out of the external outdoor drain pipe?', type: 'boolean' },
      { id: 'filter_ice_melting', text: 'Is ice visible on the indoor cooling fins behind the filter?', type: 'boolean' },
      { id: 'leak_stops_when_off', text: 'Does the dripping stop completely when the AC is switched off?', type: 'boolean' }
    ],
    dangerousFlags: ['electric_shock'],
    possibleIssues: ['drain_pipe_clog_cleaning', 'drain_tray_crack', 'indoor_evaporator_icing']
  },

  // Router / WiFi
  {
    deviceId: 'router',
    ruleId: 'no_internet_led_red',
    symptomLabel: 'Router WAN / Internet LED is glowing solid red or orange',
    questions: [
      { id: 'cable_firmly_plugged', text: 'Is the Ethernet/fiber optic cable firmly locked into the WAN/Internet port?', type: 'boolean' },
      { id: 'wifi_broadcast_visible', text: 'Can your phone or laptop still see and connect to the local WiFi SSID name?', type: 'boolean' },
      { id: 'reboot_cycle_done', text: 'Have you unplugged power for 30 seconds and restarted the device?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'extreme_heat'],
    possibleIssues: ['isp_fiber_ont_link', 'wan_port_hardware_damage', 'power_adapter_voltage_drop']
  },
  {
    deviceId: 'router',
    ruleId: 'frequent_disconnects',
    symptomLabel: 'WiFi connection repeatedly drops and reconnects every few minutes',
    questions: [
      { id: 'disconnect_all_devices', text: 'Do all connected devices lose connection simultaneously?', type: 'boolean' },
      { id: 'router_overheating_hot', text: 'Is the router casing unusually hot to the touch?', type: 'boolean' },
      { id: 'ethernet_wired_stable', text: 'Does a wired Ethernet cable connection stay stable while WiFi drops?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['router_overheating_thermal', 'firmware_corruption_flash', 'wifi_radio_amplifier_ic']
  },

  // Printer
  {
    deviceId: 'printer',
    ruleId: 'paper_jam',
    symptomLabel: 'Paper repeatedly jams or gets stuck in the feed roller mechanism',
    questions: [
      { id: 'paper_torn_inside', text: 'Are there small scraps of torn paper stuck inside the feed tray or roller path?', type: 'boolean' },
      { id: 'roller_spinning_smoothly', text: 'Do the rubber pickup rollers spin when trying to pull in paper?', type: 'boolean' },
      { id: 'loud_grinding_noise', text: 'Does the printer make a loud gear grinding or screeching noise?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['pickup_roller_worn', 'feed_gear_assembly', 'optical_paper_sensor']
  },
  {
    deviceId: 'printer',
    ruleId: 'faded_or_streaked_prints',
    symptomLabel: 'Printed pages have white horizontal lines, faded text, or smeared colors',
    questions: [
      { id: 'printhead_cleaning_run', text: 'Have you run the built-in automated printhead cleaning cycle 2-3 times?', type: 'boolean' },
      { id: 'ink_levels_sufficient', text: 'Are the physical ink tanks or toner cartridges at least 25% full?', type: 'boolean' },
      { id: 'printer_sat_idle_months', text: 'Has the printer sat unused for more than 4 weeks?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['clogged_printhead_nozzle', 'drum_unit_degradation', 'encoder_strip_dirty']
  },

  // Mixer / Blender
  {
    deviceId: 'mixer_blender',
    ruleId: 'motor_smells_burning',
    symptomLabel: 'Burning smell or sparks coming from the mixer grinder base',
    questions: [
      { id: 'sparking_visible', text: 'Can you see yellow/orange sparks through the bottom ventilation vents?', type: 'boolean' },
      { id: 'overload_switch_tripped', text: 'Did the red overload protection button at the bottom pop out?', type: 'boolean' },
      { id: 'blades_turn_freely', text: 'Can you rotate the blender jar coupler easily with your fingers?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'smoke', 'electric_shock'],
    possibleIssues: ['carbon_brush_wear', 'armature_motor_winding', 'overload_thermal_fuse']
  },
  {
    deviceId: 'mixer_blender',
    ruleId: 'jar_leaking_bottom',
    symptomLabel: 'Liquid leaks out from under the blender jar blade assembly into the machine',
    questions: [
      { id: 'black_residue_around_coupler', text: 'Is there black powder or dirty grease around the jar coupler gear?', type: 'boolean' },
      { id: 'blade_shaft_wobbly', text: 'Is the central blade shaft wobbly or loose inside the brass bush?', type: 'boolean' },
      { id: 'rubber_ring_missing', text: 'Is the silicone/rubber O-ring washer cracked or missing?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['jar_bush_blade_assembly', 'coupler_teeth_stripped', 'silicone_seal_ring']
  },

  // Electric Kettle
  {
    deviceId: 'electric_kettle',
    ruleId: 'not_heating_water',
    symptomLabel: 'Kettle switch turns on and light glows, but water stays cold',
    questions: [
      { id: 'indicator_light_working', text: 'Does the power indicator lamp or LED illuminate when switched on?', type: 'boolean' },
      { id: 'base_pins_scorched', text: 'Are the copper terminal pins on the swivel base blackened or scorched?', type: 'boolean' },
      { id: 'switch_clicks_firmly', text: 'Does the power switch click firmly and stay down?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'electric_shock'],
    possibleIssues: ['heating_element_failure', 'bi_metal_thermostat_switch', 'swivel_base_connector']
  },

  // Gaming Console
  {
    deviceId: 'gaming_console',
    ruleId: 'overheating_fan_jet_noise',
    symptomLabel: 'Fan sounds like a jet engine and console shuts down with overheating warning',
    questions: [
      { id: 'air_vents_clogged_dust', text: 'Are the exhaust vents clogged with visible dust blankets or pet hair?', type: 'boolean' },
      { id: 'warning_message_on_screen', text: 'Does the console display a "System is too hot" warning before shutting off?', type: 'boolean' },
      { id: 'console_hot_to_touch', text: 'Is the console casing very hot near the power supply / APU heatsink area?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'smoke'],
    possibleIssues: ['liquid_metal_thermal_paste', 'heatsink_dust_blockage', 'blower_fan_bearing']
  },
  {
    deviceId: 'gaming_console',
    ruleId: 'no_video_hdmi_port',
    symptomLabel: 'Console powers on (white/blue light) but TV displays "No Signal"',
    questions: [
      { id: 'hdmi_pins_bent', text: 'Are any copper pins inside the HDMI port bent, pushed back, or missing?', type: 'boolean' },
      { id: 'cable_and_tv_tested', text: 'Have you tested the HDMI cable and TV port with another working device?', type: 'boolean' },
      { id: 'safe_mode_boots', text: 'Does the console display video when booting into Safe Mode / Low Resolution?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['hdmi_port_physical_damage', 'hdmi_encoder_retimer_ic', 'apu_bga_joint_fault']
  },

  // Power Bank
  {
    deviceId: 'power_bank',
    ruleId: 'swollen_battery_casing',
    symptomLabel: 'Power bank casing is bulged, separated at the seams, or swollen',
    questions: [
      { id: 'casing_split_open', text: 'Has the battery expansion caused the plastic or aluminum shell to pop open?', type: 'boolean' },
      { id: 'sweet_chemical_smell', text: 'Do you smell a faint sweet chemical or nail-polish-like odor?', type: 'boolean' },
      { id: 'warm_while_idle', text: 'Does the battery pack feel warm even when not plugged into anything?', type: 'boolean' }
    ],
    dangerousFlags: ['swollen_battery', 'burning_smell', 'sparks', 'smoke'],
    possibleIssues: ['battery_cell_gassing_pouch', 'charge_controller_overvoltage']
  },
  {
    deviceId: 'power_bank',
    ruleId: 'not_holding_charge',
    symptomLabel: 'Power bank shows 4 full LEDs but drains to 0% after charging phone for 10 mins',
    questions: [
      { id: 'led_drops_instantly', text: 'Do the LED indicators drop from 4 bars to 1 bar almost immediately under load?', type: 'boolean' },
      { id: 'fast_charge_unsupported', text: 'Has fast charging (PD / QC) stopped working completely?', type: 'boolean' },
      { id: 'bank_takes_hours_to_reach_100', text: 'Does the power bank take 12+ hours to show 100% when recharging?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['internal_lithium_cell_degraded', 'bms_protection_circuit', 'micro_usb_typec_input_port']
  },

  // Smartwatch
  {
    deviceId: 'smartwatch',
    ruleId: 'battery_drains_under_day',
    symptomLabel: 'Smartwatch battery drains completely within 3 to 6 hours',
    questions: [
      { id: 'always_on_display_tested', text: 'Does it drain fast even with Always-On-Display and continuous GPS disabled?', type: 'boolean' },
      { id: 'watch_warm_on_wrist', text: 'Does the back ceramic/glass plate feel noticeably warm against your wrist?', type: 'boolean' },
      { id: 'screen_popping_up', text: 'Is the display glass lifting or separating from the casing due to battery swell?', type: 'boolean' }
    ],
    dangerousFlags: ['swollen_battery', 'burning_smell'],
    possibleIssues: ['micro_battery_cell_replacement', 'pmu_short_circuit', 'sensor_board_drain']
  },
  {
    deviceId: 'smartwatch',
    ruleId: 'not_charging_pins_corroded',
    symptomLabel: 'Smartwatch does not charge or magnetic puck fails to connect',
    questions: [
      { id: 'pins_green_black_corrosion', text: 'Are the metal charging contact points on the back blackened or discolored from sweat?', type: 'boolean' },
      { id: 'charger_cable_tested', text: 'Have you tested with a different USB power brick (5V 1A)?', type: 'boolean' },
      { id: 'charging_animation_flickers', text: 'Does the charging lightning bolt icon flicker on and off when moved?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['corroded_pin_cleaning', 'wireless_charging_coil', 'charging_dock_cable']
  },

  // Tablet
  {
    deviceId: 'tablet',
    ruleId: 'digitizer_touch_ghosting',
    symptomLabel: 'Tablet touchscreen registering phantom touches or dead zones',
    questions: [
      { id: 'screen_protector_removed', text: 'Does the touch ghosting persist after removing any tempered glass protector?', type: 'boolean' },
      { id: 'happens_only_while_charging', text: 'Does the phantom touching happen only when connected to a charger?', type: 'boolean' },
      { id: 'bent_aluminum_casing', text: 'Is the tablet chassis slightly bent or warped when looking down the edge?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['digitizer_touch_layer', 'noisy_charger_grounding', 'display_flex_connector']
  },
  {
    deviceId: 'tablet',
    ruleId: 'charging_port_damaged',
    symptomLabel: 'USB-C / Lightning port loose, tablet only charges at a specific angle',
    questions: [
      { id: 'cable_wiggles_loose', text: 'Does the charging cable feel loose and fall out easily?', type: 'boolean' },
      { id: 'lint_packed_inside', text: 'Can you see packed pocket lint or debris deep inside the port?', type: 'boolean' },
      { id: 'moisture_detected_alert', text: 'Does the tablet show a persistent "Liquid/debris in port" warning?', type: 'boolean' }
    ],
    dangerousFlags: ['hot_charging_port', 'sparks'],
    possibleIssues: ['port_lint_cleaning', 'usb_c_daughterboard', 'mainboard_port_microsoldering']
  },

  // Microwave Oven
  {
    deviceId: 'microwave',
    ruleId: 'not_heating_food',
    symptomLabel: 'Microwave runs, timer counts down and turntable spins, but food stays ice cold',
    questions: [
      { id: 'loud_buzz_hum', text: 'Do you hear a loud strained buzzing or humming sound when cooking starts?', type: 'boolean' },
      { id: 'burning_insulation_smell', text: 'Is there a burning electrical or ozone smell coming from the unit?', type: 'boolean' },
      { id: 'trips_kitchen_fuse', text: 'Does the microwave trip the home circuit breaker after running 5 seconds?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'smoke', 'electric_shock'],
    possibleIssues: ['magnetron_tube_failure', 'high_voltage_diode', 'high_voltage_capacitor']
  },
  {
    deviceId: 'microwave',
    ruleId: 'sparks_inside_cavity',
    symptomLabel: 'Sparks, fire flashes, or crackling noise inside the cooking chamber',
    questions: [
      { id: 'waveguide_cover_burnt', text: 'Is the cardboard/mica waveguide cover on the right interior wall scorched or greasy?', type: 'boolean' },
      { id: 'metal_utensil_removed', text: 'Have you verified that no metallic foil, gold-rim plates, or cutlery are inside?', type: 'boolean' },
      { id: 'enamel_paint_chipped', text: 'Is there bare rusted metal or chipped paint exposed on the inner walls?', type: 'boolean' }
    ],
    dangerousFlags: ['sparks', 'burning_smell', 'smoke'],
    possibleIssues: ['mica_waveguide_cover', 'cavity_cavitation_arcing', 'stirrer_blade_fan']
  },

  // Digital Camera
  {
    deviceId: 'camera',
    ruleId: 'lens_error_jammed_extended',
    symptomLabel: 'Lens stuck halfway, zoom motor clicks and displays "Lens Error"',
    questions: [
      { id: 'sand_or_grit_in_barrel', text: 'Did the camera recently encounter sand, fine dust, or a beach environment?', type: 'boolean' },
      { id: 'camera_dropped', text: 'Was the camera dropped while the zoom lens barrel was extended?', type: 'boolean' },
      { id: 'motor_grinding_clicking', text: 'Can you hear a faint electric motor whirring or clicking trying to retract?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['zoom_lens_barrel_gear', 'aperture_shutter_flex_ribbon', 'autofocus_drive_motor']
  },

  // Bluetooth Speaker
  {
    deviceId: 'speaker',
    ruleId: 'distorted_bass_blown_cone',
    symptomLabel: 'Speaker rattles, buzzes, or sounds muffled on bass notes',
    questions: [
      { id: 'distortion_at_low_volume', text: 'Does the rattling/distortion occur even at 30% volume?', type: 'boolean' },
      { id: 'passive_radiator_torn', text: 'Is the rubber surround ring on the side bass radiators torn or punctured?', type: 'boolean' },
      { id: 'loose_grille_screws', text: 'Does pressing gently on the outer plastic/metal grille stop the vibration rattle?', type: 'boolean' }
    ],
    dangerousFlags: [],
    possibleIssues: ['speaker_driver_cone_tear', 'passive_radiator_membrane', 'dsp_amplifier_board']
  },

  // Desktop PC
  {
    deviceId: 'desktop_pc',
    ruleId: 'no_display_beep_codes',
    symptomLabel: 'PC powers on, fans and LEDs spin, but monitor screen stays black with no signal',
    questions: [
      { id: 'motherboard_beep_or_debug_led', text: 'Does the motherboard emit beep codes or show a red/orange debug LED (CPU/DRAM/VGA)?', type: 'boolean' },
      { id: 'monitor_cable_in_gpu', text: 'Is the HDMI/DisplayPort cable plugged into the dedicated graphics card rather than the motherboard?', type: 'boolean' },
      { id: 'ram_reseated', text: 'Have you attempted removing and firmly reseating the RAM sticks into their slots?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'smoke'],
    possibleIssues: ['ram_contact_oxidation', 'gpu_pcie_seated_defect', 'cmos_bios_corruption']
  },

  // Vacuum Cleaner
  {
    deviceId: 'vacuum_cleaner',
    ruleId: 'loss_of_suction',
    symptomLabel: 'Motor runs loudly but vacuum cleaner has little to no suction power',
    questions: [
      { id: 'filters_washed_dry', text: 'Have the HEPA and foam pre-motor filters been washed and allowed 24h to dry?', type: 'boolean' },
      { id: 'hose_wand_blockage', text: 'Can you see clear light through the detachable flexible hose and wand tube?', type: 'boolean' },
      { id: 'dustbin_overfilled', text: 'Is the cyclone cone or dustbin gasket sealed properly without air leaks?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell'],
    possibleIssues: ['hepa_filter_choked', 'flexible_hose_tear_blockage', 'suction_motor_cyclone_seal']
  },

  // Water Purifier (RO)
  {
    deviceId: 'water_purifier',
    ruleId: 'slow_water_flow',
    symptomLabel: 'Filtered pure water trickles out as a thin drip or tank takes 4+ hours to fill',
    questions: [
      { id: 'tap_water_supply_normal', text: 'Is your home main inlet water pressure adequate?', type: 'boolean' },
      { id: 'reject_water_flowing_fast', text: 'Is reject/waste water flowing out heavily through the blue drain pipe?', type: 'boolean' },
      { id: 'filters_older_than_12_months', text: 'Has it been over 9 to 12 months since sediment and carbon pre-filters were replaced?', type: 'boolean' }
    ],
    dangerousFlags: ['electric_shock'],
    possibleIssues: ['sediment_carbon_filter_choke', 'ro_membrane_scaling', 'booster_pump_low_pressure']
  },

  // Other Device
  {
    deviceId: 'other_device',
    ruleId: 'wont_turn_on',
    symptomLabel: 'Device will not power on, no LED indicator lights or signs of life',
    questions: [
      { id: 'power_outlet_tested', text: 'Have you tested the wall electrical socket with a lamp or known-working appliance?', type: 'boolean' },
      { id: 'power_cable_damaged', text: 'Is the power adapter cord, plug, or wire frayed, kinked, or chewed?', type: 'boolean' },
      { id: 'reset_button_held', text: 'Does holding the power or pinhole reset button for 15 seconds trigger any reaction?', type: 'boolean' }
    ],
    dangerousFlags: ['burning_smell', 'sparks', 'smoke', 'electric_shock'],
    possibleIssues: ['power_supply_cable_adaptor', 'internal_fuse_blown', 'main_control_circuit']
  }
];

// Additional Repair Data for all new categories
const newRepairData = [
  // Television
  {
    deviceId: 'television',
    issueId: 'backlight_led_strips',
    issueLabel: 'LED Backlight Strip Array Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1800,
    repairCostMaxINR: 4200,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'television',
    issueId: 'power_supply_board',
    issueLabel: 'SMPS Power Supply Board Repair / Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1500,
    repairCostMaxINR: 3500,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'television',
    issueId: 'tcon_logic_board',
    issueLabel: 'T-Con Timing Controller Board Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 2000,
    repairCostMaxINR: 4500,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'television',
    issueId: 'cof_bonding_cable',
    issueLabel: 'COF Display Bonding Cable Laser Bonding Repair',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 3500,
    repairCostMaxINR: 7000,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 4,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'television',
    issueId: 'panel_lcd_defect',
    issueLabel: 'Complete 4K LCD/OLED Panel Replacement',
    isDemoData: true,
    partsAvailability: 'POOR',
    repairComplexity: 'HIGH',
    repairCostMinINR: 15000,
    repairCostMaxINR: 28000,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 6,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'television',
    issueId: 'audio_amplifier_ic',
    issueLabel: 'Audio Output Amp IC & Speaker Subsystem Service',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1200,
    repairCostMaxINR: 2500,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'television',
    issueId: 'internal_speaker_units',
    issueLabel: 'Stereo Speaker Driver Modules Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 900,
    repairCostMaxINR: 1800,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'television',
    issueId: 'main_motherboard',
    issueLabel: 'Smart TV Main Motherboard & SoC Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 3500,
    repairCostMaxINR: 7500,
    replacementCostMinINR: 22000,
    replacementCostMaxINR: 45000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 3
  },

  // Washing Machine
  {
    deviceId: 'washing_machine',
    issueId: 'drive_belt_snapped',
    issueLabel: 'Motor Drive Poly-V Belt Replacement & Tensioning',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 800,
    repairCostMaxINR: 1800,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 38000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'washing_machine',
    issueId: 'motor_carbon_brushes',
    issueLabel: 'Universal Motor Carbon Brushes Pair Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1200,
    repairCostMaxINR: 2400,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 38000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'washing_machine',
    issueId: 'motor_capacitor_failure',
    issueLabel: 'Motor Run/Start Capacitor Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 600,
    repairCostMaxINR: 1400,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 38000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'washing_machine',
    issueId: 'door_bellow_gasket',
    issueLabel: 'Door Rubber Bellow Gasket Seal Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1500,
    repairCostMaxINR: 3200,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 38000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'washing_machine',
    issueId: 'drain_pump_hose',
    issueLabel: 'Drain Pump Filter & Hose Debris Cleaning / Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 900,
    repairCostMaxINR: 2000,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 38000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'washing_machine',
    issueId: 'inlet_solenoid_valve',
    issueLabel: 'Dual Water Inlet Solenoid Valve Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 1000,
    repairCostMaxINR: 2200,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 38000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Refrigerator
  {
    deviceId: 'refrigerator',
    issueId: 'compressor_relay_overload',
    issueLabel: 'PTC Starter Relay & Overload Protector Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 900,
    repairCostMaxINR: 2200,
    replacementCostMinINR: 16000,
    replacementCostMaxINR: 42000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 6
  },
  {
    deviceId: 'refrigerator',
    issueId: 'refrigerant_gas_leak',
    issueLabel: 'Copper Tubing Leak Brazing & R600a/R134a Gas Refill',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'HIGH',
    repairCostMinINR: 2200,
    repairCostMaxINR: 4800,
    replacementCostMinINR: 16000,
    replacementCostMaxINR: 42000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'refrigerator',
    issueId: 'evaporator_fan_motor',
    issueLabel: 'Freezer Evaporator Circulation Fan Motor Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1400,
    repairCostMaxINR: 2900,
    replacementCostMinINR: 16000,
    replacementCostMaxINR: 42000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'refrigerator',
    issueId: 'defrost_thermostat_bimetal',
    issueLabel: 'Defrost Bimetal Thermostat & Sensor Fuse Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 800,
    repairCostMaxINR: 1800,
    replacementCostMinINR: 16000,
    replacementCostMaxINR: 42000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'refrigerator',
    issueId: 'defrost_heater_element',
    issueLabel: 'Quartz Glass Defrost Heater Element Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1200,
    repairCostMaxINR: 2600,
    replacementCostMinINR: 16000,
    replacementCostMaxINR: 42000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'refrigerator',
    issueId: 'magnetic_door_gasket',
    issueLabel: 'Door Magnetic Gasket Seal Replacement & Alignment',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 1100,
    repairCostMaxINR: 2400,
    replacementCostMinINR: 16000,
    replacementCostMaxINR: 42000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Air Conditioner
  {
    deviceId: 'air_conditioner',
    issueId: 'run_capacitor_failure',
    issueLabel: 'Dual Compressor/Fan Run Capacitor Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 850,
    repairCostMaxINR: 2000,
    replacementCostMinINR: 28000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'air_conditioner',
    issueId: 'refrigerant_gas_leak_refill',
    issueLabel: 'Nitrogen Pressure Test, Flare Joint Repair & R32 Gas Top-Up',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'HIGH',
    repairCostMinINR: 2600,
    repairCostMaxINR: 5500,
    replacementCostMinINR: 28000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'air_conditioner',
    issueId: 'compressor_fault',
    issueLabel: 'Rotary Inverter Compressor Motor Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 8500,
    repairCostMaxINR: 17000,
    replacementCostMinINR: 28000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'air_conditioner',
    issueId: 'drain_pipe_clog_cleaning',
    issueLabel: 'Indoor Drain Tray Flush & Condensate Line Cleaning',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 600,
    repairCostMaxINR: 1400,
    replacementCostMinINR: 28000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'air_conditioner',
    issueId: 'drain_tray_crack',
    issueLabel: 'Indoor Unit Drain Pan Sealing / Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1200,
    repairCostMaxINR: 2600,
    replacementCostMinINR: 28000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'air_conditioner',
    issueId: 'indoor_evaporator_icing',
    issueLabel: 'Deep Jet Pump Foam Service & Airflow Restoration',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 800,
    repairCostMaxINR: 1800,
    replacementCostMinINR: 28000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Router
  {
    deviceId: 'router',
    issueId: 'isp_fiber_ont_link',
    issueLabel: 'Fiber Connector Cleaning & Line Splicing Diagnostics',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 400,
    repairCostMaxINR: 900,
    replacementCostMinINR: 2000,
    replacementCostMaxINR: 6500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'router',
    issueId: 'wan_port_hardware_damage',
    issueLabel: 'Gigabit WAN Port RJ45 Surge Protection Repair',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 600,
    repairCostMaxINR: 1500,
    replacementCostMinINR: 2000,
    replacementCostMaxINR: 6500,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 2
  },
  {
    deviceId: 'router',
    issueId: 'power_adapter_voltage_drop',
    issueLabel: '12V 1.5A DC Power Adapter Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 350,
    repairCostMaxINR: 750,
    replacementCostMinINR: 2000,
    replacementCostMaxINR: 6500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'router',
    issueId: 'router_overheating_thermal',
    issueLabel: 'SoC Thermal Pad Upgrade & Heatsink Securing',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 300,
    repairCostMaxINR: 700,
    replacementCostMinINR: 2000,
    replacementCostMaxINR: 6500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'router',
    issueId: 'firmware_corruption_flash',
    issueLabel: 'UART Serial Unbrick & Clean Stock Firmware Reflash',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 500,
    repairCostMaxINR: 1200,
    replacementCostMinINR: 2000,
    replacementCostMaxINR: 6500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'router',
    issueId: 'wifi_radio_amplifier_ic',
    issueLabel: '5GHz Front-End Module (FEM) / Wi-Fi Radio IC Repair',
    isDemoData: true,
    partsAvailability: 'POOR',
    repairComplexity: 'HIGH',
    repairCostMinINR: 1100,
    repairCostMaxINR: 2200,
    replacementCostMinINR: 2000,
    replacementCostMaxINR: 6500,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 2
  },

  // Printer
  {
    deviceId: 'printer',
    issueId: 'pickup_roller_worn',
    issueLabel: 'Rubber Paper Pickup & Separation Roller Kit Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 650,
    repairCostMaxINR: 1500,
    replacementCostMinINR: 11000,
    replacementCostMaxINR: 24000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'printer',
    issueId: 'feed_gear_assembly',
    issueLabel: 'Drive Gear Train & Clutch Spring Assembly Overhaul',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 900,
    repairCostMaxINR: 2000,
    replacementCostMinINR: 11000,
    replacementCostMaxINR: 24000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'printer',
    issueId: 'optical_paper_sensor',
    issueLabel: 'Optical Paper Jam Sensor Cleaning & Realignment',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 500,
    repairCostMaxINR: 1100,
    replacementCostMinINR: 11000,
    replacementCostMaxINR: 24000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'printer',
    issueId: 'clogged_printhead_nozzle',
    issueLabel: 'Ultrasonic Piezoelectric Printhead Flush & Unclogging',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1200,
    repairCostMaxINR: 3000,
    replacementCostMinINR: 11000,
    replacementCostMaxINR: 24000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'printer',
    issueId: 'drum_unit_degradation',
    issueLabel: 'OPC Drum Cylinder & Wiper Blade Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 1000,
    repairCostMaxINR: 2400,
    replacementCostMinINR: 11000,
    replacementCostMaxINR: 24000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'printer',
    issueId: 'encoder_strip_dirty',
    issueLabel: 'Optical Carriage Encoder Strip Cleaning & Timing Calibration',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 450,
    repairCostMaxINR: 950,
    replacementCostMinINR: 11000,
    replacementCostMaxINR: 24000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },

  // Mixer / Blender
  {
    deviceId: 'mixer_blender',
    issueId: 'carbon_brush_wear',
    issueLabel: 'High-Speed Motor Carbon Brushes Pair Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 250,
    repairCostMaxINR: 650,
    replacementCostMinINR: 2500,
    replacementCostMaxINR: 7500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'mixer_blender',
    issueId: 'armature_motor_winding',
    issueLabel: 'Motor Armature Copper Rewinding / Stator Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 700,
    repairCostMaxINR: 1600,
    replacementCostMinINR: 2500,
    replacementCostMaxINR: 7500,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'mixer_blender',
    issueId: 'overload_thermal_fuse',
    issueLabel: 'Bi-metal Overload Reset Switch Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 200,
    repairCostMaxINR: 500,
    replacementCostMinINR: 2500,
    replacementCostMaxINR: 7500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'mixer_blender',
    issueId: 'jar_bush_blade_assembly',
    issueLabel: 'Stainless Steel Jar Sintered Bush & Shaft Assembly Overhaul',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 300,
    repairCostMaxINR: 750,
    replacementCostMinINR: 2500,
    replacementCostMaxINR: 7500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'mixer_blender',
    issueId: 'coupler_teeth_stripped',
    issueLabel: 'Motor & Jar Nylon Drive Coupler Gear Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 150,
    repairCostMaxINR: 400,
    replacementCostMinINR: 2500,
    replacementCostMaxINR: 7500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'mixer_blender',
    issueId: 'silicone_seal_ring',
    issueLabel: 'Food-Grade Silicone Sealing Gasket Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 100,
    repairCostMaxINR: 250,
    replacementCostMinINR: 2500,
    replacementCostMaxINR: 7500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Electric Kettle
  {
    deviceId: 'electric_kettle',
    issueId: 'heating_element_failure',
    issueLabel: 'Concealed Heating Base Element Service',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 400,
    repairCostMaxINR: 900,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'electric_kettle',
    issueId: 'bi_metal_thermostat_switch',
    issueLabel: 'Steam Sensor Bi-Metal Auto-Off Thermostat Switch Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 250,
    repairCostMaxINR: 600,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'electric_kettle',
    issueId: 'swivel_base_connector',
    issueLabel: '360-Degree Swivel Power Base Cord Assembly Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 200,
    repairCostMaxINR: 500,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3500,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },

  // Gaming Console
  {
    deviceId: 'gaming_console',
    issueId: 'liquid_metal_thermal_paste',
    issueLabel: 'Liquid Metal Re-application & APU Foam Barrier Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'HIGH',
    repairCostMinINR: 2200,
    repairCostMaxINR: 4800,
    replacementCostMinINR: 42000,
    replacementCostMaxINR: 60000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'gaming_console',
    issueId: 'heatsink_dust_blockage',
    issueLabel: 'Deep Heatsink Block Cleaning & Power Supply Fan Maintenance',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 900,
    repairCostMaxINR: 1900,
    replacementCostMinINR: 42000,
    replacementCostMaxINR: 60000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'gaming_console',
    issueId: 'blower_fan_bearing',
    issueLabel: 'Centrifugal Cooling Blower Fan Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 1400,
    repairCostMaxINR: 2800,
    replacementCostMinINR: 42000,
    replacementCostMaxINR: 60000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'gaming_console',
    issueId: 'hdmi_port_physical_damage',
    issueLabel: 'HDMI 2.1 Surface Mount Connector Replacement (Micro-Soldering)',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'HIGH',
    repairCostMinINR: 2500,
    repairCostMaxINR: 5200,
    replacementCostMinINR: 42000,
    replacementCostMaxINR: 60000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'gaming_console',
    issueId: 'hdmi_encoder_retimer_ic',
    issueLabel: 'HDMI Video Retimer Controller IC Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 3200,
    repairCostMaxINR: 6500,
    replacementCostMinINR: 42000,
    replacementCostMaxINR: 60000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'gaming_console',
    issueId: 'apu_bga_joint_fault',
    issueLabel: 'Main Processor BGA Reballing / Reflow Service',
    isDemoData: true,
    partsAvailability: 'POOR',
    repairComplexity: 'HIGH',
    repairCostMinINR: 6000,
    repairCostMaxINR: 12000,
    replacementCostMinINR: 42000,
    replacementCostMaxINR: 60000,
    expectedRepairTimeDays: 5,
    expectedRemainingUsabilityYears: 2
  },

  // Power Bank
  {
    deviceId: 'power_bank',
    issueId: 'battery_cell_gassing_pouch',
    issueLabel: 'Swollen Li-Po Cell Safe Disposal & Battery Pack Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 800,
    repairCostMaxINR: 1600,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 2
  },
  {
    deviceId: 'power_bank',
    issueId: 'charge_controller_overvoltage',
    issueLabel: 'Power Bank Buck-Boost PCB Charge Controller Repair',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 500,
    repairCostMaxINR: 1100,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 2
  },
  {
    deviceId: 'power_bank',
    issueId: 'internal_lithium_cell_degraded',
    issueLabel: 'Grade-A 18650 / 21700 Battery Cell Refresh',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 700,
    repairCostMaxINR: 1400,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'power_bank',
    issueId: 'bms_protection_circuit',
    issueLabel: 'BMS Protection Module Reset & Shunt Resistor Fix',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 350,
    repairCostMaxINR: 750,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'power_bank',
    issueId: 'micro_usb_typec_input_port',
    issueLabel: 'USB Type-C Input Receptacle Soldering Repair',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 300,
    repairCostMaxINR: 650,
    replacementCostMinINR: 1200,
    replacementCostMaxINR: 3000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },

  // Smartwatch
  {
    deviceId: 'smartwatch',
    issueId: 'micro_battery_cell_replacement',
    issueLabel: 'Precision Smartwatch Miniature Battery Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'HIGH',
    repairCostMinINR: 900,
    repairCostMaxINR: 2400,
    replacementCostMinINR: 4000,
    replacementCostMaxINR: 35000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 2
  },
  {
    deviceId: 'smartwatch',
    issueId: 'pmu_short_circuit',
    issueLabel: 'Motherboard PMIC Circuit Corrosion Ultrasonic Clean',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 1200,
    repairCostMaxINR: 2800,
    replacementCostMinINR: 4000,
    replacementCostMaxINR: 35000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 2
  },
  {
    deviceId: 'smartwatch',
    issueId: 'sensor_board_drain',
    issueLabel: 'PPG Heart Rate Sensor Flex Re-calibration',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 800,
    repairCostMaxINR: 1900,
    replacementCostMinINR: 4000,
    replacementCostMaxINR: 35000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'smartwatch',
    issueId: 'corroded_pin_cleaning',
    issueLabel: 'Pogo Pin De-oxidation & Contact Replating',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 300,
    repairCostMaxINR: 700,
    replacementCostMinINR: 4000,
    replacementCostMaxINR: 35000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'smartwatch',
    issueId: 'wireless_charging_coil',
    issueLabel: 'Internal Qi Induction Receiving Coil Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 1100,
    repairCostMaxINR: 2600,
    replacementCostMinINR: 4000,
    replacementCostMaxINR: 35000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'smartwatch',
    issueId: 'charging_dock_cable',
    issueLabel: 'Magnetic Charging Puck Cable Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 450,
    repairCostMaxINR: 1200,
    replacementCostMinINR: 4000,
    replacementCostMaxINR: 35000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },

  // Tablet
  {
    deviceId: 'tablet',
    issueId: 'digitizer_touch_layer',
    issueLabel: 'Glass Digitizer & Touch Sensing Layer Lamination',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1800,
    repairCostMaxINR: 4500,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'tablet',
    issueId: 'noisy_charger_grounding',
    issueLabel: 'Ground Loop EMI Filtering & Charger Isolation Check',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 400,
    repairCostMaxINR: 900,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'tablet',
    issueId: 'display_flex_connector',
    issueLabel: 'Display FPC Cable Re-seating & Conductive Tape Shielding',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 700,
    repairCostMaxINR: 1600,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'tablet',
    issueId: 'port_lint_cleaning',
    issueLabel: 'Precision Ultrasonic & Mechanical Port Decontamination',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 300,
    repairCostMaxINR: 700,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'tablet',
    issueId: 'usb_c_daughterboard',
    issueLabel: 'Sub-Board Charging Daughterboard Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1200,
    repairCostMaxINR: 2800,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'tablet',
    issueId: 'mainboard_port_microsoldering',
    issueLabel: 'Mainboard Micro-Soldering USB-C Port Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'HIGH',
    repairCostMinINR: 1800,
    repairCostMaxINR: 3800,
    replacementCostMinINR: 18000,
    replacementCostMaxINR: 55000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  },

  // Microwave Oven
  {
    deviceId: 'microwave',
    issueId: 'magnetron_tube_failure',
    issueLabel: 'High Power Magnetron Tube Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1400,
    repairCostMaxINR: 2900,
    replacementCostMinINR: 6000,
    replacementCostMaxINR: 16000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'microwave',
    issueId: 'high_voltage_diode',
    issueLabel: 'HV Rectifier Diode Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 450,
    repairCostMaxINR: 1100,
    replacementCostMinINR: 6000,
    replacementCostMaxINR: 16000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'microwave',
    issueId: 'high_voltage_capacitor',
    issueLabel: 'High Voltage Capacitor & Discharge Resistor Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 750,
    repairCostMaxINR: 1600,
    replacementCostMinINR: 6000,
    replacementCostMaxINR: 16000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'microwave',
    issueId: 'mica_waveguide_cover',
    issueLabel: 'Mica Mineral Waveguide Shield Cover Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 250,
    repairCostMaxINR: 600,
    replacementCostMinINR: 6000,
    replacementCostMaxINR: 16000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'microwave',
    issueId: 'cavity_cavitation_arcing',
    issueLabel: 'Internal Cavity Arc Burn Sanding & Food-Grade Enamel Repaint',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 400,
    repairCostMaxINR: 950,
    replacementCostMinINR: 6000,
    replacementCostMaxINR: 16000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'microwave',
    issueId: 'stirrer_blade_fan',
    issueLabel: 'Wave Stirrer Blade Assembly Realignment',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 350,
    repairCostMaxINR: 800,
    replacementCostMinINR: 6000,
    replacementCostMaxINR: 16000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Digital Camera
  {
    deviceId: 'camera',
    issueId: 'zoom_lens_barrel_gear',
    issueLabel: 'Precision Telescoping Lens Barrel & Guide Rail Rebuilding',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 2200,
    repairCostMaxINR: 5800,
    replacementCostMinINR: 35000,
    replacementCostMaxINR: 85000,
    expectedRepairTimeDays: 4,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'camera',
    issueId: 'aperture_shutter_flex_ribbon',
    issueLabel: 'Electro-Magnetic Shutter Blade Flex Ribbon Cable Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 1800,
    repairCostMaxINR: 4200,
    replacementCostMinINR: 35000,
    replacementCostMaxINR: 85000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'camera',
    issueId: 'autofocus_drive_motor',
    issueLabel: 'Ultrasonic/Stepper Autofocus Motor Gear Replacement',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 1900,
    repairCostMaxINR: 4500,
    replacementCostMinINR: 35000,
    replacementCostMaxINR: 85000,
    expectedRepairTimeDays: 3,
    expectedRemainingUsabilityYears: 4
  },

  // Bluetooth Speaker
  {
    deviceId: 'speaker',
    issueId: 'speaker_driver_cone_tear',
    issueLabel: 'Full-Range Dynamic Speaker Transducer Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 650,
    repairCostMaxINR: 1600,
    replacementCostMinINR: 3500,
    replacementCostMaxINR: 15000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'speaker',
    issueId: 'passive_radiator_membrane',
    issueLabel: 'Passive Bass Radiator Diaphragm Resealing / Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 450,
    repairCostMaxINR: 1100,
    replacementCostMinINR: 3500,
    replacementCostMaxINR: 15000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'speaker',
    issueId: 'dsp_amplifier_board',
    issueLabel: 'Class-D Audio Amp & Bluetooth 5.3 SoC Board Service',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1100,
    repairCostMaxINR: 2500,
    replacementCostMinINR: 3500,
    replacementCostMaxINR: 15000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  },

  // Desktop PC
  {
    deviceId: 'desktop_pc',
    issueId: 'ram_contact_oxidation',
    issueLabel: 'DDR4/DDR5 Gold Finger Contact De-oxidation & Slot Cleaning',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 350,
    repairCostMaxINR: 800,
    replacementCostMinINR: 45000,
    replacementCostMaxINR: 110000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'desktop_pc',
    issueId: 'gpu_pcie_seated_defect',
    issueLabel: 'Graphics Card PCIe Slot Contact Cleaning & Sag Bracket Support',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 500,
    repairCostMaxINR: 1200,
    replacementCostMinINR: 45000,
    replacementCostMaxINR: 110000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'desktop_pc',
    issueId: 'cmos_bios_corruption',
    issueLabel: 'CR2032 Battery Refresh & BIOS Chip Flash Overwrite',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 400,
    repairCostMaxINR: 950,
    replacementCostMinINR: 45000,
    replacementCostMaxINR: 110000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Vacuum Cleaner
  {
    deviceId: 'vacuum_cleaner',
    issueId: 'hepa_filter_choked',
    issueLabel: 'Dual HEPA Exhaust & Cyclone Foam Washable Filter Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 450,
    repairCostMaxINR: 1100,
    replacementCostMinINR: 8000,
    replacementCostMaxINR: 28000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'vacuum_cleaner',
    issueId: 'flexible_hose_tear_blockage',
    issueLabel: 'Crush-Proof Vacuum Flexible Hose & Detachable Wand Clearing',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 500,
    repairCostMaxINR: 1200,
    replacementCostMinINR: 8000,
    replacementCostMaxINR: 28000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'vacuum_cleaner',
    issueId: 'suction_motor_cyclone_seal',
    issueLabel: 'Digital Brushless Vacuum Suction Motor Overhaul & Gasket Seal',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1400,
    repairCostMaxINR: 3200,
    replacementCostMinINR: 8000,
    replacementCostMaxINR: 28000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 4
  },

  // Water Purifier (RO)
  {
    deviceId: 'water_purifier',
    issueId: 'sediment_carbon_filter_choke',
    issueLabel: 'Spun Sediment & Activated Pre-Carbon Filter Cartridge Kit',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 750,
    repairCostMaxINR: 1800,
    replacementCostMinINR: 12000,
    replacementCostMaxINR: 26000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },
  {
    deviceId: 'water_purifier',
    issueId: 'ro_membrane_scaling',
    issueLabel: '80 GPD Thin-Film Composite (TFC) RO Membrane Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 1400,
    repairCostMaxINR: 2800,
    replacementCostMinINR: 12000,
    replacementCostMaxINR: 26000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'water_purifier',
    issueId: 'booster_pump_low_pressure',
    issueLabel: '100 GPD Heavy-Duty RO Booster Pump Diaphragm Service',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'MEDIUM',
    repairCostMinINR: 1600,
    repairCostMaxINR: 3400,
    replacementCostMinINR: 12000,
    replacementCostMaxINR: 26000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 5
  },

  // Other Device
  {
    deviceId: 'other_device',
    issueId: 'power_supply_cable_adaptor',
    issueLabel: 'Universal Power Supply Unit & DC Cord Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 400,
    repairCostMaxINR: 1200,
    replacementCostMinINR: 3000,
    replacementCostMaxINR: 12000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 3
  },
  {
    deviceId: 'other_device',
    issueId: 'internal_fuse_blown',
    issueLabel: 'Thermal Fuse & MOV Surge Protector Replacement',
    isDemoData: true,
    partsAvailability: 'GOOD',
    repairComplexity: 'LOW',
    repairCostMinINR: 300,
    repairCostMaxINR: 800,
    replacementCostMinINR: 3000,
    replacementCostMaxINR: 12000,
    expectedRepairTimeDays: 1,
    expectedRemainingUsabilityYears: 4
  },
  {
    deviceId: 'other_device',
    issueId: 'main_control_circuit',
    issueLabel: 'Primary Control PCB Trace Repair & Component Solder',
    isDemoData: true,
    partsAvailability: 'MEDIUM',
    repairComplexity: 'HIGH',
    repairCostMinINR: 800,
    repairCostMaxINR: 2200,
    replacementCostMinINR: 3000,
    replacementCostMaxINR: 12000,
    expectedRepairTimeDays: 2,
    expectedRemainingUsabilityYears: 3
  }
];

// Helper to format diagnostic rules
const formattedRules = newDiagnosticRules.map(r => ({
  PK: `DEVICE#${r.deviceId}`,
  SK: `RULE#${r.ruleId}`,
  deviceId: r.deviceId,
  ruleId: r.ruleId,
  symptomLabel: r.symptomLabel,
  questions: r.questions,
  dangerousFlags: r.dangerousFlags,
  possibleIssues: r.possibleIssues
}));

// Helper to format repair data
const formattedRepairData = newRepairData.map(d => ({
  PK: `DEVICE#${d.deviceId}`,
  SK: `REPAIRDATA#${d.issueId}`,
  deviceId: d.deviceId,
  issueId: d.issueId,
  issueLabel: d.issueLabel,
  isDemoData: d.isDemoData,
  partsAvailability: d.partsAvailability,
  repairComplexity: d.repairComplexity,
  repairCostMinINR: d.repairCostMinINR,
  repairCostMaxINR: d.repairCostMaxINR,
  replacementCostMinINR: d.replacementCostMinINR,
  replacementCostMaxINR: d.replacementCostMaxINR,
  expectedRepairTimeDays: d.expectedRepairTimeDays,
  expectedRemainingUsabilityYears: d.expectedRemainingUsabilityYears
}));

// Mock providers for new categories
const cities = ['Bengaluru', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Kolkata'];
const newProviders = [];
let pIndex = 100;
allDevices.filter(d => !['smartphone', 'laptop', 'headphones'].includes(d.deviceId)).forEach(device => {
  cities.slice(0, 3).forEach(city => {
    pIndex++;
    newProviders.push({
      PK: `PROVIDER#p${pIndex}`,
      SK: 'METADATA',
      GSI1PK: `PROVIDERCAT#${device.deviceId}`,
      GSI1SK: `CITY#${city}`,
      providerId: `p${pIndex}`,
      isMockData: true,
      name: `${city} ${device.name} Care & Repair Center (Demo)`,
      city: city,
      rating: +(4.4 + Math.random() * 0.5).toFixed(1),
      categories: [device.deviceId],
      contact: `support-${device.deviceId}-${city.toLowerCase()}@demo.back2life.local`
    });
  });
});

async function main() {
  console.log(`Writing seed files...`);
  const seedDir = path.resolve(__dirname, 'data/seed');

  // Update devices.json
  const existingDevices = JSON.parse(fs.readFileSync(path.join(seedDir, 'devices.json'), 'utf-8'));
  const deviceMap = new Map();
  existingDevices.forEach(d => deviceMap.set(d.deviceId, d));
  formattedDevices.forEach(d => deviceMap.set(d.deviceId, d));
  const mergedDevices = Array.from(deviceMap.values());
  fs.writeFileSync(path.join(seedDir, 'devices.json'), JSON.stringify(mergedDevices, null, 2));
  console.log(`Updated data/seed/devices.json with ${mergedDevices.length} devices.`);

  // Update diagnosticRules.json
  const existingRules = JSON.parse(fs.readFileSync(path.join(seedDir, 'diagnosticRules.json'), 'utf-8'));
  const ruleMap = new Map();
  existingRules.forEach(r => ruleMap.set(`${r.deviceId}#${r.ruleId}`, r));
  formattedRules.forEach(r => ruleMap.set(`${r.deviceId}#${r.ruleId}`, r));
  const mergedRules = Array.from(ruleMap.values());
  fs.writeFileSync(path.join(seedDir, 'diagnosticRules.json'), JSON.stringify(mergedRules, null, 2));
  console.log(`Updated data/seed/diagnosticRules.json with ${mergedRules.length} rules.`);

  // Update repairData.json
  const existingRepairData = JSON.parse(fs.readFileSync(path.join(seedDir, 'repairData.json'), 'utf-8'));
  const repairMap = new Map();
  existingRepairData.forEach(r => repairMap.set(`${r.deviceId}#${r.issueId}`, r));
  formattedRepairData.forEach(r => repairMap.set(`${r.deviceId}#${r.issueId}`, r));
  const mergedRepairData = Array.from(repairMap.values());
  fs.writeFileSync(path.join(seedDir, 'repairData.json'), JSON.stringify(mergedRepairData, null, 2));
  console.log(`Updated data/seed/repairData.json with ${mergedRepairData.length} repair records.`);

  // Update providers.json
  const existingProviders = JSON.parse(fs.readFileSync(path.join(seedDir, 'providers.json'), 'utf-8'));
  const providerMap = new Map();
  existingProviders.forEach(p => providerMap.set(p.providerId, p));
  newProviders.forEach(p => providerMap.set(p.providerId, p));
  const mergedProviders = Array.from(providerMap.values());
  fs.writeFileSync(path.join(seedDir, 'providers.json'), JSON.stringify(mergedProviders, null, 2));
  console.log(`Updated data/seed/providers.json with ${mergedProviders.length} providers.`);

  // Now seed AWS DynamoDB Table
  const tableName = 'Back2LifeTable-dev';
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    console.log(`Seeding AWS DynamoDB Table "${tableName}" in ${process.env.AWS_REGION}...`);
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    const doc = DynamoDBDocumentClient.from(client);

    const itemsToUpload = [
      ...formattedDevices,
      ...formattedRules,
      ...formattedRepairData,
      ...newProviders
    ];

    console.log(`Total new items to upload to DynamoDB: ${itemsToUpload.length}`);

    // Batch write in chunks of 25 (DynamoDB limit)
    for (let i = 0; i < itemsToUpload.length; i += 25) {
      const chunk = itemsToUpload.slice(i, i + 25);
      const putRequests = chunk.map(item => ({
        PutRequest: { Item: item }
      }));

      try {
        await doc.send(new BatchWriteCommand({
          RequestItems: {
            [tableName]: putRequests
          }
        }));
        process.stdout.write(`Uploaded items ${i + 1} to ${Math.min(i + 25, itemsToUpload.length)}...\r`);
      } catch (err) {
        console.error(`\nError uploading chunk at index ${i}:`, err.message);
      }
    }
    console.log(`\nSuccessfully seeded DynamoDB table ${tableName}!`);
  } else {
    console.warn(`AWS credentials not found in env, skipped direct DynamoDB seeding.`);
  }
}

main().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
