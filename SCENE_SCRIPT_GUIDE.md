# Smart Scene & Script Generation Guide

## Overview
The AI in Blueprint Studio is highly intuitive for generating scenes and scripts. It understands natural language, detects context, and creates professional Home Assistant configurations with intelligent defaults.

---

## 🎬 Scene Generation - Examples

### 1. **Basic Scene**
```
User: "Create a scene for living room lights at 80%"
```

**Generated:**
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

### 2. **Morning Scene (Intelligent Preset)**
```
User: "Create a morning scene for bedroom"
```

**Generated:**
```yaml
bedroom_morning:
  name: Bedroom Morning
  icon: mdi:weather-sunny
  entities:
    light.bedroom_main:
      state: on
      brightness_pct: 100
      kelvin: 4000
      transition: 1
    light.bedroom_bedside:
      state: on
      brightness_pct: 100
      kelvin: 4000
      transition: 1
```

**AI Intelligence:**
- ✅ Detected "morning" → Applied cool white (4000K)
- ✅ Set brightness to 100% for energizing effect
- ✅ Added appropriate icon (mdi:weather-sunny)
- ✅ Found all bedroom lights automatically
- ✅ Added smooth transition

### 3. **Evening/Bedtime Scene**
```
User: "Create evening scene for bedroom at 40% warm light"
```

**Generated:**
```yaml
bedroom_evening:
  name: Bedroom Evening
  icon: mdi:weather-night
  entities:
    light.bedroom_main:
      state: on
      brightness_pct: 40
      kelvin: 2700
      transition: 1
    light.bedroom_bedside:
      state: on
      brightness_pct: 40
      kelvin: 2700
      transition: 1
```

**AI Intelligence:**
- ✅ Detected "evening" → Applied warm white (2700K)
- ✅ Used specified 40% brightness
- ✅ Night-time icon
- ✅ Relaxing atmosphere preset

### 4. **Movie Scene**
```
User: "Create movie scene for living room"
```

**Generated:**
```yaml
living_room_movie:
  name: Living Room Movie
  icon: mdi:movie
  entities:
    light.living_room_ceiling:
      state: on
      brightness_pct: 10
      rgb_color: [0, 0, 100]
      transition: 1
    light.living_room_floor:
      state: on
      brightness_pct: 10
      rgb_color: [0, 0, 100]
      transition: 1
```

**AI Intelligence:**
- ✅ Detected "movie" → 10% brightness
- ✅ Applied dim blue color
- ✅ Movie icon
- ✅ Perfect for watching TV

### 5. **Reading Scene**
```
User: "Create reading scene with bright lights"
```

**Generated:**
```yaml
reading:
  name: Reading
  icon: mdi:book-open
  entities:
    light.living_room_reading:
      state: on
      brightness_pct: 80
      kelvin: 4000
      transition: 1
```

**AI Intelligence:**
- ✅ Cool white for comfortable reading
- ✅ Book icon
- ✅ Eye-friendly lighting

### 6. **Romantic Scene**
```
User: "Create romantic dinner scene"
```

**Generated:**
```yaml
romantic_dinner:
  name: Romantic Dinner
  icon: mdi:heart
  entities:
    light.dining_room:
      state: on
      brightness_pct: 20
      rgb_color: [255, 0, 100]
      transition: 1
```

**AI Intelligence:**
- ✅ Soft pink/red color
- ✅ Low brightness (20%)
- ✅ Heart icon
- ✅ Romantic mood

### 7. **Party Scene**
```
User: "Create party scene for all living room lights"
```

**Generated:**
```yaml
living_room_party:
  name: Living Room Party
  icon: mdi:party-popper
  entities:
    light.living_room_ceiling:
      state: on
      brightness_pct: 100
      rgb_color: [255, 0, 255]
      transition: 1
    light.living_room_floor:
      state: on
      brightness_pct: 100
      rgb_color: [255, 0, 255]
      transition: 1
    light.living_room_strip:
      state: on
      brightness_pct: 100
      rgb_color: [255, 0, 255]
      transition: 1
```

**AI Intelligence:**
- ✅ Found ALL living room lights
- ✅ Vibrant magenta color
- ✅ Full brightness
- ✅ Party icon

### 8. **Multi-Domain Scene**
```
User: "Create relax scene with lights at 50% and thermostat at 72"
```

**Generated:**
```yaml
relax:
  name: Relax
  icon: mdi:sofa
  entities:
    light.living_room:
      state: on
      brightness_pct: 50
      kelvin: 2700
      transition: 1
    climate.living_room:
      temperature: 72
      hvac_mode: heat
```

**AI Intelligence:**
- ✅ Multiple domains (light + climate)
- ✅ Warm ambiance
- ✅ Comfort temperature
- ✅ Relax icon

### 9. **Scene with Custom Transition**
```
User: "Create scene with 5 second transition"
```

**Generated:**
```yaml
custom_scene:
  name: Custom Scene
  icon: mdi:lightbulb-group
  entities:
    light.living_room:
      state: on
      brightness_pct: 80
      transition: 5
```

**AI Intelligence:**
- ✅ Custom transition time extracted
- ✅ Smooth 5-second fade

---

## 🔧 Script Generation - Examples

### 1. **Simple Script**
```
User: "Create script to turn on kitchen lights at 80%"
```

**Generated:**
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

### 2. **Multi-Step Script**
```
User: "Create script to turn on lights, wait 5 minutes, then turn them off"
```

**Generated:**
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

**AI Intelligence:**
- ✅ Detected "then" → Multi-step sequence
- ✅ Extracted "5 minutes" → Proper delay format
- ✅ Added turn off at the end
- ✅ Proper sequence structure

### 3. **Script with Notification**
```
User: "Create script to turn on lights and notify me 'Lights activated'"
```

**Generated:**
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

**AI Intelligence:**
- ✅ Detected notification request
- ✅ Extracted message text
- ✅ Proper notify action

### 4. **Parallel Mode Script**
```
User: "Create script to turn on all kitchen lights simultaneously"
```

**Generated:**
```yaml
turn_on_all_kitchen_lights:
  alias: Turn On All Kitchen Lights
  description: Activates devices with configured settings
  mode: parallel
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
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.kitchen_pendant
    data: {}
```

**AI Intelligence:**
- ✅ Detected "simultaneously" → Parallel mode
- ✅ Multiple actions for each light
- ✅ All execute at once

### 5. **Script with Restart Mode**
```
User: "Create script to turn on lights with restart mode"
```

**Generated:**
```yaml
turn_on_lights:
  alias: Turn On Lights
  description: Activates devices with configured settings
  mode: restart
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.living_room
    data: {}
```

**AI Intelligence:**
- ✅ Detected "restart" → restart mode
- ✅ Interrupts previous execution

### 6. **Climate Control Script**
```
User: "Create script to set thermostat to 72 degrees in heat mode"
```

**Generated:**
```yaml
set_thermostat:
  alias: Set Thermostat
  description: Controls climate and temperature settings
  mode: single
  sequence:
  - action: climate.turn_on
    metadata: {}
    target:
      entity_id: climate.living_room
    data:
      temperature: 72
      hvac_mode: heat
```

**AI Intelligence:**
- ✅ Detected temperature value
- ✅ Detected "heat mode"
- ✅ Proper climate control
- ✅ Intelligent description

### 7. **Complex Multi-Action Script**
```
User: "Create script to turn on all bedroom lights at 50%, wait 30 seconds, then notify me"
```

**Generated:**
```yaml
turn_on_all_bedroom_lights:
  alias: Turn On All Bedroom Lights
  description: Executes a sequence of actions
  mode: single
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.bedroom_main
    data:
      brightness_pct: 50
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.bedroom_bedside
    data:
      brightness_pct: 50
  - delay:
      hours: 0
      minutes: 0
      seconds: 30
  - action: notify.notify
    metadata: {}
    data:
      message: "bedroom lights activated"
```

**AI Intelligence:**
- ✅ Found all bedroom lights
- ✅ Applied brightness to each
- ✅ Proper 30-second delay
- ✅ Auto-generated notification message

---

## 🎯 Supported Scene Types

| Scene Type | Brightness | Color Temp | Icon | Use Case |
|------------|-----------|------------|------|----------|
| **Morning** | 100% | 4000K (Cool) | ☀️ | Energizing wake-up |
| **Evening** | 40% | 2700K (Warm) | 🌙 | Relaxing wind-down |
| **Movie** | 10% | Blue | 🎬 | Watching TV/movies |
| **Reading** | 80% | 4000K (Cool) | 📖 | Comfortable reading |
| **Romantic** | 20% | Pink/Red | ❤️ | Dinner, date night |
| **Party** | 100% | Magenta | 🎉 | Celebration |
| **Relax** | 50% | 2700K (Warm) | 🛋️ | Unwinding |

---

## 🚀 Advanced Features

### 1. **Multi-Domain Support**
```
✅ Lights (brightness, color, transition)
✅ Climate (temperature, hvac_mode)
✅ Covers (position, state)
✅ Media Players (volume, state)
✅ Switches (on/off)
```

### 2. **Intelligent Entity Detection**
```
"Create scene for all kitchen lights"
→ Finds: light.kitchen_ceiling, light.kitchen_under_cabinet, etc.
```

### 3. **Context-Aware Defaults**
```
Morning scene → Cool white, 100% brightness
Evening scene → Warm white, 40% brightness
Movie scene → Dim blue, 10% brightness
```

### 4. **Proper Mode Detection**
```
"simultaneously" → mode: parallel
"restart" → mode: restart
"queued" → mode: queued
Default → mode: single
```

### 5. **Smart Descriptions**
```
Turn on lights → "Activates devices with configured settings"
Sequence → "Executes a sequence of actions"
Notification → "Sends notifications and controls devices"
Climate → "Controls climate and temperature settings"
```

---

## 💡 Natural Language Understanding

### Scene Keywords
- **Morning**: wake, breakfast, morning, sunrise
- **Evening**: evening, night, bedtime, sleep, sunset
- **Movie**: movie, cinema, tv, watch
- **Reading**: reading, read, study
- **Romantic**: romantic, dinner, date
- **Party**: party, celebration
- **Relax**: relax, chill, unwind

### Script Keywords
- **Multi-step**: then, after, sequence, followed by, next, and then
- **Parallel**: parallel, simultaneously, at once
- **Restart**: restart, interrupt
- **Queue**: queue, queued
- **Delay**: wait, delay, after (+ time value)
- **Notification**: notify, send, alert, message

---

## 📊 Comparison: Before vs After

### Before Enhancement
```yaml
# Basic scene - limited features
living_room:
  name: Living Room
  entities:
    light.living_room: on
```

### After Enhancement
```yaml
# Smart scene - full features
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

### Before Enhancement (Script)
```yaml
# Basic script - single action
turn_on_light:
  alias: Turn On Light
  sequence:
  - action: light.turn_on
    target:
      entity_id: light.living_room
```

### After Enhancement (Script)
```yaml
# Smart script - multi-step with intelligence
turn_on_light:
  alias: Turn On Light
  description: Executes a sequence of actions
  mode: single
  sequence:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.living_room
    data:
      brightness_pct: 80
  - delay:
      hours: 0
      minutes: 5
      seconds: 0
  - action: notify.notify
    metadata: {}
    data:
      message: "Light activated"
```

---

## ✅ Summary of Intelligence

### Scene Generation
- ✅ 7 preset scene types with intelligent defaults
- ✅ Multi-attribute support (brightness, color, temp, transition)
- ✅ Up to 10 entities per scene (increased from 5)
- ✅ Automatic icon selection
- ✅ Context-aware descriptions
- ✅ Multi-domain support (lights, climate, covers, media)
- ✅ Custom transition detection
- ✅ Smart color temperature based on scene type

### Script Generation
- ✅ Multi-step sequences
- ✅ Delay support (seconds, minutes, hours)
- ✅ Notification integration
- ✅ Mode detection (single, parallel, restart, queued)
- ✅ Turn on/off sequences
- ✅ Multiple entity handling
- ✅ Intelligent descriptions
- ✅ Proper metadata: {} everywhere

---

**The AI is now extremely intuitive for scenes and scripts!** 🎉

It understands natural language, applies intelligent defaults, and generates professional, production-ready Home Assistant configurations.
