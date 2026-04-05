
const interiors = [
    "vw_casino_main",
    "vw_casino_penthouse",
    "vw_dlc_casino_door",
    "hei_dlc_milo_heist_apartment_01", // Low end
    "hei_dlc_milo_heist_apartment_02", // High end
    "apa_v_mp_h_01_a",
    "apa_v_mp_h_01_c",
    "apa_v_mp_h_01_b",
    "apa_v_mp_h_02_a",
    "apa_v_mp_h_02_c",
    "apa_v_mp_h_02_b",
    "apa_v_mp_h_03_a",
    "apa_v_mp_h_03_c",
    "apa_v_mp_h_03_b",
    "apa_v_mp_h_04_a",
    "apa_v_mp_h_04_c",
    "apa_v_mp_h_04_b",
    "apa_v_mp_h_05_a",
    "apa_v_mp_h_05_c",
    "apa_v_mp_h_05_b",
    "apa_v_mp_h_06_a",
    "apa_v_mp_h_06_c",
    "apa_v_mp_h_06_b",
    "apa_v_mp_h_07_a",
    "apa_v_mp_h_07_c",
    "apa_v_mp_h_07_b",
    "apa_v_mp_h_08_a",
    "apa_v_mp_h_08_c",
    "apa_v_mp_h_08_b",
];

interiors.forEach(ipl => {
    mp.game.streaming.requestIpl(ipl);
});

console.log("[Interiors] All luxury apartments and Casino IPLs loaded.");
