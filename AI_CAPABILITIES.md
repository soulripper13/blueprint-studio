# Blueprint Studio AI - Smart Capabilities

## Overview
The Local AI has been transformed into a Senior Home Assistant Expert with advanced natural language understanding, intelligent YAML/Jinja error detection, intuitive scene and script generation, and support for 30+ device types and complex scenarios.

---

## 🎯 Supported Devices & Domains (30+)

### Lighting & Controls
- **Lights**: bulbs, lamps, chandeliers, spotlights, LED strips, strip lights
- **Switches**: plugs, outlets, wall switches, power strips, sockets
- **Fans**: ceiling fans, exhaust fans, ventilators

### Climate & Environment
- **Climate**: thermostats, heaters, AC units, heat pumps, HVAC, temperature control
- **Humidifiers**: humidifiers, dehumidifiers
- **Water Heaters**: boilers, water heaters

### Security & Access
- **Locks**: smart locks, deadbolts, door locks
- **Cameras**: security cameras, doorbells, webcams
- **Alarm Panels**: security systems, alarm panels
- **Sirens**: alarm sirens

### Covers & Shading
- **Covers**: blinds, shades, curtains, shutters, garage doors, gates, rollers, awnings

### Entertainment
- **Media Players**: TVs, speakers, stereos, soundbars, Chromecast, Roku, Apple TV
- **Remotes**: remote controls

### Sensors
- **Binary Sensors**: motion, door, window, leak, smoke, occupancy, presence
- **Sensors**: temperature, humidity, light, power, energy, battery

### Home Assistant Helpers
- **Input Boolean**: toggles, virtual switches
- **Input Number**: sliders, number helpers
- **Input Select**: dropdowns, select helpers
- **Input Datetime**: date/time helpers
- **Input Text**: text inputs, text helpers
- **Timers**: countdown timers
- **Counters**: numerical counters
- **Buttons**: press buttons

### Other
- **Vacuum**: robot vacuums, Roomba, mops
- **Notifications**: alerts, messages
- **Automations**: automation controls
- **Scripts**: script execution
- **Scenes**: scene activation
- **Device Trackers**: phones, location tracking
- **Persons**: user presence
- **Zones**: geofencing areas, geofences
- **Groups**: entity groups

---

## 🧠 Natural Language Understanding

### Area/Room Detection (28+ rooms)
```
✓ Kitchen, Bedroom, Living Room, Bathroom, Garage, Office
✓ Hallway, Basement, Attic, Dining Room, Laundry, Porch
✓ Garden, Backyard, Frontyard, Upstairs, Downstairs
✓ Balcony, Patio, Deck, Entryway, Foyer, Closet, Pantry
✓ Mudroom, Study, Den, Family Room, Playroom, Nursery
```

### Domain Synonym Intelligence (100+ Synonyms)
```
"Turn on the bulb" → light domain
"Turn on the LED strip" → light domain
"Open the shutter" → cover domain
"Set the thermostat" → climate domain
"Lock the deadbolt" → lock domain
"Start the roomba" → vacuum domain
"Play on the chromecast" → media_player domain
```

### Multi-Entity Support
```
"Turn on ALL kitchen lights" → Finds all kitchen lights
"Close EVERY bedroom blind" → Finds all bedroom covers
"Turn on ENTIRE living room" → Finds all living room devices
```

---

## 🎬 Advanced Automation Scenarios

### 1. Time-Based Automations
```
✅ "Turn on kitchen lights at 7pm"
✅ "Turn on at 7am and off at 10pm" (multi-intent)
✅ "Open blinds at sunrise"
✅ "Set AC to 72 at 3pm" (with value)
```

### 2. Motion-Triggered Automations
```
✅ "Turn on hallway light when motion detected"
✅ "Send notification when motion detected after dark"
✅ "Turn on camera when motion detected"
```

### 3. Temperature-Based Automations
```
✅ "Turn on AC when temperature above 25 degrees"
✅ "Send alert if temperature below 10"
✅ "Set thermostat to 72 degrees"
✅ "Turn on heater when temp below 65"
```

### 4. State-Based Triggers
```
✅ "Turn on lights when door opens"
✅ "Lock door when everyone leaves"
✅ "Turn off everything when I leave home"
✅ "Send alert when window opens"
```

### 5. Condition-Based Logic
```
✅ "Turn on lights at 7pm if home"
✅ "Send alert only after dark"
✅ "Run on weekdays only"
✅ "Activate only on weekends"
✅ "Only when temperature above 25"
✅ "If nobody home, turn off lights"
```

### 6. Brightness & Color Control
```
✅ "Turn on at 80% brightness"
✅ "Set lights to red"
✅ "Warm white at 50%"
✅ "3000k color temperature"
✅ "Cool white lights"
✅ "Set lights to cyan"
```

### 7. Climate Control
```
✅ "Set temperature to 72 degrees"
✅ "Turn on heating mode"
✅ "Set AC to cool mode"
✅ "Auto mode at 68 degrees"
```

### 8. Cover Position Control
```
✅ "Open blinds to 50%"
✅ "Set position to 75%"
✅ "Close shutters"
✅ "Open garage door"
```

### 9. Media Player Control
```
✅ "Set volume to 50%"
✅ "Play music in living room"
✅ "Pause TV"
✅ "Volume at 30%"
```

### 10. Notifications & Delays
```
✅ "Turn on light and send notification 'Light activated'"
✅ "Wait 5 minutes then turn off"
✅ "Notify me when door opens"
✅ "Delay 30 seconds then close"
```

### 11. Multi-Intent Automations
```
✅ "Turn on at 7am and off at 10pm" → Professional choose block
✅ "Open at sunrise and close at sunset" → Trigger IDs
```

---

## 🎭 Intelligent Scene Generation

### Preset Scene Types (7 Smart Presets)

The AI automatically recognizes scene types and applies intelligent defaults:

| Scene Type | Auto Brightness | Auto Color Temp | Icon | Keywords |
|-----------|----------------|-----------------|------|----------|
| **Morning** | 100% | 4000K (cool) | ☀️ | morning, wake, breakfast |
| **Evening** | 40% | 2700K (warm) | 🌙 | evening, night, bedtime, sleep |
| **Movie** | 10% | Blue dim | 🎬 | movie, cinema, tv, watch |
| **Reading** | 80% | 4000K | 📖 | reading, read, study |
| **Romantic** | 20% | Pink/Red | ❤️ | romantic, dinner, date |
| **Party** | 100% | Magenta | 🎉 | party, celebration |
| **Relax** | 50% | 2700K (warm) | 🛋️ | relax, chill, unwind |

### Scene Examples

#### Basic Scene
```
User: "Create scene for living room lights at 80%"
```
```yaml
living_room_lights:
  name: Living Room Lights
  icon: mdi:lightbulb-group
  entities:
    light.living_room_ceiling:
      state: on
      brightness_pct: 80
      transition: 1
```

#### Morning Scene (Intelligent Preset)
```
User: "Create morning scene for bedroom"
```
```yaml
bedroom_morning:
  name: Bedroom Morning
  icon: mdi:weather-sunny
  entities:
    light.bedroom_main:
      state: on
      brightness_pct: 100      # Auto: energizing
      kelvin: 4000             # Auto: cool white
      transition: 1
    light.bedroom_bedside:
      state: on
      brightness_pct: 100
      kelvin: 4000
      transition: 1
```

#### Movie Scene
```
User: "Create movie scene for living room"
```
```yaml
living_room_movie:
  name: Living Room Movie
  icon: mdi:movie
  entities:
    light.living_room_ceiling:
      state: on
      brightness_pct: 10       # Auto: dim for viewing
      rgb_color: [0, 0, 100]   # Auto: dim blue
      transition: 1
```

#### Multi-Domain Scene
```
User: "Create relax scene with lights at 50% and thermostat at 72"
```
```yaml
relax:
  name: Relax
  icon: mdi:sofa
  entities:
    light.living_room:
      state: on
      brightness_pct: 50
      kelvin: 2700             # Auto: warm
      transition: 1
    climate.living_room:
      temperature: 72
      hvac_mode: heat
```

### Scene Features
- ✅ 7 intelligent presets with smart defaults
- ✅ Multi-attribute support (brightness, color, temp, transition)
- ✅ Up to 10 entities per scene
- ✅ Multi-domain: lights, climate, covers, media players
- ✅ Automatic icon selection (10+ icons)
- ✅ Context-aware descriptions
- ✅ Custom transition detection
- ✅ Smart color temperature based on scene type

---

## 🔧 Intelligent Script Generation

### Script Modes
The AI detects execution modes from natural language:
- **single** (default) - One execution at a time
- **parallel** - Multiple executions simultaneously
- **restart** - Restart if already running
- **queued** - Queue multiple executions

### Script Examples

#### Simple Script
```
User: "Create script to turn on kitchen lights at 80%"
```
```yaml
turn_on_kitchen_lights:
  alias: Turn On Kitchen Lights
  description: Activates devices with configured settings
  mode: single
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.kitchen
    data:
      brightness_pct: 80
```

#### Multi-Step Script
```
User: "Create script to turn on lights, wait 5 minutes, then turn them off"
```
```yaml
turn_on_lights:
  alias: Turn On Lights
  description: Executes a sequence of actions
  mode: single
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.living_room
    data: {}
  - delay:
      hours: 0
      minutes: 5
      seconds: 0
  - action: light.turn_off
    metadata: {}
    target:
      entity_id: light.living_room
    data: {}
```

#### Script with Notification
```
User: "Create script to turn on lights and notify me 'Lights activated'"
```
```yaml
turn_on_lights:
  alias: Turn On Lights
  description: Sends notifications and controls devices
  mode: single
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.living_room
    data: {}
  - action: notify.notify
    metadata: {}
    data:
      message: "Lights activated"
```

#### Parallel Mode Script
```
User: "Create script to turn on all kitchen lights simultaneously"
```
```yaml
turn_on_all_kitchen_lights:
  alias: Turn On All Kitchen Lights
  description: Activates devices with configured settings
  mode: parallel                # Auto-detected
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.kitchen_ceiling
    data: {}
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.kitchen_under_cabinet
    data: {}
```

### Script Features
- ✅ Multi-step sequences
- ✅ Delay support (seconds, minutes, hours)
- ✅ Notification integration
- ✅ 4 execution modes (single, parallel, restart, queued)
- ✅ Turn on/off sequences
- ✅ Multiple entity handling
- ✅ Intelligent descriptions
- ✅ Proper metadata everywhere

---

## 🔍 YAML Error Detection & Solutions

### Syntax Errors Detected
1. **Legacy 'service:' syntax**
   - ❌ `service: light.turn_on`
   - ✅ `action: light.turn_on`

2. **Singular keys (legacy)**
   - ❌ `trigger:`, `condition:`, `action:`
   - ✅ `triggers:`, `conditions:`, `actions:`

3. **Old trigger platform syntax**
   - ❌ `- platform: time`
   - ✅ `- trigger: time`

4. **Missing automation ID**
   - ❌ Missing `id:` field
   - ✅ `id: '1738012345678'` (13-digit timestamp)

5. **Missing metadata**
   - ❌ Action without `metadata: {}`
   - ✅ Always includes `metadata: {}`

6. **Malformed entity_id**
   - ❌ `entity_id: kitchen`
   - ✅ `entity_id: light.kitchen`

7. **Invalid domain**
   - ❌ `entity_id: wrong.device`
   - ✅ Suggests valid domains

### Error Response Format
```json
{
  "valid": false,
  "errors": [
    {
      "line": 5,
      "type": "legacy_syntax",
      "message": "Legacy 'service:' syntax detected",
      "solution": "Replace 'service:' with 'action:'",
      "example": "service: light.turn_on → action: light.turn_on",
      "original": "service: light.turn_on"
    }
  ],
  "error_count": 1
}
```

### Warning Response (Best Practices)
```json
{
  "valid": true,
  "warnings": [
    {
      "line": 2,
      "type": "missing_id",
      "message": "Automation 'Morning Routine' missing unique 'id:' field",
      "solution": "Add 'id: \"XXXXXXXXXXXXX\"' before 'alias:'",
      "example": "- id: '1738012345678'\n  alias: Morning Routine"
    }
  ],
  "warning_count": 1,
  "message": "YAML is valid but found 1 best practice issue(s)"
}
```

---

## 📝 Jinja Template Support

### File Extensions Supported
- `.jinja` - Standard Jinja template files
- `.jinja2` - Jinja2 template files
- `.j2` - Short form Jinja2 templates

### Jinja Error Detection

#### Missing Quotes
```jinja
❌ {{ states(sensor.temperature) }}
✅ {{ states('sensor.temperature') }}
```

#### Wrong Brackets
```jinja
❌ {{{ value }}}
✅ {{ value }}
```

#### Missing Pipe for Filters
```jinja
❌ {{ states('sensor.temp') float }}
✅ {{ states('sensor.temp') | float }}
```

### Intelligent Jinja Suggestions

The AI provides contextual suggestions based on template content:

**State Functions** - When using `states()`:
```jinja
{{ states('sensor.temperature') }}
{{ state_attr('light.kitchen', 'brightness') }}
```

**Control Structures** - When using `{% if %}` or `{% for %}`:
```jinja
{% if states('light.kitchen') == 'on' %}...{% endif %}
{% for state in states.light %}...{% endfor %}
```

**Time Functions** - When using `now()`:
```jinja
{{ now().strftime('%H:%M') }}
{{ as_timestamp(now()) }}
{{ today_at('19:00') }}
```

**Math Operations**:
```jinja
{{ (states('sensor.temp') | float) * 1.8 + 32 }}
{{ states('sensor.value') | float | round(2) }}
```

### Jinja Response Format
```json
{
  "valid": true,
  "suggestions": [
    {
      "type": "tip",
      "message": "Using states() function",
      "examples": [
        "{{ states('sensor.temperature') }}",
        "{{ state_attr('light.kitchen', 'brightness') }}"
      ]
    }
  ],
  "message": "Jinja template syntax looks good!",
  "tip": "Use {{ }} for expressions and {% %} for statements"
}
```

---

## 🎨 Smart Features

### 1. Entity Awareness
- ✅ Scans live `hass.states` for real entities
- ✅ No placeholder entities like `light.your_device`
- ✅ Area-aware matching (bonus points for room names)
- ✅ Friendly name priority (8pts vs 2pts)
- ✅ Exact entity_id part matching (5pts)

### 2. Intelligent Scoring
```python
Score Breakdown:
- Area match in entity_id: +10 points
- Area match in friendly_name: +10 points
- Word match in entity_id parts: +5 points
- Word match in friendly_name: +8 points
- Partial match in entity_id: +2 points
- Partial match in friendly_name: +3 points
```

### 3. Multi-Entity Support
```
"Turn on all kitchen lights"
→ Returns top 10 entities scoring >50% of best match
```

### 4. Condition Detection
- Person presence (home/away)
- Sun position (day/night)
- Day of week (weekdays/weekends)
- Temperature thresholds (above/below)
- Time ranges
- Numeric state thresholds

### 5. Value Extraction
- Brightness: `80%`, `50 percent`
- Temperature: `72 degrees`, `22°C`
- Position: `open to 75%`
- Fan speed: `speed 3`, `50%`
- Volume: `volume 60%`
- Color: `red`, `warm white`, `3000k`, `cyan`, `magenta`
- HVAC mode: `heat`, `cool`, `auto`, `off`

### 6. Trigger Type Detection
- **Time**: `at 7pm`, `7:00`, `19:00`
- **State**: `when door opens`, `when motion detected`
- **Numeric State**: `when temp above 25`
- **AM/PM conversion**: Automatic 24-hour format

### 7. Smart Naming
```
Query: "Turn on kitchen light at 7pm"
→ Name: "Kitchen Light Turn On"

Query: "Create automation called Morning Routine"
→ Name: "Morning Routine"

Query: "Create morning scene for bedroom"
→ Name: "Bedroom Morning"
```

---

## 📋 Complete Usage Examples

### Example 1: Simple Light Control
```
User: "Turn on kitchen lights at 7pm at 80%"
```
```yaml
- id: '1738012345678'
  alias: Kitchen Light Turn On
  triggers:
  - trigger: time
    at: '19:00:00'
  conditions: []
  actions:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.kitchen_ceiling
    data:
      brightness_pct: 80
  mode: single
```

### Example 2: Complex Conditional Automation
```
User: "Turn on bedroom lights at 80% at 6am on weekdays if home"
```
```yaml
- id: '1738012345679'
  alias: Bedroom Light Turn On
  triggers:
  - trigger: time
    at: '06:00:00'
  conditions:
  - condition: state
    entity_id: person.admin
    state: 'home'
  - condition: time
    weekday:
    - mon
    - tue
    - wed
    - thu
    - fri
  actions:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.bedroom_main
    data:
      brightness_pct: 80
  mode: single
```

### Example 3: Motion-Based with Notification
```
User: "Turn on hallway light when motion detected and notify me"
```
```yaml
- id: '1738012345680'
  alias: Hallway Motion Light
  triggers:
  - trigger: state
    entity_id: binary_sensor.hallway_motion
    to: 'on'
  conditions: []
  actions:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.hallway
    data: {}
  - action: notify.notify
    metadata: {}
    data:
      message: "Motion detected in hallway"
  mode: single
```

### Example 4: Temperature-Based Automation
```
User: "Turn on AC when temperature above 25 degrees"
```
```yaml
- id: '1738012345681'
  alias: Temperature AC Control
  triggers:
  - trigger: numeric_state
    entity_id: sensor.living_room_temperature
    above: 25
  conditions: []
  actions:
  - action: climate.turn_on
    metadata: {}
    target:
      entity_id: climate.living_room
    data:
      hvac_mode: cool
  mode: single
```

### Example 5: Evening Scene
```
User: "Create evening scene for living room"
```
```yaml
living_room_evening:
  name: Living Room Evening
  icon: mdi:weather-night
  entities:
    light.living_room_ceiling:
      state: on
      brightness_pct: 40
      kelvin: 2700
      transition: 1
    light.living_room_floor:
      state: on
      brightness_pct: 40
      kelvin: 2700
      transition: 1
```

### Example 6: Multi-Step Script
```
User: "Create script to turn on lights, wait 30 seconds, then notify"
```
```yaml
turn_on_lights:
  alias: Turn On Lights
  description: Executes a sequence of actions
  mode: single
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.living_room
    data: {}
  - delay:
      hours: 0
      minutes: 0
      seconds: 30
  - action: notify.notify
    metadata: {}
    data:
      message: "lights activated"
```

---

## 🚀 Technical Improvements

### Performance
- ✅ Background thread operations for heavy I/O
- ✅ Efficient entity scanning with scoring
- ✅ Regex-based pattern matching
- ✅ Single-pass condition detection

### Code Quality
- ✅ Modular helper methods
- ✅ Type hints throughout
- ✅ Comprehensive error handling
- ✅ Full stack traces in logs
- ✅ Clean separation of concerns

### Extensibility
- ✅ Easy to add new domains
- ✅ Simple synonym expansion
- ✅ Pluggable condition patterns
- ✅ Extensible action types
- ✅ Configurable error patterns

---

## 📊 Comprehensive Statistics

### Devices & Domains
- **30+ Device Domains** supported
- **28+ Room Types** recognized
- **100+ Synonyms** mapped
- **12+ Color Names** for RGB lights

### Triggers & Conditions
- **10+ Trigger Types** detected
- **8+ Condition Types** supported
- **Temperature thresholds** (above/below)
- **Time-based conditions** (weekdays/weekends)

### Scenes & Scripts
- **7 Scene Presets** with intelligent defaults
- **4 Script Modes** (single, parallel, restart, queued)
- **10 entities max** per scene
- **6 attributes** per light entity
- **Multi-step sequences** supported
- **Delay support** (seconds, minutes, hours)
- **Notification integration**

### Validation & Error Detection
- **7+ YAML Errors** detected with solutions
- **3+ Jinja Errors** detected with solutions
- **3 File Types** validated (YAML, Jinja, templates)
- **Line-by-line** error reporting
- **Best practice warnings**

---

## 🎓 Best Practices Enforced

1. ✅ Modern plural keys: `triggers:`, `conditions:`, `actions:`
2. ✅ Modern action syntax: `- action: domain.service`
3. ✅ Modern trigger syntax: `- trigger: platform`
4. ✅ Unique automation IDs (13-digit timestamps)
5. ✅ Metadata in all actions: `metadata: {}`
6. ✅ Proper entity_id format: `domain.entity_name`
7. ✅ Mode specification: `mode: single`
8. ✅ Empty conditions: `conditions: []`
9. ✅ Scene icons and descriptions
10. ✅ Script descriptions based on content

---

## 📚 Additional Documentation

### Detailed Guides
- **SCENE_SCRIPT_GUIDE.md** - Complete scene and script examples
- **JINJA_SUPPORT.md** - Comprehensive Jinja2 template guide
- **JINJA_IMPLEMENTATION.md** - Technical implementation details

### Example Files
- **examples/example_template.jinja** - Practical Jinja examples

---

## 🔮 Future Enhancements

Potential additions:
- [ ] Template-based triggers
- [ ] Blueprint support
- [ ] Advanced jinja2 templates
- [ ] Multiple notification services
- [ ] Custom component detection
- [ ] Integration-specific features
- [ ] Voice command optimization
- [ ] Multi-language support
- [ ] Visual automation builder
- [ ] Template testing sandbox

---

## 🎯 Summary

The Blueprint Studio AI is now a **complete Home Assistant expert** that:

✅ Understands 30+ device types with 100+ synonyms
✅ Generates perfect automations from natural language
✅ Creates intelligent scenes with 7 smart presets
✅ Builds multi-step scripts with delays and notifications
✅ Validates YAML and Jinja with helpful error messages
✅ Provides contextual suggestions and examples
✅ Follows all 2024+ Home Assistant best practices
✅ Scans real entities from your actual Home Assistant setup
✅ Never uses placeholders - always real entity IDs

**The AI is production-ready and extremely intuitive!** 🚀

---

**Version**: 2.5.0
**Last Updated**: 2024-01-27
**Compatibility**: Home Assistant 2024+
