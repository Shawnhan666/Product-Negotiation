export const roles = ["CEO", "Department_Head_A", "Department_Head_B"];

export const products = {
  //Smartphone: ['5G Support', 'Foldable Display', 'AI Camera', 'Solar Charging', 'Biometric Security', 'Expandable Storage', 'Water Resistance', 'Wireless Charging'],
  //Smartwatch: ['Heart Rate Monitor', 'LTE Connectivity', 'Sleep Tracking', 'ECG Function', 'Fall Detection', 'Customizable Faces', 'Swim-proof Design', 'Battery Life (2+ Days)'],
  Laptop: ['Touchscreen', '4K Display', 'Fingerprint Reader', 'Thunderbolt 4 Ports', 'AI-enhanced Performance', 'Ultra-light Design', 'High-speed WiFi 6E', 'Long Battery Life'],
  //SmartHomeSpeaker: ['Voice Recognition Accuracy', 'Multi-room Audio', 'Smart Home Control', 'Privacy Mode', 'Sound Quality', 'Portable Design', 'Waterproof', 'Energy Efficiency'],
  //ElectricVehicle: ['Autopilot Features', 'Battery Range', 'Fast Charging', 'Safety Features', 'Interior Luxury', 'Sound System', 'Environmental Impact', 'Connectivity Features']
};

export const bonues = {
  CEO: [1, -0.5, 1, -0.5, 1, 1, -0.5, 1],
  Department_Head_A: [-0.5, 1, 1, 1, 1, -0.5, -0.5, -0.5],
  Department_Head_B: [1, 1, 1, -0.5, 1, 1, -0.5, -0.5]
};




export const rolesData = {
    "CEO": {
      mix_1: 23, mix_2: 9, mix_3: 0, li_1: 11, li_2: 8, li_3: 4, li_4: 0,
      green_1: 17, green_2: 11, green_3: 8, green_4: 0,
      height_1: 0, height_2: 0, height_3: 10, height_4: 20, height_5: 30,
      venues_1: 0, venues_2: 5, venues_3: 11, venues_4: 14, venues_5: 19
    },
    "Green_Living": {
      mix_1: 0, mix_2: 10, mix_3: 20, li_1: 0, li_2: 5, li_3: 20, li_4: 25,
      green_1: 0, green_2: 10, green_3: 15, green_4: 35,
      height_1: 15, height_2: 10, height_3: 5, height_4: 0, height_5: 0,
      venues_1: 5, venues_2: 5, venues_3: 5, venues_4: 0, venues_5: 0
    },
    "Illium": {
      mix_1: 0, mix_2: 5, mix_3: 10, li_1: 0, li_2: 5, li_3: 10, li_4: 15,
      green_1: 0, green_2: 4, green_3: 10, green_4: 15,
      height_1: 25, height_2: 15, height_3: 10, height_4: 5, height_5: 0,
      venues_1: 35, venues_2: 20, venues_3: 20, venues_4: 0, venues_5: 0
    },
    "Mayor_Gabriel": {
        mix_1: 21, mix_2: 10, mix_3: 0, li_1: 0, li_2: 2, li_3: 4, li_4: 10,
        green_1: 30, green_2: 20, green_3: 9, green_4: 0,
        height_1: 0, height_2: 5, height_3: 10, height_4: 15, height_5: 25,
        venues_1: 0, venues_2: 5, venues_3: 6, venues_4: 9, venues_5: 14
    },
    "Our_Backyards": {
        mix_1: 0, mix_2: 13, mix_3: 6, li_1: 9, li_2: 6, li_3: 3, li_4: 0,
        green_1: 0, green_2: 8, green_3: 16, green_4: 24,
        height_1: 38, height_2: 20, height_3: 10, height_4: 0, height_5: 0,
        venues_1: 4, venues_2: 12, venues_3: 16, venues_4: 8, venues_5: 0
    },
    "Planning_Commission": {
        mix_1: 0, mix_2: 20, mix_3: 10, li_1: 0, li_2: 15, li_3: 15, li_4: 0,
        green_1: 0, green_2: 20, green_3: 30, green_4: 0,
        height_1: 0, height_2: 20, height_3: 15, height_4: 5, height_5: 5,
        venues_1: 0, venues_2: 15, venues_3: 15, venues_4: 15, venues_5: 0
    },
};

export const optionMappings = {
  mix: { "1": "30:70", "2": "50:50", "3": "70:30" },
  li: { "1": "6%", "2": "9%", "3": "12%", "4": "15%" },
  green: { "1": "14 acres", "2": "16 acres", "3": "18 acres", "4": "20 acres" },
  height: { "1": "400ft", "2": "500ft", "3": "600ft", "4": "700ft", "5": "800ft" },
  venues: { "1": "0 venues", "2": "1 venues", "3": "2 venues", "4": "3 venues", "5": "4 venues" },
};